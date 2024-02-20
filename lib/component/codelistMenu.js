import { Menu } from '@lumino/widgets';
import { ShareCode } from '../ankusCommon';
export class CodelistMenu extends Menu {
    constructor() {
        /* constructor(cmdreg: CommandRegistry) {
          super({ commands: cmdreg });
        }
      
        protected onCloseRequest(msg: Message): void {
          console.log('onCloseRequest');
          //this.clearItems();
        }
      
        protected onUpdateRequest(msg: Message): void {
          console.log('onUpdateRequest');
          //this.makeMenu();
        }*/
        super(...arguments);
        this.makeMenu = async () => {
            const codelist = await ShareCode.codelist(['pivot'], ShareCode.CodePropertyName.name, ShareCode.CodePropertyName.name, true, -1);
            console.log(codelist);
            if (codelist) {
                codelist.list.forEach(c => {
                    this.commands.addCommand('ankus:code-list-' + c.id, {
                        label: c.name,
                        execute: () => { }
                    });
                    this.addItem({ command: 'ankus:code-list-' + c.id });
                });
            }
        };
    }
    onActivateRequest(msg) {
        console.log('onActivateRequest');
        this.clearItems();
        this.makeMenu();
    }
}
//# sourceMappingURL=codelistMenu.js.map