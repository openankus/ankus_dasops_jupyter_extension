import { JupyterFrontEnd } from '@jupyterlab/application';
import { IStateDB } from '@jupyterlab/statedb';
import { LabIcon } from '@jupyterlab/ui-components';
import { Message } from '@lumino/messaging';
import { ISignal } from '@lumino/signaling';
import { CommandRegistry } from '@lumino/commands';
import { IStatusBar } from '@jupyterlab/statusbar';
import { INotebookTracker, Notebook } from '@jupyterlab/notebook';
import { AnkusCodeEditor } from './component/ankusCodeEditor';
import { CodeObject, CellData } from './doc/docModel';
import { CodelistWidget } from './component/codeList';
export declare const ANKUS_EXT_ID = "jupyter-ankus";
export declare const ANKUS_ICON: LabIcon;
export declare namespace StandardTermPart {
    type Word = {
        wordId?: number;
        nameId?: number;
        name?: string;
        engName?: string;
        desc?: string;
        engDesc?: string;
        category?: number;
    };
    type Category = {
        id: number;
        name: string;
    };
    enum Format {
        upper = "UPPERCASE",
        lower = "lowercase",
        camel = "camelCase",
        sentence = "SentenceCase"
    }
    enum Field {
        id = "id",
        name = "name",
        engName = "engName",
        engFullname = "engDesc",
        desc = "desc",
        cat = "category"
    }
    const ABBR_RULE: RegExp;
    function searchWords(searchCol: string, keyword: string, orderCol: string, asc: boolean, category?: number): Promise<Word[]>;
    function loadCategories(): Promise<Category[]>;
    function categoryLoadSignal(): ISignal<Ankus, Category[]>;
    function addCategory(name: string, signal: boolean): Promise<Category[]>;
    function delCategory(id: number, signal: boolean): Promise<Category[]>;
    function updateCategory(id: number, name: string, signal: boolean): Promise<Category[]>;
    function completerMenu(keyword: string, x: number, y: number): Promise<HTMLElement | null>;
}
export type UserInfo = {
    token: string;
    idx: number;
    loginId: string;
    name: string;
    admin: boolean;
};
export declare class Ankus {
    private static _ankus;
    private constructor();
    static initialize(app: JupyterFrontEnd, state: IStateDB, statusBar: IStatusBar, notebook: INotebookTracker): void;
    private _app;
    private _statdb;
    private _statbar;
    private _notebook;
    private _serverUrl;
    private _remId;
    private _user;
    private _clipboardData;
    private _factory;
    private _codelist;
    private _editorlist;
    private _stdtrmCat;
    private _stdtrmFmt;
    private _stdtrmCatChanged;
    static get ankusPlugin(): Ankus;
    static get ankusURL(): string;
    static get loginToken(): string | undefined;
    static get userIsAdmin(): boolean | undefined;
    get stdtrmCategoriesLoadSignal(): ISignal<Ankus, StandardTermPart.Category[]>;
    onStdtrmCategoriesLoaded(cats: StandardTermPart.Category[]): void;
    static get stdtermCategory(): number;
    static set stdtermCategory(id: number);
    static get stdtermFormat(): string;
    static set stdtermFormat(fmt: string);
    static get userID(): string | undefined;
    static get userNumber(): number | undefined;
    static get userName(): string | undefined;
    set codeList(list: CodelistWidget);
    get curActiveEditor(): AnkusCodeEditor | null;
    get activeNotebook(): Notebook | null;
    openCodeEditor(id?: number): Promise<void>;
    openStdtermSetting(word: StandardTermPart.Word | undefined): Promise<void>;
    hookEditor: (sender: any, message: Message) => boolean;
    login(user: UserInfo, remember: boolean, url: string): void;
    saveState: () => void;
    get jupyterCmdReg(): CommandRegistry;
    static dateToString(date: Date): string;
    updateCodelist(): void;
    connectStatusbar(editor: ISignal<AnkusCodeEditor, CodeObject>): void;
    disconnectStatusbar(editor: ISignal<AnkusCodeEditor, CodeObject>): void;
    copyCells(cells: any): void;
    get clipboardData(): CellData[] | undefined;
    deleteCode(id: number): void;
}
