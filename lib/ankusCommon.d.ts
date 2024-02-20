import { JupyterFrontEnd } from '@jupyterlab/application';
import { IStateDB } from '@jupyterlab/statedb';
import { LabIcon } from '@jupyterlab/ui-components';
import { Menu } from '@lumino/widgets';
import { Message } from '@lumino/messaging';
import { ISignal } from '@lumino/signaling';
import { CommandRegistry } from '@lumino/commands';
import { IStatusBar } from '@jupyterlab/statusbar';
import { INotebookTracker, Notebook } from '@jupyterlab/notebook';
import { AnkusCodeEditor } from './component/ankusCodeEditor';
import { CodelistWidget } from './component/codeList';
export declare const ANKUS_EXT_ID = "jupyter-ankus";
export declare const ANKUS_ICON: LabIcon;
export declare namespace ShareCode {
    enum CodePropertyName {
        id = "codeId",
        name = "title",
        comment = "codeComment",
        userNo = "writer",
        date = "udate",
        content = "content",
        userName = "name",
        tag = "tags"
    }
    type CodeProperty = {
        id?: number;
        name?: string;
        writer?: string;
        date?: Date;
        comment?: string;
        tag?: string;
        writerNo?: number;
        taglist?: Array<string>;
    };
    type CodeList = {
        list: CodeProperty[];
        totalSize: number;
        pageSize: number;
    };
    function codelist(keywords: string[], searchCol: string, orderCol: string, asc: boolean, page: number): Promise<CodeList | null>;
    function completerMenu(keyword: string, x: number, y: number): Promise<HTMLElement>;
}
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
    function searchWords(searchCol: string, keyword: string, orderCol: string, asc: boolean, category?: number): Promise<Word[] | null>;
    function loadCategories(): Promise<Category[]>;
    function categoryLoadSignal(): ISignal<Ankus, Category[]>;
    function addCategory(name: string, signal: boolean): Promise<Category[]>;
    function delCategory(id: number, signal: boolean): Promise<Category[]>;
    function updateCategory(id: number, name: string, signal: boolean): Promise<Category[]>;
    function completerMenu(keyword: string, x: number, y: number): Promise<HTMLElement>;
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
    private _mainmenu;
    private _serverUrl;
    private _remId;
    private _user;
    private _factory;
    private _codelist;
    private _editorlist;
    private _stdtrmCat;
    private _stdtrmFmt;
    private _stdtrmCatChanged;
    static get ankusPlugin(): Ankus;
    static get ankusURL(): string;
    static get loginToken(): string | undefined;
    static get logged(): boolean;
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
    get codeList(): CodelistWidget;
    set mainMenu(menu: Menu);
    get curActiveEditor(): AnkusCodeEditor | null;
    static get activeNotebook(): Notebook | null;
    openCodeEditor(id?: number): Promise<void>;
    openStdtermSetting(word: StandardTermPart.Word | undefined): Promise<void>;
    hookEditor: (sender: any, message: Message) => boolean;
    login(user: UserInfo, remember: boolean, url: string): void;
    saveState: () => void;
    static get cmdReg(): CommandRegistry;
    static dateToString(date: Date): string;
    updateCodelist(): void;
    currentCode(): ShareCode.CodeProperty | undefined;
    showCodeProp(): void;
    connectStatusbar(editor: ISignal<AnkusCodeEditor, ShareCode.CodeProperty>): void;
    disconnectStatusbar(editor: ISignal<AnkusCodeEditor, ShareCode.CodeProperty>): void;
    deleteCode(): void;
}
