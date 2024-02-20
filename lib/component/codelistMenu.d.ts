import { Message } from '@lumino/messaging';
import { Menu } from '@lumino/widgets';
export declare class CodelistMenu extends Menu {
    protected onActivateRequest(msg: Message): void;
    private makeMenu;
}
