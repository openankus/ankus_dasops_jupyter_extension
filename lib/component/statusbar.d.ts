import { IStatusBar } from '@jupyterlab/statusbar';
import { ISignal } from '@lumino/signaling';
import { Widget } from '@lumino/widgets';
import { ShareCode } from '../ankusCommon';
import { AnkusCodeEditor } from './ankusCodeEditor';
export declare class AnkusStatusbar implements IStatusBar.IItem {
    private _isActive;
    constructor();
    set activate(value: boolean);
    setEditor(editor: ISignal<AnkusCodeEditor, ShareCode.CodeProperty>): void;
    delEditor(editor: ISignal<AnkusCodeEditor, ShareCode.CodeProperty>): void;
    private _onUpdate;
    isActive: () => boolean;
    item: Widget;
    align: IStatusBar.Alignment;
    rank: number;
    activeStateChanged?: ISignal<any, void> | undefined;
}
