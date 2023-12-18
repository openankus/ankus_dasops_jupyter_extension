import { IStatusBar } from '@jupyterlab/statusbar';
import { ISignal } from '@lumino/signaling';
import { Widget } from '@lumino/widgets';

import { Ankus } from '../ankusCommon';
import { CodeObject } from '../doc/docModel';
import { AnkusCodeEditor } from './ankusCodeEditor';

export class AnkusStatusbar implements IStatusBar.IItem {
  private _isActive: boolean;

  constructor() {
    const node = document.createElement('div');
    node.className = 'ankus-statusbar';
    this.item = new Widget({ node });

    this._isActive = false;
  }

  set activate(value: boolean) {
    this._isActive = value;
  }

  setEditor(editor: ISignal<AnkusCodeEditor, CodeObject>): void {
    editor.connect(this._onUpdate);
  }

  delEditor(editor: ISignal<AnkusCodeEditor, CodeObject>): void {
    editor.disconnect(this._onUpdate);
  }

  private _onUpdate = (sender: AnkusCodeEditor, change: CodeObject): void => {
    this.item.node.innerHTML = `작성자: ${
      change.writer
    }&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;최종 작성일: ${Ankus.dateToString(
      change.date!
    )}`;
  };

  isActive: () => boolean = () => this._isActive;

  item: Widget;
  align: IStatusBar.Alignment = 'right';
  rank = 10;
  activeStateChanged?: ISignal<any, void> | undefined;
}
