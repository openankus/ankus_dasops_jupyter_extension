import { Menu } from '@lumino/widgets';
import { deleteIcon, settingsIcon, duplicateIcon } from '@jupyterlab/ui-components';
import { Ankus, StandardTermPart, ShareCode } from './ankusCommon';
export const CommandID = {
    renderCell: {
        id: 'ankus:editor-render-cell',
        label: 'Render Cell'
    },
    //notebook cell -> ankus code
    addCode: {
        id: 'ankus:ntbk-add-code',
        label: 'Create ankus code with selected Cells'
    },
    //update notebook cell
    updateCode: {
        id: 'ankus:ntbk-update-code',
        label: 'Update ankus Code with selected Cells'
    },
    stdtrmAutoComplete: {
        id: 'ankus:ntbk-stdtrm-complet',
        label: 'Show Dictionary'
    },
    //코드 목록
    selectCodeItem: {
        id: 'ankus:select-code-item',
        label: 'Select ankus code...'
    },
    openNtbk: { id: 'ankus:ntbk-open-code', label: 'Open Code in Notebook' },
    renameCode: { id: 'ankus:rename-code', label: 'Rename...' },
    codeProp: { id: 'ankus:code-prop', label: 'Properties...' },
    duplicCode: { id: 'ankus:duplic-code', label: 'Duplicate' },
    deleteCode: { id: 'ankus:list-delete-code', label: 'Delete' },
    insertCode: {
        id: 'ankus:ntbk-insert-code',
        label: 'Insert Code into Notebook'
    },
    //simple code list
    simpleList: {
        id: 'ankus:simple-code-list',
        label: 'Simple'
    },
    //detail code list
    detailList: {
        id: 'ankus:detail-code-list',
        label: 'Detail'
    }
}; //CommandID
export function createCommands(app, mainmenu) {
    // code prop
    app.commands.addCommand(CommandID.codeProp.id, {
        label: CommandID.codeProp.label,
        icon: settingsIcon,
        execute: async (args) => {
            Ankus.ankusPlugin.showCodeProp();
        }
    });
    //rename code
    app.commands.addCommand(CommandID.renameCode.id, {
        label: CommandID.renameCode.label,
        //코드 작성자와 사용자가 동일하면, 변경 가능
        isEnabled: () => { var _a; return ((_a = Ankus.ankusPlugin.currentCode()) === null || _a === void 0 ? void 0 : _a.writerNo) === Ankus.userNumber; },
        execute: () => {
            Ankus.ankusPlugin.codeList.openRenameDlg();
        }
    });
    //duplicate code
    app.commands.addCommand(CommandID.duplicCode.id, {
        label: CommandID.duplicCode.label,
        icon: duplicateIcon,
        isEnabled: () => Ankus.ankusPlugin.currentCode() !== undefined,
        execute: () => {
            const code = {};
            code[ShareCode.CodePropertyName.id] = Ankus.ankusPlugin.currentCode().id;
            code[ShareCode.CodePropertyName.userNo] = Ankus.userNumber;
            fetch(Ankus.ankusURL + '/share-code/duplicate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: Ankus.loginToken, code: code })
            })
                .then(response => {
                if (!response.ok) {
                    throw new Error('fail');
                }
                //refresh code list
                Ankus.ankusPlugin.updateCodelist();
            })
                .catch(error => {
                alert('공유 코드 복제 오류');
            });
        }
    });
    //delete code
    app.commands.addCommand(CommandID.deleteCode.id, {
        label: CommandID.deleteCode.label,
        icon: deleteIcon,
        isEnabled: () => Ankus.ankusPlugin.currentCode() !== undefined &&
            //작성자만 삭제 가능
            Ankus.ankusPlugin.currentCode().writerNo === Ankus.userNumber,
        execute: () => {
            Ankus.ankusPlugin.deleteCode();
        }
    });
    //save code
    /* app.commands.addCommand(CommandID.saveCode.id, {
      label: CommandID.saveCode.label,
      icon: saveIcon,
  
      isEnabled: () => {
        if (Ankus.ankusPlugin.curActiveEditor) {
          return Ankus.ankusPlugin.curActiveEditor.saveAvailable;
        } else {
          return false;
        }
      },
  
      execute: () => {
        if (Ankus.ankusPlugin.curActiveEditor) {
          Ankus.ankusPlugin.curActiveEditor.save();
        }
      }
    }); //save code
   */
    // Add notebook completer select command.
    app.commands.addCommand(CommandID.stdtrmAutoComplete.id, {
        label: CommandID.stdtrmAutoComplete.label,
        execute: async () => {
            if (Ankus.loginToken !== undefined &&
                Ankus.activeNotebook !== null &&
                Ankus.activeNotebook.activeCell !== null) {
                //return app.commands.execute('completer:select', { id });
                const editor = Ankus.activeNotebook.activeCell.editor;
                if (editor === null) {
                    return;
                }
                const token = editor.getTokenAtCursor(); //ver4//.getTokenForPosition(editor.getCursorPosition()) //검색어
                if (token.value.length === 0) {
                    return;
                }
                //cursor position
                const curpos = editor.getCursorPosition();
                const p = editor.getCoordinateForPosition(curpos);
                //검색 안내
                const noti = document.createElement('div');
                noti.innerHTML =
                    ' Searching for "<b>' + token.value + '</b>" in Dictionary ';
                noti.className = 'ankus-info-on-ntbk';
                noti.style.left = p.right + 5 + 'px';
                noti.style.top = p.top + 'px';
                Ankus.activeNotebook.parent.parent.parent.parent.parent.parent.node.appendChild(noti);
                try {
                    //ReactDOM.render(menuitems!, menu);
                    //const widget = new Widget({ node:  });
                    //show auto complete menu
                    const mn = await StandardTermPart.completerMenu(token.value, p.right, p.bottom);
                    noti.remove();
                    if (mn) {
                        //focus out
                        mn.onblur = ev => {
                            mn.remove();
                            editor.focus();
                        };
                        Ankus.activeNotebook.parent.parent.parent.parent.parent.parent.node.appendChild(mn);
                        mn.focus();
                    }
                }
                catch (err) {
                    noti.style.color = 'var(--jp-error-color0)';
                    noti.innerHTML = 'Search Error';
                    setTimeout(() => noti.remove(), 2000);
                }
            } //if : 노트북 확인
        } //execute
    }); //variable completer
    // 코드 선택 메뉴
    app.commands.addCommand(CommandID.selectCodeItem.id, {
        label: () => {
            const token = Ankus.activeNotebook.activeCell.editor.getTokenAtCursor();
            //check token
            if (token !== undefined && token.value.length > 0) {
                //최대 20글자 표시
                const nm = token.value.length > 20
                    ? token.value.substring(0, 20) + '...'
                    : token.value;
                return 'Search for code with name "' + nm + '"';
            }
            return CommandID.selectCodeItem.label;
        },
        isVisible: () => Ankus.logged,
        isEnabled: () => {
            const token = Ankus.activeNotebook.activeCell.editor.getTokenAtCursor();
            //check login,token
            return token !== undefined && token.value.length > 0;
        },
        execute: async () => {
            const editor = Ankus.activeNotebook.activeCell.editor;
            //window coordinate
            const p = editor.getCoordinateForPosition(editor.getCursorPosition());
            const tkn = editor.getTokenAtCursor().value;
            //검색 안내
            const noti = document.createElement('div');
            noti.innerHTML = 'Searching for "<b>' + tkn + '</b>" in Shared Code';
            noti.className = 'ankus-info-on-ntbk';
            noti.style.left = p.right + 5 + 'px';
            noti.style.top = p.top + 'px';
            Ankus.activeNotebook.parent.parent.parent.parent.parent.parent.node.appendChild(noti);
            try {
                //show auto complete menu
                const mn = await ShareCode.completerMenu(tkn, p.left, p.bottom);
                noti.remove();
                if (mn) {
                    //focus out
                    mn.onblur = ev => {
                        mn.remove();
                        editor.focus();
                    };
                    //Ankus.ankusPlugin.activeNotebook!.activeCell!.node.appendChild(
                    Ankus.activeNotebook.parent.parent.parent.parent.parent.parent.node.appendChild(mn);
                    mn.focus();
                }
            }
            catch (err) {
                noti.style.color = 'var(--jp-error-color0)';
                noti.innerHTML = 'Search Error';
                setTimeout(() => noti.remove(), 2000);
            }
        } //execute
    }); //코드 선택 메뉴
    ////////////////////////////jupyter notebook context menu///////////////////////
    app.contextMenu.addItem({ type: 'separator', selector: '.jp-Cell' });
    //notebook cell -> update ankus code
    app.contextMenu.addItem({
        command: CommandID.updateCode.id,
        selector: '.jp-Cell'
    });
    //notebook cell -> add ankus code
    app.contextMenu.addItem({
        command: CommandID.addCode.id,
        selector: '.jp-Cell'
    });
    app.contextMenu.addItem({
        command: CommandID.selectCodeItem.id,
        selector: '.jp-Cell'
    });
    ////////////////////////////code context menu///////////////////////
    app.contextMenu.addItem({
        type: 'separator',
        selector: '.ankus-code-list-item'
    });
    //open notebook
    app.contextMenu.addItem({
        command: CommandID.openNtbk.id,
        selector: '.ankus-code-list-item'
    });
    //insert code
    app.contextMenu.addItem({
        command: CommandID.insertCode.id,
        selector: '.ankus-code-list-item'
    });
    //duplicate
    app.contextMenu.addItem({
        command: CommandID.duplicCode.id,
        selector: '.ankus-code-list-item'
    });
    //delete
    app.contextMenu.addItem({
        command: CommandID.deleteCode.id,
        selector: '.ankus-code-list-item'
        //args: { code: Ankus.ankusPlugin.currentCode() } as any as ReadonlyJSONObject
    });
    app.contextMenu.addItem({
        type: 'separator',
        selector: '.ankus-code-list-item'
    });
    //rename
    app.contextMenu.addItem({
        command: CommandID.renameCode.id,
        selector: '.ankus-code-list-item'
    });
    //prop
    app.contextMenu.addItem({
        command: CommandID.codeProp.id,
        selector: '.ankus-code-list-item'
    });
    ////////////////////////////////////short cut///////////////////////////////////
    //add notebook cell - shortcut
    app.commands.addKeyBinding({
        command: CommandID.addCode.id,
        keys: ['Accel K'],
        selector: '.jp-Notebook'
    });
    //선택 코드를 notebook cell 내용으로 변경 - shortcut
    app.commands.addKeyBinding({
        command: CommandID.updateCode.id,
        keys: ['Accel U'],
        selector: '.jp-Notebook'
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
    m.addItem({ command: CommandID.openNtbk.id });
    m.addItem({ command: CommandID.insertCode.id });
    m.addItem({ command: CommandID.duplicCode.id });
    m.addItem({ command: CommandID.deleteCode.id });
    m.addItem({ type: 'separator' });
    m.addItem({ command: CommandID.updateCode.id });
    m.addItem({ command: CommandID.addCode.id });
    mainmenu.addMenu(m, false, { rank: 80 });
    m.hide();
    Ankus.ankusPlugin.mainMenu = m;
} //createCommands
//context menu for code
/* export const codeContextMenu = (code: ShareCode.CodeProperty): Menu => {
  //context menu of code item
  const menu = new Menu({ commands: jpCommands });
  menu.addClass('ankus-code-menu');

  //delete
  menu.addItem({
    command: CommandID.deleteCode.id,
    args: {
      id: code.id!,
      enable: Ankus.userNumber === code.writerNo
    }
  });

  menu.addItem({ type: 'separator' });

  return menu;
}; */
//# sourceMappingURL=ankusCommands.js.map