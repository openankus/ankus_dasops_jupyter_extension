/// <reference types="react" />
import { ReactWidget } from '@jupyterlab/apputils';
import { DocumentWidget } from '@jupyterlab/docregistry';
import { Message } from '@lumino/messaging';
import { Widget } from '@lumino/widgets';
import * as AnkusDoc from '../doc/docModel';
import '../../style/codeedit.css';
export declare class AnkusDocWidget extends DocumentWidget<AnkusCodeEditor, AnkusDoc.AnkusDocModel> {
    constructor(options: DocumentWidget.IOptions<AnkusCodeEditor, AnkusDoc.AnkusDocModel>);
    dispose(): void;
}
export declare class AnkusCodeEditor extends ReactWidget {
    private _edcelRef;
    constructor(doc: AnkusDoc.AnkusDocModel);
    forceClose(): void;
    prepareClose(): boolean;
    protected onResize(msg: Widget.ResizeMessage): void;
    dispose(): void;
    private _selectedTab;
    private _doc;
    private _updateStatusbar;
    private _editCell;
    private _selectedCell;
    private _resetCode;
    private _onContentChanged;
    private _onSaved;
    addTag: (tag: string) => void;
    delTag: (name: string) => void;
    updateTag: (tag: string, idx: number) => void;
    updateComment: (comment: string) => void;
    newCell(type: string): void;
    pasteCell(): void;
    private updateContent;
    deleteCell: () => Promise<void>;
    shiftEditMode: () => void;
    onAfterShow(msg: Message): void;
    protected onBeforeHide(msg: Message): void;
    private saveAs;
    save: () => void;
    get saveVisible(): boolean;
    get saveAvailable(): boolean;
    get curActiveTab(): string;
    private setActiveCell;
    get cellIsEditMode(): boolean;
    private tooltipText;
    private titleStyle;
    render(): JSX.Element;
}
