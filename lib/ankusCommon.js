import { MainAreaWidget } from '@jupyterlab/apputils';
import { LabIcon } from '@jupyterlab/ui-components';
import { MessageLoop } from '@lumino/messaging';
import { Signal } from '@lumino/signaling';
//import cookie from 'react-cookies';
//import csrf from 'csurf';
import { AnkusDocModelFactory } from './doc/widgetFactory';
import { AnkusCodeEditor } from './component/ankusCodeEditor';
import { AnkusStatusbar } from './component/statusbar';
import { CodeTag } from './doc/docModel';
import { StandardTermSetting } from './component/standardTermSetting';
import { NotebookPlugin } from './notebookAction';
import ankusSvg from '../style/images/ankus.svg';
import { CommandID } from './ankusCommands';
//export const ANKUS_URL = 'http://localhost:9090'; //'http://dev.openankus.org:9090'; //
export const ANKUS_EXT_ID = 'jupyter-ankus';
export const ANKUS_ICON = new LabIcon({ name: 'ankus-icon', svgstr: ankusSvg });
export var ShareCode;
(function (ShareCode) {
    //api 서버와 함께 사용하는 명칭
    let CodePropertyName;
    (function (CodePropertyName) {
        CodePropertyName["id"] = "codeId";
        CodePropertyName["name"] = "title";
        CodePropertyName["comment"] = "codeComment";
        CodePropertyName["userNo"] = "writer";
        CodePropertyName["date"] = "udate";
        CodePropertyName["content"] = "content";
        CodePropertyName["userName"] = "name";
        CodePropertyName["tag"] = "tags";
    })(CodePropertyName = ShareCode.CodePropertyName || (ShareCode.CodePropertyName = {}));
    async function codelist(keywords, searchCol, orderCol, asc, page) {
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
            }
            else {
                throw new Error('fail');
            }
        })
            .then(response => {
            const res = {
                //code list
                list: response.content.map((itm) => ({
                    id: itm[CodePropertyName.id],
                    name: itm[CodePropertyName.name],
                    writer: itm[CodePropertyName.userName],
                    date: itm[CodePropertyName.date],
                    comment: itm[CodePropertyName.comment],
                    writerNo: itm[CodePropertyName.userNo],
                    tag: itm[CodePropertyName.tag]
                })),
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
    ShareCode.codelist = codelist;
    //노트북 셀의 선택 단어에 대한 자동완성 메뉴
    async function completerMenu(keyword, x, y) {
        //no keyword
        if (keyword.trim().length < 1) {
            throw new Error('Keyword Error');
        }
        //search code name
        const terms = await codelist([keyword], CodePropertyName.name, CodePropertyName.name, true, -1);
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
        let selidx;
        const list = document.createElement('dl');
        const menuitems = terms.list.map(term => {
            const codeid = term.id;
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
            item.onclick = (ev) => {
                //close menu
                menu.blur();
                //노트북 셀에 코드 삽입
                Ankus.cmdReg.execute(CommandID.insertCode.id, {
                    id: ev.target.id
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
    ShareCode.completerMenu = completerMenu;
    const isVisible = function (ele, container) {
        const eleTop = ele.offsetTop;
        const eleBottom = eleTop + ele.clientHeight;
        const containerTop = container.scrollTop + container.offsetTop;
        const containerBottom = containerTop + container.clientHeight;
        // The element is fully visible in the container
        return (eleTop >= containerTop && eleBottom <= containerBottom
        // Some part of the element is visible in the container
        /* (eleTop < containerTop && containerTop < eleBottom) ||
        (eleTop < containerBottom && containerBottom < eleBottom) */
        );
    }; //element is visible
})(ShareCode || (ShareCode = {})); //ShareCode
export var StandardTermPart;
(function (StandardTermPart) {
    let Format;
    (function (Format) {
        Format["upper"] = "UPPERCASE";
        Format["lower"] = "lowercase";
        Format["camel"] = "camelCase";
        Format["sentence"] = "SentenceCase";
    })(Format = StandardTermPart.Format || (StandardTermPart.Format = {}));
    let Field;
    (function (Field) {
        Field["id"] = "id";
        Field["name"] = "name";
        Field["engName"] = "engName";
        Field["engFullname"] = "engDesc";
        Field["desc"] = "desc";
        Field["cat"] = "category";
    })(Field = StandardTermPart.Field || (StandardTermPart.Field = {}));
    StandardTermPart.ABBR_RULE = /^[a-zA-Z0-9-_.]*$/;
    async function searchWords(searchCol, keyword, orderCol, asc, category) {
        const data = {
            searchColumn: searchCol,
            searchKeyword: keyword,
            orderColumn: orderCol,
            order: asc ? 'asc' : 'desc',
            category: category === undefined ? 0 : category
        };
        const res = await fetch(Ankus.ankusURL +
            '/standard-term/list?token=' +
            encodeURIComponent(Ankus.loginToken), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error('Response Error');
            }
        })
            .then(json => {
            const list = json;
            const terms = list.map(item => ({
                nameId: item['nameId'],
                wordId: item['wordId'],
                name: item['name'],
                engName: item['engName'],
                category: item['category'],
                desc: item['desc'],
                engDesc: item['engDesc']
            })); //response list
            return terms;
        }) //response
            .catch(error => {
            return null;
        });
        return res;
    } //searchWords
    StandardTermPart.searchWords = searchWords;
    async function loadCategories() {
        const res = await fetch(Ankus.ankusURL +
            '/standard-term/category-list?token=' +
            encodeURIComponent(Ankus.loginToken))
            .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error('Error Response');
            }
        })
            .then(response => {
            const lst = response;
            //check response
            if (lst.length === 0) {
                throw new Error('No Category');
            }
            const cats = lst.map(cat => 
            //category
            ({
                id: cat['id'],
                name: cat['name']
            })); //response list
            return cats;
        })
            .catch(error => {
            throw new Error('Failed to load Categories');
        });
        return res;
    } //loadCategories
    StandardTermPart.loadCategories = loadCategories;
    function categoryLoadSignal() {
        return Ankus.ankusPlugin.stdtrmCategoriesLoadSignal;
    }
    StandardTermPart.categoryLoadSignal = categoryLoadSignal;
    async function addCategory(name, signal) {
        const res = await fetch(Ankus.ankusURL +
            '/standard-term/add-category?token=' +
            encodeURIComponent(Ankus.loginToken) +
            '&name=' +
            encodeURIComponent(name), {
            method: 'POST'
        })
            .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error('Error Response');
            }
        })
            .then(json => {
            const list = json;
            const categories = list.map(item => ({
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
    StandardTermPart.addCategory = addCategory;
    //delete category
    async function delCategory(id, signal) {
        const res = await fetch(Ankus.ankusURL +
            '/standard-term/del-category?token=' +
            encodeURIComponent(Ankus.loginToken) +
            '&id=' +
            id, {
            method: 'DELETE'
        })
            .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error('Error Response');
            }
        })
            .then(json => {
            const list = json;
            const categories = list.map(item => ({
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
    StandardTermPart.delCategory = delCategory;
    async function updateCategory(id, name, signal) {
        const res = await fetch(Ankus.ankusURL +
            '/standard-term/edit-category?token=' +
            encodeURIComponent(Ankus.loginToken) +
            '&id=' +
            id +
            '&name=' +
            encodeURIComponent(name), {
            method: 'PUT'
        })
            .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error('Error Response');
            }
        })
            .then(json => {
            const list = json;
            const categories = list.map(item => ({
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
    StandardTermPart.updateCategory = updateCategory;
    async function completerMenu(keyword, x, y) {
        //no keyword
        if (keyword.trim().length < 1) {
            throw new Error('Keyword Error');
        }
        //check korean
        //const korRule = /^[가-힣]*$/;
        const engRule = /[\w\s.-]+/g;
        //search column
        const searchCol = engRule.test(keyword)
            ? Field.engName
            : Field.name;
        //search term
        const terms = await searchWords(searchCol, keyword, Field.engName, true, Ankus.stdtermCategory);
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
        btn.onclick = (ev) => {
            //close menu
            menu.blur();
            //standard term setting
            Ankus.ankusPlugin.openStdtermSetting(searchCol === Field.name ? { name: keyword } : { engName: keyword });
        };
        menu.appendChild(btn);
        /////////////////menu item - setting editor//////////////////
        let selidx;
        const list = document.createElement('dl');
        const menuitems = terms.map(term => {
            const item = document.createElement('dt');
            //item.style.paddingLeft = '5px';
            //item.style.paddingRight = '5px';
            item.id = term.engName;
            //name + english name
            item.innerHTML =
                '<span >' + term.engName + '</span> : <span >' + term.name + '</span>';
            //english full name
            if (term.engDesc !== null) {
                item.title = term.engDesc;
            }
            //click
            item.onclick = (ev) => {
                //insert selected text
                NotebookPlugin.insertCompletionText(term.engName, true);
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
                NotebookPlugin.insertCompletionText(list.children.item(selidx).id, true);
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
    StandardTermPart.completerMenu = completerMenu;
    const isVisible = function (ele, container) {
        const eleTop = ele.offsetTop;
        const eleBottom = eleTop + ele.clientHeight;
        const containerTop = container.scrollTop + container.offsetTop;
        const containerBottom = containerTop + container.clientHeight;
        // The element is fully visible in the container
        return (eleTop >= containerTop && eleBottom <= containerBottom
        // Some part of the element is visible in the container
        /* (eleTop < containerTop && containerTop < eleBottom) ||
        (eleTop < containerBottom && containerBottom < eleBottom) */
        );
    }; //element is visible
})(StandardTermPart || (StandardTermPart = {})); //StandardTermPart
export class Ankus {
    constructor(app, state, statusBar, notebook) {
        this._mainmenu = null;
        this._serverUrl = '';
        this._remId = false;
        this._user = undefined;
        this._editorlist = [];
        //private csrfProtect = csrf({ cookie: true });
        this._stdtrmCat = 0;
        this._stdtrmFmt = '';
        this._stdtrmCatChanged = new Signal(this);
        this.hookEditor = (sender, message) => {
            const editor = sender.content;
            //click close
            if (message.type === 'close-request') {
                if (!editor.prepareClose()) {
                    return false;
                }
            }
            return true;
        };
        //로그인 정보 저장
        this.saveState = () => {
            this._statdb.save(ANKUS_EXT_ID, {
                serverURL: this._serverUrl,
                loginID: this._remId ? this._user.loginId : '',
                remID: this._remId,
                stdTermCategory: this._stdtrmCat,
                stdTermFormat: this._stdtrmFmt
            });
        };
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
    static initialize(app, state, statusBar, notebook) {
        Ankus._ankus = new Ankus(app, state, statusBar, notebook);
    }
    static get ankusPlugin() {
        return Ankus._ankus;
    }
    static get ankusURL() {
        return Ankus._ankus._serverUrl;
    }
    static get loginToken() {
        var _a;
        return (_a = Ankus._ankus._user) === null || _a === void 0 ? void 0 : _a.token;
    }
    static get logged() {
        return this.loginToken !== undefined;
    }
    static get userIsAdmin() {
        var _a;
        return (_a = Ankus._ankus._user) === null || _a === void 0 ? void 0 : _a.admin;
    }
    get stdtrmCategoriesLoadSignal() {
        return this._stdtrmCatChanged;
    }
    //category list change
    onStdtrmCategoriesLoaded(cats) {
        this._stdtrmCatChanged.emit(cats);
    }
    static get stdtermCategory() {
        return Ankus._ankus._stdtrmCat;
    }
    static set stdtermCategory(id) {
        Ankus._ankus._stdtrmCat = id;
    }
    static get stdtermFormat() {
        return Ankus._ankus._stdtrmFmt;
    }
    static set stdtermFormat(fmt) {
        Ankus._ankus._stdtrmFmt = fmt;
    }
    static get userID() {
        var _a;
        return (_a = Ankus._ankus._user) === null || _a === void 0 ? void 0 : _a.loginId;
    }
    static get userNumber() {
        var _a;
        return (_a = Ankus._ankus._user) === null || _a === void 0 ? void 0 : _a.idx;
    }
    static get userName() {
        var _a;
        return (_a = Ankus._ankus._user) === null || _a === void 0 ? void 0 : _a.name;
    }
    set codeList(list) {
        this._codelist = list;
    }
    get codeList() {
        return this._codelist;
    }
    set mainMenu(menu) {
        this._mainmenu = menu;
    }
    get curActiveEditor() {
        const curwg = this._app.shell.currentWidget;
        if (curwg !== null &&
            curwg.content instanceof AnkusCodeEditor) {
            return curwg.content;
        }
        return null;
    } //activatedEditor
    //current notebook
    static get activeNotebook() {
        //check notebook
        if (Ankus.ankusPlugin._notebook.currentWidget !== null &&
            Ankus.ankusPlugin._app.shell.currentWidget.node.classList.contains('jp-NotebookPanel')) {
            return Ankus.ankusPlugin._notebook.currentWidget.content;
        }
        return null;
    }
    async openCodeEditor(id) {
        let editorId = ANKUS_EXT_ID;
        const doc = this._factory.createNew();
        //open code
        if (id !== undefined) {
            //main window list
            const iter = this._app.shell.widgets('main');
            let w;
            while ((w = iter.next().value) !== undefined) {
                //found code editor
                if (w.id === ANKUS_EXT_ID + '-' + id) {
                    this._app.shell.activateById(w.id);
                    return;
                }
            }
            try {
                //get code
                const response = await fetch(`${this._serverUrl}/share-code/view?token=` +
                    this._user.token +
                    '&codeId=' +
                    id);
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
                    doc.codeTag = jsrp[ShareCode.CodePropertyName.tag].map((value) => new CodeTag(value.name, value.tagId));
                }
                editorId += '-' + doc.codeId;
            }
            catch (error) {
                alert('공유 코드 열기 오류');
                return;
            }
        }
        //new code
        else {
            doc.codeName = 'untitled';
            doc.userNumber = this._user.idx;
            doc.writer = this._user.name;
            doc.updateDate = new Date();
        }
        const content = new AnkusCodeEditor(doc);
        const mainwdg = new MainAreaWidget({ content });
        mainwdg.id = editorId;
        mainwdg.title.icon = ANKUS_ICON;
        //mainwdg.title.label = title;
        mainwdg.title.closable = true;
        this._app.shell.add(mainwdg, 'main');
        this._editorlist.push(content);
        MessageLoop.installMessageHook(mainwdg, this.hookEditor);
    } //openCodeEditor
    async openStdtermSetting(word) {
        //main window list
        const iter = this._app.shell.widgets('main');
        let w;
        while ((w = iter.next().value) !== undefined) {
            //found code editor
            if (w.id === ANKUS_EXT_ID + '-standard-term') {
                if (word) {
                    w.content.setSelection(word, Ankus.stdtermCategory);
                }
                this._app.shell.activateById(w.id);
                return;
            }
        }
        const content = new StandardTermSetting(word);
        const mainwdg = new MainAreaWidget({ content });
        mainwdg.id = ANKUS_EXT_ID + '-standard-term';
        mainwdg.title.icon = ANKUS_ICON;
        mainwdg.title.iconClass = 'ankus-editor-icon';
        mainwdg.title.label = 'Dictionary Setting';
        mainwdg.title.closable = true;
        this._app.shell.add(mainwdg, 'main');
    } //open standard setting
    login(user, remember, url) {
        this._user = user;
        this._remId = remember;
        this._serverUrl = url;
        this.saveState();
        this._mainmenu.show();
    }
    static get cmdReg() {
        return this.ankusPlugin._app.commands;
    }
    static dateToString(date) {
        const s = new Date(date).toLocaleString();
        return s.substring(0, s.lastIndexOf(':'));
    }
    //refresh code list
    updateCodelist() {
        var _a;
        (_a = this._codelist) === null || _a === void 0 ? void 0 : _a.refresh();
    }
    //current selected code
    currentCode() {
        var _a;
        return (_a = this._codelist) === null || _a === void 0 ? void 0 : _a.selectedCode;
    }
    //show code property dialog
    showCodeProp() {
        this._codelist.openCodeProp();
    }
    connectStatusbar(editor) {
        this._statbar.setEditor(editor);
        this._statbar.activate = true;
    }
    disconnectStatusbar(editor) {
        this._statbar.delEditor(editor);
        this._statbar.activate = false;
    }
    //delete code
    deleteCode() {
        var _a;
        if (this.currentCode === undefined) {
            return;
        }
        if (confirm('"' + this.currentCode().name + '" 코드를 삭제하시겠습니까?')) {
            fetch(Ankus.ankusURL + '/share-code/delete/' + this.currentCode().id, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: (_a = this._user) === null || _a === void 0 ? void 0 : _a.token })
            })
                .then(response => {
                if (!response.ok) {
                    throw new Error('fail');
                }
                //main window list
                const iter = this._app.shell.widgets('main');
                let w;
                while ((w = iter.next().value) !== undefined) {
                    //found code editor
                    if (w.id === ANKUS_EXT_ID + '-' + this.currentCode().id) {
                        const editor = w.content;
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
//# sourceMappingURL=ankusCommon.js.map