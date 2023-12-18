import { Menu } from '@lumino/widgets';
import { LabIcon } from '@jupyterlab/ui-components';
import { deleteIcon, editIcon, markdownIcon, pythonIcon, saveIcon } from '@jupyterlab/ui-components';
import { Ankus, StandardTermPart } from './ankusCommon';
import pasteIcon from '../style/images/paste.svg';
export const CommandID = {
    newCodeCell: {
        id: 'ankus:editor-new-code-cell',
        label: 'New code cell'
    },
    newMarkdown: {
        id: 'ankus:editor-new-markdown',
        label: 'New markdown cell'
    },
    deleteCell: { id: 'ankus:editor-delete-cell', label: 'Delete Cell' },
    pasteCell: {
        id: 'ankus:ntbk-paste-cell',
        label: 'Paste Notebook Cells'
    },
    editCell: {
        id: 'ankus:editor-edit-cell',
        label: 'Edit Cell'
    },
    renderCell: {
        id: 'ankus:editor-render-cell',
        label: 'Render Cell'
    },
    //notebook cell -> ankus code
    addCode: {
        id: 'ankus:ntbk-add-code',
        label: 'Add Cells to ankus code'
    },
    //copy notebook cell
    copyCell: {
        id: 'ankus:ntbk-copy-cell',
        label: 'Copy Cells to ankus code'
    },
    stdtrmAutoComplete: {
        id: 'ankus:ntbk-stdtrm-complet',
        label: 'Show Dictionary'
    },
    openNtbk: { id: 'ankus:ntbk-open-code', label: 'Open Code in Notebook' },
    openCode: { id: 'ankus:editor-open', label: 'Edit' },
    deleteCode: { id: 'ankus:list-delete-code', label: 'Delete' },
    insertCode: {
        id: 'ankus:ntbk-insert-code',
        label: 'Insert Code into Notebook'
    },
    saveCode: {
        id: 'ankus:editor-save-code',
        label: 'Save ankus Code'
    }
};
let jpCommands;
export function createCommands(app, mainmenu) {
    jpCommands = app.commands;
    //insert new cell
    app.commands.addCommand(CommandID.newCodeCell.id, {
        label: CommandID.newCodeCell.label,
        icon: pythonIcon,
        isEnabled: () => {
            //코드 편집창 확인
            if (Ankus.ankusPlugin.curActiveEditor) {
                //코드 내용 편집 화면 확인
                return Ankus.ankusPlugin.curActiveEditor.curActiveTab === 'code';
            }
            else {
                return false;
            }
        },
        execute: () => {
            //코드 편집창 확인
            if (Ankus.ankusPlugin.curActiveEditor) {
                Ankus.ankusPlugin.curActiveEditor.newCell('code');
            }
        }
    }); //insert new cell
    //insert new markdown
    app.commands.addCommand(CommandID.newMarkdown.id, {
        label: CommandID.newMarkdown.label,
        icon: markdownIcon,
        isEnabled: () => {
            //코드 편집창 확인
            if (Ankus.ankusPlugin.curActiveEditor) {
                //코드 내용 편집 화면 확인
                return Ankus.ankusPlugin.curActiveEditor.curActiveTab === 'code';
            }
            else {
                return false;
            }
        },
        execute: async (args) => {
            //코드 편집창 확인
            if (Ankus.ankusPlugin.curActiveEditor) {
                Ankus.ankusPlugin.curActiveEditor.newCell('markdown');
            }
        }
    }); //insert new markdown
    //delete cell
    app.commands.addCommand(CommandID.deleteCell.id, {
        label: CommandID.deleteCell.label,
        icon: deleteIcon,
        isEnabled: () => {
            if (Ankus.ankusPlugin.curActiveEditor) {
                return Ankus.ankusPlugin.curActiveEditor.curActiveTab === 'code';
            }
            else {
                return false;
            }
        },
        execute: async () => {
            if (Ankus.ankusPlugin.curActiveEditor) {
                Ankus.ankusPlugin.curActiveEditor.deleteCell();
            }
        }
    }); //delete cell
    //open code
    app.commands.addCommand(CommandID.openCode.id, {
        label: CommandID.openCode.label,
        icon: editIcon,
        execute: async (args) => {
            Ankus.ankusPlugin.openCodeEditor(args['id']);
        }
    });
    //delete code
    app.commands.addCommand(CommandID.deleteCode.id, {
        label: CommandID.deleteCode.label,
        icon: deleteIcon,
        isEnabled: args => Boolean(args['enable']),
        execute: async (args) => {
            Ankus.ankusPlugin.deleteCode(Number(args['id']));
        }
    });
    //paste cell
    app.commands.addCommand(CommandID.pasteCell.id, {
        label: CommandID.pasteCell.label,
        icon: new LabIcon({ name: 'paste', svgstr: pasteIcon }),
        isEnabled: () => {
            //no clipboard
            if (Ankus.ankusPlugin.clipboardData === undefined) {
                return false;
            }
            if (Ankus.ankusPlugin.curActiveEditor) {
                return Ankus.ankusPlugin.curActiveEditor.curActiveTab === 'code';
            }
            else {
                return false;
            }
        },
        execute: async (args) => {
            if (Ankus.ankusPlugin.curActiveEditor) {
                Ankus.ankusPlugin.curActiveEditor.pasteCell();
            }
        } //execute
    }); //paste cell
    //shift code cell edit mode
    app.commands.addCommand(CommandID.editCell.id, {
        label: CommandID.editCell.label,
        icon: editIcon,
        isToggled: () => {
            if (Ankus.ankusPlugin.curActiveEditor !== null) {
                return Ankus.ankusPlugin.curActiveEditor.cellIsEditMode;
            }
            return false;
        },
        isEnabled: () => {
            if (Ankus.ankusPlugin.curActiveEditor) {
                return Ankus.ankusPlugin.curActiveEditor.curActiveTab === 'code';
            }
            else {
                return false;
            }
        },
        execute: async (args) => {
            if (Ankus.ankusPlugin.curActiveEditor) {
                return Ankus.ankusPlugin.curActiveEditor.shiftEditMode();
            }
        }
    }); //shift code cell edit mode
    //save code
    app.commands.addCommand(CommandID.saveCode.id, {
        label: CommandID.saveCode.label,
        icon: saveIcon,
        isEnabled: () => {
            if (Ankus.ankusPlugin.curActiveEditor) {
                return Ankus.ankusPlugin.curActiveEditor.saveAvailable;
            }
            else {
                return false;
            }
        },
        execute: () => {
            if (Ankus.ankusPlugin.curActiveEditor) {
                Ankus.ankusPlugin.curActiveEditor.save();
            }
        }
    }); //save code
    // Add notebook completer select command.
    app.commands.addCommand(CommandID.stdtrmAutoComplete.id, {
        label: CommandID.stdtrmAutoComplete.label,
        execute: async () => {
            if (Ankus.loginToken !== undefined &&
                Ankus.ankusPlugin.activeNotebook !== null &&
                Ankus.ankusPlugin.activeNotebook.activeCell !== null) {
                //return app.commands.execute('completer:select', { id });
                const editor = Ankus.ankusPlugin.activeNotebook.activeCell.editor;
                if (editor === null) {
                    return;
                }
                const token = editor.getTokenAtCursor(); //ver4//.getTokenForPosition(editor.getCursorPosition()) //검색어
                if (token !== undefined) {
                    try {
                        //ReactDOM.render(menuitems!, menu);
                        //const widget = new Widget({ node:  });
                        //cursor position
                        const curpos = editor.getCursorPosition();
                        const p = editor.getCoordinateForPosition(curpos);
                        //show auto complete menu
                        const mn = await StandardTermPart.completerMenu(token.value, p.right, p.bottom);
                        if (mn) {
                            //focus out
                            mn.onblur = ev => {
                                mn.remove();
                                editor.focus();
                            };
                            Ankus.ankusPlugin.activeNotebook.activeCell.node.appendChild(mn);
                            mn.focus();
                        }
                    }
                    catch (err) {
                        console.log(err);
                    }
                } //if : 검색어 확인
            } //if : 노트북 확인
        } //execute
    }); //variable completer
    ////////////////////////////jupyter notebook context menu///////////////////////
    app.contextMenu.addItem({ type: 'separator', selector: '.jp-Cell' });
    //copy notebook cell
    app.contextMenu.addItem({
        command: CommandID.copyCell.id,
        selector: '.jp-Cell'
    });
    //notebook cell -> ankus code
    app.contextMenu.addItem({
        command: CommandID.addCode.id,
        selector: '.jp-Cell'
    });
    ////////////////////////////ankus editor context menu///////////////////////
    //edit cell - ankus editor context menu
    app.contextMenu.addItem({
        command: CommandID.editCell.id,
        selector: '.ankus-cod-cel-tbl'
    });
    //delete cell - ankus editor context menu
    app.contextMenu.addItem({
        command: CommandID.deleteCell.id,
        selector: '.ankus-cod-cel-tbl'
    });
    app.contextMenu.addItem({
        type: 'separator',
        selector: '.ankus-cod-cel-tbl'
    });
    //new code cell - ankus editor context menu
    app.contextMenu.addItem({
        command: CommandID.newCodeCell.id,
        selector: '.ankus-cod-cel-tbl'
    });
    //new markdown cell - ankus editor context menu
    app.contextMenu.addItem({
        command: CommandID.newMarkdown.id,
        selector: '.ankus-cod-cel-tbl'
    });
    //paste - ankus editor context menu
    app.contextMenu.addItem({
        command: CommandID.pasteCell.id,
        selector: '.ankus-cod-cel-tbl'
    });
    ////////////////////////////////////short cut///////////////////////////////////
    //edit notebook cell - shortcut
    app.commands.addKeyBinding({
        command: CommandID.editCell.id,
        keys: ['Accel Shift Enter'],
        selector: 'body'
    });
    //add notebook cell - shortcut
    app.commands.addKeyBinding({
        command: CommandID.addCode.id,
        keys: ['Accel K'],
        selector: '.jp-Notebook'
    });
    //paste notebook cell - shortcut
    app.commands.addKeyBinding({
        command: CommandID.pasteCell.id,
        keys: ['Accel U'],
        selector: 'body'
    });
    //copy notebook cell - shortcut
    app.commands.addKeyBinding({
        command: CommandID.copyCell.id,
        keys: ['Accel J'],
        selector: '.jp-Notebook'
    });
    //delete cell
    app.commands.addKeyBinding({
        command: CommandID.deleteCell.id,
        keys: ['Accel Backspace'],
        selector: 'body'
    });
    //save code
    app.commands.addKeyBinding({
        command: CommandID.saveCode.id,
        keys: ['Accel W'],
        selector: 'body'
    });
    // Set enter key for notebook completer select command.
    app.commands.addKeyBinding({
        command: CommandID.stdtrmAutoComplete.id,
        keys: ['Accel .'],
        selector: '.jp-Notebook .jp-CodeCell .jp-InputArea-editor'
    });
    /////////////////////////////////////main menu - ankus//////////////////////////////
    const { commands } = app;
    const m = new Menu({ commands });
    m.title.label = 'ankus';
    m.addItem({ command: CommandID.copyCell.id });
    m.addItem({ command: CommandID.addCode.id });
    m.addItem({ type: 'separator' });
    m.addItem({ command: CommandID.newCodeCell.id });
    m.addItem({ command: CommandID.newMarkdown.id });
    m.addItem({ command: CommandID.pasteCell.id });
    m.addItem({ command: CommandID.deleteCell.id });
    m.addItem({ type: 'separator' });
    m.addItem({ command: CommandID.saveCode.id });
    mainmenu.addMenu(m, false, { rank: 80 });
    /* palette.addItem({
      command: CommandID.newCodeCell.id,
      category: 'ankus',
      args: {}
    }); */
} //createCommands
//context menu for code
export const codeContextMenu = (code) => {
    //context menu of code item
    const menu = new Menu({ commands: jpCommands });
    //open
    menu.addItem({
        command: CommandID.openCode.id,
        args: { id: code.id }
    });
    //delete
    menu.addItem({
        command: CommandID.deleteCode.id,
        args: {
            id: code.id,
            enable: Ankus.userNumber === code.writerNo
        }
    });
    menu.addItem({ type: 'separator' });
    //open notebook
    menu.addItem({
        command: CommandID.openNtbk.id,
        args: { id: code.id }
    });
    //insert code
    menu.addItem({
        command: CommandID.insertCode.id,
        args: { id: code.id }
    });
    return menu;
};
//# sourceMappingURL=ankusCommands.js.map