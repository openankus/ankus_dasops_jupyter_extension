import { IChangedArgs } from '@jupyterlab/coreutils';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { IModelDB } from '@jupyterlab/observables';
import { YDocument, MapChange, StateChange } from '@jupyter/ydoc';
import { PartialJSONValue, ReadonlyPartialJSONValue } from '@lumino/coreutils';
import { ISignal } from '@lumino/signaling';
import { NotebookPlugin } from '../notebookAction';
export declare class CodeTag {
    private _state;
    name: string;
    id?: number;
    constructor(name: string, id?: number);
    static newTag(name: string): CodeTag;
    get added(): boolean;
    get deleted(): boolean;
    setDeleted(): void;
    setNormal(): void;
}
export declare class AnkusDocModel implements DocumentRegistry.IModel {
    constructor(languagePreference?: string, modelDB?: IModelDB);
    get contentChanged(): ISignal<this, void>;
    get stateChanged(): ISignal<this, IChangedArgs<any, any, string>>;
    get dirty(): boolean;
    set dirty(value: boolean);
    readonly readOnly: boolean;
    /**
     * defaultKernelName and defaultKernelLanguage are only used by the Notebook widget
     * or documents that use kernels, and they store the name and the language of the kernel.
     */
    readonly defaultKernelName: string;
    readonly defaultKernelLanguage: string;
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
    readonly sharedModel: AnkusDoc;
    toString(): string;
    fromString(value: string): void;
    toJSON(): PartialJSONValue;
    fromJSON(value: ReadonlyPartialJSONValue): void;
    initialize(): void;
    get isDisposed(): boolean;
    dispose(): void;
    setComment(comment: string): void;
    addTag(name: string): void;
    deleteTag(name: string): void;
    updateTag(name: string, idx: number): void;
    get comment(): string;
    get codeContent(): Array<NotebookPlugin.CellData>;
    set codeContent(content: Array<NotebookPlugin.CellData>);
    get codeTag(): Array<CodeTag>;
    set codeTag(list: Array<CodeTag>);
    get sharedModelChanged(): ISignal<this, AnkusDocChange>;
    get saved(): ISignal<this, void>;
    private _onSharedModelChanged;
    get codeId(): number | undefined;
    set codeId(value: number | undefined);
    get codeName(): string;
    set codeName(value: string);
    get writer(): string;
    set writer(value: string);
    get userNumber(): number;
    set userNumber(value: number);
    get updateDate(): Date;
    set updateDate(value: Date);
    private updateCode;
    save(): void;
    private _dirty;
    private _isDisposed;
    private _contentChanged;
    private _stateChanged;
    private _sharedModelChanged;
    private _saved;
}
export type AnkusDocChange = {
    contextChange?: MapChange;
    codeChange?: string;
    commentChange?: string;
    tagChange?: Array<any>;
    nameChange?: string;
    stateChange?: StateChange<any>[];
};
export declare class AnkusDoc extends YDocument<AnkusDocChange> {
    version: string;
    constructor();
    /**
     * Dispose of the resources.
     */
    dispose(): void;
    /**
     * Static method to create instances on the sharedModel
     *
     * @returns The sharedModel instance
     */
    static create(): AnkusDoc;
    /**
     * Returns an the requested object.
     *
     * @param key The key of the object.
     * @returns The content
     */
    getContent(key: string): any;
    /**
     * Adds new data.
     *
     * @param key The key of the object.
     * @param value New object.
     */
    setContent(key: string, value: any): void;
    /**
     * Handle a change.
     *
     * @param event Model event
     */
    private _contentObserver;
    get updateDate(): Date;
    set updateDate(value: Date);
    private _date;
    private _content;
}
