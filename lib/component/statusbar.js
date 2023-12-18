import { Widget } from '@lumino/widgets';
import { Ankus } from '../ankusCommon';
export class AnkusStatusbar {
    constructor() {
        this._onUpdate = (sender, change) => {
            this.item.node.innerHTML = `작성자: ${change.writer}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;최종 작성일: ${Ankus.dateToString(change.date)}`;
        };
        this.isActive = () => this._isActive;
        this.align = 'right';
        this.rank = 10;
        const node = document.createElement('div');
        node.className = 'ankus-statusbar';
        this.item = new Widget({ node });
        this._isActive = false;
    }
    set activate(value) {
        this._isActive = value;
    }
    setEditor(editor) {
        editor.connect(this._onUpdate);
    }
    delEditor(editor) {
        editor.disconnect(this._onUpdate);
    }
}
//# sourceMappingURL=statusbar.js.map