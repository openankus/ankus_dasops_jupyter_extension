import { JupyterFrontEnd } from '@jupyterlab/application';
import { MainAreaWidget } from '@jupyterlab/apputils';
import { IStateDB } from '@jupyterlab/statedb';
import { LabIcon } from '@jupyterlab/ui-components';
import { Widget, Menu } from '@lumino/widgets';
import { Message, MessageLoop } from '@lumino/messaging';
import { Signal, ISignal } from '@lumino/signaling';
import { CommandRegistry } from '@lumino/commands';
import { IStatusBar } from '@jupyterlab/statusbar';
import {
  INotebookTracker,
  Notebook,
  NotebookActions
} from '@jupyterlab/notebook';

//import cookie from 'react-cookies';
//import csrf from 'csurf';

import { AnkusDocModelFactory } from './doc/widgetFactory';
import { AnkusCodeEditor } from './component/ankusCodeEditor';
import { AnkusStatusbar } from './component/statusbar';
import { CodeTag } from './doc/docModel';
import { CodelistWidget } from './component/codeList';
import { StandardTermSetting } from './component/standardTermSetting';
import { NotebookPlugin } from './notebookAction';

import ankusSvg from '../style/images/ankus.svg';
import { CommandID } from './ankusCommands';

//export const ANKUS_URL = 'http://localhost:9090'; //'http://dev.openankus.org:9090'; //
export const ANKUS_EXT_ID = 'jupyter-ankus';
export const ANKUS_ICON = new LabIcon({ name: 'ankus-icon', svgstr: ankusSvg });

export namespace ShareCode {
  //api 서버와 함께 사용하는 명칭
  export enum CodePropertyName {
    id = 'codeId',
    name = 'title',
    comment = 'codeComment',
    userNo = 'writer',
    date = 'udate',
    content = 'content',
    userName = 'name',
    tag = 'tags'
  }

  export type CodeProperty = {
    id?: number;
    name?: string;
    writer?: string; //작성자명
    date?: Date;
    comment?: string;
    tag?: string; //#tag1 #tag2
    writerNo?: number; //작성자 고유번호
    taglist?: Array<string>;
  };

  export type CodeList = {
    list: CodeProperty[];
    //전체 코드 개수
    totalSize: number;
    //페이지당 코드 개수
    pageSize: number;
  };

  export async function codelist(
    keywords: string[],
    searchCol: string,
    orderCol: string,
    asc: boolean,
    page: number
  ): Promise<CodeList | null> {
    //list option
    const option = {
      token: Ankus.loginToken,
      searchColumn: searchCol,
      searchKeyword: keywords,
      orderColumn: orderCol,
      order: asc ? 'asc' : 'desc',
      page: page
    };

    const ret = fetch(Ankus.ankusURL + '/share-code/codelist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(option)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('fail');
        }
      })
      .then(response => {
        const res: CodeList = {
          //code list
          list: response.content.map(
            (itm: any) =>
              ({
                id: itm[CodePropertyName.id],
                name: itm[CodePropertyName.name],
                writer: itm[CodePropertyName.userName],
                date: itm[CodePropertyName.date],
                comment: itm[CodePropertyName.comment],
                writerNo: itm[CodePropertyName.userNo],
                tag: itm[CodePropertyName.tag]
              }) as CodeProperty
          ),
          totalSize: response.totalElements,
          pageSize: response.totalPages
        };

        return res;
      })
      .catch(error => {
        return null;
      }); //fetch

    return ret;
  } //codelist

  //노트북 셀의 선택 단어에 대한 자동완성 메뉴
  export async function completerMenu(
    keyword: string,
    x: number,
    y: number
  ): Promise<HTMLElement> {
    //no keyword
    if (keyword.trim().length < 1) {
      throw new Error('Keyword Error');
    }

    //search code name
    const terms = await codelist(
      [keyword],
      CodePropertyName.name,
      CodePropertyName.name,
      true,
      -1
    );

    //fail
    if (terms === null) {
      throw new Error('Search Error');
    }

    /////////////////menu//////////////////
    const menu = document.createElement('div');
    menu.className = 'ankus-autocomplet-menu';
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.style.display = terms.totalSize === 0 ? 'none' : 'block';
    menu.tabIndex = -1;

    let selidx: number;
    const list = document.createElement('dl');

    const menuitems = terms.list.map(term => {
      const codeid = term.id!;

      const item = document.createElement('dt');
      item.style.paddingLeft = '5px';
      item.style.paddingRight = '5px';
      item.id = String(codeid);
      //name + english name
      item.innerHTML =
        '<span >' +
        term.name +
        '</span> - <span style="font-size:11px; " >' +
        term.writer +
        '</span>';

      //  item.title = term.engDesc!;

      //click menu
      item.onclick = (ev: MouseEvent) => {
        //close menu
        menu.blur();

        //노트북 셀에 코드 삽입
        Ankus.cmdReg.execute(CommandID.insertCode.id, {
          id: (ev.target as HTMLElement).id
        });
      };

      //description
      if (term.comment) {
        const desc = document.createElement('dd');
        desc.textContent = term.comment;
        item.appendChild(desc);
      }

      list.appendChild(item);
      return item;
    }); //menu item list

    if (menuitems && menuitems.length > 0) {
      //첫번째 아이템 기본 선택
      menuitems[0].className = 'sel-menu';

      menu.appendChild(list);
    }

    //key
    menu.onkeydown = ev => {
      //down
      if (ev.key === 'ArrowDown') {
        if (menuitems.length > 1) {
          //이전 선택 제거
          menuitems[selidx].className = '';
          //다음 아이템 / 첫 아이템
          selidx = menuitems.length === selidx + 1 ? 0 : selidx + 1;
          //아이템 선택
          menuitems[selidx].className = 'sel-menu';

          if (!isVisible(menuitems[selidx], list)) {
            menuitems[selidx].scrollIntoView();
          }
        }
        ev.preventDefault();
      }
      //up
      else if (ev.key === 'ArrowUp') {
        if (menuitems.length > 1) {
          //이전 선택 제거
          menuitems[selidx].className = '';
          //이전 아이템 / 마지막 아이템
          selidx = 0 === selidx ? menuitems.length - 1 : selidx - 1;
          //아이템 선택
          menuitems[selidx].className = 'sel-menu';

          if (!isVisible(menuitems[selidx], list)) {
            menuitems[selidx].scrollIntoView();
          }
        }
        ev.preventDefault();
      }
      //enter
      else if (ev.key === 'Enter') {
        ev.preventDefault();
        menu.blur();

        //노트북 셀에 코드 삽입
        Ankus.cmdReg.execute(CommandID.insertCode.id, {
          //선택 메뉴의 아이디
          id: menuitems[selidx].id
        });
      }
      //esc
      else if (ev.key === 'Escape') {
        ev.preventDefault();
        menu.blur();
      }
    }; //key

    selidx = 0;
    return menu;
  } //completerMenu

  const isVisible = function (ele: HTMLElement, container: HTMLElement) {
    const eleTop = ele.offsetTop;
    const eleBottom = eleTop + ele.clientHeight;

    const containerTop = container.scrollTop + container.offsetTop;
    const containerBottom = containerTop + container.clientHeight;

    // The element is fully visible in the container
    return (
      eleTop >= containerTop && eleBottom <= containerBottom
      // Some part of the element is visible in the container
      /* (eleTop < containerTop && containerTop < eleBottom) ||
      (eleTop < containerBottom && containerBottom < eleBottom) */
    );
  }; //element is visible
} //ShareCode

export namespace StandardTermPart {
  export type Word = {
    wordId?: number;
    nameId?: number;
    name?: string;
    engName?: string;
    desc?: string;
    engDesc?: string;
    category?: number;
  };

  export type Category = {
    id: number;
    name: string;
  };

  export enum Format {
    upper = 'UPPERCASE',
    lower = 'lowercase',
    camel = 'camelCase',
    sentence = 'SentenceCase'
  }

  export enum Field {
    id = 'id',
    name = 'name',
    engName = 'engName',
    engFullname = 'engDesc',
    desc = 'desc',
    cat = 'category'
  }

  export const ABBR_RULE = /^[a-zA-Z0-9-_.]*$/;

  export async function searchWords(
    searchCol: string,
    keyword: string,
    orderCol: string,
    asc: boolean,
    category?: number
  ): Promise<Word[] | null> {
    const data = {
      searchColumn: searchCol,
      searchKeyword: keyword,
      orderColumn: orderCol,
      order: asc ? 'asc' : 'desc',
      category: category === undefined ? 0 : category
    };

    const res = await fetch(
      Ankus.ankusURL +
        '/standard-term/list?token=' +
        encodeURIComponent(Ankus.loginToken!),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Response Error');
        }
      })
      .then(json => {
        const list: any[] = json;
        const terms = list.map(
          item =>
            ({
              nameId: item['nameId'],
              wordId: item['wordId'],
              name: item['name'],
              engName: item['engName'],
              category: item['category'],
              desc: item['desc'],
              engDesc: item['engDesc']
            }) as StandardTermPart.Word
        ); //response list

        return terms;
      }) //response
      .catch(error => {
        return null;
      });

    return res;
  } //searchWords

  export async function loadCategories(): Promise<Category[]> {
    const res = await fetch(
      Ankus.ankusURL +
        '/standard-term/category-list?token=' +
        encodeURIComponent(Ankus.loginToken!)
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error Response');
        }
      })
      .then(response => {
        const lst: any[] = response;
        //check response
        if (lst.length === 0) {
          throw new Error('No Category');
        }

        const cats: Category[] = lst.map(cat =>
          //category
          ({
            id: cat['id'] as number,
            name: cat['name'] as string
          })
        ); //response list

        return cats;
      })
      .catch(error => {
        throw new Error('Failed to load Categories');
      });

    return res;
  } //loadCategories

  export function categoryLoadSignal(): ISignal<Ankus, Category[]> {
    return Ankus.ankusPlugin.stdtrmCategoriesLoadSignal;
  }

  export async function addCategory(
    name: string,
    signal: boolean
  ): Promise<Category[]> {
    const res = await fetch(
      Ankus.ankusURL +
        '/standard-term/add-category?token=' +
        encodeURIComponent(Ankus.loginToken!) +
        '&name=' +
        encodeURIComponent(name),
      {
        method: 'POST'
      }
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error Response');
        }
      })
      .then(json => {
        const list: any[] = json;
        const categories: Category[] = list.map(item => ({
          id: item['id'],
          name: item['name']
        }));

        if (signal) {
          Ankus.ankusPlugin.onStdtrmCategoriesLoaded(categories);
        }
        return categories;
      })
      .catch(error => {
        throw new Error('Failed to add category');
      });

    return res;
  } //addCategory

  //delete category
  export async function delCategory(
    id: number,
    signal: boolean
  ): Promise<Category[]> {
    const res = await fetch(
      Ankus.ankusURL +
        '/standard-term/del-category?token=' +
        encodeURIComponent(Ankus.loginToken!) +
        '&id=' +
        id,
      {
        method: 'DELETE'
      }
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error Response');
        }
      })
      .then(json => {
        const list: any[] = json;
        const categories: Category[] = list.map(item => ({
          id: item['id'],
          name: item['name']
        }));

        if (signal) {
          Ankus.ankusPlugin.onStdtrmCategoriesLoaded(categories);
        }
        return categories;
      })

      .catch(error => {
        throw new Error('Failed to delete category');
      });

    return res;
  } //delCategory

  export async function updateCategory(
    id: number,
    name: string,
    signal: boolean
  ): Promise<Category[]> {
    const res = await fetch(
      Ankus.ankusURL +
        '/standard-term/edit-category?token=' +
        encodeURIComponent(Ankus.loginToken!) +
        '&id=' +
        id +
        '&name=' +
        encodeURIComponent(name),
      {
        method: 'PUT'
      }
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error Response');
        }
      })
      .then(json => {
        const list: any[] = json;
        const categories: Category[] = list.map(item => ({
          id: item['id'],
          name: item['name']
        }));

        if (signal) {
          Ankus.ankusPlugin.onStdtrmCategoriesLoaded(categories);
        }
        return categories;
      })
      .catch(error => {
        throw new Error('Failed to update category');
      });

    return res;
  } //editCategory

  export async function completerMenu(
    keyword: string,
    x: number,
    y: number
  ): Promise<HTMLElement> {
    //no keyword
    if (keyword.trim().length < 1) {
      throw new Error('Keyword Error');
    }
    //check korean
    //const korRule = /^[가-힣]*$/;
    const engRule = /[\w\s.-]+/g;
    //search column
    const searchCol: string = engRule.test(keyword)
      ? Field.engName
      : Field.name;

    //search term
    const terms = await searchWords(
      searchCol,
      keyword,
      Field.engName,
      true,
      Ankus.stdtermCategory
    );

    if (terms === null) {
      throw new Error('Search Error');
    }

    /////////////////menu//////////////////
    const menu = document.createElement('div');
    menu.className = 'ankus-autocomplet-menu';
    //position
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.tabIndex = -1;

    /////////////////menu item - setting editor//////////////////
    const btn = document.createElement('div');
    btn.className = 'ankus-completer-new-term';

    //icon
    const icn = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icn.style.width = '16';
    icn.style.height = '16';
    icn.innerHTML =
      '<defs>\
      <clipPath id="clip-path">\
        <rect id="사각형_29" data-name="사각형 29" width="8" height="8" fill="#fff"/>\
      </clipPath>\
      </defs>\
      <g id="그룹_154" data-name="그룹 154" transform="translate(-36 -68)">\
        <circle id="타원_11" data-name="타원 11" cx="6" cy="6" r="6" transform="translate(36 68)" fill="#004391"/>\
        <g id="그룹_14" data-name="그룹 14" transform="translate(38 70)">\
        <g id="그룹_11" data-name="그룹 11" clip-path="url(#clip-path)">\
          <path id="패스_21" data-name="패스 21" d="M7.429,3.428H4.571V.572a.571.571,0,1,0-1.143,0V3.428H.572a.571.571,0,1,0,0,1.143H3.428V7.429a.571.571,0,0,0,1.143,0V4.571H7.429a.571.571,0,0,0,0-1.143" fill="#fff"/>\
        </g>\
        </g>\
      </g>';
    btn.append(icn);

    //text
    const spn = document.createElement('span');
    spn.textContent = ' New Dictionary Term';
    btn.append(spn);

    //click
    btn.onclick = (ev: MouseEvent) => {
      //close menu
      menu.blur();

      //standard term setting
      Ankus.ankusPlugin.openStdtermSetting(
        searchCol === Field.name ? { name: keyword } : { engName: keyword }
      );
    };
    menu.appendChild(btn);
    /////////////////menu item - setting editor//////////////////

    let selidx: number;
    const list = document.createElement('dl');

    const menuitems = terms.map(term => {
      const item = document.createElement('dt');
      //item.style.paddingLeft = '5px';
      //item.style.paddingRight = '5px';
      item.id = term.engName!;
      //name + english name
      item.innerHTML =
        '<span >' + term.engName + '</span> : <span >' + term.name + '</span>';

      //english full name
      if (term.engDesc !== null) {
        item.title = term.engDesc!;
      }

      //click
      item.onclick = (ev: MouseEvent) => {
        //insert selected text
        NotebookPlugin.insertCompletionText(term.engName!, true);
        //close menu
        menu.blur();
      };

      if (term.desc) {
        //description
        const desc = document.createElement('dd');
        desc.textContent = term.desc;
        item.appendChild(desc);
      }

      list.appendChild(item);
      return item;
    }); //menu item list

    if (menuitems && menuitems.length > 0) {
      //첫번째 아이템 기본 선택
      menuitems[0].className = 'sel-menu';

      menu.appendChild(list);
    }

    //key
    menu.onkeydown = ev => {
      //down
      if (ev.key === 'ArrowDown') {
        if (menuitems.length > 1) {
          //이전 선택 제거
          menuitems[selidx].className = '';
          //다음 아이템 / 첫 아이템
          selidx = menuitems.length === selidx + 1 ? 0 : selidx + 1;
          //아이템 선택
          menuitems[selidx].className = 'sel-menu';

          if (!isVisible(menuitems[selidx], list)) {
            menuitems[selidx].scrollIntoView();
          }
        }
        ev.preventDefault();
      }
      //up
      else if (ev.key === 'ArrowUp') {
        if (menuitems.length > 1) {
          //이전 선택 제거
          menuitems[selidx].className = '';
          //이전 아이템 / 마지막 아이템
          selidx = 0 === selidx ? menuitems.length - 1 : selidx - 1;
          //아이템 선택
          menuitems[selidx].className = 'sel-menu';

          if (!isVisible(menuitems[selidx], list)) {
            menuitems[selidx].scrollIntoView();
          }
        }
        ev.preventDefault();
      }
      //enter
      else if (ev.key === 'Enter') {
        //insert selected text
        NotebookPlugin.insertCompletionText(
          list.children.item(selidx)!.id,
          true
        );

        ev.preventDefault();
        menu.blur();
      }
      //esc
      else if (ev.key === 'Escape') {
        ev.preventDefault();
        menu.blur();
      }
    }; //key

    selidx = 0;
    return menu;
  } //completerMenu

  const isVisible = function (ele: HTMLElement, container: HTMLElement) {
    const eleTop = ele.offsetTop;
    const eleBottom = eleTop + ele.clientHeight;

    const containerTop = container.scrollTop + container.offsetTop;
    const containerBottom = containerTop + container.clientHeight;

    // The element is fully visible in the container
    return (
      eleTop >= containerTop && eleBottom <= containerBottom
      // Some part of the element is visible in the container
      /* (eleTop < containerTop && containerTop < eleBottom) ||
      (eleTop < containerBottom && containerBottom < eleBottom) */
    );
  }; //element is visible
} //StandardTermPart

export type UserInfo = {
  token: string;
  idx: number; //user index
  loginId: string;
  name: string; //user name
  admin: boolean;
};

export class Ankus {
  private static _ankus: Ankus;

  private constructor(
    app: JupyterFrontEnd,
    state: IStateDB,
    statusBar: IStatusBar,
    notebook: INotebookTracker
  ) {
    this._app = app;
    this._statdb = state;
    this._notebook = notebook;

    //status bar
    this._statbar = new AnkusStatusbar();
    statusBar.registerStatusItem('ankus-status', this._statbar);

    //document
    this._factory = new AnkusDocModelFactory();
    app.docRegistry.addModelFactory(this._factory);

    app.docRegistry.addFileType({
      name: 'ankus',
      displayName: 'ankus',
      mimeTypes: ['text/json', 'application/json'],
      fileFormat: 'text',
      contentType: 'file'
    });
  } //constructor

  static initialize(
    app: JupyterFrontEnd,
    state: IStateDB,
    statusBar: IStatusBar,
    notebook: INotebookTracker
  ) {
    Ankus._ankus = new Ankus(app, state, statusBar, notebook);
  }

  private _app: JupyterFrontEnd;
  private _statdb: IStateDB;
  private _statbar: AnkusStatusbar;
  private _notebook: INotebookTracker;
  private _mainmenu: Menu | null = null;

  private _serverUrl = '';
  private _remId = false;
  private _user: UserInfo | undefined = undefined;

  private _factory: AnkusDocModelFactory;
  private _codelist: CodelistWidget | undefined;
  private _editorlist: Array<AnkusCodeEditor> = [];
  //private csrfProtect = csrf({ cookie: true });

  private _stdtrmCat = 0;
  private _stdtrmFmt = '';
  private _stdtrmCatChanged = new Signal<Ankus, StandardTermPart.Category[]>(
    this
  );

  static get ankusPlugin(): Ankus {
    return Ankus._ankus;
  }

  static get ankusURL(): string {
    return Ankus._ankus._serverUrl;
  }

  static get loginToken(): string | undefined {
    return Ankus._ankus._user?.token;
  }

  static get logged(): boolean {
    return this.loginToken !== undefined;
  }

  static get userIsAdmin() {
    return Ankus._ankus._user?.admin;
  }

  get stdtrmCategoriesLoadSignal(): ISignal<
    Ankus,
    StandardTermPart.Category[]
  > {
    return this._stdtrmCatChanged;
  }

  //category list change
  onStdtrmCategoriesLoaded(cats: StandardTermPart.Category[]): void {
    this._stdtrmCatChanged.emit(cats);
  }

  static get stdtermCategory(): number {
    return Ankus._ankus._stdtrmCat;
  }
  static set stdtermCategory(id: number) {
    Ankus._ankus._stdtrmCat = id;
  }

  static get stdtermFormat(): string {
    return Ankus._ankus._stdtrmFmt;
  }
  static set stdtermFormat(fmt: string) {
    Ankus._ankus._stdtrmFmt = fmt;
  }

  static get userID(): string | undefined {
    return Ankus._ankus._user?.loginId;
  }

  static get userNumber(): number | undefined {
    return Ankus._ankus._user?.idx;
  }

  static get userName(): string | undefined {
    return Ankus._ankus._user?.name;
  }

  set codeList(list: CodelistWidget) {
    this._codelist = list;
  }
  get codeList(): CodelistWidget {
    return this._codelist!;
  }

  set mainMenu(menu: Menu) {
    this._mainmenu = menu;
  }

  get curActiveEditor(): AnkusCodeEditor | null {
    const curwg = this._app.shell.currentWidget;
    if (
      curwg !== null &&
      (curwg as MainAreaWidget).content instanceof AnkusCodeEditor
    ) {
      return (curwg as MainAreaWidget).content as AnkusCodeEditor;
    }
    return null;
  } //activatedEditor

  //current notebook
  static get activeNotebook(): Notebook | null {
    //check notebook
    if (
      Ankus.ankusPlugin._notebook.currentWidget !== null &&
      Ankus.ankusPlugin._app.shell.currentWidget!.node.classList.contains(
        'jp-NotebookPanel'
      )
    ) {
      return Ankus.ankusPlugin._notebook.currentWidget.content;
    }

    return null;
  }

  async openCodeEditor(id?: number): Promise<void> {
    let editorId: string = ANKUS_EXT_ID;
    const doc = this._factory.createNew();

    //open code
    if (id !== undefined) {
      //main window list
      const iter = this._app.shell.widgets('main');
      let w: Widget | undefined;
      while ((w = iter.next().value) !== undefined) {
        //found code editor
        if (w.id === ANKUS_EXT_ID + '-' + id) {
          this._app.shell.activateById(w.id);
          return;
        }
      }

      try {
        //get code
        const response = await fetch(
          `${this._serverUrl}/share-code/view?token=` +
            this._user!.token +
            '&codeId=' +
            id
        );
        //fail
        if (!response.ok) {
          throw new Error('fail');
        }

        //code data
        const jsrp = await response.json();

        doc.codeId = id;
        doc.codeName = jsrp[ShareCode.CodePropertyName.name];
        doc.writer = jsrp[ShareCode.CodePropertyName.userName];
        doc.updateDate = jsrp[ShareCode.CodePropertyName.date];
        doc.userNumber = jsrp[ShareCode.CodePropertyName.userNo];
        doc.codeContent = jsrp[ShareCode.CodePropertyName.content];

        if (jsrp[ShareCode.CodePropertyName.comment] !== null) {
          doc.setComment(jsrp[ShareCode.CodePropertyName.comment]);
        }

        //tag list
        if (jsrp[ShareCode.CodePropertyName.tag] !== null) {
          doc.codeTag = jsrp[ShareCode.CodePropertyName.tag].map(
            (value: any) => new CodeTag(value.name, value.tagId)
          );
        }

        editorId += '-' + doc.codeId;
      } catch (error) {
        alert('공유 코드 열기 오류');
        return;
      }
    }
    //new code
    else {
      doc.codeName = 'untitled';
      doc.userNumber = this._user!.idx;
      doc.writer = this._user!.name;
      doc.updateDate = new Date();
    }

    const content = new AnkusCodeEditor(doc);
    const mainwdg: MainAreaWidget = new MainAreaWidget({ content });

    mainwdg.id = editorId;
    mainwdg.title.icon = ANKUS_ICON;
    //mainwdg.title.label = title;
    mainwdg.title.closable = true;

    this._app.shell.add(mainwdg, 'main');
    this._editorlist.push(content);
    MessageLoop.installMessageHook(mainwdg, this.hookEditor);
  } //openCodeEditor

  async openStdtermSetting(word: StandardTermPart.Word | undefined) {
    //main window list
    const iter = this._app.shell.widgets('main');
    let w: Widget | undefined;
    while ((w = iter.next().value) !== undefined) {
      //found code editor
      if (w.id === ANKUS_EXT_ID + '-standard-term') {
        if (word) {
          ((w as MainAreaWidget).content as StandardTermSetting).setSelection(
            word,
            Ankus.stdtermCategory
          );
        }
        this._app.shell.activateById(w.id);
        return;
      }
    }

    const content = new StandardTermSetting(word);
    const mainwdg: MainAreaWidget = new MainAreaWidget({ content });

    mainwdg.id = ANKUS_EXT_ID + '-standard-term';
    mainwdg.title.icon = ANKUS_ICON;
    mainwdg.title.iconClass = 'ankus-editor-icon';
    mainwdg.title.label = 'Dictionary Setting';
    mainwdg.title.closable = true;

    this._app.shell.add(mainwdg, 'main');
  } //open standard setting

  hookEditor = (sender: any, message: Message): boolean => {
    const editor: AnkusCodeEditor = sender.content as AnkusCodeEditor;
    //click close
    if (message.type === 'close-request') {
      if (!editor.prepareClose()) {
        return false;
      }
    }
    return true;
  };

  login(user: UserInfo, remember: boolean, url: string) {
    this._user = user;
    this._remId = remember;
    this._serverUrl = url;

    this.saveState();
    this._mainmenu!.show();
  }

  //로그인 정보 저장
  saveState = (): void => {
    this._statdb.save(ANKUS_EXT_ID, {
      serverURL: this._serverUrl,
      loginID: this._remId ? this._user!.loginId : '',
      remID: this._remId,
      stdTermCategory: this._stdtrmCat,
      stdTermFormat: this._stdtrmFmt
    });
  };

  static get cmdReg(): CommandRegistry {
    return this.ankusPlugin._app.commands;
  }

  static dateToString(date: Date): string {
    const s = new Date(date).toLocaleString();
    return s.substring(0, s.lastIndexOf(':'));
  }

  //refresh code list
  updateCodelist() {
    this._codelist?.refresh();
  }

  //current selected code
  currentCode() {
    return this._codelist?.selectedCode;
  }

  //show code property dialog
  showCodeProp() {
    this._codelist!.openCodeProp();
  }

  connectStatusbar(editor: ISignal<AnkusCodeEditor, ShareCode.CodeProperty>) {
    this._statbar.setEditor(editor);
    this._statbar.activate = true;
  }

  disconnectStatusbar(
    editor: ISignal<AnkusCodeEditor, ShareCode.CodeProperty>
  ) {
    this._statbar.delEditor(editor);
    this._statbar.activate = false;
  }

  //delete code
  deleteCode() {
    if (this.currentCode === undefined) {
      return;
    }

    if (
      confirm('"' + this.currentCode()!.name + '" 코드를 삭제하시겠습니까?')
    ) {
      fetch(Ankus.ankusURL + '/share-code/delete/' + this.currentCode()!.id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: this._user?.token })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('fail');
          }

          //main window list
          const iter = this._app.shell.widgets('main');
          let w: Widget | undefined;
          while ((w = iter.next().value) !== undefined) {
            //found code editor
            if (w.id === ANKUS_EXT_ID + '-' + this.currentCode()!.id) {
              const editor = (w as MainAreaWidget).content as AnkusCodeEditor;
              editor.forceClose();
              //w.close();
              break;
            }
          }

          //update code list
          this.updateCodelist();
        })
        .catch(error => {
          alert('공유 코드 삭제 오류');
        });
    } //if : confirm delete
  } //deleteCode
} //class Ankus
