import { IStatusBar } from '@jupyterlab/statusbar';
import { ISignal } from '@lumino/signaling';
import { Widget } from '@lumino/widgets';
import { CodeObject } from '../doc/docModel';
import { AnkusCodeEditor } from './ankusCodeEditor';
export declare class AnkusStatusbar implements IStatusBar.IItem {
    private _isActive;
    constructor();
    set activate(value: boolean);
    setEditor(editor: ISignal<AnkusCodeEditor, CodeObject>): void;
    delEditor(editor: ISignal<AnkusCodeEditor, CodeObject>): void;
    private _onUpdate;
    isActive: () => boolean;
    item: Widget;
    align: IStatusBar.Alignment;
    rank: number;
    activeStateChanged?: ISignal<any, void> | undefined;
}
