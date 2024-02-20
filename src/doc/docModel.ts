import { IChangedArgs } from '@jupyterlab/coreutils';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { IModelDB, ModelDB } from '@jupyterlab/observables';
import { YDocument, MapChange, StateChange } from '@jupyter/ydoc';
import { PartialJSONValue, ReadonlyPartialJSONValue } from '@lumino/coreutils';
import { ISignal, Signal } from '@lumino/signaling';
import * as Y from 'yjs';

import { Ankus, ShareCode } from '../ankusCommon';
import { NotebookPlugin } from '../notebookAction';

enum TagState {
  Normal,
  New,
  Delete
}

export class CodeTag {
  private _state: TagState = TagState.Normal;
  name = '';
  id?: number;

  constructor(name: string, id?: number) {
    this.name = name;
    this.id = id;
  }

  static newTag(name: string): CodeTag {
    const tag: CodeTag = new CodeTag(name);
    tag._state = TagState.New;
    return tag;
  }

  get added(): boolean {
    return this._state === TagState.New;
  }
  get deleted(): boolean {
    return this._state === TagState.Delete;
  }

  setDeleted() {
    this._state = TagState.Delete;
  }

  setNormal() {
    this._state = TagState.Normal;
  }
} //CodeTag

export class AnkusDocModel implements DocumentRegistry.IModel {
  constructor(languagePreference?: string, modelDB?: IModelDB) {
    this.modelDB = modelDB || new ModelDB();

    this.codeTag = [];
    this.sharedModel.changed.connect(this._onSharedModelChanged);
  }

  get contentChanged(): ISignal<this, void> {
    return this._contentChanged;
  }

  get stateChanged(): ISignal<this, IChangedArgs<any, any, string>> {
    return this._stateChanged;
  }

  get dirty(): boolean {
    return this._dirty;
  }

  set dirty(value: boolean) {
    this._dirty = value;
  }

  readonly readOnly: boolean = false;

  /**
   * defaultKernelName and defaultKernelLanguage are only used by the Notebook widget
   * or documents that use kernels, and they store the name and the language of the kernel.
   */
  readonly defaultKernelName!: string;
  readonly defaultKernelLanguage!: string;

  /**
   * modelBD is the datastore for the content of the document.
   * modelDB is not a shared datastore so we don't use it on this example since
   * this example is a shared document.
   */
  readonly modelDB: IModelDB;

  /**
   * New datastore introduced in JupyterLab v3.1 to store shared data and make notebooks
   * collaborative
   */
  readonly sharedModel: AnkusDoc = AnkusDoc.create();

  toString(): string {
    throw new Error('Method not implemented.');
  }

  fromString(value: string): void {
    throw new Error('Method not implemented.');
  }

  toJSON(): PartialJSONValue {
    throw new Error('Method not implemented.');
  }

  fromJSON(value: ReadonlyPartialJSONValue): void {
    throw new Error('Method not implemented.');
  }

  initialize(): void {
    throw new Error('Method not implemented.');
  }

  get isDisposed(): boolean {
    return this._isDisposed;
  }

  dispose(): void {
    if (this._isDisposed) {
      return;
    }

    this._isDisposed = true;
    this.sharedModel.changed.disconnect(this._onSharedModelChanged);
    Signal.clearData(this);
  }

  /*  getCodeObject(): CodeProperty {
    return {
      comment: this.sharedModel.getContent(CodePropertyName.comment),
      tag: this.sharedModel.getContent(CodePropertyName.tag),
      content: this.sharedModel.getContent(CodePropertyName.content),
      id: this.sharedModel.codeId,
      name: this.sharedModel.codeName,
      writer: this.sharedModel.writer,
      date: this.sharedModel.updateDate
    };
  } */

  setComment(comment: string): void {
    this.sharedModel.setContent(ShareCode.CodePropertyName.comment, comment);
  }

  addTag(name: string): void {
    /*     const regex = /[\s#]/g;
    if (name.search(regex) !== -1) {
      return false;
    }
 */
    const tags = this.codeTag;
    //const found = tags.find(tag => tag.name === name);
    //추가
    //if (found === undefined) {
    tags.push(CodeTag.newTag(name));

    this.sharedModel.setContent(ShareCode.CodePropertyName.tag, tags);
  }

  deleteTag(name: string): void {
    const tags = this.codeTag;
    const found = tags.find(tag => tag.name === name);
    if (found !== undefined) {
      tags.splice(tags.indexOf(found), 1);

      this.sharedModel.setContent(ShareCode.CodePropertyName.tag, tags);
    }
  }

  updateTag(name: string, idx: number) {
    const tags = this.codeTag;
    tags[idx].name = name;
    this.sharedModel.setContent(ShareCode.CodePropertyName.tag, tags);
  }

  get comment(): string {
    return this.sharedModel.getContent(ShareCode.CodePropertyName.comment);
  }

  get codeContent(): Array<NotebookPlugin.CellData> {
    return this.sharedModel.getContent(ShareCode.CodePropertyName.content);
  }

  set codeContent(content: Array<NotebookPlugin.CellData>) {
    this.sharedModel.setContent(ShareCode.CodePropertyName.content, content);
  }

  get codeTag(): Array<CodeTag> {
    return this.sharedModel.getContent(ShareCode.CodePropertyName.tag);
  }

  set codeTag(list: Array<CodeTag>) {
    this.sharedModel.setContent(ShareCode.CodePropertyName.tag, list);
  }

  get sharedModelChanged(): ISignal<this, AnkusDocChange> {
    return this._sharedModelChanged;
  }

  get saved(): ISignal<this, void> {
    return this._saved;
  }

  private _onSharedModelChanged = (
    sender: AnkusDoc,
    changes: AnkusDocChange
  ): void => {
    this._sharedModelChanged.emit(changes);
  };

  get codeId(): number | undefined {
    return this.sharedModel.getContent(ShareCode.CodePropertyName.id);
  }

  set codeId(value: number | undefined) {
    this.sharedModel.setContent(ShareCode.CodePropertyName.id, value);
  }

  get codeName(): string {
    return this.sharedModel.getContent(ShareCode.CodePropertyName.name);
  }

  set codeName(value: string) {
    this.sharedModel.setContent(ShareCode.CodePropertyName.name, value);
  }

  get writer(): string {
    return this.sharedModel.getContent(ShareCode.CodePropertyName.userName);
  }

  set writer(value: string) {
    this.sharedModel.setContent(ShareCode.CodePropertyName.userName, value);
  }

  get userNumber(): number {
    return this.sharedModel.getContent(ShareCode.CodePropertyName.userNo);
  }

  set userNumber(value: number) {
    this.sharedModel.setContent(ShareCode.CodePropertyName.userNo, value);
  }

  get updateDate(): Date {
    return this.sharedModel.updateDate;
  }

  set updateDate(value: Date) {
    this.sharedModel.updateDate = value;
  }

  /*   private commitTagDeletion(): void {
    const deltags: Array<number> = [];
    //삭제할 태그 아이디 목록
    this.codeTag.forEach(tag => {
      //check deletion
      if (tag.deleted && tag.id !== undefined) {
        deltags.push(tag.id);
      }
    });

    //삭제할 태그 있음
    if (deltags.length !== 0) {
      fetch(ANKUS_URL + '/share-code/delete-tag/' + this.codeId, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: Ankus.ankusPlugin.loginToken, //login token
          tags: deltags //삭제할 태그
        })
      })
        .then(response => {
          //response fail
          if (!response.ok) {
            throw new Error('fail');
          }

          const tags: Array<CodeTag> = [];
          //태그 목록에서, 삭제된 태그 제거
          this.codeTag.forEach(tag => {
            //check deletion tag
            if (!tag.deleted) {
              tags.push(tag);
            }
          });

          this.sharedModel.setContent(CodePropertyName.tag, tags);
          this.updateCode();
        })
        .catch(error => {
          alert('태그 저장 오류');
        }); //fetch
    } else {
      this.updateCode();
    }
  } //commitTagDeletion */

  private updateCode(): void {
    const contents = this.codeContent.filter(value => {
      return value.source.trim().length !== 0;
    });

    const code: any = {};
    code[ShareCode.CodePropertyName.name] = this.codeName; //code name
    code[ShareCode.CodePropertyName.comment] = this.comment; //code comment
    code[ShareCode.CodePropertyName.content] = contents; //code content
    //code[CodePropertyName.date] = this.updateDate;
    code[ShareCode.CodePropertyName.userNo] = this.userNumber; //code writer(number)
    //tag list
    code[ShareCode.CodePropertyName.tag] = this.codeTag.map(
      (tag, index) => tag.name
    );
    //code id
    code[ShareCode.CodePropertyName.id] = this.codeId;

    //update code
    fetch(Ankus.ankusURL + '/share-code/modify', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: Ankus.loginToken, //login token
        code: code //code detail
      })
    })
      .then(response => {
        //response ok
        if (response.ok) {
          return response.json();
        }
        //response fail
        else {
          throw new Error('fail');
        }
      })
      .then(jsresp => {
        console.log('code updated');
        //update date
        this.updateDate = jsresp[ShareCode.CodePropertyName.date];
        //reset dirty
        this.dirty = false;
        //saved signal
        this._saved.emit();
      })
      .catch(error => {
        alert('공유 코드 저장 오류');
      }); //fetch
  } //update code

  public save(): void {
    //new code
    if (this.codeId === undefined) {
      const contents = this.codeContent.filter(value => {
        //빈 문자열 제외
        return value.source.trim().length !== 0;
      });

      const code: any = {};
      code[ShareCode.CodePropertyName.name] = this.codeName; //code name
      code[ShareCode.CodePropertyName.comment] = this.comment; //code comment
      code[ShareCode.CodePropertyName.content] = contents; //code content
      //code[CodePropertyName.date] = this.updateDate;
      code[ShareCode.CodePropertyName.userNo] = this.userNumber; //code writer(number)
      //tag list
      code[ShareCode.CodePropertyName.tag] = this.codeTag.map(
        (tag, index) => tag.name
      );

      fetch(Ankus.ankusURL + '/share-code/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: Ankus.loginToken, //user token
          code: code //code detail
        })
      })
        .then(response => {
          //response ok
          if (response.ok) {
            return response.json();
          }
          //response fail
          else {
            throw new Error('fail');
          }
        })
        .then(jsresp => {
          //code id
          this.codeId = jsresp[ShareCode.CodePropertyName.id];
          //update date
          this.updateDate = jsresp[ShareCode.CodePropertyName.date];
          //reset dirty
          this.dirty = false;
          //saved signal
          this._saved.emit();
        })
        .catch(error => {
          alert('공유 코드 저장 오류');
        }); //fetch
    } //if : new code

    //update code
    else {
      this.updateCode();

      //new tag exists
      /*       if (addtags.length > 0) {
        //add tag
        fetch(ANKUS_URL + '/share-code/add-tag/' + this.codeId, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: Ankus.ankusPlugin.loginToken, //login token
            tags: addtags //tag name list
          })
        })
          .then(response => {
            //response ok
            if (response.ok) {
              return response.json();
            }
            //response fail
            else {
              throw new Error('fail');
            }
          })
          .then((response: Array<any>) => {
            //new tag list
            response.forEach(val => {
              //find tag
              const found = this.codeTag.find(tag => val.name === tag.name);
              if (found !== undefined) {
                //tag id
                found.id = val.id;
                //new tag -> normal tag
                found.setNormal();
              }
            }); //new tag list

            //delete tag
            this.commitTagDeletion();
          })
          .catch(error => {
            alert('태그 저장 오류');
          }); //fetch
      } //if : new tag exists
      else {
        //delete tag
        this.commitTagDeletion();
      } */
    } //update code
  } //save

  private _dirty = false;
  private _isDisposed = false;
  private _contentChanged = new Signal<this, void>(this);
  private _stateChanged = new Signal<this, IChangedArgs<any>>(this);
  private _sharedModelChanged = new Signal<this, AnkusDocChange>(this);
  private _saved = new Signal<this, void>(this);
}

export type AnkusDocChange = {
  contextChange?: MapChange;
  codeChange?: string;
  commentChange?: string;
  tagChange?: Array<any>;
  nameChange?: string;
  stateChange?: StateChange<any>[];
};

export class AnkusDoc extends YDocument<AnkusDocChange> {
  version: string = '1.0';

  constructor() {
    super();

    // Creating a new shared object and listen to its changes
    this._content = this.ydoc.getMap('content');
    this._content.observe(this._contentObserver);
  }

  /**
   * Dispose of the resources.
   */
  dispose(): void {
    this._content.unobserve(this._contentObserver);
  }

  /**
   * Static method to create instances on the sharedModel
   *
   * @returns The sharedModel instance
   */
  public static create(): AnkusDoc {
    return new AnkusDoc();
  }

  /**
   * Returns an the requested object.
   *
   * @param key The key of the object.
   * @returns The content
   */
  public getContent(key: string): any {
    return this._content.get(key);
  }

  /**
   * Adds new data.
   *
   * @param key The key of the object.
   * @param value New object.
   */
  public setContent(key: string, value: any): void {
    this._content.set(key, value);
  }

  /**
   * Handle a change.
   *
   * @param event Model event
   */
  private _contentObserver = (event: Y.YMapEvent<any>): void => {
    const changes: AnkusDocChange = {};

    // Checks which object changed and propagates them.
    if (event.keysChanged.has(ShareCode.CodePropertyName.tag)) {
      changes.tagChange = this._content.get(ShareCode.CodePropertyName.tag);
    } else if (event.keysChanged.has(ShareCode.CodePropertyName.comment)) {
      changes.commentChange = this._content.get(
        ShareCode.CodePropertyName.comment
      );
    } else if (event.keysChanged.has(ShareCode.CodePropertyName.content)) {
      changes.codeChange = this._content.get(
        ShareCode.CodePropertyName.content
      );
    } else if (event.keysChanged.has(ShareCode.CodePropertyName.name)) {
      changes.nameChange = this._content.get(ShareCode.CodePropertyName.name);
    } else {
      return;
    }

    this._changed.emit(changes);
  };

  /*   get codeId(): number {
    return this._id;
  }

  set codeId(value: number) {
    this._id = value;
  }

  get codeName(): string {
    return this._name;
  }

  set codeName(value: string) {
    this._name = value;
  }

  get writer(): string {
    return this._writer;
  }

  set writer(value: string) {
    this._writer = value;
  }


  private _id = 0;
  private _name = '';
  private _writer = '';
  
*/

  get updateDate(): Date {
    return this._date;
  }

  set updateDate(value: Date) {
    this._date = value;
  }

  private _date: Date = new Date();
  private _content: Y.Map<any>;
}
