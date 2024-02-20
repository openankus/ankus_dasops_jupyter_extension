import { ModelDB } from '@jupyterlab/observables';
import { YDocument } from '@jupyter/ydoc';
import { Signal } from '@lumino/signaling';
import { Ankus, ShareCode } from '../ankusCommon';
var TagState;
(function (TagState) {
    TagState[TagState["Normal"] = 0] = "Normal";
    TagState[TagState["New"] = 1] = "New";
    TagState[TagState["Delete"] = 2] = "Delete";
})(TagState || (TagState = {}));
export class CodeTag {
    constructor(name, id) {
        this._state = TagState.Normal;
        this.name = '';
        this.name = name;
        this.id = id;
    }
    static newTag(name) {
        const tag = new CodeTag(name);
        tag._state = TagState.New;
        return tag;
    }
    get added() {
        return this._state === TagState.New;
    }
    get deleted() {
        return this._state === TagState.Delete;
    }
    setDeleted() {
        this._state = TagState.Delete;
    }
    setNormal() {
        this._state = TagState.Normal;
    }
} //CodeTag
export class AnkusDocModel {
    constructor(languagePreference, modelDB) {
        this.readOnly = false;
        /**
         * New datastore introduced in JupyterLab v3.1 to store shared data and make notebooks
         * collaborative
         */
        this.sharedModel = AnkusDoc.create();
        this._onSharedModelChanged = (sender, changes) => {
            this._sharedModelChanged.emit(changes);
        };
        this._dirty = false;
        this._isDisposed = false;
        this._contentChanged = new Signal(this);
        this._stateChanged = new Signal(this);
        this._sharedModelChanged = new Signal(this);
        this._saved = new Signal(this);
        this.modelDB = modelDB || new ModelDB();
        this.codeTag = [];
        this.sharedModel.changed.connect(this._onSharedModelChanged);
    }
    get contentChanged() {
        return this._contentChanged;
    }
    get stateChanged() {
        return this._stateChanged;
    }
    get dirty() {
        return this._dirty;
    }
    set dirty(value) {
        this._dirty = value;
    }
    toString() {
        throw new Error('Method not implemented.');
    }
    fromString(value) {
        throw new Error('Method not implemented.');
    }
    toJSON() {
        throw new Error('Method not implemented.');
    }
    fromJSON(value) {
        throw new Error('Method not implemented.');
    }
    initialize() {
        throw new Error('Method not implemented.');
    }
    get isDisposed() {
        return this._isDisposed;
    }
    dispose() {
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
    setComment(comment) {
        this.sharedModel.setContent(ShareCode.CodePropertyName.comment, comment);
    }
    addTag(name) {
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
    deleteTag(name) {
        const tags = this.codeTag;
        const found = tags.find(tag => tag.name === name);
        if (found !== undefined) {
            tags.splice(tags.indexOf(found), 1);
            this.sharedModel.setContent(ShareCode.CodePropertyName.tag, tags);
        }
    }
    updateTag(name, idx) {
        const tags = this.codeTag;
        tags[idx].name = name;
        this.sharedModel.setContent(ShareCode.CodePropertyName.tag, tags);
    }
    get comment() {
        return this.sharedModel.getContent(ShareCode.CodePropertyName.comment);
    }
    get codeContent() {
        return this.sharedModel.getContent(ShareCode.CodePropertyName.content);
    }
    set codeContent(content) {
        this.sharedModel.setContent(ShareCode.CodePropertyName.content, content);
    }
    get codeTag() {
        return this.sharedModel.getContent(ShareCode.CodePropertyName.tag);
    }
    set codeTag(list) {
        this.sharedModel.setContent(ShareCode.CodePropertyName.tag, list);
    }
    get sharedModelChanged() {
        return this._sharedModelChanged;
    }
    get saved() {
        return this._saved;
    }
    get codeId() {
        return this.sharedModel.getContent(ShareCode.CodePropertyName.id);
    }
    set codeId(value) {
        this.sharedModel.setContent(ShareCode.CodePropertyName.id, value);
    }
    get codeName() {
        return this.sharedModel.getContent(ShareCode.CodePropertyName.name);
    }
    set codeName(value) {
        this.sharedModel.setContent(ShareCode.CodePropertyName.name, value);
    }
    get writer() {
        return this.sharedModel.getContent(ShareCode.CodePropertyName.userName);
    }
    set writer(value) {
        this.sharedModel.setContent(ShareCode.CodePropertyName.userName, value);
    }
    get userNumber() {
        return this.sharedModel.getContent(ShareCode.CodePropertyName.userNo);
    }
    set userNumber(value) {
        this.sharedModel.setContent(ShareCode.CodePropertyName.userNo, value);
    }
    get updateDate() {
        return this.sharedModel.updateDate;
    }
    set updateDate(value) {
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
    updateCode() {
        const contents = this.codeContent.filter(value => {
            return value.source.trim().length !== 0;
        });
        const code = {};
        code[ShareCode.CodePropertyName.name] = this.codeName; //code name
        code[ShareCode.CodePropertyName.comment] = this.comment; //code comment
        code[ShareCode.CodePropertyName.content] = contents; //code content
        //code[CodePropertyName.date] = this.updateDate;
        code[ShareCode.CodePropertyName.userNo] = this.userNumber; //code writer(number)
        //tag list
        code[ShareCode.CodePropertyName.tag] = this.codeTag.map((tag, index) => tag.name);
        //code id
        code[ShareCode.CodePropertyName.id] = this.codeId;
        //update code
        fetch(Ankus.ankusURL + '/share-code/modify', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: Ankus.loginToken,
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
    save() {
        //new code
        if (this.codeId === undefined) {
            const contents = this.codeContent.filter(value => {
                //빈 문자열 제외
                return value.source.trim().length !== 0;
            });
            const code = {};
            code[ShareCode.CodePropertyName.name] = this.codeName; //code name
            code[ShareCode.CodePropertyName.comment] = this.comment; //code comment
            code[ShareCode.CodePropertyName.content] = contents; //code content
            //code[CodePropertyName.date] = this.updateDate;
            code[ShareCode.CodePropertyName.userNo] = this.userNumber; //code writer(number)
            //tag list
            code[ShareCode.CodePropertyName.tag] = this.codeTag.map((tag, index) => tag.name);
            fetch(Ankus.ankusURL + '/share-code/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: Ankus.loginToken,
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
}
export class AnkusDoc extends YDocument {
    constructor() {
        super();
        this.version = '1.0';
        /**
         * Handle a change.
         *
         * @param event Model event
         */
        this._contentObserver = (event) => {
            const changes = {};
            // Checks which object changed and propagates them.
            if (event.keysChanged.has(ShareCode.CodePropertyName.tag)) {
                changes.tagChange = this._content.get(ShareCode.CodePropertyName.tag);
            }
            else if (event.keysChanged.has(ShareCode.CodePropertyName.comment)) {
                changes.commentChange = this._content.get(ShareCode.CodePropertyName.comment);
            }
            else if (event.keysChanged.has(ShareCode.CodePropertyName.content)) {
                changes.codeChange = this._content.get(ShareCode.CodePropertyName.content);
            }
            else if (event.keysChanged.has(ShareCode.CodePropertyName.name)) {
                changes.nameChange = this._content.get(ShareCode.CodePropertyName.name);
            }
            else {
                return;
            }
            this._changed.emit(changes);
        };
        this._date = new Date();
        // Creating a new shared object and listen to its changes
        this._content = this.ydoc.getMap('content');
        this._content.observe(this._contentObserver);
    }
    /**
     * Dispose of the resources.
     */
    dispose() {
        this._content.unobserve(this._contentObserver);
    }
    /**
     * Static method to create instances on the sharedModel
     *
     * @returns The sharedModel instance
     */
    static create() {
        return new AnkusDoc();
    }
    /**
     * Returns an the requested object.
     *
     * @param key The key of the object.
     * @returns The content
     */
    getContent(key) {
        return this._content.get(key);
    }
    /**
     * Adds new data.
     *
     * @param key The key of the object.
     * @param value New object.
     */
    setContent(key, value) {
        this._content.set(key, value);
    }
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
    get updateDate() {
        return this._date;
    }
    set updateDate(value) {
        this._date = value;
    }
}
//# sourceMappingURL=docModel.js.map