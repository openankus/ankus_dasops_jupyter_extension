"use strict";
(self["webpackChunkjupyter_ankus"] = self["webpackChunkjupyter_ankus"] || []).push([["lib_index_js"],{

/***/ "./lib/ankusCommands.js":
/*!******************************!*\
  !*** ./lib/ankusCommands.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CommandID: () => (/* binding */ CommandID),
/* harmony export */   createCommands: () => (/* binding */ createCommands)
/* harmony export */ });
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ankusCommon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ankusCommon */ "./lib/ankusCommon.js");



const CommandID = {
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
function createCommands(app, mainmenu) {
    // code prop
    app.commands.addCommand(CommandID.codeProp.id, {
        label: CommandID.codeProp.label,
        icon: _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__.settingsIcon,
        execute: async (args) => {
            _ankusCommon__WEBPACK_IMPORTED_MODULE_2__.Ankus.ankusPlugin.showCodeProp();
        }
    });
    //rename code
    app.commands.addCommand(CommandID.renameCode.id, {
        label: CommandID.renameCode.label,
        //코드 작성자와 사용자가 동일하면, 변경 가능
        isEnabled: () => { var _a; return ((_a = _ankusCommon__WEBPACK_IMPORTED_MODULE_2__.Ankus.ankusPlugin.currentCode()) === null || _a === void 0 ? void 0 : _a.writerNo) === _ankusCommon__WEBPACK_IMPORTED_MODULE_2__.Ankus.userNumber; },
        execute: () => {
            _ankusCommon__WEBPACK_IMPORTED_MODULE_2__.Ankus.ankusPlugin.codeList.openRenameDlg();
        }
    });
    //duplicate code
    app.commands.addCommand(CommandID.duplicCode.id, {
        label: CommandID.duplicCode.label,
        icon: _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__.duplicateIcon,
        isEnabled: () => _ankusCommon__WEBPACK_IMPORTED_MODULE_2__.Ankus.ankusPlugin.currentCode() !== undefined,
        execute: () => {
            const code = {};
            code[_ankusCommon__WEBPACK_IMPORTED_MODULE_2__.ShareCode.CodePropertyName.id] = _ankusCommon__WEBPACK_IMPORTED_MODULE_2__.Ankus.ankusPlugin.currentCode().id;
            code[_ankusCommon__WEBPACK_IMPORTED_MODULE_2__.ShareCode.CodePropertyName.userNo] = _ankusCommon__WEBPACK_IMPORTED_MODULE_2__.Ankus.userNumber;
            fetch(_ankusCommon__WEBPACK_IMPORTED_MODULE_2__.Ankus.ankusURL + '/share-code/duplicate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: _ankusCommon__WEBPACK_IMPORTED_MODULE_2__.Ankus.loginToken, code: code })
            })
                .then(response => {
                if (!response.ok) {
                    throw new Error('fail');
                }
                //refresh code list
                _ankusCommon__WEBPACK_IMPORTED_MODULE_2__.Ankus.ankusPlugin.updateCodelist();
            })
                .catch(error => {
                alert('공유 코드 복제 오류');
            });
        }
    });
    //delete code
    app.commands.addCommand(CommandID.deleteCode.id, {
        label: CommandID.deleteCode.label,
        icon: _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__.deleteIcon,
        isEnabled: () => _ankusCommon__WEBPACK_IMPORTED_MODULE_2__.Ankus.ankusPlugin.currentCode() !== undefined &&
            //작성자만 삭제 가능
            _ankusCommon__WEBPACK_IMPORTED_MODULE_2__.Ankus.ankusPlugin.currentCode().writerNo === _ankusCommon__WEBPACK_IMPORTED_MODULE_2__.Ankus.userNumber,
        execute: () => {
            _ankusCommon__WEBPACK_IMPORTED_MODULE_2__.Ankus.ankusPlugin.deleteCode();
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
            if (_ankusCommon__WEBPACK_IMPORTED_MODULE_2__.Ankus.loginToken !== undefined &&
                _ankusCommon__WEBPACK_IMPORTED_MODULE_2__.Ankus.activeNotebook !== null &&
                _ankusCommon__WEBPACK_IMPORTED_MODULE_2__.Ankus.activeNotebook.activeCell !== null) {
                //return app.commands.execute('completer:select', { id });
                const editor = _ankusCommon__WEBPACK_IMPORTED_MODULE_2__.Ankus.activeNotebook.activeCell.editor;
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
                        const dv = document.createElement('div');
                        dv.innerText = 'search';
                        dv.style.left = '0px';
                        dv.style.top = '0px';
                        dv.style.position = 'fixed';
                        dv.style.zIndex = '99';
                        _ankusCommon__WEBPACK_IMPORTED_MODULE_2__.Ankus.activeNotebook.parent.parent.parent.parent.parent.parent.node.appendChild(dv);
                        //show auto complete menu
                        const mn = await _ankusCommon__WEBPACK_IMPORTED_MODULE_2__.StandardTermPart.completerMenu(token.value, p.right, p.bottom);
                        if (mn) {
                            //focus out
                            mn.onblur = ev => {
                                mn.remove();
                                editor.focus();
                            };
                            //Ankus.activeNotebook!.parent!.parent!.parent!.parent!.parent!.parent!.node.appendChild(
                            //mn
                            //);
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
    // 코드 선택 메뉴
    app.commands.addCommand(CommandID.selectCodeItem.id, {
        label: () => {
            const token = _ankusCommon__WEBPACK_IMPORTED_MODULE_2__.Ankus.activeNotebook.activeCell.editor.getTokenAtCursor();
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
        isVisible: () => _ankusCommon__WEBPACK_IMPORTED_MODULE_2__.Ankus.logged,
        isEnabled: () => {
            const token = _ankusCommon__WEBPACK_IMPORTED_MODULE_2__.Ankus.activeNotebook.activeCell.editor.getTokenAtCursor();
            //check login,token
            return token !== undefined && token.value.length > 0;
        },
        execute: async () => {
            const editor = _ankusCommon__WEBPACK_IMPORTED_MODULE_2__.Ankus.activeNotebook.activeCell.editor;
            try {
                //window coordinate
                const p = editor.getCoordinateForPosition(editor.getCursorPosition());
                //show auto complete menu
                const mn = await _ankusCommon__WEBPACK_IMPORTED_MODULE_2__.ShareCode.completerMenu(editor.getTokenAtCursor().value, p.left, p.bottom);
                if (mn) {
                    //focus out
                    mn.onblur = ev => {
                        mn.remove();
                        editor.focus();
                    };
                    //Ankus.ankusPlugin.activeNotebook!.activeCell!.node.appendChild(
                    _ankusCommon__WEBPACK_IMPORTED_MODULE_2__.Ankus.activeNotebook.parent.parent.parent.parent.parent.parent.node.appendChild(mn);
                    mn.focus();
                }
            }
            catch (err) {
                console.log(err);
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
    const m = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_0__.Menu({ commands });
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
    _ankusCommon__WEBPACK_IMPORTED_MODULE_2__.Ankus.ankusPlugin.mainMenu = m;
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


/***/ }),

/***/ "./lib/ankusCommon.js":
/*!****************************!*\
  !*** ./lib/ankusCommon.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ANKUS_EXT_ID: () => (/* binding */ ANKUS_EXT_ID),
/* harmony export */   ANKUS_ICON: () => (/* binding */ ANKUS_ICON),
/* harmony export */   Ankus: () => (/* binding */ Ankus),
/* harmony export */   ShareCode: () => (/* binding */ ShareCode),
/* harmony export */   StandardTermPart: () => (/* binding */ StandardTermPart)
/* harmony export */ });
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lumino_messaging__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @lumino/messaging */ "webpack/sharing/consume/default/@lumino/messaging");
/* harmony import */ var _lumino_messaging__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_lumino_messaging__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _lumino_signaling__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @lumino/signaling */ "webpack/sharing/consume/default/@lumino/signaling");
/* harmony import */ var _lumino_signaling__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_lumino_signaling__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _doc_widgetFactory__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./doc/widgetFactory */ "./lib/doc/widgetFactory.js");
/* harmony import */ var _component_ankusCodeEditor__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./component/ankusCodeEditor */ "./lib/component/ankusCodeEditor.js");
/* harmony import */ var _component_statusbar__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./component/statusbar */ "./lib/component/statusbar.js");
/* harmony import */ var _doc_docModel__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./doc/docModel */ "./lib/doc/docModel.js");
/* harmony import */ var _component_standardTermSetting__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./component/standardTermSetting */ "./lib/component/standardTermSetting.js");
/* harmony import */ var _notebookAction__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./notebookAction */ "./lib/notebookAction.js");
/* harmony import */ var _style_images_ankus_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../style/images/ankus.svg */ "./style/images/ankus.svg");
/* harmony import */ var _ankusCommands__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ankusCommands */ "./lib/ankusCommands.js");




//import cookie from 'react-cookies';
//import csrf from 'csurf';








//export const ANKUS_URL = 'http://localhost:9090'; //'http://dev.openankus.org:9090'; //
const ANKUS_EXT_ID = 'jupyter-ankus';
const ANKUS_ICON = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__.LabIcon({ name: 'ankus-icon', svgstr: _style_images_ankus_svg__WEBPACK_IMPORTED_MODULE_4__ });
var ShareCode;
(function (ShareCode) {
    //api 서버와 함께 사용하는 명칭
    let CodePropertyName;
    (function (CodePropertyName) {
        CodePropertyName["id"] = "codeId";
        CodePropertyName["name"] = "title";
        CodePropertyName["comment"] = "codeComment";
        CodePropertyName["userNo"] = "writer";
        CodePropertyName["date"] = "udate";
        CodePropertyName["content"] = "content";
        CodePropertyName["userName"] = "name";
        CodePropertyName["tag"] = "tags";
    })(CodePropertyName = ShareCode.CodePropertyName || (ShareCode.CodePropertyName = {}));
    async function codelist(keywords, searchCol, orderCol, asc, page) {
        //list option
        const option = {
            token: Ankus.loginToken,
            searchColumn: searchCol,
            searchKeyword: keywords,
            orderColumn: orderCol,
            order: asc ? 'asc' : 'desc',
            page: page
        };
        const ret = fetch(Ankus.ankusURL + '/share-code/codelist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(option)
        })
            .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error('fail');
            }
        })
            .then(response => {
            const res = {
                //code list
                list: response.content.map((itm) => ({
                    id: itm[CodePropertyName.id],
                    name: itm[CodePropertyName.name],
                    writer: itm[CodePropertyName.userName],
                    date: itm[CodePropertyName.date],
                    comment: itm[CodePropertyName.comment],
                    writerNo: itm[CodePropertyName.userNo],
                    tag: itm[CodePropertyName.tag]
                })),
                totalSize: response.totalElements,
                pageSize: response.totalPages
            };
            return res;
        })
            .catch(error => {
            alert('Failed to load code list');
        }); //fetch
        return ret;
    } //codelist
    ShareCode.codelist = codelist;
    //노트북 셀의 선택 단어에 대한 자동완성 메뉴
    async function completerMenu(keyword, x, y) {
        //no keyword
        if (keyword.trim().length < 1) {
            return null;
        }
        //search code name
        const terms = await codelist([keyword], CodePropertyName.name, CodePropertyName.name, true, -1);
        //none
        if (terms === undefined) {
            return null;
        }
        /////////////////menu//////////////////
        const menu = document.createElement('div');
        menu.className = 'ankus-autocomplet-menu';
        //position
        console.log(x + ' / ' + y);
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        menu.tabIndex = -1;
        let selidx;
        const list = document.createElement('dl');
        const menuitems = terms.list.map(term => {
            const codeid = term.id;
            const item = document.createElement('dt');
            item.style.paddingLeft = '5px';
            item.style.paddingRight = '5px';
            item.id = String(codeid);
            //name + english name
            item.innerHTML =
                '<span >' +
                    term.name +
                    '</span> - <span style="font-size:11px; " >' +
                    term.writer +
                    '</span>';
            //  item.title = term.engDesc!;
            //click menu
            item.onclick = (ev) => {
                //close menu
                menu.blur();
                //노트북 셀에 코드 삽입
                Ankus.cmdReg.execute(_ankusCommands__WEBPACK_IMPORTED_MODULE_5__.CommandID.insertCode.id, {
                    id: ev.target.id
                });
            };
            //description
            if (term.comment) {
                const desc = document.createElement('dd');
                desc.textContent = term.comment;
                item.appendChild(desc);
            }
            list.appendChild(item);
            return item;
        }); //menu item list
        if (menuitems && menuitems.length > 0) {
            //첫번째 아이템 기본 선택
            menuitems[0].className = 'sel-menu';
            menu.appendChild(list);
        }
        //key
        menu.onkeydown = ev => {
            //down
            if (ev.key === 'ArrowDown') {
                if (menuitems.length > 1) {
                    //이전 선택 제거
                    menuitems[selidx].className = '';
                    //다음 아이템 / 첫 아이템
                    selidx = menuitems.length === selidx + 1 ? 0 : selidx + 1;
                    //아이템 선택
                    menuitems[selidx].className = 'sel-menu';
                    if (!isVisible(menuitems[selidx], list)) {
                        menuitems[selidx].scrollIntoView();
                    }
                }
                ev.preventDefault();
            }
            //up
            else if (ev.key === 'ArrowUp') {
                if (menuitems.length > 1) {
                    //이전 선택 제거
                    menuitems[selidx].className = '';
                    //이전 아이템 / 마지막 아이템
                    selidx = 0 === selidx ? menuitems.length - 1 : selidx - 1;
                    //아이템 선택
                    menuitems[selidx].className = 'sel-menu';
                    if (!isVisible(menuitems[selidx], list)) {
                        menuitems[selidx].scrollIntoView();
                    }
                }
                ev.preventDefault();
            }
            //enter
            else if (ev.key === 'Enter') {
                ev.preventDefault();
                menu.blur();
                //노트북 셀에 코드 삽입
                Ankus.cmdReg.execute(_ankusCommands__WEBPACK_IMPORTED_MODULE_5__.CommandID.insertCode.id, {
                    //선택 메뉴의 아이디
                    id: menuitems[selidx].id
                });
            }
            //esc
            else if (ev.key === 'Escape') {
                ev.preventDefault();
                menu.blur();
            }
        }; //key
        selidx = 0;
        return menu;
    } //completerMenu
    ShareCode.completerMenu = completerMenu;
    const isVisible = function (ele, container) {
        const eleTop = ele.offsetTop;
        const eleBottom = eleTop + ele.clientHeight;
        const containerTop = container.scrollTop + container.offsetTop;
        const containerBottom = containerTop + container.clientHeight;
        // The element is fully visible in the container
        return (eleTop >= containerTop && eleBottom <= containerBottom
        // Some part of the element is visible in the container
        /* (eleTop < containerTop && containerTop < eleBottom) ||
        (eleTop < containerBottom && containerBottom < eleBottom) */
        );
    }; //element is visible
})(ShareCode || (ShareCode = {})); //ShareCode
var StandardTermPart;
(function (StandardTermPart) {
    let Format;
    (function (Format) {
        Format["upper"] = "UPPERCASE";
        Format["lower"] = "lowercase";
        Format["camel"] = "camelCase";
        Format["sentence"] = "SentenceCase";
    })(Format = StandardTermPart.Format || (StandardTermPart.Format = {}));
    let Field;
    (function (Field) {
        Field["id"] = "id";
        Field["name"] = "name";
        Field["engName"] = "engName";
        Field["engFullname"] = "engDesc";
        Field["desc"] = "desc";
        Field["cat"] = "category";
    })(Field = StandardTermPart.Field || (StandardTermPart.Field = {}));
    StandardTermPart.ABBR_RULE = /^[a-zA-Z0-9-_.]*$/;
    async function searchWords(searchCol, keyword, orderCol, asc, category) {
        const data = {
            searchColumn: searchCol,
            searchKeyword: keyword,
            orderColumn: orderCol,
            order: asc ? 'asc' : 'desc',
            category: category === undefined ? 0 : category
        };
        const res = await fetch(Ankus.ankusURL +
            '/standard-term/list?token=' +
            encodeURIComponent(Ankus.loginToken), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error('Response Error');
            }
        })
            .then(json => {
            const list = json;
            const terms = list.map(item => ({
                nameId: item['nameId'],
                wordId: item['wordId'],
                name: item['name'],
                engName: item['engName'],
                category: item['category'],
                desc: item['desc'],
                engDesc: item['engDesc']
            })); //response list
            return terms;
        }) //response
            .catch(error => {
            throw new Error('Search Dictionary Error');
        });
        return res;
    } //searchWords
    StandardTermPart.searchWords = searchWords;
    async function loadCategories() {
        const res = await fetch(Ankus.ankusURL +
            '/standard-term/category-list?token=' +
            encodeURIComponent(Ankus.loginToken))
            .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error('Error Response');
            }
        })
            .then(response => {
            const lst = response;
            //check response
            if (lst.length === 0) {
                throw new Error('No Category');
            }
            const cats = lst.map(cat => 
            //category
            ({
                id: cat['id'],
                name: cat['name']
            })); //response list
            return cats;
        })
            .catch(error => {
            throw new Error('Failed to load Categories');
        });
        return res;
    } //loadCategories
    StandardTermPart.loadCategories = loadCategories;
    function categoryLoadSignal() {
        return Ankus.ankusPlugin.stdtrmCategoriesLoadSignal;
    }
    StandardTermPart.categoryLoadSignal = categoryLoadSignal;
    async function addCategory(name, signal) {
        const res = await fetch(Ankus.ankusURL +
            '/standard-term/add-category?token=' +
            encodeURIComponent(Ankus.loginToken) +
            '&name=' +
            encodeURIComponent(name), {
            method: 'POST'
        })
            .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error('Error Response');
            }
        })
            .then(json => {
            const list = json;
            const categories = list.map(item => ({
                id: item['id'],
                name: item['name']
            }));
            if (signal) {
                Ankus.ankusPlugin.onStdtrmCategoriesLoaded(categories);
            }
            return categories;
        })
            .catch(error => {
            throw new Error('Failed to add category');
        });
        return res;
    } //addCategory
    StandardTermPart.addCategory = addCategory;
    //delete category
    async function delCategory(id, signal) {
        const res = await fetch(Ankus.ankusURL +
            '/standard-term/del-category?token=' +
            encodeURIComponent(Ankus.loginToken) +
            '&id=' +
            id, {
            method: 'DELETE'
        })
            .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error('Error Response');
            }
        })
            .then(json => {
            const list = json;
            const categories = list.map(item => ({
                id: item['id'],
                name: item['name']
            }));
            if (signal) {
                Ankus.ankusPlugin.onStdtrmCategoriesLoaded(categories);
            }
            return categories;
        })
            .catch(error => {
            throw new Error('Failed to delete category');
        });
        return res;
    } //delCategory
    StandardTermPart.delCategory = delCategory;
    async function updateCategory(id, name, signal) {
        const res = await fetch(Ankus.ankusURL +
            '/standard-term/edit-category?token=' +
            encodeURIComponent(Ankus.loginToken) +
            '&id=' +
            id +
            '&name=' +
            encodeURIComponent(name), {
            method: 'PUT'
        })
            .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error('Error Response');
            }
        })
            .then(json => {
            const list = json;
            const categories = list.map(item => ({
                id: item['id'],
                name: item['name']
            }));
            if (signal) {
                Ankus.ankusPlugin.onStdtrmCategoriesLoaded(categories);
            }
            return categories;
        })
            .catch(error => {
            throw new Error('Failed to update category');
        });
        return res;
    } //editCategory
    StandardTermPart.updateCategory = updateCategory;
    async function completerMenu(keyword, x, y) {
        //no keyword
        if (keyword.trim().length < 1) {
            return null;
        }
        //check korean
        //const korRule = /^[가-힣]*$/;
        const engRule = /[\w\s.-]+/g;
        //search column
        const searchCol = engRule.test(keyword)
            ? Field.engName
            : Field.name;
        //search term
        const terms = await searchWords(searchCol, keyword, Field.engName, true, Ankus.stdtermCategory);
        /////////////////menu//////////////////
        const menu = document.createElement('div');
        menu.className = 'ankus-autocomplet-menu';
        //position
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        menu.tabIndex = -1;
        /////////////////menu item - setting editor//////////////////
        const btn = document.createElement('div');
        btn.className = 'ankus-completer-new-term';
        //icon
        const icn = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icn.style.width = '16';
        icn.style.height = '16';
        icn.innerHTML =
            '<defs>\
      <clipPath id="clip-path">\
        <rect id="사각형_29" data-name="사각형 29" width="8" height="8" fill="#fff"/>\
      </clipPath>\
      </defs>\
      <g id="그룹_154" data-name="그룹 154" transform="translate(-36 -68)">\
        <circle id="타원_11" data-name="타원 11" cx="6" cy="6" r="6" transform="translate(36 68)" fill="#004391"/>\
        <g id="그룹_14" data-name="그룹 14" transform="translate(38 70)">\
        <g id="그룹_11" data-name="그룹 11" clip-path="url(#clip-path)">\
          <path id="패스_21" data-name="패스 21" d="M7.429,3.428H4.571V.572a.571.571,0,1,0-1.143,0V3.428H.572a.571.571,0,1,0,0,1.143H3.428V7.429a.571.571,0,0,0,1.143,0V4.571H7.429a.571.571,0,0,0,0-1.143" fill="#fff"/>\
        </g>\
        </g>\
      </g>';
        btn.append(icn);
        //text
        const spn = document.createElement('span');
        spn.textContent = ' New Dictionary Term';
        btn.append(spn);
        //click
        btn.onclick = (ev) => {
            //close menu
            menu.blur();
            //standard term setting
            Ankus.ankusPlugin.openStdtermSetting(searchCol === Field.name ? { name: keyword } : { engName: keyword });
        };
        menu.appendChild(btn);
        /////////////////menu item - setting editor//////////////////
        let selidx;
        const list = document.createElement('dl');
        const menuitems = terms.map(term => {
            const item = document.createElement('dt');
            //item.style.paddingLeft = '5px';
            //item.style.paddingRight = '5px';
            item.id = term.engName;
            //name + english name
            item.innerHTML =
                '<span >' + term.engName + '</span> : <span >' + term.name + '</span>';
            //english full name
            if (term.engDesc !== null) {
                item.title = term.engDesc;
            }
            //click
            item.onclick = (ev) => {
                //insert selected text
                _notebookAction__WEBPACK_IMPORTED_MODULE_6__.NotebookPlugin.insertCompletionText(term.engName, true);
                //close menu
                menu.blur();
            };
            if (term.desc) {
                //description
                const desc = document.createElement('dd');
                desc.textContent = term.desc;
                item.appendChild(desc);
            }
            list.appendChild(item);
            return item;
        }); //menu item list
        if (menuitems && menuitems.length > 0) {
            //첫번째 아이템 기본 선택
            menuitems[0].className = 'sel-menu';
            menu.appendChild(list);
        }
        //key
        menu.onkeydown = ev => {
            //down
            if (ev.key === 'ArrowDown') {
                if (menuitems.length > 1) {
                    //이전 선택 제거
                    menuitems[selidx].className = '';
                    //다음 아이템 / 첫 아이템
                    selidx = menuitems.length === selidx + 1 ? 0 : selidx + 1;
                    //아이템 선택
                    menuitems[selidx].className = 'sel-menu';
                    if (!isVisible(menuitems[selidx], list)) {
                        menuitems[selidx].scrollIntoView();
                    }
                }
                ev.preventDefault();
            }
            //up
            else if (ev.key === 'ArrowUp') {
                if (menuitems.length > 1) {
                    //이전 선택 제거
                    menuitems[selidx].className = '';
                    //이전 아이템 / 마지막 아이템
                    selidx = 0 === selidx ? menuitems.length - 1 : selidx - 1;
                    //아이템 선택
                    menuitems[selidx].className = 'sel-menu';
                    if (!isVisible(menuitems[selidx], list)) {
                        menuitems[selidx].scrollIntoView();
                    }
                }
                ev.preventDefault();
            }
            //enter
            else if (ev.key === 'Enter') {
                //insert selected text
                _notebookAction__WEBPACK_IMPORTED_MODULE_6__.NotebookPlugin.insertCompletionText(list.children.item(selidx).id, true);
                ev.preventDefault();
                menu.blur();
            }
            //esc
            else if (ev.key === 'Escape') {
                ev.preventDefault();
                menu.blur();
            }
        }; //key
        selidx = 0;
        return menu;
    } //completerMenu
    StandardTermPart.completerMenu = completerMenu;
    const isVisible = function (ele, container) {
        const eleTop = ele.offsetTop;
        const eleBottom = eleTop + ele.clientHeight;
        const containerTop = container.scrollTop + container.offsetTop;
        const containerBottom = containerTop + container.clientHeight;
        // The element is fully visible in the container
        return (eleTop >= containerTop && eleBottom <= containerBottom
        // Some part of the element is visible in the container
        /* (eleTop < containerTop && containerTop < eleBottom) ||
        (eleTop < containerBottom && containerBottom < eleBottom) */
        );
    }; //element is visible
})(StandardTermPart || (StandardTermPart = {})); //StandardTermPart
class Ankus {
    constructor(app, state, statusBar, notebook) {
        this._mainmenu = null;
        this._serverUrl = '';
        this._remId = false;
        this._user = undefined;
        this._editorlist = [];
        //private csrfProtect = csrf({ cookie: true });
        this._stdtrmCat = 0;
        this._stdtrmFmt = '';
        this._stdtrmCatChanged = new _lumino_signaling__WEBPACK_IMPORTED_MODULE_3__.Signal(this);
        this.hookEditor = (sender, message) => {
            const editor = sender.content;
            //click close
            if (message.type === 'close-request') {
                if (!editor.prepareClose()) {
                    return false;
                }
            }
            return true;
        };
        //로그인 정보 저장
        this.saveState = () => {
            this._statdb.save(ANKUS_EXT_ID, {
                serverURL: this._serverUrl,
                loginID: this._remId ? this._user.loginId : '',
                remID: this._remId,
                stdTermCategory: this._stdtrmCat,
                stdTermFormat: this._stdtrmFmt
            });
        };
        this._app = app;
        this._statdb = state;
        this._notebook = notebook;
        //status bar
        this._statbar = new _component_statusbar__WEBPACK_IMPORTED_MODULE_7__.AnkusStatusbar();
        statusBar.registerStatusItem('ankus-status', this._statbar);
        //document
        this._factory = new _doc_widgetFactory__WEBPACK_IMPORTED_MODULE_8__.AnkusDocModelFactory();
        app.docRegistry.addModelFactory(this._factory);
        app.docRegistry.addFileType({
            name: 'ankus',
            displayName: 'ankus',
            mimeTypes: ['text/json', 'application/json'],
            fileFormat: 'text',
            contentType: 'file'
        });
    } //constructor
    static initialize(app, state, statusBar, notebook) {
        Ankus._ankus = new Ankus(app, state, statusBar, notebook);
    }
    static get ankusPlugin() {
        return Ankus._ankus;
    }
    static get ankusURL() {
        return Ankus._ankus._serverUrl;
    }
    static get loginToken() {
        var _a;
        return (_a = Ankus._ankus._user) === null || _a === void 0 ? void 0 : _a.token;
    }
    static get logged() {
        return this.loginToken !== undefined;
    }
    static get userIsAdmin() {
        var _a;
        return (_a = Ankus._ankus._user) === null || _a === void 0 ? void 0 : _a.admin;
    }
    get stdtrmCategoriesLoadSignal() {
        return this._stdtrmCatChanged;
    }
    //category list change
    onStdtrmCategoriesLoaded(cats) {
        this._stdtrmCatChanged.emit(cats);
    }
    static get stdtermCategory() {
        return Ankus._ankus._stdtrmCat;
    }
    static set stdtermCategory(id) {
        Ankus._ankus._stdtrmCat = id;
    }
    static get stdtermFormat() {
        return Ankus._ankus._stdtrmFmt;
    }
    static set stdtermFormat(fmt) {
        Ankus._ankus._stdtrmFmt = fmt;
    }
    static get userID() {
        var _a;
        return (_a = Ankus._ankus._user) === null || _a === void 0 ? void 0 : _a.loginId;
    }
    static get userNumber() {
        var _a;
        return (_a = Ankus._ankus._user) === null || _a === void 0 ? void 0 : _a.idx;
    }
    static get userName() {
        var _a;
        return (_a = Ankus._ankus._user) === null || _a === void 0 ? void 0 : _a.name;
    }
    set codeList(list) {
        this._codelist = list;
    }
    get codeList() {
        return this._codelist;
    }
    set mainMenu(menu) {
        this._mainmenu = menu;
    }
    get curActiveEditor() {
        const curwg = this._app.shell.currentWidget;
        if (curwg !== null &&
            curwg.content instanceof _component_ankusCodeEditor__WEBPACK_IMPORTED_MODULE_9__.AnkusCodeEditor) {
            return curwg.content;
        }
        return null;
    } //activatedEditor
    //current notebook
    static get activeNotebook() {
        //check notebook
        if (Ankus.ankusPlugin._notebook.currentWidget !== null &&
            Ankus.ankusPlugin._app.shell.currentWidget.node.classList.contains('jp-NotebookPanel')) {
            return Ankus.ankusPlugin._notebook.currentWidget.content;
        }
        return null;
    }
    async openCodeEditor(id) {
        let editorId = ANKUS_EXT_ID;
        const doc = this._factory.createNew();
        //open code
        if (id !== undefined) {
            //main window list
            const iter = this._app.shell.widgets('main');
            let w;
            while ((w = iter.next().value) !== undefined) {
                //found code editor
                if (w.id === ANKUS_EXT_ID + '-' + id) {
                    this._app.shell.activateById(w.id);
                    return;
                }
            }
            try {
                //get code
                const response = await fetch(`${this._serverUrl}/share-code/view?token=` +
                    this._user.token +
                    '&codeId=' +
                    id);
                //fail
                if (!response.ok) {
                    throw new Error('fail');
                }
                //code data
                const jsrp = await response.json();
                doc.codeId = id;
                doc.codeName = jsrp[ShareCode.CodePropertyName.name];
                doc.writer = jsrp[ShareCode.CodePropertyName.userName];
                doc.updateDate = jsrp[ShareCode.CodePropertyName.date];
                doc.userNumber = jsrp[ShareCode.CodePropertyName.userNo];
                doc.codeContent = jsrp[ShareCode.CodePropertyName.content];
                if (jsrp[ShareCode.CodePropertyName.comment] !== null) {
                    doc.setComment(jsrp[ShareCode.CodePropertyName.comment]);
                }
                //tag list
                if (jsrp[ShareCode.CodePropertyName.tag] !== null) {
                    doc.codeTag = jsrp[ShareCode.CodePropertyName.tag].map((value) => new _doc_docModel__WEBPACK_IMPORTED_MODULE_10__.CodeTag(value.name, value.tagId));
                }
                editorId += '-' + doc.codeId;
            }
            catch (error) {
                alert('공유 코드 열기 오류');
                return;
            }
        }
        //new code
        else {
            doc.codeName = 'untitled';
            doc.userNumber = this._user.idx;
            doc.writer = this._user.name;
            doc.updateDate = new Date();
        }
        const content = new _component_ankusCodeEditor__WEBPACK_IMPORTED_MODULE_9__.AnkusCodeEditor(doc);
        const mainwdg = new _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.MainAreaWidget({ content });
        mainwdg.id = editorId;
        mainwdg.title.icon = ANKUS_ICON;
        //mainwdg.title.label = title;
        mainwdg.title.closable = true;
        this._app.shell.add(mainwdg, 'main');
        this._editorlist.push(content);
        _lumino_messaging__WEBPACK_IMPORTED_MODULE_2__.MessageLoop.installMessageHook(mainwdg, this.hookEditor);
    } //openCodeEditor
    async openStdtermSetting(word) {
        //main window list
        const iter = this._app.shell.widgets('main');
        let w;
        while ((w = iter.next().value) !== undefined) {
            //found code editor
            if (w.id === ANKUS_EXT_ID + '-standard-term') {
                if (word) {
                    w.content.setSelection(word, Ankus.stdtermCategory);
                }
                this._app.shell.activateById(w.id);
                return;
            }
        }
        const content = new _component_standardTermSetting__WEBPACK_IMPORTED_MODULE_11__.StandardTermSetting(word);
        const mainwdg = new _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.MainAreaWidget({ content });
        mainwdg.id = ANKUS_EXT_ID + '-standard-term';
        mainwdg.title.icon = ANKUS_ICON;
        mainwdg.title.iconClass = 'ankus-editor-icon';
        mainwdg.title.label = 'Dictionary Setting';
        mainwdg.title.closable = true;
        this._app.shell.add(mainwdg, 'main');
    } //open standard setting
    login(user, remember, url) {
        this._user = user;
        this._remId = remember;
        this._serverUrl = url;
        this.saveState();
        this._mainmenu.show();
    }
    static get cmdReg() {
        return this.ankusPlugin._app.commands;
    }
    static dateToString(date) {
        const s = new Date(date).toLocaleString();
        return s.substring(0, s.lastIndexOf(':'));
    }
    //refresh code list
    updateCodelist() {
        var _a;
        (_a = this._codelist) === null || _a === void 0 ? void 0 : _a.refresh();
    }
    //current selected code
    currentCode() {
        var _a;
        return (_a = this._codelist) === null || _a === void 0 ? void 0 : _a.selectedCode;
    }
    //show code property dialog
    showCodeProp() {
        this._codelist.openCodeProp();
    }
    connectStatusbar(editor) {
        this._statbar.setEditor(editor);
        this._statbar.activate = true;
    }
    disconnectStatusbar(editor) {
        this._statbar.delEditor(editor);
        this._statbar.activate = false;
    }
    //delete code
    deleteCode() {
        var _a;
        if (this.currentCode === undefined) {
            return;
        }
        if (confirm('"' + this.currentCode().name + '" 코드를 삭제하시겠습니까?')) {
            fetch(Ankus.ankusURL + '/share-code/delete/' + this.currentCode().id, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: (_a = this._user) === null || _a === void 0 ? void 0 : _a.token })
            })
                .then(response => {
                if (!response.ok) {
                    throw new Error('fail');
                }
                //main window list
                const iter = this._app.shell.widgets('main');
                let w;
                while ((w = iter.next().value) !== undefined) {
                    //found code editor
                    if (w.id === ANKUS_EXT_ID + '-' + this.currentCode().id) {
                        const editor = w.content;
                        editor.forceClose();
                        //w.close();
                        break;
                    }
                }
                //update code list
                this.updateCodelist();
            })
                .catch(error => {
                alert('공유 코드 삭제 오류');
            });
        } //if : confirm delete
    } //deleteCode
} //class Ankus


/***/ }),

/***/ "./lib/component/ankusCodeEditor.js":
/*!******************************************!*\
  !*** ./lib/component/ankusCodeEditor.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AnkusCodeEditor: () => (/* binding */ AnkusCodeEditor),
/* harmony export */   AnkusDocWidget: () => (/* binding */ AnkusDocWidget)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lumino_signaling__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @lumino/signaling */ "webpack/sharing/consume/default/@lumino/signaling");
/* harmony import */ var _lumino_signaling__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_lumino_signaling__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _jupyterlab_docregistry__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @jupyterlab/docregistry */ "webpack/sharing/consume/default/@jupyterlab/docregistry");
/* harmony import */ var _jupyterlab_docregistry__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_docregistry__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _material_ui_core_Tooltip__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @material-ui/core/Tooltip */ "./node_modules/@material-ui/core/esm/Tooltip/Tooltip.js");
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! typestyle */ "./node_modules/typestyle/lib.es2015/index.js");
/* harmony import */ var _ankusCommon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../ankusCommon */ "./lib/ankusCommon.js");
/* harmony import */ var _codeContentTab__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./codeContentTab */ "./lib/component/codeContentTab.js");
/* harmony import */ var _style_codeedit_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../style/codeedit.css */ "./style/codeedit.css");









class AnkusDocWidget extends _jupyterlab_docregistry__WEBPACK_IMPORTED_MODULE_3__.DocumentWidget {
    constructor(options) {
        super(options);
    }
    dispose() {
        this.content.dispose();
        super.dispose();
    }
}
//import styled from 'styled-components';
/* const StyledCloseBtn = styled.div`
  color: blue;
  cursor: pointer;
`;
 */
class AnkusCodeEditor extends _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.ReactWidget {
    constructor(doc) {
        super();
        //입력커서가 있는 셀
        this._edcelRef = null;
        //private _context: DocumentRegistry.IContext<AnkusDocModel>;
        //private keyword = '';
        this._selectedTab = 'code';
        this._updateStatusbar = new _lumino_signaling__WEBPACK_IMPORTED_MODULE_2__.Signal(this);
        this._editCell = [];
        this._selectedCell = 0;
        this._resetCode = false;
        //  private _ref: HTMLDivElement | null = null;
        this._onContentChanged = (sender, change) => {
            // Wrapping the updates into a flag to prevent apply changes triggered by the same client
            //if (change.codeChange !== undefined) {
            // updating the widgets to re-render it
            //this.update();
            //}
            this._doc.dirty = true;
            this.title.label = this._doc.codeName + '*';
            // updating the widgets to re-render it
            this.update();
        }; //_onContentChanged
        this._onSaved = (sender, change) => {
            this.update();
            _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.Ankus.ankusPlugin.updateCodelist();
            console.log('editor title = ' + this._doc.codeName);
            this.title.label = this._doc.codeName; //change title
            //update status bar
            this._updateStatusbar.emit({
                id: this._doc.codeId,
                date: this._doc.updateDate,
                writer: this._doc.writer
            });
        }; //_onSaved
        this.addTag = (tag) => {
            if (this._doc.codeTag === undefined || this._doc.codeTag.length < 30) {
                this._doc.addTag(tag);
            }
        };
        this.delTag = (name) => {
            this._doc.deleteTag(name);
        };
        this.updateTag = (tag, idx) => {
            this._doc.updateTag(tag, idx);
        };
        this.updateComment = (comment) => {
            this._doc.setComment(comment);
        };
        //update content
        this.updateContent = (idx, value) => {
            const content = this._doc.codeContent;
            content[idx]['source'] = value;
            this._doc.codeContent = content;
        };
        //shift code cell edit mode
        this.shiftEditMode = () => {
            if (this._selectedTab === 'code') {
                //현재 편집 중인 셀의 입력 포커스 제거
                //단축키 사용할 경우, 입력 포커스를 임의로 처리해서, 편집 완료 및 내용 저장 수행
                if (this._edcelRef) {
                    this._edcelRef.blur();
                    this._edcelRef = null;
                }
                //선택한 셀의 편집 모드 전환
                this._editCell[this._selectedCell] = !this._editCell[this._selectedCell];
            }
            //화면 갱신
            this.update();
        }; //shiftEditMode
        //다른 이름으로 저장
        this.saveAs = () => {
            const ret = prompt('코드명을 입력하세요.', this._doc.codeName);
            //cancel, name is empty
            if (ret === null || ret.trim().length === 0) {
                return;
            }
            this._doc.codeName = ret.trim();
        }; //save as
        this.save = () => {
            //different user
            if (_ankusCommon__WEBPACK_IMPORTED_MODULE_6__.Ankus.userNumber !== this._doc.userNumber) {
                this._doc.codeId = undefined; //add code
                this._doc.userNumber = _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.Ankus.userNumber; //change user
                this._doc.writer = _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.Ankus.userName;
            }
            this._doc.save();
        };
        this.setActiveCell = (idx) => {
            this._selectedCell = idx;
            this.update();
        };
        this.titleStyle = (0,typestyle__WEBPACK_IMPORTED_MODULE_4__.style)({
            fontSize: '20px',
            fontWeight: '600',
            margin: '5px 10px 0 10px',
            verticalAlign: 'bottom',
            display: 'inline-block',
            color: 'var(--jp-ui-font-color1)'
        });
        this._doc = doc;
        this.title.label = doc.codeName;
        if (doc.codeContent !== undefined) {
            //셀 편집 상태를 false로 초기화
            this._editCell = new Array(doc.codeContent.length);
            this._editCell.fill(false);
        }
        //코드 새로 만들기 -> 비어있는 셀 하나 추가
        else {
            this._doc.codeContent = [{ cell_type: 'code', source: '' }];
            this._editCell = [true];
        }
        this._doc.sharedModelChanged.connect(this._onContentChanged);
        this._doc.saved.connect(this._onSaved);
    }
    forceClose() {
        var _a;
        this._doc.dirty = false;
        (_a = this.parent) === null || _a === void 0 ? void 0 : _a.close();
    }
    /* private saveConfirm() {
      <Dialog
        onClose={e => {
          this._askSave = false;
          this.update();
        }}
        open={this._askSave}
      >
        <DialogTitle>Save Code</DialogTitle>
        <DialogContent>
          <DialogContentText>
            '{this._doc.codeName}' changed. Save?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={e => this.setState({ openCatdlg: false })}>
            Cancel
          </Button>
          <Button onClick={e => this.setState({ openCatdlg: false })}>Yes</Button>
          <Button onClick={e => this.setState({ openCatdlg: false })}>No</Button>
        </DialogActions>
      </Dialog>;
    } */
    prepareClose() {
        if (this._doc.dirty) {
            //confirm close
            if (!confirm('작업중인 편집창을 닫으시겠습니까?')) {
                return false;
            }
            //confirm save
            if (!confirm('"' + this._doc.codeName + '"의 변경 내용을 저장하시겠습니까?')) {
                return true;
            }
            //content is empty
            if (this._doc.codeContent === undefined ||
                this._doc.codeContent.length < 1) {
                alert('코드 내용이 비어있습니다.');
                return false;
            }
            //new code
            if (this._doc.codeId === undefined) {
                //prompt name
                const nm = prompt('코드명을 입력하세요.', this._doc.codeName);
                if (nm !== null && nm.trim().length > 0) {
                    this._doc.codeName = nm.trim();
                }
            }
            this._doc.save();
            /* showDialog({
              title: 'save ankus-code',
              body: 'Save changes in "' + this._doc.codeName + '" before closing?',
              focusNodeSelector: 'button.jp-mod-accept',
              buttons: [
                Dialog.cancelButton(),
                Dialog.warnButton({ label: 'Discard' }),
                Dialog.okButton({ label: 'Save' })
              ]
            }).then(result => console.log(result)); */
        } //if : dirty
        return true;
    } //prepareClose
    onResize(msg) {
        //this._contentH = msg.height - this._contentRef!.offsetTop - 30;
        this.update();
    }
    dispose() {
        if (this.isDisposed) {
            return;
        }
        this._doc.sharedModelChanged.disconnect(this._onContentChanged);
        _lumino_signaling__WEBPACK_IMPORTED_MODULE_2__.Signal.clearData(this);
        super.dispose();
    }
    //new empty cell
    newCell(type) {
        //check code tab
        if (this._selectedTab === 'code') {
            const content = [...this._doc.codeContent];
            const editlist = [...this._editCell];
            //insert empty cell
            content.splice(this._selectedCell + 1, 0, {
                cell_type: type,
                source: ''
            });
            //set editable
            editlist.splice(this._selectedCell + 1, 0, true);
            //update content
            this._selectedCell++;
            this._editCell = editlist;
            this._doc.codeContent = content;
        }
    }
    onAfterShow(msg) {
        _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.Ankus.ankusPlugin.connectStatusbar(this._updateStatusbar);
        this._updateStatusbar.emit({
            id: this._doc.codeId,
            date: this._doc.updateDate,
            writer: this._doc.writer
        });
        //    if (this._ref) {
        //    this._ref.focus();
        //}
    }
    onBeforeHide(msg) {
        _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.Ankus.ankusPlugin.disconnectStatusbar(this._updateStatusbar);
    }
    //save 버튼 표시
    get saveVisible() {
        return (this._doc.codeId !== undefined && //기존 코드
            this._doc.userNumber === _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.Ankus.userNumber //사용자가 코드 작성자
        );
    }
    //save 버튼 활성화
    get saveAvailable() {
        return (this._doc.dirty && //수정 내용 있음
            // 코드 내용이 있음
            this._doc.codeContent !== undefined &&
            this._doc.codeContent.length > 0);
    }
    get curActiveTab() {
        return this._selectedTab;
    }
    get cellIsEditMode() {
        return this._editCell[this._selectedCell];
    }
    //tooltip for save
    /* SaveTooltip = styled(({ className, ...props }: TooltipProps) => (
      <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 12
      }
    })); */
    tooltipText() {
        return this.saveAvailable && this._doc.userNumber !== _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.Ankus.userNumber ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { children: ["Login User and Author are ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("b", { children: "different" }), ".", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("b", { children: "Saved as a new code" }) })] })) : ('');
    } //tooltip text
    render() {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ankus-editor", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "title-wrap", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: this.titleStyle, children: ["ankus Share Code - ", this._doc.codeName] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: this.saveAs, children: "Rename" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core_Tooltip__WEBPACK_IMPORTED_MODULE_7__["default"], { arrow: true, title: this.tooltipText(), placement: "bottom-start", PopperProps: { disablePortal: true }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "btn-save", onClick: this.save, disabled: !this.saveAvailable, children: "Save" }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: { margin: '20px 0 10px 10px' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: 'code' === this._selectedTab
                                ? 'tab_title select_tab'
                                : 'tab_title', onClick: () => {
                                this._selectedTab = 'code';
                                this.update();
                            }, children: "Code" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: 'desc' === this._selectedTab
                                ? 'tab_title select_tab'
                                : 'tab_title', onClick: () => {
                                this._selectedTab = 'desc';
                                this.update();
                            }, children: "Description" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("hr", { style: {
                        border: '1px solid var(--jp-border-color1)'
                    } }), this._selectedTab === 'desc' ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {})) : this._resetCode ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {})) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_codeContentTab__WEBPACK_IMPORTED_MODULE_8__.CodeContentTab, { data: this._doc.codeContent, edit: this._editCell, onChangeCell: this.updateContent, onSelectCell: this.setActiveCell, selectedCell: this._selectedCell, onChangeCellEditMode: this.shiftEditMode, 
                    //셀에서 편집 시작
                    onFocusCellEditor: (ref) => (this._edcelRef = ref) }))] }));
    } //render
}


/***/ }),

/***/ "./lib/component/ankusSidebar.js":
/*!***************************************!*\
  !*** ./lib/component/ankusSidebar.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AnkusSidebar: () => (/* binding */ AnkusSidebar),
/* harmony export */   LoginMessage: () => (/* binding */ LoginMessage)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! typestyle */ "./node_modules/typestyle/lib.es2015/index.js");
/* harmony import */ var allotment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! allotment */ "webpack/sharing/consume/default/allotment/allotment");
/* harmony import */ var allotment__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(allotment__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var allotment_dist_style_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! allotment/dist/style.css */ "./node_modules/allotment/dist/style.css");
/* harmony import */ var react_icons_md__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-icons/md */ "./node_modules/react-icons/md/index.esm.js");
/* harmony import */ var _style_sidebar_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../style/sidebar.css */ "./style/sidebar.css");
/* harmony import */ var _style_images_ankusbg_png__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../style/images/ankusbg.png */ "./style/images/ankusbg.png");
/* harmony import */ var _codeList__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./codeList */ "./lib/component/codeList.js");
/* harmony import */ var _ankusCommon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../ankusCommon */ "./lib/ankusCommon.js");
/* harmony import */ var _standardTerm__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./standardTerm */ "./lib/component/standardTerm.js");












const LoginMessage = 'ankus-login:';
var LoginState;
(function (LoginState) {
    LoginState[LoginState["logout"] = 0] = "logout";
    LoginState[LoginState["logging"] = 1] = "logging";
    LoginState[LoginState["logged"] = 2] = "logged";
})(LoginState || (LoginState = {}));
//const centerStyle = {
//display: 'flex'
// justifyContent: 'center',
// alignItems: 'center'
//};
function AnkusView(props) {
    const [loginState, login] = react__WEBPACK_IMPORTED_MODULE_2__.useState(LoginState.logout);
    const [loginID, setId] = react__WEBPACK_IMPORTED_MODULE_2__.useState(props.loginID);
    const [passwd, setPasswd] = react__WEBPACK_IMPORTED_MODULE_2__.useState('');
    const [remID, remember] = react__WEBPACK_IMPORTED_MODULE_2__.useState(props.remID);
    const [url, setUrl] = react__WEBPACK_IMPORTED_MODULE_2__.useState(props.url);
    const [errmsg, loginFail] = react__WEBPACK_IMPORTED_MODULE_2__.useState('');
    const [collapsed, collapsePane] = react__WEBPACK_IMPORTED_MODULE_2__.useState(false);
    let _inputRef;
    //      MessageLoop.postMessage(ankusWidget, new Message(LoginMessage));
    const loginStyle = {
        marginLeft: '14px',
        paddingTop: '34px',
        width: '250px'
    };
    const imgStyle = {
        marginLeft: '15px'
    };
    const standardTitleClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_3__.style)({
        //    fontSize: '12px',
        //  fontFamily: 'system-ui',
        margin: 0,
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: 'var(--jp-layout-color1)',
        borderTop: '2px solid var(--jp-border-color1)'
    });
    const clickLogin = () => {
        /*    const form = document.createElement('form');
        form.action = ANKUS_URL + '/share-code/login';
        form.method = 'post';
        form.style.display = 'none';
        document.body.appendChild(form);
    
        const id = document.createElement('input');
        id.value = loginID;
        id.type = 'text';
        id.name = 'username';
        form.appendChild(id);
    
        const pass = document.createElement('input');
        pass.value = passwd;
        pass.type = 'password';
        pass.name = 'password';
        form.appendChild(pass);
    
        const submit = document.createElement('input');
        submit.type = 'submit';
        form.appendChild(submit);
        submit.click();
    */
        let u = url.trim();
        const regex = /^https?:\/\/.+/;
        if (u.match(regex) === null) {
            u = 'http://' + u;
            setUrl(u);
        }
        login(LoginState.logging);
        fetch(u + '/share-code/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: loginID, password: passwd })
        })
            .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error(`${response.status}`);
            }
        })
            .then(response => {
            _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.ankusPlugin.login({
                token: response['token'],
                idx: response['id'],
                name: response['name'],
                loginId: loginID,
                admin: response['admin']
            }, remID, u);
            login(LoginState.logged);
        })
            .catch(error => {
            loginFail(error.message === '404' ? '로그인 실패' : '네트워크 오류');
            login(LoginState.logout);
        });
        /*    const form = new FormData();
        form.append('username', loginID);
        form.append('password', passwd);
    
        const response = await axios.post(ANKUS_URL + '/share-code/login', form, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
    */
    };
    // code list
    if (loginState === LoginState.logged) {
        return (
        //<React.Fragment>
        //<CodelistWidget />
        //</React.Fragment>
        (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(allotment__WEBPACK_IMPORTED_MODULE_4__.Allotment, { vertical: true, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(allotment__WEBPACK_IMPORTED_MODULE_4__.Allotment.Pane, { minSize: 350, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_codeList__WEBPACK_IMPORTED_MODULE_8__.CodelistWidget, { logout: () => login(LoginState.logout) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(allotment__WEBPACK_IMPORTED_MODULE_4__.Allotment.Pane, { preferredSize: "30%", minSize: collapsed ? 20 : 200, maxSize: collapsed ? 20 : 500, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: standardTitleClass, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { className: "ankus-term-title-btn", onClick: () => {
                                        collapsePane(collapsed => !collapsed);
                                    }, title: collapsed ? 'Expand Dictionary' : 'Collapse Dictionary', children: [collapsed ? (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_icons_md__WEBPACK_IMPORTED_MODULE_9__.MdKeyboardArrowRight, {}) : (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_icons_md__WEBPACK_IMPORTED_MODULE_9__.MdKeyboardArrowDown, {}), "Dictionary"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { title: "Setting", className: "ankus-term-title-btn", onClick: () => _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.ankusPlugin.openStdtermSetting(undefined), children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_icons_md__WEBPACK_IMPORTED_MODULE_9__.MdSettings, {}) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_standardTerm__WEBPACK_IMPORTED_MODULE_10__.StandardTerm, {})] })] }));
    } //code list
    //login page
    else {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: loginStyle, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img", { src: _style_images_ankusbg_png__WEBPACK_IMPORTED_MODULE_11__, style: imgStyle }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { className: "inputLogin inpID", type: "text", placeholder: "ID", value: loginID, onChange: evt => setId(evt.target.value), onKeyDown: e => {
                        if (e.key === 'Enter') {
                            if (loginID.length !== 0) {
                                _inputRef.focus();
                            }
                        } //if : enter
                    } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { className: "inputLogin inpPw", type: "password", placeholder: "Password", onChange: evt => setPasswd(evt.target.value), onKeyDown: e => {
                        if (e.key === 'Enter') {
                            if (loginID.length !== 0 && passwd.length !== 0) {
                                clickLogin();
                            }
                        } //if : enter
                    }, ref: c => {
                        _inputRef = c;
                    } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "remstyle", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "checkbox", checked: remID, onChange: e => {
                                    remember(e.target.checked);
                                } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { style: { margin: '2px 0 0 2px' }, children: "Remember" })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "btnLogin", disabled: loginState !== LoginState.logout ||
                        !loginID ||
                        !passwd ||
                        url.trim().length < 1, onClick: clickLogin, children: "Login" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "errmsg", children: errmsg }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { className: "inputLogin inputUrl", style: { width: '195px' }, type: "text", placeholder: "ankus URL", title: "Enter ankus server URL(http://ankus.com)", value: url, onChange: evt => setUrl(evt.target.value) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ankus-ui-text", style: { marginLeft: '43px' }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a", { href: url, target: "_blank", children: "Go to ankus website" }) })] }));
    }
} //LoginElement
class AnkusSidebar extends _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.ReactWidget {
    constructor(loginID, remID, url) {
        super();
        this._loginID = loginID;
        this._remID = remID;
        this._url = url;
    }
    render() {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ankus-container", style: { height: '100%' }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(AnkusView, { loginID: this._loginID, remID: this._remID, url: this._url }) }));
    } //render
} //AnkusSidebar


/***/ }),

/***/ "./lib/component/codeContentTab.js":
/*!*****************************************!*\
  !*** ./lib/component/codeContentTab.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CodeCellEditor: () => (/* binding */ CodeCellEditor),
/* harmony export */   CodeContentTab: () => (/* binding */ CodeContentTab)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! typestyle */ "./node_modules/typestyle/lib.es2015/index.js");
/* harmony import */ var react_autosize_textarea__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-autosize-textarea */ "webpack/sharing/consume/default/react-autosize-textarea/react-autosize-textarea");
/* harmony import */ var react_autosize_textarea__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_autosize_textarea__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_markdown__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-markdown */ "webpack/sharing/consume/default/react-markdown/react-markdown");
/* harmony import */ var react_markdown__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_markdown__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_syntax_highlighter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-syntax-highlighter */ "webpack/sharing/consume/default/react-syntax-highlighter/react-syntax-highlighter");
/* harmony import */ var react_syntax_highlighter__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_syntax_highlighter__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react_syntax_highlighter_dist_esm_styles_hljs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-syntax-highlighter/dist/esm/styles/hljs */ "./node_modules/react-syntax-highlighter/dist/esm/styles/hljs/docco.js");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _style_codecontent_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../style/codecontent.css */ "./style/codecontent.css");



//import TextareaAutosize from '@material-ui/core/TextareaAutosize';






//table column type
/* type TableData = {
  no: number;
  cell: string;
  type: string;
}; */
/* const StyledTextarea = styled(TextareaAutosize)`
  overflow: ${({ theme }) => theme.textarea.overflow};
  overflowx: ${({ theme }) => theme.textarea.overflowX};
`; */
class CodeContentTab extends (react__WEBPACK_IMPORTED_MODULE_1___default().Component) {
    /*   const pasteText = (
      event: React.ClipboardEvent<HTMLTextAreaElement>
    ): void => {
      console.log(event.clipboardData.getData('text/html'));
    };
   */
    constructor(props) {
        super(props);
        this.renderCell = (value, row) => {
            const cellClass = row === this.props.selectedCell ? 'ankus-Cell sel-cell' : 'ankus-Cell';
            //code
            if (this.props.data[row].cell_type === 'code') {
                //edit
                if (this.props.edit[row]) {
                    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(CodeCellEditor, { idx: row, defaultValue: value, clazzName: cellClass, 
                        //셀에서 입력포커스를 가졌을 때 호출
                        onBeginEdit: celref => {
                            this._focusCelref = celref;
                            //입력포커스를 가져간 셀을 알려줌
                            this.props.onFocusCellEditor(celref);
                        }, 
                        //셀에서 입력포커스를 버렸을 때 호출
                        onEndEdit: (idx, val) => {
                            this._focusCelref = null;
                            this.props.onChangeCell(idx, val);
                        } })); //return
                    {
                        /* <TextareaAutosize
                          className={cellClass}
                          defaultValue={value}
                          onFocus={e => {
                            this._focusRef = e.target;
                          }}
                          onBlur={e => {
                            this._focusRef = null;
                            this.props.onChangeCell(row, e.target.value);
                          }}
                          style={{ overflowX: 'auto' }}
                          // theme={{ textarea: { overflow: 'auto', overflowX: 'scroll' } }}
                        /> */
                    }
                    {
                        /* <textarea
                          className={cellClass}
                          style={{
                            width: '100%',
                            resize: 'none',
                            overflowY: 'hidden',
                            padding: '1.1em',
                            paddingBottom: '0.2em',
                            display: props.edit[row] ? 'block' : 'none'
                          }}
                          //props.onChangeCell(row, event.target.value);
                          //onPaste={event => pasteText(event)}
                          
                          onChange={e => {
                            e.currentTarget.style.height = 'auto';
                            e.currentTarget.style.height =
                              e.currentTarget.scrollHeight + 'px';
                          }}
                        >
                          {value}
                        </textarea> */
                    }
                } //if : edit code
                //render code
                else {
                    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: cellClass + ' hl-wrap', style: {
                            marginBottom: '5px',
                            display: this.props.edit[row] ? 'none' : 'block'
                        }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)((react_syntax_highlighter__WEBPACK_IMPORTED_MODULE_5___default()), { language: "python", style: react_syntax_highlighter_dist_esm_styles_hljs__WEBPACK_IMPORTED_MODULE_8__["default"], customStyle: {
                                backgroundColor: 'var(--jp-layout-color2)',
                                fontFamily: 'var(--jp-code-font-family)',
                                color: 'var(--jp-content-font-color0)'
                            }, children: value }) }));
                }
            } //if: code
            //markdown
            else {
                //edit
                if (this.props.edit[row]) {
                    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(CodeCellEditor, { idx: row, defaultValue: value, clazzName: cellClass, 
                        //셀에서 입력포커스를 가졌을 때 호출
                        onBeginEdit: celref => {
                            this._focusCelref = celref;
                            //입력포커스를 가져간 셀을 알려줌
                            this.props.onFocusCellEditor(celref);
                        }, 
                        //셀에서 입력포커스를 버렸을 때 호출
                        onEndEdit: (idx, val) => {
                            this._focusCelref = null;
                            this.props.onChangeCell(idx, val);
                        } }));
                    {
                        /* <TextareaAutosize
                          className={cellClass}
                          style={{
                            backgroundColor: '#f1f1f1'
                          }}
                          defaultValue={value}
                          //value={value}
                          //onChange={event => {
                          //props.onChangeCell(row, event.target.value);
                          //}}
                          onFocus={e => {
                            this._focusRef = e.target;
                          }}
                          onBlur={e => {
                            this._focusRef = null;
                            this.props.onChangeCell(row, e.target.value);
                          }}
                        /> */
                    }
                } //if : editing
                //render markdown
                else {
                    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: cellClass + ' md-wrap', style: { marginBottom: '5px' }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)((react_markdown__WEBPACK_IMPORTED_MODULE_4___default()), { children: value }) }));
                }
            } //else : markdown
        }; //render cell
        this.tableKeydown = (event) => {
            //셀 편집 상태 아님 확인
            if (this._focusCelref === null) {
                //상단 셀 선택
                if (event.key === 'ArrowUp' && this.props.selectedCell > 0) {
                    this.props.onSelectCell(this.props.selectedCell - 1);
                }
                //하단 셀 선택
                else if (event.key === 'ArrowDown' &&
                    this.props.selectedCell < this.props.data.length - 1) {
                    this.props.onSelectCell(this.props.selectedCell + 1);
                }
                return false;
            } //if : 셀 편집 상태 아님 확인
            return true;
        }; //tableKeydown
        this._headerStyle = (0,typestyle__WEBPACK_IMPORTED_MODULE_2__.style)({
            fontWeight: '700',
            marginBottom: '3px',
            color: 'var(--jp-ui-font-color2)'
        });
        this._noStyle = (0,typestyle__WEBPACK_IMPORTED_MODULE_2__.style)({
            width: '35px',
            textAlign: 'center',
            verticalAlign: 'top',
            color: 'var(--jp-ui-font-color1)'
        });
        //입력포커스가 있는 셀
        this._focusCelref = null;
        this.state = {};
    }
    render() {
        //table header
        /* const columns = React.useMemo<Column<TableData>[]>(
          () => [
            { Header: 'No', accessor: 'no' },
            {
              Header: 'Cell',
              accessor: 'cell'
            },
            { Header: 'Type', accessor: 'type' }
          ],
          []
        ); */
        //table data
        /* const tbldat: TableData[] = [];
        this.props.data.forEach((value, index) => {
          tbldat.push({ no: index + 1, cell: value.source, type: value.cell_type });
        });
        const data = React.useMemo<TableData[]>(() => tbldat, [tbldat]); */
        //create table
        //const { getTableProps, getTableBodyProps, rows, prepareRow } =
        //useTable<TableData>({ columns, data });
        const tbldat = this.props.data;
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ankus-code-wrap", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: this._headerStyle, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: {
                                width: '50px',
                                display: 'inline-block',
                                textAlign: 'center'
                            }, children: "No" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "th-cell", children: "Cell" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "tbl-container", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("table", { className: "ankus-cod-cel-tbl", 
                        //{...getTableProps()}
                        onKeyDown: e => {
                            this.tableKeydown(e);
                        }, tabIndex: 0, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("tbody", { children: tbldat.map((row, ri) => (
                            //prepareRow(row);
                            (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("tr", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("td", { className: this._noStyle, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { style: { marginTop: '5px' }, children: ri + 1 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("td", { 
                                        //{...cell.getCellProps()}
                                        onClick: e => this.props.onSelectCell(ri), onContextMenu: e => this.props.onSelectCell(ri), children: this.renderCell(row.source /* cell.value */, ri) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("td", { 
                                        //{...cell.getCellProps()}
                                        style: { width: '30px', verticalAlign: 'top' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: event => {
                                                    this.props.onSelectCell(ri);
                                                    this.props.onChangeCellEditMode();
                                                }, style: { marginTop: '5px' }, title: this.props.edit[ri] ? 'Edit' : 'View', children: this.props.edit[ri] ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_6__.editIcon.react, {})) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_6__.imageIcon.react, {})) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { title: row.cell_type === 'markdown' ? 'Markdown' : 'Python', style: { display: 'flex', justifyContent: 'center' }, children: row.cell_type /* row.values['type'] */ === 'markdown' ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_6__.markdownIcon.react, {})) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_6__.pythonIcon.react, {})) })] })] }, ri))) }) }) })] })); //return
    } //render
} //CodeContentTab
class CodeCellEditor extends (react__WEBPACK_IMPORTED_MODULE_1___default().Component) {
    constructor(props) {
        super(props);
        this._ref = null;
        this.state = { value: props.defaultValue };
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextState.value === this.state.value &&
            nextProps.defaultValue === this.props.defaultValue &&
            nextProps.clazzName === this.props.clazzName) {
            return false;
        }
        if (nextProps.defaultValue !== this.props.defaultValue) {
            this.setState({ value: nextProps.defaultValue });
        }
        return true;
    }
    render() {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)((react_autosize_textarea__WEBPACK_IMPORTED_MODULE_3___default()), { className: this.props.clazzName, value: this.state.value, ref: c => (this._ref = c), onChange: e => {
                this.setState({ value: e.currentTarget.value });
            }, onFocus: e => {
                this.props.onBeginEdit(this._ref);
            }, onBlur: e => {
                this.props.onEndEdit(this.props.idx, this.state.value);
            }, style: { overflowX: 'auto' } })); //return
    } //render
} //CodeCellEditor


/***/ }),

/***/ "./lib/component/codeDescTab.js":
/*!**************************************!*\
  !*** ./lib/component/codeDescTab.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CodePropDlg: () => (/* binding */ CodePropDlg),
/* harmony export */   RenameDialog: () => (/* binding */ RenameDialog)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_icons_md__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-icons/md */ "./node_modules/react-icons/md/index.esm.js");
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material-ui/core */ "webpack/sharing/consume/default/@material-ui/core/@material-ui/core");
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @material-ui/core/styles */ "./node_modules/@material-ui/core/esm/styles/withStyles.js");
/* harmony import */ var _material_ui_icons_Close__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @material-ui/icons/Close */ "./node_modules/@material-ui/icons/Close.js");
/* harmony import */ var _material_ui_core_DialogContent__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @material-ui/core/DialogContent */ "./node_modules/@material-ui/core/esm/DialogContent/DialogContent.js");
/* harmony import */ var _material_ui_core_DialogTitle__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @material-ui/core/DialogTitle */ "./node_modules/@material-ui/core/esm/DialogTitle/DialogTitle.js");
/* harmony import */ var _material_ui_core_DialogActions__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @material-ui/core/DialogActions */ "./node_modules/@material-ui/core/esm/DialogActions/DialogActions.js");
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! typestyle */ "./node_modules/typestyle/lib.es2015/index.js");
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! styled-components */ "webpack/sharing/consume/default/styled-components/styled-components");
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(styled_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_syntax_highlighter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-syntax-highlighter */ "webpack/sharing/consume/default/react-syntax-highlighter/react-syntax-highlighter");
/* harmony import */ var react_syntax_highlighter__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_syntax_highlighter__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react_syntax_highlighter_dist_esm_styles_hljs__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-syntax-highlighter/dist/esm/styles/hljs */ "./node_modules/react-syntax-highlighter/dist/esm/styles/hljs/docco.js");
/* harmony import */ var _style_codedesc_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../style/codedesc.css */ "./style/codedesc.css");














const maxTagCount = 30;
//rename dialog
const RenameDialog = (props) => {
    const { open, onClose } = props;
    const [newnm, setName] = react__WEBPACK_IMPORTED_MODULE_1___default().useState('');
    const [dirty, setDirty] = react__WEBPACK_IMPORTED_MODULE_1___default().useState(false);
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_material_ui_core__WEBPACK_IMPORTED_MODULE_2__.Dialog, { open: open, onClose: onClose, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_2__.DialogTitle, { children: "Rename Code" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_material_ui_core__WEBPACK_IMPORTED_MODULE_2__.DialogContent, { dividers: true, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_2__.DialogContentText, { children: "Enter new name." }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_2__.TextField, { autoFocus: true, margin: "dense", id: "name", label: "Name", style: { width: '300px' }, defaultValue: props.name, onChange: e => {
                            setName(e.target.value);
                            setDirty(true);
                        } })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_material_ui_core__WEBPACK_IMPORTED_MODULE_2__.DialogActions, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_2__.Button, { onClick: e => onClose(''), color: "primary", children: "Cancel" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_2__.Button, { onClick: e => onClose(newnm), color: "primary", disabled: newnm.length < 1 || !dirty, children: "Rename" })] })] })); //return
}; //RenameDialog
class CodePropDlg extends (react__WEBPACK_IMPORTED_MODULE_1___default().Component) {
    constructor(props) {
        super(props);
        this.DialogTitle = (pr) => {
            var _a;
            //withStyles(this.styles)((props) => {
            const { children, classes, onClose, ...other } = pr;
            return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_material_ui_core_DialogTitle__WEBPACK_IMPORTED_MODULE_7__["default"], { style: {
                    backgroundColor: 'var(--jp-layout-color1)',
                    padding: '10px 20px',
                    display: 'flex',
                    justifyContent: 'space-between'
                }, disableTypography: true, ...other, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_material_ui_core__WEBPACK_IMPORTED_MODULE_2__.Typography, { variant: "h6", style: { display: 'inline-block', color: 'var(--jp-ui-font-color1)' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("b", { children: (_a = this.props.prop) === null || _a === void 0 ? void 0 : _a.name }), " - Properties"] }), onClose ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_2__.IconButton, { style: {
                            display: 'inline-block',
                            width: '30px',
                            height: '30px'
                        }, "aria-label": "close", 
                        /* className={classes.closeButton} */
                        onClick: onClose, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_icons_Close__WEBPACK_IMPORTED_MODULE_8__["default"], { style: {
                                position: 'relative',
                                top: '-7px',
                                color: 'var(--jp-ui-font-color2)'
                            } }) })) : null] }));
        };
        this.DialogContent = (0,_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_9__["default"])(theme => ({
            root: {
                //padding: theme.spacing(2),
                padding: '10px 20px',
                width: '560px',
                height: '550px',
                backgroundColor: 'var(--jp-layout-color1)'
            }
        }))(_material_ui_core_DialogContent__WEBPACK_IMPORTED_MODULE_10__["default"]);
        this.DialogActions = (0,_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_9__["default"])(theme => ({
            root: {
                margin: 0,
                padding: theme.spacing(1),
                backgroundColor: 'var(--jp-layout-color1)'
            }
        }))(_material_ui_core_DialogActions__WEBPACK_IMPORTED_MODULE_11__["default"]);
        this.DelButton = (styled_components__WEBPACK_IMPORTED_MODULE_4___default().button) `
    border: none;
    width: 20px;
    background-color: transparent;
    cursor: pointer;
    &:active,
    &:hover {
      background-color: var(--jp-ui-control-color2);
    }
  `;
        this.tagBoxStyle = (0,typestyle__WEBPACK_IMPORTED_MODULE_3__.style)({
            height: '160px',
            padding: '0 5px',
            overflow: 'auto',
            border: '1px solid var(--jp-border-color1)',
            backgroundColor: 'var(--jp-layout-color1)',
            color: 'var(--jp-ui-font-color0)'
        });
        //code preview
        this.codePreview = () => {
            let prv = '';
            this.props.content.forEach(c => {
                //markdown 제외
                if (c.cell_type === 'code') {
                    prv += c.source + '\n\n';
                }
            });
            return prv;
        };
        //update tag
        this.clbkUpdateTag = (idx, value) => {
            //중복 검사
            if (this.state.taglist.find((t, index) => index !== idx && t === value) !== undefined) {
                return false;
            }
            const list = [...this.state.taglist];
            //마지막 줄에 입력 => 항목 추가
            if (idx === this.state.taglist.length - 1) {
                list.splice(idx, 0, value);
            }
            else {
                list[idx] = value;
            }
            this.setState({ taglist: list, dirty: true });
            return true;
        }; //clbkUpdateTag
        //end edit tag
        this.clbkEndEditTag = (idx, tag) => { };
        //return delete button
        this.buttonCell = (row) => {
            //new tag
            if (this.isNewTag(row)) {
                //hide button
                return '';
            }
            //delete tag button
            else {
                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: event => {
                        const list = [...this.state.taglist];
                        list.splice(row, 1);
                        this.setState({ taglist: list, dirty: true });
                    }, title: "Delete Tag", className: "align-vt-center", style: { justifyContent: 'center', marginLeft: '7px' }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_icons_md__WEBPACK_IMPORTED_MODULE_12__.MdClear, { color: "var(--jp-ui-font-color1)" }) })); //return
            } //delete tag button
        }; //buttonCell
        this.state = { taglist: [], desc: '', dirty: false };
    }
    componentDidUpdate(prevProps) {
        // 전형적인 사용 사례 (props 비교를 잊지 마세요)
        //dialog를 다시 여는 경우
        if (this.props.open !== prevProps.open && this.props.open === true) {
            //tag list
            const list = this.props.prop.taglist === undefined
                ? []
                : [...this.props.prop.taglist];
            //편집 가능할 경우, 새 태그 입력란 삽입
            if (this.props.editable) {
                list.push('[Click to enter a new tag]');
            }
            //description
            const desc = this.props.prop.comment === undefined ? '' : this.props.prop.comment;
            this.setState({ taglist: list, desc: desc, dirty: false });
        } //if : dialog를 다시 여는 경우
    } //componentDidUpdate
    //새 태그 입력란인지 확인
    isNewTag(row) {
        //편집 가능하고, 태그 개수가 제한값보다 작고, 마지막 줄일 경우
        return (this.props.editable &&
            row === this.state.taglist.length - 1 &&
            this.state.taglist.length < maxTagCount);
    }
    closeDlg() {
        if (this.state.dirty) {
            if (!confirm('Close dialog without saving?')) {
                return;
            }
        }
        this.props.onClose(false);
    }
    render() {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_material_ui_core__WEBPACK_IMPORTED_MODULE_2__.Dialog, { onClose: () => this.closeDlg(), open: this.props.open, style: { border: '1px solid var(--jp-border-color1)' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(this.DialogTitle, { id: "customized-dialog-title", onClose: () => this.closeDlg() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(this.DialogContent, { dividers: true, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_2__.Typography, { variant: "subtitle2", style: { color: 'var(--jp-ui-font-color1)' }, children: "\u00A0Preview" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)((react_syntax_highlighter__WEBPACK_IMPORTED_MODULE_5___default()), { language: "python", style: react_syntax_highlighter_dist_esm_styles_hljs__WEBPACK_IMPORTED_MODULE_13__["default"], customStyle: {
                                backgroundColor: 'var(--jp-layout-color2)',
                                fontFamily: 'var(--jp-code-font-family)',
                                fontSize: '9px',
                                color: 'var(--jp-content-font-color0)',
                                margin: 0,
                                height: '180px',
                                borderCollapse: 'collapse'
                            }, children: this.codePreview() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("br", {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_2__.Typography, { variant: "subtitle2", style: { color: 'var(--jp-ui-font-color1)' }, children: "\u00A0Tag" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: this.tagBoxStyle, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("table", { className: "ankus-code-tag-tbl", style: {
                                    width: '100%',
                                    borderCollapse: 'collapse'
                                }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("tbody", { children: this.state
                                        .taglist.filter((t, i) => i < maxTagCount)
                                        .map((row, ri) => {
                                        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("tr", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("td", { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: ri + 1 }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("td", { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(TagCell
                                                    //editing={editingTagIdx === row}
                                                    , { 
                                                        //editing={editingTagIdx === row}
                                                        tag: row, newTag: this.isNewTag(ri), onEndEdit: this.clbkEndEditTag, onUpdateTag: this.clbkUpdateTag, index: ri, editable: this.props.editable }) }), this.props.editable ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("td", { children: this.buttonCell(ri) })) : ('')] }, ri));
                                    }) }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("br", {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_2__.Typography, { variant: "subtitle2", style: { color: 'var(--jp-ui-font-color1)' }, children: "\u00A0Description" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("textarea", { className: "ankus-code-desc-txt", maxLength: 300, placeholder: "\uCF54\uB4DC \uC124\uBA85 (\uCD5C\uB300 300\uC790)", onChange: e => this.setState({ desc: e.target.value, dirty: true }), disabled: !this.props.editable, children: this.state.desc })] }), this.props.editable ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(this.DialogActions, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_2__.Button, { autoFocus: true, onClick: () => {
                            const tlst = this.state.taglist;
                            this.props.onClose(true, 
                            //마지막 항목은 새 태그 입력란이므로, 제외
                            tlst.slice(0, tlst.length - 1), this.state.desc);
                        }, disabled: !this.state.dirty, style: {
                            color: this.state.dirty
                                ? 'var(--ankus-control-color)'
                                : 'var(--ankus-disable-color)'
                        }, children: "Save changes" }) })) : ('')] })); //return
    } //render
} //CodePropDlg
class TagCell extends (react__WEBPACK_IMPORTED_MODULE_1___default().Component) {
    constructor(props) {
        super(props);
        //tag input control focus out
        this.onFocusOutTagInput = (e) => {
            //공백, # 삭제
            const trimtag = e.target.value.replace(/[\s#]/g, '');
            if (trimtag.length) {
                //update tag
                this.props.onUpdateTag(this.props.index, trimtag);
            }
            //end edit
            this.endEditCell();
        };
        this.endEditCell = () => {
            this.props.onEndEdit(this.props.index, this.state.input);
            this.setState({ edit: false });
        };
        this.onKeyDownTagInput = (e) => {
            this.setState({ tooltip: '' }); //hide tooltip
            //공백과 # 입력 불가
            if (e.key === ' ' || e.key === '#') {
                e.preventDefault();
            }
            //esc -> cancel edit
            else if (e.key === 'Escape') {
                this.endEditCell();
            }
            // enter key
            else if (e.key === 'Enter') {
                //공백, # 삭제
                const trimtag = e.currentTarget.value.replace(/[\s#]/g, '');
                if (trimtag.length) {
                    //tag error
                    if (!this.props.onUpdateTag(this.props.index, trimtag)) {
                        this.setState({ tooltip: 'Same Tag exists' });
                    }
                    //tag ok
                    else {
                        this.endEditCell();
                    }
                }
                //empty tag
                else {
                    this.setState({ tooltip: 'Empty Tag is not allowed' });
                }
            } //if : enter
        }; //onKeyDownTagInput
        this.state = { input: '', tooltip: '', edit: false };
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.tag !== this.props.tag) {
            this.setState({ input: this.props.newTag ? '' : this.props.tag });
        }
    }
    render() {
        //편집 상태
        if (this.state.edit) {
            return (
            //<ClickAwayListener onClickAway={event => this.props.onEndEdit}>
            //<div>
            (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_2__.Tooltip, { arrow: true, title: this.state.tooltip, placement: "bottom-start", PopperProps: { disablePortal: true }, 
                //onClose={event => {}}
                open: this.state.tooltip.length > 0, disableFocusListener: true, disableHoverListener: true, disableTouchListener: true, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { className: "input-tag", 
                    // ref={c => {
                    //   this._inputRef = c;
                    // }}
                    maxLength: 30, type: "text", onKeyDown: this.onKeyDownTagInput, placeholder: "\uAC80\uC0C9 \uD0DC\uADF8 (\uCD5C\uB300 30\uC790. \uACF5\uBC31\uACFC #\uC740 \uC785\uB825 \uBD88\uAC00)", onChange: event => {
                        this.setState({ input: event.target.value });
                    }, onBlur: event => this.onFocusOutTagInput(event), value: this.state.input, autoFocus: true }) })
            /* <button style={{ width: '20px' }}>
                  <MdDone></MdDone>
                </button> */
            //</div>
            //</ClickAwayListener>
            );
        } //if : editing
        else {
            //새로운 태그 입력란
            if (this.props.newTag) {
                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { style: {
                        color: 'var(--jp-ui-font-color2)'
                    }, onClick: event => {
                        this.setState({ edit: true });
                    }, children: this.props.tag }));
            }
            //태그
            else {
                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { onClick: event => {
                        this.setState({
                            edit: this.props.editable,
                            input: this.props.tag
                        });
                    }, children: this.props.tag }));
            }
        } //else : display tag
    } //render
} //TagCell


/***/ }),

/***/ "./lib/component/codeList.js":
/*!***********************************!*\
  !*** ./lib/component/codeList.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CodelistWidget: () => (/* binding */ CodelistWidget)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_loading__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-loading */ "webpack/sharing/consume/default/react-loading/react-loading");
/* harmony import */ var react_loading__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_loading__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! typestyle */ "./node_modules/typestyle/lib.es2015/index.js");
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! styled-components */ "webpack/sharing/consume/default/styled-components/styled-components");
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(styled_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_icons_ai__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-icons/ai */ "./node_modules/react-icons/ai/index.esm.js");
/* harmony import */ var _ankusCommon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../ankusCommon */ "./lib/ankusCommon.js");
/* harmony import */ var _style_codelist_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../style/codelist.css */ "./style/codelist.css");
/* harmony import */ var _codeDescTab__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./codeDescTab */ "./lib/component/codeDescTab.js");









var CodeView;
(function (CodeView) {
    CodeView[CodeView["simple"] = 0] = "simple";
    CodeView[CodeView["detail"] = 1] = "detail";
})(CodeView || (CodeView = {}));
const SimpleCodeItem = (styled_components__WEBPACK_IMPORTED_MODULE_4___default().div) `
  font-family: var(--jp-content-font-family);
  font-size: 12px;
  height: 24px;
  padding: 0 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--jp-ui-font-color1);
  &:hover {
    background-color: var(--jp-layout-color2);
  }
`;
const SelSimpleCodeItem = (styled_components__WEBPACK_IMPORTED_MODULE_4___default().div) `
  font-family: var(--jp-content-font-family);
  font-size: 12px;
  height: 24px;
  padding: 0 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--jp-brand-color1);
  color: var(--jp-ui-inverse-font-color1);
`;
const SimpleCodeName = (styled_components__WEBPACK_IMPORTED_MODULE_4___default().span) `
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: calc(100% - 150px);
`;
const SimpleCodeDate = (styled_components__WEBPACK_IMPORTED_MODULE_4___default().span) `
  width: 135px;
  text-align: right;
`;
const DetailCodeName = (styled_components__WEBPACK_IMPORTED_MODULE_4___default().p) `
  font-size: 16px;
  font-weight: 600;
`;
const CodeElement = (props) => {
    const onClick = (event) => {
        if (props.onClick) {
            props.onClick(event, props.codeobj);
        }
    };
    /* const showMenu = (event: any): void => {
      //select code
      onClick(event);
  
      //context menu
      const menu = codeContextMenu(props.codeobj);
      menu.open(event.clientX, event.clientY);
    }; */
    //double click code
    const dblclickCode = () => {
        _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.Ankus.cmdReg.execute('ankus:ntbk-open-code');
    };
    const tooltip = () => {
        return ('• Writer: ' +
            props.codeobj.writer +
            '\n• Description:\n' +
            (props.codeobj.comment ? props.codeobj.comment : ''));
    };
    return props.viewType === CodeView.detail ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { className: "ankus-code-list-item", onClick: onClick, onDoubleClick: dblclickCode, onContextMenu: onClick, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: props.select ? 'code-item sel-code' : 'code-item', children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(DetailCodeName, { children: props.codeobj.name }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: props.codeobj.comment }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: props.codeobj.tag }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: [props.codeobj.writer, " | "] }), _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.Ankus.dateToString(props.codeobj.date)] })] }) })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { className: "ankus-code-list-item", onClick: onClick, onDoubleClick: dblclickCode, onContextMenu: onClick, title: tooltip(), children: props.select ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(SelSimpleCodeItem, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(SimpleCodeName, { children: props.codeobj.name }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(SimpleCodeDate, { children: _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.Ankus.dateToString(props.codeobj.date) })] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(SimpleCodeItem, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(SimpleCodeName, { children: props.codeobj.name }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(SimpleCodeDate, { children: _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.Ankus.dateToString(props.codeobj.date) })] })) }));
}; //CodeElement
class CodelistWidget extends (react__WEBPACK_IMPORTED_MODULE_1___default().Component) {
    constructor(props) {
        super(props);
        this.SEARCH_OPTION = [
            {
                name: _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.ShareCode.CodePropertyName.name,
                label: 'Name',
                guide: 'Search Name'
            },
            {
                name: _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.ShareCode.CodePropertyName.tag,
                label: 'Tag',
                guide: 'Search Tag(ex: tag1 tag2)'
            },
            {
                name: _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.ShareCode.CodePropertyName.comment,
                label: 'Comments',
                guide: 'Search Comments(ex: word1 word2)'
            },
            {
                name: _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.ShareCode.CodePropertyName.userNo,
                label: 'Writer',
                guide: 'Search Writer'
            }
        ];
        this._errMsg = '';
        this._codeList = [];
        this._searchKeyword = '';
        this.SearchResult = (styled_components__WEBPACK_IMPORTED_MODULE_4___default().span) `
    font-size: 12px;
    color: var(--jp-ui-font-color2);
    margin: 15px 0 0 5px;
  `;
        this.ViewButton = (styled_components__WEBPACK_IMPORTED_MODULE_4___default().button) `
    color: var(--jp-ui-font-color2);
    display: inline-block;
    width: 17px;
    height: 17px;
    padding: 2px;
  `;
        this.CodeList = (styled_components__WEBPACK_IMPORTED_MODULE_4___default().ul) `
    margin: 0;
    padding: 0;
    overflow: auto;
    font-family: var(--jp-content-font-family);
    list-style: none;
    background-color: var(--jp-layout-color0);
  `;
        //on select code
        this.clbkSelectCode = (event, codeobj) => {
            //update selection
            this.setState({ selection: { prop: codeobj } });
        };
        //callback - close property dialog
        this.clbkCloseProp = (save, taglist, desc) => {
            //close
            this.setState({ openProp: false });
            if (save) {
                const code = {};
                code[_ankusCommon__WEBPACK_IMPORTED_MODULE_6__.ShareCode.CodePropertyName.comment] = desc;
                //tag list
                code[_ankusCommon__WEBPACK_IMPORTED_MODULE_6__.ShareCode.CodePropertyName.tag] = taglist;
                //code id
                code[_ankusCommon__WEBPACK_IMPORTED_MODULE_6__.ShareCode.CodePropertyName.id] = this.state.selection.prop.id;
                //update code
                fetch(_ankusCommon__WEBPACK_IMPORTED_MODULE_6__.Ankus.ankusURL + '/share-code/modify/prop', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.Ankus.loginToken,
                        code: code //code detail
                    })
                })
                    .then(response => {
                    //response ok
                    if (response.ok) {
                        this.refresh();
                        this.setState({ selection: undefined });
                    }
                    //response fail
                    else {
                        throw new Error('fail');
                    }
                })
                    .catch(error => {
                    alert('공유 코드 저장 오류');
                }); //fetch
            } //if : check tag list
        }; //clbkCloseProp
        //callback - close rename dialog
        this.clbkCloseRename = async (name) => {
            //close dialog
            this.setState({ openRename: false });
            if (name !== undefined &&
                name.length > 0 &&
                name !== this.state.selection.prop.name) {
                const code = {};
                //code name
                code[_ankusCommon__WEBPACK_IMPORTED_MODULE_6__.ShareCode.CodePropertyName.name] = name;
                //code id
                code[_ankusCommon__WEBPACK_IMPORTED_MODULE_6__.ShareCode.CodePropertyName.id] = this.state.selection.prop.id;
                //update code
                fetch(_ankusCommon__WEBPACK_IMPORTED_MODULE_6__.Ankus.ankusURL + '/share-code/modify/name', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.Ankus.loginToken,
                        code: code //code detail
                    })
                })
                    .then(response => {
                    //response ok
                    if (response.ok) {
                        //update code list
                        this.refresh();
                    }
                    //response fail
                    else {
                        throw new Error('fail');
                    }
                })
                    .catch(error => {
                    alert('공유 코드 저장 오류');
                }); //fetch
            } //if : check name
        }; //clbkCloseRename
        this.prevPage = () => {
            this.searchCode(this.state.pageNo - 1, this.state.orderOption, this.state.orderDirection === 'asc');
        };
        this.nextPage = () => {
            this.searchCode(this.state.pageNo + 1, this.state.orderOption, this.state.orderDirection === 'asc');
        };
        //code list
        this.searchCode = async (page, orderCol, asc) => {
            //search keyword list
            const words = this.getSearchKeywords();
            //search option
            const searchOption = this.state.searchOption;
            //show wait image
            this.setState({ loading: true });
            const out = await _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.ShareCode.codelist(words, searchOption, orderCol, asc, page);
            this.setState({
                //hide wait image
                loading: false,
                //init code selection
                selection: undefined,
                //code list order
                orderDirection: asc ? 'asc' : 'desc',
                orderOption: orderCol
            });
            if (out !== undefined) {
                this._codeList = out.list;
                this.setState({
                    codeSize: out.totalSize,
                    searchOption: searchOption,
                    searchResult: this.resultMessage(words.join(', '), out.totalSize),
                    pageSize: out.pageSize,
                    pageNo: page
                });
            }
            else {
                this._codeList = [];
                this.setState({
                    codeSize: 0,
                    searchOption: searchOption,
                    searchResult: this.resultMessage(words.join(', '), 0),
                    pageSize: 0,
                    pageNo: 0
                });
            }
        }; //searchCode
        /*   private deleteCode = () => {
          if (!confirm('선택한 공유 코드 삭제')) {
            return;
          }
      
          fetch(ANKUS_URL + '/share-code/delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(checkList)
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('fail');
              } else {
                this.searchCode(0);
              }
            })
            .catch(error => {
              alert('공유 코드 삭제 오류');
            }); //fetch
        }; //deleteCode */
        this.changeSearchOption = (e) => {
            this.SEARCH_OPTION.forEach(element => {
                if (element.name === e.target.value) {
                    const res = this.state.searchResult;
                    this.setState({ searchOption: element.name, searchResult: res });
                    return false;
                }
            });
        };
        this.changeSearchKeyword = (e) => {
            //this.setState({ searchKeyword: e.target.value });
            console.log(e.target.value);
            this._searchKeyword = e.target.value;
        };
        //change order by
        this.changeOrderOption = (e) => {
            //제목 정렬 선택
            if (e.target.className === 'name-wrap') {
                //현재 제목 정렬 상태
                if (this.state.orderOption === _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.ShareCode.CodePropertyName.name) {
                    //정렬 순서 변경
                    this.searchCode(this.state.viewType === CodeView.detail ? 0 : -1, this.state.orderOption, this.state.orderDirection !== 'asc');
                }
                //제목 정렬로 변경
                else {
                    this.searchCode(this.state.viewType === CodeView.detail ? 0 : -1, _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.ShareCode.CodePropertyName.name, this.state.orderDirection === 'asc');
                }
            }
            //select date order
            else {
                //current date order
                if (this.state.orderOption === _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.ShareCode.CodePropertyName.date) {
                    //정렬 순서 변경
                    this.searchCode(this.state.viewType === CodeView.detail ? 0 : -1, this.state.orderOption, this.state.orderDirection !== 'asc');
                }
                //change to date order
                else {
                    this.searchCode(this.state.viewType === CodeView.detail ? 0 : -1, _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.ShareCode.CodePropertyName.date, this.state.orderDirection === 'asc');
                }
            }
        }; //changeOrderOption
        //change order
        this.changeOrder = (e) => {
            this.searchCode(this.state.viewType === CodeView.detail ? 0 : -1, this.state.orderOption, this.state.orderDirection !== 'asc');
        };
        //change view mode
        this.changeCodeView = (viewType) => {
            this.setState({ viewType: viewType });
            this.searchCode(viewType === CodeView.detail ? 0 : -1, this.state.orderOption, this.state.orderDirection !== 'asc');
        };
        this.__selectStyle = (0,typestyle__WEBPACK_IMPORTED_MODULE_3__.style)({
            width: '85px',
            height: '24px',
            border: '1px solid var(--jp-toolbar-border-color)',
            backgroundColor: 'transparent',
            display: 'flex',
            boxSizing: 'border-box',
            color: 'var(--jp-ui-font-color1)',
            cursor: 'pointer'
        });
        this.__searchInputStyle = (0,typestyle__WEBPACK_IMPORTED_MODULE_3__.style)({
            width: '100%',
            height: '24px',
            boxSizing: 'border-box',
            border: '1px solid var(--jp-toolbar-border-color)',
            fontSize: '12px',
            marginLeft: '6px',
            paddingLeft: '8px',
            backgroundColor: 'transparent',
            color: 'var(--jp-content-font-color0)'
        });
        _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.Ankus.ankusPlugin.codeList = this;
        this.state = {
            searchOption: _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.ShareCode.CodePropertyName.name,
            searchResult: '',
            orderDirection: 'asc',
            orderOption: _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.ShareCode.CodePropertyName.name,
            codeSize: 0,
            loading: false,
            selection: undefined,
            viewType: CodeView.simple,
            pageNo: 0,
            pageSize: 0,
            openProp: false,
            openRename: false
        };
        this.searchCode(this.state.viewType === CodeView.detail ? 0 : -1, _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.ShareCode.CodePropertyName.name, true);
    } //constructor
    get selectedCode() {
        var _a;
        return (_a = this.state.selection) === null || _a === void 0 ? void 0 : _a.prop;
    }
    //open code property
    async openCodeProp() {
        try {
            //get code
            const response = await fetch(`${_ankusCommon__WEBPACK_IMPORTED_MODULE_6__.Ankus.ankusURL}/share-code/view?token=` +
                _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.Ankus.loginToken +
                '&codeId=' +
                this.state.selection.prop.id);
            //fail
            if (!response.ok) {
                throw new Error('fail');
            }
            const jsrp = await response.json();
            const codetail = {
                ...this.state.selection.prop
            };
            // codetail.id = this.state.selection?.id;
            // codetail.name = jsrp[ShareCode.CodePropertyName.name];
            // codetail.writer = jsrp[ShareCode.CodePropertyName.userName];
            // codetail.date = jsrp[ShareCode.CodePropertyName.date];
            // codetail.writerNo = jsrp[ShareCode.CodePropertyName.userNo];
            const content = jsrp[_ankusCommon__WEBPACK_IMPORTED_MODULE_6__.ShareCode.CodePropertyName.content];
            //comment
            if (jsrp[_ankusCommon__WEBPACK_IMPORTED_MODULE_6__.ShareCode.CodePropertyName.comment] !== null) {
                codetail.comment = jsrp[_ankusCommon__WEBPACK_IMPORTED_MODULE_6__.ShareCode.CodePropertyName.comment];
            }
            //tag list
            if (jsrp[_ankusCommon__WEBPACK_IMPORTED_MODULE_6__.ShareCode.CodePropertyName.tag] !== null) {
                codetail.taglist = jsrp[_ankusCommon__WEBPACK_IMPORTED_MODULE_6__.ShareCode.CodePropertyName.tag].map((value) => value.name);
            }
            this.setState({ selection: { prop: codetail, content: content } });
            this.setState({ openProp: true });
        }
        catch (error) {
            alert('공유 코드 정보 가져오기 오류');
        }
    } //openCodeProp
    //open rename dialog
    openRenameDlg() {
        this.setState({ openRename: true });
    }
    getSearchKeywords() {
        if (this.state.searchOption === _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.ShareCode.CodePropertyName.tag ||
            this.state.searchOption === _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.ShareCode.CodePropertyName.comment) {
            return this._searchKeyword.trim().split(' ');
        }
        else {
            return this._searchKeyword === '' ? [] : [this._searchKeyword];
        }
    }
    //refresh list
    refresh() {
        this.searchCode(this.state.pageNo, this.state.orderOption, this.state.orderDirection === 'asc');
    }
    resultMessage(keyword, count) {
        var _a;
        if (keyword) {
            return ('Search for "' +
                keyword +
                '" in ' +
                ((_a = this.SEARCH_OPTION.find(option => option.name === this.state.searchOption)) === null || _a === void 0 ? void 0 : _a.label) +
                ' - Total ' +
                count);
        }
        else {
            return 'Total ' + count;
        }
    } //resultMessage
    render() {
        var _a, _b, _c, _d, _e;
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ankus-code-list-wrap", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: {
                        margin: '0 5px 10px 10px',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ankus-ui-text", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("a", { href: _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.Ankus.ankusURL, target: "_blank", style: { display: 'flex', justifySelf: 'end' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "ankus-icon-btn go-icon" }), "Go to ankus website"] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "ankus-icon-btn", title: "Logout", onClick: this.props.logout, style: { width: '24px', height: '20px' }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_icons_ai__WEBPACK_IMPORTED_MODULE_7__.AiOutlineLogout, { style: {
                                    width: '16px',
                                    height: '16px',
                                    color: 'var(--jp-ui-font-color2)'
                                } }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "search-wrap", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("select", { onChange: this.changeSearchOption, className: this.__selectStyle, children: this.SEARCH_OPTION.map((option, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: option.name, children: option.label }, index))) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { className: this.__searchInputStyle, type: "text", placeholder: (_a = this.SEARCH_OPTION.find(option => option.name === this.state.searchOption)) === null || _a === void 0 ? void 0 : _a.guide, onChange: this.changeSearchKeyword, onKeyDown: e => {
                                if (e.key === 'Enter') {
                                    this.searchCode(this.state.viewType === CodeView.detail ? 0 : -1, this.state.orderOption, this.state.orderDirection === 'asc');
                                }
                            } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "search-btn", onClick: () => this.searchCode(this.state.viewType === CodeView.detail ? 0 : -1, this.state.orderOption, this.state.orderDirection === 'asc'), title: "Filter code list" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(this.SearchResult, { children: this.state.searchResult }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: { padding: '10px 5px 0 0' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(this.ViewButton, { className: "ankus-icon-btn", title: "Detail", onClick: () => this.changeCodeView(CodeView.detail), children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_icons_ai__WEBPACK_IMPORTED_MODULE_7__.AiOutlineAlignLeft, { style: {
                                            color: this.state.viewType === CodeView.detail
                                                ? 'var(--jp-ui-font-color0)'
                                                : 'var(--jp-ui-font-color2)'
                                        } }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(this.ViewButton, { className: "ankus-icon-btn", title: "List", onClick: () => this.changeCodeView(CodeView.simple), children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_icons_ai__WEBPACK_IMPORTED_MODULE_7__.AiOutlineBars, { style: {
                                            color: this.state.viewType === CodeView.simple
                                                ? 'var(--jp-ui-font-color0)'
                                                : 'var(--jp-ui-font-color2)'
                                        } }) })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "title", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "name-wrap", onClick: this.changeOrderOption, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Name" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { 
                                    // arrown up/down
                                    className: this.state.orderDirection === 'asc' ? 'name-up' : 'name-down', style: {
                                        display: 
                                        //arrow show/hide
                                        this.state.orderOption === _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.ShareCode.CodePropertyName.name
                                            ? 'block'
                                            : 'none'
                                    } })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "date-wrap", onClick: this.changeOrderOption, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: this.state.orderDirection === 'asc' ? 'date-up' : 'date-down', style: {
                                        display: this.state.orderOption === _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.ShareCode.CodePropertyName.date
                                            ? 'block'
                                            : 'none'
                                    } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Date Updated" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: {
                        display: this.state.errMsg === '' ? 'block' : 'none'
                    }, children: this.state.errMsg }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: {
                        height: 'calc(100% - 110px)',
                        display: this._codeList.length > 0 ? 'block' : 'none'
                    }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(this.CodeList, { style: {
                                maxHeight: this.state.viewType === CodeView.detail
                                    ? 'calc(100% - 40px)'
                                    : '100%'
                            }, children: this._codeList.map((item, index) => {
                                var _a;
                                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(CodeElement, { viewType: this.state.viewType, onClick: this.clbkSelectCode, codeobj: {
                                        name: item.name,
                                        id: item.id,
                                        comment: item.comment,
                                        writer: item.writer,
                                        date: item.date,
                                        tag: item.tag,
                                        writerNo: item.writerNo
                                    }, select: ((_a = this.state.selection) === null || _a === void 0 ? void 0 : _a.prop.id) === item.id }, index));
                            }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_codeDescTab__WEBPACK_IMPORTED_MODULE_8__.RenameDialog, { name: ((_b = this.state.selection) === null || _b === void 0 ? void 0 : _b.prop.name) === undefined
                                ? ''
                                : this.state.selection.prop.name, open: this.state.openRename, onClose: this.clbkCloseRename }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_codeDescTab__WEBPACK_IMPORTED_MODULE_8__.CodePropDlg, { open: this.state.openProp, 
                            //코드 작성자와 현재 사용자가 동일하면, 수정 가능
                            editable: ((_c = this.state.selection) === null || _c === void 0 ? void 0 : _c.prop.writerNo) === _ankusCommon__WEBPACK_IMPORTED_MODULE_6__.Ankus.userNumber, prop: (_d = this.state.selection) === null || _d === void 0 ? void 0 : _d.prop, content: ((_e = this.state.selection) === null || _e === void 0 ? void 0 : _e.content) === undefined
                                ? []
                                : this.state.selection.content, onClose: (save, taglist, desc) => this.clbkCloseProp(save, taglist, desc) }), this.state.viewType === CodeView.detail ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "page", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: this.prevPage, disabled: this.state.pageNo === 0, title: "Prev" }), this.state.pageNo + 1, "/", this.state.pageSize, (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: this.nextPage, disabled: this.state.pageNo + 1 === this.state.pageSize, title: "Next" })] })) : (''), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: {
                                display: this.state.loading ? 'block' : 'none',
                                textAlign: 'center'
                            }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)((react_loading__WEBPACK_IMPORTED_MODULE_2___default()), { type: "spin", color: "#1E90FF", height: '50px', width: '50px' }) })] })] }));
    }
} //CodelistWidget


/***/ }),

/***/ "./lib/component/standardTerm.js":
/*!***************************************!*\
  !*** ./lib/component/standardTerm.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StandardTerm: () => (/* binding */ StandardTerm)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! typestyle */ "./node_modules/typestyle/lib.es2015/index.js");
/* harmony import */ var react_loading__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-loading */ "webpack/sharing/consume/default/react-loading/react-loading");
/* harmony import */ var react_loading__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_loading__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_icons_ai__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-icons/ai */ "./node_modules/react-icons/ai/index.esm.js");
/* harmony import */ var _material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @material-ui/core/Grid */ "./node_modules/@material-ui/core/esm/Grid/Grid.js");
/* harmony import */ var _ankusCommon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../ankusCommon */ "./lib/ankusCommon.js");
/* harmony import */ var _notebookAction__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../notebookAction */ "./lib/notebookAction.js");
/* harmony import */ var _style_standardterm_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../style/standardterm.css */ "./style/standardterm.css");









///////////////////////// term item ///////////////////////
class TermElement extends (react__WEBPACK_IMPORTED_MODULE_1___default().Component) {
    constructor(props) {
        super(props);
        //select term
        this._onClick = (event) => {
            this.props.onSelectTerm(this.props.word);
        };
        //check keyword
        if (props.keyword !== undefined) {
            const key = props.keyword.toLowerCase();
            //search target
            const lower = props.searchField === _ankusCommon__WEBPACK_IMPORTED_MODULE_5__.StandardTermPart.Field.name
                ? props.word.name.toLowerCase()
                : props.word.engName.toLowerCase();
            const txt = props.searchField === _ankusCommon__WEBPACK_IMPORTED_MODULE_5__.StandardTermPart.Field.name
                ? props.word.name
                : props.word.engName;
            const ary = [];
            for (let b = 0; b < txt.length;) {
                const i = lower.indexOf(key, b);
                //found keyword
                if (i >= 0) {
                    const s = txt.substring(b, i);
                    if (s.length > 0) {
                        //not keyword -> blue
                        ary.push({ text: s, key: false });
                    }
                    //keyword -> red
                    ary.push({ text: txt.substring(i, i + key.length), key: true });
                    b = i + key.length;
                } //if: found keyword
                else {
                    //not keyword -> blue
                    ary.push({ text: txt.substring(b), key: false });
                    break;
                }
            } //for: name length
            if (props.searchField === _ankusCommon__WEBPACK_IMPORTED_MODULE_5__.StandardTermPart.Field.name) {
                this.state = {
                    name: ary,
                    eng: [{ text: props.word.engName, key: false }]
                };
            }
            else {
                this.state = {
                    name: [{ text: props.word.name, key: false }],
                    eng: ary
                };
            }
        } //if : check keyword
        else {
            this.state = {
                name: [{ text: props.word.name, key: false }],
                eng: [{ text: props.word.engName, key: false }]
            };
        }
    }
    render() {
        /*     let tagstr = '';
        if (this.props.codeobj.tag !== undefined) {
          tagstr = this.props.codeobj.tag?.reduce(
            (pval, cval) => pval + ' #' + cval.name,
            ''
          );
        } */
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ankus-std-term", onClick: this._onClick, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { style: { color: 'var(--ankus-control-color)' }, children: [this.state.eng.map((elm, idx) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: elm.key ? 'keyword' : '', children: elm.text }, idx))), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: ' (' }), this.state.name.map((elm, idx) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: elm.key ? 'keyword' : '', children: elm.text }, idx))), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: ')' })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: this.props.word.engDesc }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: this.props.word.desc })] }));
    } //render
} //CodeElement
class StandardTerm extends (react__WEBPACK_IMPORTED_MODULE_1___default().Component) {
    constructor(props) {
        super(props);
        this._termList = undefined;
        /* private _keywordRef: React.RefObject<HTMLInputElement> | null = null; */
        this.__searchResultStyle = (0,typestyle__WEBPACK_IMPORTED_MODULE_2__.style)({
            fontSize: '11px',
            fontWeight: '500',
            color: 'var(--jp-ui-font-color2)',
            margin: '12px 0 0 5px',
            padding: 0
        });
        this.smallTitleStyle = (0,typestyle__WEBPACK_IMPORTED_MODULE_2__.style)({
            fontSize: '11px',
            verticalAlign: 'middle',
            lineHeight: '20px'
        });
        this.fmtSelectStyle = (0,typestyle__WEBPACK_IMPORTED_MODULE_2__.style)({
            fontSize: '11px',
            height: '20px',
            width: '100%',
            cursor: 'pointer',
            backgroundColor: 'transparent',
            color: 'var(--jp-ui-font-color0)',
            border: '1px solid var(--jp-border-color2)'
        });
        this.__searchInputStyle = (0,typestyle__WEBPACK_IMPORTED_MODULE_2__.style)({
            height: '20px',
            width: '100%',
            boxSizing: 'border-box',
            backgroundColor: 'transparent',
            color: 'var(--jp-ui-font-color0)',
            border: '1px solid var(--jp-border-color2)',
            fontSize: '11px'
        });
        this.selectWord = (word) => {
            //insert into notebook
            _notebookAction__WEBPACK_IMPORTED_MODULE_6__.NotebookPlugin.insertCompletionText(word.engName, false);
        };
        this.loadCategories = async () => {
            //initialize
            const cats = [{ id: 0, name: 'All' }];
            let cat = 0;
            //category list
            const list = await _ankusCommon__WEBPACK_IMPORTED_MODULE_5__.StandardTermPart.loadCategories();
            list.forEach(item => {
                cats.push(item);
                //check selected category
                if (item.id === this.state.category) {
                    cat = item.id;
                }
            });
            //store category
            this.setState({ categories: cats });
            this.setState({ category: cat });
        }; //loadCategories
        this.searchTerm = async (orderCol, asc) => {
            var _a;
            this._termList = undefined;
            //show loading
            this.setState({ loading: true });
            try {
                //search term
                this._termList = await _ankusCommon__WEBPACK_IMPORTED_MODULE_5__.StandardTermPart.searchWords(this.state.searchOption, this.state.keyword, orderCol, asc, this.state.category);
                this.setState({
                    searchResult: this._termList.length +
                        ' results in "' +
                        ((_a = this.state.categories.find(c => c.id === this.state.category)) === null || _a === void 0 ? void 0 : _a.name) +
                        '"'
                });
            }
            catch (e) {
                this._termList = undefined;
            }
            //hide loading
            this.setState({ loading: false });
        }; //searchTerm
        this.changeCategory = (evt) => {
            _ankusCommon__WEBPACK_IMPORTED_MODULE_5__.Ankus.stdtermCategory = Number(evt.target.value);
            this.setState({
                category: Number(evt.target.value)
            });
            _ankusCommon__WEBPACK_IMPORTED_MODULE_5__.Ankus.ankusPlugin.saveState();
        };
        this.changeFormat = (evt) => {
            _ankusCommon__WEBPACK_IMPORTED_MODULE_5__.Ankus.stdtermFormat = evt.target.value;
            this.setState({ format: evt.target.value });
            _ankusCommon__WEBPACK_IMPORTED_MODULE_5__.Ankus.ankusPlugin.saveState();
        };
        //change order by
        this.changeOrderOption = (orderCol) => {
            let asc = this.state.asc;
            //현재 제목 정렬 상태
            if (this.state.orderOption === orderCol) {
                asc = !asc;
                this.setState({ asc: asc });
            }
            //제목 정렬로 변경
            else {
                this.setState({ orderOption: orderCol });
            }
            this.searchTerm(orderCol, asc);
        }; //changeOrderOption
        this.state = {
            searchOption: 'name',
            searchResult: '',
            keyword: '',
            asc: true,
            orderOption: 'engName',
            editCat: false,
            category: _ankusCommon__WEBPACK_IMPORTED_MODULE_5__.Ankus.stdtermCategory,
            categories: [{ id: 0, name: 'All' }],
            catDlg: false,
            loading: false,
            format: _ankusCommon__WEBPACK_IMPORTED_MODULE_5__.Ankus.stdtermFormat
        };
        this.loadCategories();
        //category list changed
        _ankusCommon__WEBPACK_IMPORTED_MODULE_5__.StandardTermPart.categoryLoadSignal().connect(async (_, cats) => {
            console.log('category load signal - sidebar');
            const catlst = [...cats];
            catlst.unshift({ id: 0, name: 'All' });
            //new category  list
            this.setState({ categories: catlst });
        });
        /* this._keywordRef = React.createRef<HTMLInputElement>(); */
    } //constructor
    render() {
        var _a, _b;
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ankus-standard-wrap", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_7__["default"], { container: true, spacing: 1, style: { padding: '7px' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_7__["default"], { item: true, xs: 4, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: this.smallTitleStyle, children: " - term format : " }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_7__["default"], { item: true, xs: 8, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("select", { className: this.fmtSelectStyle, title: "Select Term Format", onChange: this.changeFormat, children: Object.values(_ankusCommon__WEBPACK_IMPORTED_MODULE_5__.StandardTermPart.Format).map((fmt, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: fmt, selected: this.state.format === fmt, children: fmt }, index))) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_7__["default"], { item: true, xs: 4, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: this.smallTitleStyle, children: " - category : " }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_7__["default"], { item: true, xs: 8, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("select", { onChange: this.changeCategory, className: this.fmtSelectStyle, value: this.state.category, title: "Select Category", style: { width: '100%' }, children: this.state.categories.map((cat, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: cat.id, children: cat.name }, cat.id))) }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: {
                        //카테고리 없으면, 검색 불가
                        display: this.state !== undefined && this.state.categories.length > 0
                            ? 'block'
                            : 'none',
                        height: 'calc(100% - 60px)',
                        width: '100%'
                    }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: this.smallTitleStyle, style: { paddingLeft: '7px' }, children: ["- search term in '", (_a = this.state.categories.find(c => c.id === this.state.category)) === null || _a === void 0 ? void 0 : _a.name, "'"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_7__["default"], { container: true, spacing: 1, style: { padding: '0 7px' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_7__["default"], { item: true, xs: 4, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("select", { onChange: e => this.setState({ searchOption: e.target.value }), className: this.fmtSelectStyle, style: { width: '100%' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "name", children: "Name" }, 1), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "engName", children: "Abbreviation" }, 2)] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_7__["default"], { item: true, xs: 7, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { 
                                        /* ref={this._keywordRef} */
                                        className: this.__searchInputStyle, type: "text", placeholder: "Input Keyword", onKeyDown: e => {
                                            //enter key
                                            if (e.key === 'Enter' &&
                                                this.state.keyword.replace(' ', '').length > 0) {
                                                this.searchTerm(this.state.orderOption, this.state.asc);
                                            }
                                            //space key
                                            else if (e.key === ' ') {
                                                e.preventDefault();
                                            }
                                        }, onChange: e => this.setState({ keyword: e.target.value }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_7__["default"], { item: true, xs: 1, style: {
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: '0'
                                    }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { className: "btn-search", title: "Search Dictionary", onClick: e => this.searchTerm(this.state.orderOption, this.state.asc), disabled: this.state.loading || this.state.keyword.trim().length < 1, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_icons_ai__WEBPACK_IMPORTED_MODULE_8__.AiOutlineSearch, {}) }) })] }), this.state.loading ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ankus-loading-container", style: { height: 'calc(100% - 60px)' }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)((react_loading__WEBPACK_IMPORTED_MODULE_3___default()), { type: "spin", color: "#1E90FF", height: '50px', width: '50px' }) })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: {
                                display: this._termList !== undefined ? 'block' : 'none',
                                height: 'calc(100% - 60px)'
                            }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: this.__searchResultStyle, children: this.state.searchResult }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ankus-std-order-title", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "name-tab", onClick: () => this.changeOrderOption(_ankusCommon__WEBPACK_IMPORTED_MODULE_5__.StandardTermPart.Field.name), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Name" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { 
                                                    // arrown up/down
                                                    className: "ankus-std-btn-order", children: this.state.orderOption === _ankusCommon__WEBPACK_IMPORTED_MODULE_5__.StandardTermPart.Field.name ? (this.state.asc ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_icons_ai__WEBPACK_IMPORTED_MODULE_8__.AiFillCaretUp, {})) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_icons_ai__WEBPACK_IMPORTED_MODULE_8__.AiFillCaretDown, {}))) : ('') })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "eng-tab", onClick: () => this.changeOrderOption(_ankusCommon__WEBPACK_IMPORTED_MODULE_5__.StandardTermPart.Field.engName), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ankus-std-btn-order", children: this.state.orderOption ===
                                                        _ankusCommon__WEBPACK_IMPORTED_MODULE_5__.StandardTermPart.Field.engName ? (this.state.asc ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_icons_ai__WEBPACK_IMPORTED_MODULE_8__.AiFillCaretUp, {})) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_icons_ai__WEBPACK_IMPORTED_MODULE_8__.AiFillCaretDown, {}))) : ('') }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Abbreviation" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ankus-std-term-list", children: (_b = this._termList) === null || _b === void 0 ? void 0 : _b.map((item, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(TermElement, { onSelectTerm: e => this.selectWord(item), word: item, keyword: this.state.keyword, searchField: this.state.searchOption }, index))) })] })
                        /* 검색결과 */
                        )] })] }));
    }
} //CodelistWidget


/***/ }),

/***/ "./lib/component/standardTermSetting.js":
/*!**********************************************!*\
  !*** ./lib/component/standardTermSetting.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StandardTermSetting: () => (/* binding */ StandardTermSetting)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @material-ui/core/Grid */ "./node_modules/@material-ui/core/esm/Grid/Grid.js");
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! typestyle */ "./node_modules/typestyle/lib.es2015/index.js");
/* harmony import */ var react_loading__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-loading */ "webpack/sharing/consume/default/react-loading/react-loading");
/* harmony import */ var react_loading__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_loading__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_icons_ai__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-icons/ai */ "./node_modules/react-icons/ai/index.esm.js");
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @material-ui/core */ "webpack/sharing/consume/default/@material-ui/core/@material-ui/core");
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _ankusCommon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../ankusCommon */ "./lib/ankusCommon.js");
/* harmony import */ var _style_standardterm_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../style/standardterm.css */ "./style/standardterm.css");










const headStyle = (0,typestyle__WEBPACK_IMPORTED_MODULE_3__.style)({
    width: '100%',
    height: '50px',
    fontSize: '17px'
});
const btnContainerStyle = (0,typestyle__WEBPACK_IMPORTED_MODULE_3__.style)({
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '7px'
});
const invalidListStyle = (0,typestyle__WEBPACK_IMPORTED_MODULE_3__.style)({
    color: 'gray',
    fontWeight: 600,
    fontSize: '15px',
    textAlign: 'center'
});
class StandardTermSetting extends _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_2__.ReactWidget {
    constructor(word) {
        super();
        this._category = _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.stdtermCategory; //initial value : default category
        //    this._catRef = React.createRef<HTMLInputElement>();
        this._word = word;
        //category list changed
        /* StandardTermPart.categoryLoadSignal().connect(
          async (_, cats: StandardTermPart.Category[]) => {
            console.log('category load signal - setting');
    
            this._categories = [...cats];
            this.update();
            
          }
        ); */
    }
    setSelection(word, cat) {
        this._word = word;
        this._category = cat;
        this.update();
    }
    //  private _catRef: React.RefObject<HTMLInputElement>;
    /* private sortCat = () => {
      const cats = this.state.categories;
  
      cats.sort((a, b) => {
        const an = a.name.toUpperCase();
        const bn = b.name.toUpperCase();
  
        if (an < bn) {
          return -1;
        }
        if (an > bn) {
          return 1;
        }
        return 0;
      });
      this.setState({ categories: cats });
    }; */
    //const input = this._catRef.current?.lastChild
    //?.firstChild as HTMLInputElement;
    //(this._catRef.current?.lastChild?.firstChild as HTMLInputElement).value =
    //value;
    render() {
        return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(CategoryBar, { word: this._word, cat: this._category });
    }
}
//delete button in text field
const txtfldDeleteButton = (disable, click) => {
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.IconButton, { className: "del-btn", size: "small", onClick: click, style: {
            width: '18px',
            marginLeft: '5px',
            color: 'var(--jp-ui-font-color1)',
            border: 'none'
        }, disabled: disable, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_icons_ai__WEBPACK_IMPORTED_MODULE_8__.AiOutlineClose, {}) }));
};
class CategoryBar extends (react__WEBPACK_IMPORTED_MODULE_1___default().Component) {
    constructor(props) {
        super(props);
        this.listRef = react__WEBPACK_IMPORTED_MODULE_1___default().createRef();
        this.loadCategories = async () => {
            this.setState({ loading: true });
            try {
                const cats = await _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.StandardTermPart.loadCategories();
                this.setState({ categories: cats });
            }
            catch (e) {
                this.setState({ categories: undefined });
            }
            this.setState({ loading: false });
        };
        this.scrollToListitem = (value) => {
            if (this.listRef.current) {
                //목록에서 카테고리 찾으면, 스크롤 위치 조정
                for (const item of this.listRef.current.children) {
                    if (item.textContent === value) {
                        item.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        break;
                    }
                }
            }
        };
        //add category
        this.onAdd = async () => {
            const name = this.state.inputVal.trim();
            const prevsel = this.state.selected;
            if (this.state.categories) {
                //동일한 이름 확인
                const found = this.state.categories.find(cat => cat.name === name);
                if (found !== undefined) {
                    //change category
                    if (prevsel !== found.id) {
                        //select category
                        this.setState({ selected: found.id });
                        this.loadWords(found.id, this.state.searchKeyword);
                    }
                    //scroll list
                    this.scrollToListitem(found.name);
                    return;
                } //if : check same name
            }
            const cats = await _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.StandardTermPart.addCategory(name, true);
            this.setState({ categories: cats });
            const fnd = cats.find(cat => cat.name === name);
            if (fnd !== undefined) {
                this.setState({ selected: fnd.id });
                this.setState({ wordlist: [] });
                this.scrollToListitem(fnd.name);
            }
        }; //add
        //delete category
        this.onDelete = async (id) => {
            //alert
            if (confirm('Delete this category and terms belonging to it?')) {
                const cats = await _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.StandardTermPart.delCategory(id, true);
                this.setState({ categories: cats });
                //선택 카테고리 삭제
                if (id === this.state.selected) {
                    this.setState({ selected: 0 });
                }
            }
        }; //delete
        this.onUpdate = async () => {
            //none selected
            if (this.state.selected === 0) {
                return;
            }
            const name = this.state.inputVal.trim();
            if (this.state.categories) {
                //동일한 이름 확인
                const found = this.state.categories.find(cat => cat.name === name);
                if (found !== undefined) {
                    //no change
                    if (found.id === this.state.selected) {
                        return;
                    }
                    //select category
                    this.setState({ selected: found.id });
                    //scroll list
                    this.scrollToListitem(found.name);
                    //load word list
                    this.loadWords(found.id, this.state.searchKeyword);
                    return;
                } //if : check name
            }
            const cats = await _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.StandardTermPart.updateCategory(this.state.selected, name, true);
            this.setState({ categories: cats });
            //scroll list
            this.scrollToListitem(name);
        }; //update category
        this.loadWords = async (catid, keyword) => {
            //check category
            if (catid !== 0) {
                this.setState({ loadingWords: true });
                try {
                    this.setState({
                        wordlist: await _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.StandardTermPart.searchWords(_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.StandardTermPart.Field.engName, keyword, _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.StandardTermPart.Field.engName, true, catid)
                    });
                }
                catch (e) {
                    this.setState({ wordlist: undefined });
                }
                this.setState({ loadingWords: false });
            }
            //no category -> no word list
            else {
                this.setState({ wordlist: [] });
            }
        }; //load words
        this.onRequestReloadWords = async (search) => {
            this.setState({ searchKeyword: search });
            this.loadWords(this.state.selected, search);
        };
        this.openCategorySelectDlg = () => {
            this.setState({ openCatdlg: true });
        };
        this.categorySelectDialog = () => {
            return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.Dialog, { onClose: e => this.setState({ openCatdlg: false }), open: this.state.openCatdlg, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.DialogTitle, { children: "Select Category" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.DialogContent, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.FormControl, { fullWidth: true, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.InputLabel, { id: "ankus-move-cat-input-label", children: "Category" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.Select, { value: this.state.catdlgSel, labelId: "ankus-move-cat-input-label", style: { minWidth: '300px' }, label: "Category", onChange: e => this.setState({ catdlgSel: e.target.value }), children: this.state.categories === undefined
                                        ? ''
                                        : this.state.categories.map(cat => cat.id !== this.state.selected ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.MenuItem, { value: cat.id, children: cat.name }, cat.id)) : null) })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.DialogActions, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.Button, { disabled: this.state.categories === undefined ||
                                    this.state.categories.length < 2, onClick: () => this.onClickCategoryPopupOk(), children: "Ok" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.Button, { onClick: e => this.setState({ openCatdlg: false }), children: "Cancel" })] })] }));
        }; //categorySelectDialog
        this.onClickCategoryPopupOk = () => {
            this.setState({ openCatdlg: false });
            const found = this.state.categories.find(cat => cat.id === Number(this.state.catdlgSel));
            if (found !== undefined) {
                this.setState({ selected: found.id });
                this.scrollToListitem(found.name);
                this.setState({ inputVal: found.name });
                //카테고리 선택 알림
                this.setState({ catdlgSeq: this.state.catdlgSeq + 1 });
            }
        };
        //click category
        this.onClickListitem = (cat) => {
            //no change
            if (cat.id === this.state.selected) {
                return;
            }
            //select category
            this.setState({ selected: cat.id });
            this.setState({ inputVal: cat.name });
            this.loadWords(cat.id, this.state.searchKeyword);
        }; //click category
        this.deleteCatName = () => {
            this.setState({ inputVal: '' });
        };
        this.categoryListitem = () => {
            return this.state.categories === undefined ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: invalidListStyle, style: {
                    margin: '0 10px 15px 15px',
                    paddingTop: '20px',
                    height: 'calc(100% - 185px)',
                    width: 'calc(100% - 25px)',
                    border: '1px solid #D3D3D3'
                }, children: "unavailable" })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: {
                    height: 'calc(100% - 155px)',
                    padding: '0'
                }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.List, { dense: true, className: "ankus-term-setting-catlist", style: { padding: '0', height: '100%' }, ref: this.listRef, children: this.state.categories.map(cat => {
                        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.ListItem, { button: true, selected: this.state.selected === cat.id, onClick: e => this.onClickListitem(cat), children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.ListItemText, { primary: cat.name }), _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.userIsAdmin ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.ListItemSecondaryAction, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.IconButton, { edge: "end", "aria-label": "delete", title: "Delete Category", size: "small", onClick: () => this.onDelete(cat.id), children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_icons_ai__WEBPACK_IMPORTED_MODULE_8__.AiFillDelete, { color: this.state.selected === cat.id
                                                ? 'var(--jp-ui-inverse-font-color1)'
                                                : 'var(--jp-ui-font-color1)' }) }) })) : ('')] }, cat.id)); //return
                    }) }) })
            //카테고리 목록
            ); //return
        }; //categoryListitem
        this.__containerStyle = (0,typestyle__WEBPACK_IMPORTED_MODULE_3__.style)({
            color: 'var(--jp-ui-font-color1)',
            height: '100%',
            margin: '0'
        });
        this.inputCategoryIsValid = () => {
            return this.state.inputVal.trim().length > 0;
        };
        this.updateCategoryIsEnable = () => {
            return this.inputCategoryIsValid() && this.state.selected !== undefined;
        };
        this.state = {
            inputVal: '',
            //search keyword
            searchKeyword: '',
            loading: false,
            //select category
            selected: props.cat,
            categories: undefined,
            loadingWords: false,
            wordlist: [],
            //category select dialog
            openCatdlg: false,
            catdlgSel: '',
            //카테고리 선택에 따른 일련번호
            catdlgSeq: 0
        }; //state
    } //constructor
    componentDidMount() {
        this.loadCategories();
        this.loadWords(this.props.cat, '');
    }
    render() {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_9__["default"], { container: true, spacing: 1, className: this.__containerStyle, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_9__["default"], { item: true, xs: 5, style: { display: 'flex', height: '100%' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: { width: '100%', height: '100%', padding: '0 10px 0 15px' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: headStyle, style: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'end'
                                    }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { style: { padding: '0 0 5px 5px' }, children: "Categories" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.IconButton, { title: "Refresh category list", disabled: this.state.loading, onClick: async () => this.loadCategories(), children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_icons_ai__WEBPACK_IMPORTED_MODULE_8__.AiOutlineReload, { color: "var(--jp-ui-font-color1)", style: {
                                                    width: '15px',
                                                    height: '15px',
                                                    margin: '0',
                                                    padding: '0'
                                                } }) })] }), this.state.loading ? (
                                //category loading image
                                (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ankus-loading-container", style: {
                                        height: 'calc(100% - 155px)'
                                    }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)((react_loading__WEBPACK_IMPORTED_MODULE_4___default()), { type: "spin", color: "var(--jp-brand-color1)", height: "50px", width: "50px" }) })) : (
                                //category list
                                this.categoryListitem()), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("br", {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ankus-term-setting-input", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { 
                                            /* ref={this._catRef} */
                                            title: "Enter category name (max 50 characters)", maxLength: 50, placeholder: "Category Name", value: this.state.inputVal, onChange: e => {
                                                this.setState({ inputVal: e.target.value });
                                            } }), txtfldDeleteButton(this.state.inputVal.length < 1, this.deleteCatName)] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: btnContainerStyle, style: { marginTop: '13px' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.Button, { title: "Add Category", size: "small", variant: "outlined", 
                                            //color="primary"
                                            disabled: !this.inputCategoryIsValid(), onClick: e => this.onAdd(), style: {
                                                color: 'white',
                                                backgroundColor: this.inputCategoryIsValid()
                                                    ? 'var(--ankus-control-color)'
                                                    : 'var(--ankus-disable-color)'
                                            }, children: "Add" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.Button, { title: "Update Category", size: "small", variant: "outlined", 
                                            //color="primary"
                                            disabled: !this.updateCategoryIsEnable(), onClick: e => this.onUpdate(), style: {
                                                marginLeft: '10px',
                                                color: 'white',
                                                backgroundColor: this.updateCategoryIsEnable()
                                                    ? 'var(--ankus-control-color)'
                                                    : 'var(--ankus-disable-color)'
                                            }, children: "Update" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.Divider, { orientation: "vertical", variant: "middle", flexItem: true, style: { margin: '8px 0 0 0' } })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_material_ui_core_Grid__WEBPACK_IMPORTED_MODULE_9__["default"], { item: true, xs: 7, style: { height: '100%' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(WordPage, { loading: this.state.loadingWords, words: this.state.wordlist, refreshWords: this.onRequestReloadWords, category: this.state.selected, initVal: this.props.word, openCategorySelectDialog: this.openCategorySelectDlg, catseldlgOk: this.state.catdlgSeq, categoryList: this.state.categories }), this.categorySelectDialog()] })] }));
    }
}
const WordPage = (props) => {
    const { initVal, category, words, refreshWords } = props;
    //name
    const [name, setName] = react__WEBPACK_IMPORTED_MODULE_1___default().useState((initVal === null || initVal === void 0 ? void 0 : initVal.name) ? initVal.name : '');
    //english name
    const [engName, setEngName] = react__WEBPACK_IMPORTED_MODULE_1___default().useState((initVal === null || initVal === void 0 ? void 0 : initVal.engName) ? initVal.engName : '');
    //english full name
    const [engFullname, setEngFullname] = react__WEBPACK_IMPORTED_MODULE_1___default().useState((initVal === null || initVal === void 0 ? void 0 : initVal.engDesc) ? initVal.engDesc : '');
    //description
    const [desc, setDesc] = react__WEBPACK_IMPORTED_MODULE_1___default().useState((initVal === null || initVal === void 0 ? void 0 : initVal.desc) ? initVal.desc : '');
    //select word
    const [selected, selectWord] = react__WEBPACK_IMPORTED_MODULE_1___default().useState(undefined);
    /* new Array<boolean>(props.words.length) */
    //search keyword
    const [searchKeyword, setSearchKeyword] = react__WEBPACK_IMPORTED_MODULE_1___default().useState('');
    //check change
    const [dirty, setDirty] = react__WEBPACK_IMPORTED_MODULE_1___default().useState(false);
    //search detail
    const [searchingTerm, setSearchTerm] = react__WEBPACK_IMPORTED_MODULE_1___default().useState(false);
    //show import info
    const [importInfo, showImportInfo] = react__WEBPACK_IMPORTED_MODULE_1___default().useState(false);
    //check word
    const [checked, setWordChecked] = react__WEBPACK_IMPORTED_MODULE_1___default().useState([]);
    //check all word
    const [allChecked, setAllChecked] = react__WEBPACK_IMPORTED_MODULE_1___default().useState(false);
    const ABBR_RULE = /^[a-zA-Z0-9-_.]*$/;
    const listRef = react__WEBPACK_IMPORTED_MODULE_1___default().createRef();
    const fileRef = react__WEBPACK_IMPORTED_MODULE_1___default().createRef();
    const infoStyle = (0,typestyle__WEBPACK_IMPORTED_MODULE_3__.style)({
        position: 'absolute',
        left: 'calc(100% - 400px)',
        width: '380px',
        height: '95px',
        padding: '5px',
        fontSize: '12px',
        display: importInfo ? 'block' : 'none',
        backgroundColor: 'var(--jp-layout-color2)',
        border: '1px solid var(--jp-border-color1)',
        //boxShadow: '1px 1px 5px 0px',
        zIndex: '999'
    });
    //change detail
    react__WEBPACK_IMPORTED_MODULE_1___default().useEffect(() => {
        (async () => {
            setName((initVal === null || initVal === void 0 ? void 0 : initVal.name) ? initVal.name : '');
            setEngName((initVal === null || initVal === void 0 ? void 0 : initVal.engName) ? initVal.engName : '');
            setEngFullname((initVal === null || initVal === void 0 ? void 0 : initVal.engDesc) ? initVal.engDesc : '');
            setDesc((initVal === null || initVal === void 0 ? void 0 : initVal.desc) ? initVal.desc : '');
        })();
    }, [props.initVal]);
    //select category for copy
    react__WEBPACK_IMPORTED_MODULE_1___default().useEffect(() => {
        (async () => {
            if (props.catseldlgOk > 0) {
                copyTo();
            }
        })();
    }, [props.catseldlgOk]);
    //change category
    react__WEBPACK_IMPORTED_MODULE_1___default().useEffect(() => {
        (async () => {
            //init check box
            setWordChecked([]);
            //uncheck all
            setAllChecked(false);
            //none selected
            selectWord(undefined);
            //init dirty
            setDirty(false);
        })();
    }, [props.category]);
    //change word list
    react__WEBPACK_IMPORTED_MODULE_1___default().useEffect(() => {
        (async () => {
            if (props.words !== undefined && selected !== undefined) {
                //check id or name
                const found = props.words.find(w => w.nameId === selected.nameId || w.name === selected.name);
                //selection
                selectWord(found);
                return;
            } //if : valid selection
            selectWord(undefined);
        })();
    }, [props.words]);
    const updateWord = async () => {
        if (selected === undefined) {
            return;
        }
        if (!confirm('Update "' + selected.name + '"?')) {
            return;
        }
        fetch(_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.ankusURL +
            '/standard-term/update-term?token=' +
            encodeURIComponent(_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.loginToken), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nameId: selected.nameId,
                wordId: selected.wordId,
                name: name.trim(),
                engName: engName.trim(),
                desc: desc.trim(),
                engDesc: engFullname.trim(),
                category: category
            })
        })
            .then(response => {
            if (response.ok) {
                //init dirty
                setDirty(false);
                //refresh terms
                refreshWords(searchKeyword);
            }
            else {
                throw new Error('Error Response');
            }
        })
            .catch(error => {
            console.log('Failed to edit Category');
        });
    }; //update word
    const onSelectWord = (word) => {
        selectWord(word);
        setName(word.name);
        setEngFullname(word.engDesc ? word.engDesc : '');
        setEngName(word.engName);
        setDesc(word.desc ? word.desc : '');
    };
    const clickImport = (e) => {
        fileRef.current.click();
    };
    const importFile = (e) => {
        //e.preventDefault();
        const fd = new FormData();
        fd.append('file', e.target.files[0]);
        fetch(_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.ankusURL +
            '/standard-term/import?category=' +
            props.category +
            '&token=' +
            encodeURIComponent(_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.loginToken), {
            method: 'POST',
            //headers: {
            //'Content-Type': 'multipart/form-data'
            //},
            body: fd
        })
            .then(response => {
            if (response.ok) {
                //refresh term list
                refreshWords(searchKeyword);
            }
        })
            .catch(error => {
            throw new Error('Failed to import file');
        });
    }; //importFile
    const onDeleteWord = async () => {
        if (confirm('Delete checked terms?')) {
            const idlist = checked.map(w => w.nameId);
            fetch(_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.ankusURL +
                '/standard-term/delete-term?token=' +
                encodeURIComponent(_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.loginToken), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(idlist)
            })
                .then(response => {
                if (response.ok) {
                    //init check box
                    setWordChecked([]);
                    //uncheck all
                    setAllChecked(false);
                    //selected term is deleted
                    if (selected !== undefined &&
                        idlist.find(wd => wd === selected.nameId)) {
                        //none selected
                        selectWord(undefined);
                        //init dirty
                        setDirty(false);
                    }
                    //refresh terms
                    refreshWords(searchKeyword);
                }
                else {
                    throw new Error('Error Response');
                }
            })
                .catch(error => {
                throw new Error('Failed to delete word');
            });
        } //if : confirm
    }; //delete word
    const copyTo = async () => {
        await saveWords(words.filter(w => checked.find(chk => w.nameId === chk.nameId && w.wordId === chk.wordId)));
        //init keyword
        setSearchKeyword('');
        //clear name
        setName('');
        //clear english name
        setEngName('');
        //clear english full name
        setEngFullname('');
        //clear description
        setDesc('');
        refreshWords('');
    };
    //add term
    const onClickAdd = async () => {
        //init dirty
        setDirty(false);
        const word = {
            name: name.trim(),
            engName: engName.trim(),
            desc: desc.trim(),
            engDesc: engFullname.trim(),
            category: category
        };
        await fetch(_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.ankusURL +
            '/standard-term/add-term?token=' +
            encodeURIComponent(_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.loginToken), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(word)
        })
            .then(response => {
            if (response.ok) {
                return response.json();
            }
            else if (response.status === 409) {
                //conflict
                alert('The same term name exists');
                throw new Error('Term exists');
            }
            else {
                throw new Error('Error Response');
            }
        })
            .then(response => {
            const wrd = response;
            //select new
            selectWord(wrd);
            //응답 내용은, name id, word id, name, category id
            //show detail
            /* setName(wrd.name!);
            setEngName(wrd.engName!);
            setEngFullname(wrd.engDesc!);
            setDesc(wrd.desc!); */
        })
            .catch(error => {
            throw new Error('Failed to add term');
        });
        //refresh term list
        refreshWords(searchKeyword);
        //scroll list
        scrollToListitem(word.name);
    }; // click add
    const saveWords = async (wdlst) => {
        fetch(_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.ankusURL +
            '/standard-term/save-term?token=' +
            encodeURIComponent(_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.loginToken) +
            '&category=' +
            category, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(wdlst)
        })
            .then(response => {
            if (response.ok) {
                return;
            }
            else {
                throw new Error('Error Response');
            }
        })
            .catch(error => {
            throw new Error('Failed to add word');
        });
    }; //save word list
    const checkAll = (check) => {
        setAllChecked(check);
        //setWordChecked(new Array<boolean>(words.length).fill(check));
        if (check) {
            setWordChecked(words);
        }
        else {
            setWordChecked([]);
        }
    };
    const onCheckListitem = async (event, word) => {
        const lst = [...checked];
        //lst[index] = event.target.checked;
        if (event.target.checked) {
            lst.push(word);
        }
        else {
            const i = lst.indexOf(word);
            lst.splice(i, 1);
        }
        setWordChecked(lst);
    }; //check word
    //delete keyword
    const deleteSearchKeyword = () => {
        setSearchKeyword('');
        //init check box
        setWordChecked([]);
        //uncheck all
        setAllChecked(false);
        //none selected
        selectWord(undefined);
        refreshWords('');
    };
    //change keyword
    const changeSearchKeyword = (evt) => {
        if (evt.target.value.search(ABBR_RULE) !== -1) {
            //keyword
            setSearchKeyword(evt.target.value);
            //init check box
            setWordChecked([]);
            //uncheck all
            setAllChecked(false);
            //none selected
            selectWord(undefined);
            //load word list
            refreshWords(evt.target.value);
        }
    };
    //key down-abbr
    const keydownAbbr = (evt) => {
        if (evt.key.length === 1 && evt.key.search(ABBR_RULE) === -1) {
            evt.preventDefault();
        }
    };
    const deleteName = () => {
        setName('');
    };
    const deleteEngName = () => {
        setEngName('');
    };
    const deleteEngDesc = () => {
        setEngFullname('');
    };
    const deleteDesc = () => {
        setDesc('');
    };
    /*   const engKey = (evt: React.KeyboardEvent) => {
      if (evt.key.length === 1) {
        //alphabet, -, _, .
        const engRule = /[a-zA-Z0-9.-_]+/g;
  
        if (!engRule.test(evt.key)) {
          evt.preventDefault();
        }
      }
    }; */
    //change abbr
    const changeEngName = (evt) => {
        if (evt.target.value.search(ABBR_RULE) !== -1) {
            setEngName(evt.target.value);
            setDirty(true);
        }
    };
    const loadWordOfName = async (name) => {
        //searching state
        setSearchTerm(true);
        //find term
        const res = await fetch(_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.ankusURL +
            '/standard-term/find-name?token=' +
            encodeURIComponent(_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.loginToken) +
            '&name=' +
            encodeURIComponent(name) +
            '&category=' +
            category)
            .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error('Response Error');
            }
        })
            .then(json => {
            const trm = {
                nameId: json['nameId'],
                wordId: json['wordId'],
                name: json['name'],
                engName: json['engName'],
                category: json['category'],
                desc: json['desc'],
                engDesc: json['engDesc']
            };
            setEngName(trm.engName);
            setEngFullname(trm.engDesc);
            setDesc(trm.desc);
            return trm;
        })
            .catch(error => {
            //no searching state
            setSearchTerm(false);
            //검색된 용어가 없을 때도, 여기서 오류 발생
            throw new Error('Search Dictionary Error');
        });
        //no searching state
        setSearchTerm(false);
        //return term
        return res;
    }; //findWordOfName
    const loadWordOfEng = async (eng) => {
        setSearchTerm(true);
        const res = await fetch(_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.ankusURL +
            '/standard-term/find-abbr?token=' +
            encodeURIComponent(_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.loginToken) +
            '&engName=' +
            encodeURIComponent(eng) +
            '&category=' +
            category)
            .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error('Response Error');
            }
        })
            .then(json => {
            const trm = {
                nameId: json['nameId'],
                wordId: json['wordId'],
                name: json['name'],
                engName: json['engName'],
                category: json['category'],
                desc: json['desc'],
                engDesc: json['engDesc']
            };
            setEngFullname(trm.engDesc);
            setDesc(trm.desc);
            return trm;
        })
            .catch(error => {
            setSearchTerm(false);
            throw new Error('Search Dictionary Error');
        });
        setSearchTerm(false);
        return res;
    }; //findWordOfEng
    const scrollToListitem = (value) => {
        var _a;
        if (listRef.current) {
            //목록에서 용어명 찾으면, 스크롤 위치 조정
            for (const item of listRef.current.children) {
                if ((_a = item.textContent) === null || _a === void 0 ? void 0 : _a.endsWith('(' + value + ')')) {
                    item.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    break;
                }
            } //for : list item
        } //if : check list
    }; //scroll list
    const wordListitem = () => {
        return words === undefined ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: invalidListStyle, style: {
                margin: 0,
                height: 'calc(100% - 394px)',
                width: 'calc(100% - 25px)',
                border: '1px solid #D3D3D3',
                paddingTop: '20px'
            }, children: "unavailable" })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.List, { className: "ankus-dict-tm-list", dense: true, ref: listRef, style: {
                margin: 0,
                padding: '2px',
                height: 'calc(100% - 376px)',
                overflow: 'auto',
                width: 'calc(100% - 25px)',
                border: '1px solid var(--jp-border-color1)',
                backgroundColor: 'var(--jp-layout-color1)'
            }, children: words.map((word, index) => {
                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.ListItem, { button: true, selected: (selected === null || selected === void 0 ? void 0 : selected.nameId) === word.nameId, onClick: e => onSelectWord(word), style: {
                        padding: '4px 7px 4px 7px',
                        height: '22px',
                        backgroundColor: (selected === null || selected === void 0 ? void 0 : selected.nameId) === word.nameId
                            ? 'var(--jp-brand-color1)'
                            : 'transparent'
                    }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "checkbox", checked: checked.includes(word), onChange: async (e) => onCheckListitem(e, word), style: { margin: '0 10px 0 5px' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.ListItemText, { primary: word.engName + ' (' + word.name + ')', primaryTypographyProps: {
                                style: {
                                    fontSize: '0.8rem',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis'
                                }
                            } })] }, index)); //return
            }) })); //return
    }; //wordListitem
    //import info
    const drawImportInfo = () => {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: infoStyle, children: ["Only CSV files(UTF-8) are imported. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("br", {}), " ", '•', " First row is header.", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("br", {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { style: { color: 'var(--jp-ui-font-color2)', fontWeight: '800' }, children: ["\u00A0\u00A0\u00A0", ' » ', "name, abbreviation(english), english full name, description"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("br", {}), '•', " Bellow is an example of file.", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("br", {}), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { style: {
                        color: 'var(--jp-info-color0)',
                        fontWeight: '800',
                        position: 'relative',
                        left: '80px',
                        top: '5px'
                    }, children: ["name, abbreviation, english, description", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("br", {}), "\uC6A9\uC5B4\uBA85, NM, term name, \uC6A9\uC5B4 \uC124\uBA85"] })] }));
    }; //drawImportInfo
    const disableRefresh = () => {
        return props.loading || props.category === 0;
    };
    const disableCopy = () => {
        return (checked.length < 1 ||
            props.categoryList === undefined ||
            props.categoryList.length < 2);
    };
    const disableCheck = () => {
        return words ? words.length < 1 : true;
    };
    const disableUpdate = () => {
        return (selected === undefined || //no selection
            !dirty || //not modified
            !fulfillRequired() //필수항목 미기입
        );
    };
    const fulfillRequired = () => {
        return (name.trim().length > 0 && //name
            engName.trim().length > 0 //english name
        );
    };
    const disableFindAbbr = () => {
        return searchingTerm || engName.trim().length < 1;
    };
    const disableFindName = () => {
        return searchingTerm || name.trim().length < 1;
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: { width: '100%', height: '100%' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: headStyle, style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: 'calc(100% - 5px)'
                }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ankus-term-setting-input", style: { height: '30px', marginTop: '12px' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { 
                                /* ref={this._catRef} */
                                title: "Enter english abbreviation", maxLength: 50, placeholder: "Search Term", value: searchKeyword, onChange: changeSearchKeyword, onKeyDown: keydownAbbr }), txtfldDeleteButton(searchKeyword.length < 1, deleteSearchKeyword)] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.IconButton, { title: "Refresh term list", style: { margin: '10px 10px 0 0' }, disabled: disableRefresh(), onClick: async () => refreshWords(searchKeyword), children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_icons_ai__WEBPACK_IMPORTED_MODULE_8__.AiOutlineReload, { style: {
                                width: '15px',
                                height: '15px',
                                margin: '0',
                                padding: '0',
                                color: disableRefresh()
                                    ? 'var(--ankus-disable-color)'
                                    : 'var(--jp-ui-font-color1)'
                            } }) })] }), props.loading ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "ankus-loading-container", style: {
                    height: 'calc(100% - 370px)'
                }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)((react_loading__WEBPACK_IMPORTED_MODULE_4___default()), { type: "spin", color: "#1E90FF", height: '50px', width: '50px' }) })) : (wordListitem()), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    margin: '8px 20px 0 7px'
                }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: { width: '100px' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.Checkbox, { id: "ankus-dict-chkall-term", checked: allChecked, color: "primary", size: "small", disabled: disableCheck(), style: {
                                    padding: '0 0 0 5px',
                                    color: disableCheck()
                                        ? 'var(--ankus-disable-color)'
                                        : 'var(--jp-brand-color1)'
                                }, onClick: e => checkAll(!allChecked) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { htmlFor: "ankus-dict-chkall-term", style: {
                                    cursor: disableCheck() ? 'auto' : 'pointer',
                                    color: disableCheck()
                                        ? 'var(--ankus-disable-color)'
                                        : 'var(--jp-ui-font-color1)'
                                }, children: "Check All" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: { width: '230px' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.Button, { variant: "outlined", size: "small", title: "Delete checked terms", style: {
                                    padding: 0,
                                    backgroundColor: checked.length < 1
                                        ? 'var(--ankus-disable-color)'
                                        : 'var(--ankus-control-color)',
                                    color: 'white',
                                    fontSize: '12px'
                                }, disabled: checked.length < 1, onClick: async () => onDeleteWord(), children: "Delete" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.Button, { variant: "outlined", size: "small", title: "Copy checked terms to a category", style: {
                                    margin: '0 5px',
                                    padding: 0,
                                    backgroundColor: disableCopy()
                                        ? 'var(--ankus-disable-color)'
                                        : 'var(--ankus-control-color)',
                                    color: 'white',
                                    fontSize: '12px'
                                }, disabled: disableCopy(), onClick: () => props.openCategorySelectDialog(), children: "Copy To" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "file", name: "file", ref: fileRef, accept: ".csv", onChange: importFile, style: { display: 'none' } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.Button, { variant: "outlined", size: "small", title: "Import CSV file", type: "submit", style: {
                                    marginRight: '5px',
                                    padding: 0,
                                    backgroundColor: props.category === 0
                                        ? 'var(--ankus-disable-color)'
                                        : 'var(--ankus-control-color)',
                                    color: 'white',
                                    fontSize: '12px'
                                }, disabled: props.category === 0, onClick: clickImport, children: "Import" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_icons_ai__WEBPACK_IMPORTED_MODULE_8__.AiOutlineInfoCircle, { style: {
                                        color: 'var(--jp-info-color0)',
                                        width: '15px',
                                        height: '15px'
                                    }, onMouseOver: e => showImportInfo(true), onMouseLeave: e => showImportInfo(false) }) }), drawImportInfo()] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: { width: 'calc(100%-5px)', margin: '23px 3px 0 0' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "align-vt-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ankus-term-setting-input", style: { width: 'calc(100% - 50px)' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { 
                                        /* ref={this._catRef} */
                                        title: "Enter term name (max 50 characters)", maxLength: 50, placeholder: "Term Name", value: name, onChange: e => {
                                            setName(e.target.value.replace(' ', ''));
                                            setDirty(true);
                                        }, onKeyDown: e => {
                                            if (e.key === ' ') {
                                                e.preventDefault();
                                            }
                                        }, style: { fontSize: 14 } }), txtfldDeleteButton(name.length < 1, deleteName)] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.IconButton, { title: "Find Term", size: "small", onClick: async () => loadWordOfName(name), style: { marginLeft: '5px' }, disabled: disableFindName(), children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_icons_ai__WEBPACK_IMPORTED_MODULE_8__.AiOutlineSearch, { style: {
                                        color: disableFindName()
                                            ? 'var(--ankus-disable-color)'
                                            : 'var(--jp-ui-font-color1)'
                                    } }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "align-vt-center", style: { padding: '10px 0' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ankus-term-setting-input", style: { width: 'calc(100% - 50px)' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { 
                                        /* ref={this._catRef} */
                                        title: "Enter english abbreviation (max 50 characters)", maxLength: 50, placeholder: "English Abbreviation", value: engName, onChange: changeEngName, onKeyDown: keydownAbbr, style: { fontSize: 14 } }), txtfldDeleteButton(engName.length < 1, deleteEngName)] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.IconButton, { title: "Find Term", size: "small", onClick: async () => loadWordOfEng(engName), style: { marginLeft: '5px' }, disabled: disableFindAbbr(), children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_icons_ai__WEBPACK_IMPORTED_MODULE_8__.AiOutlineSearch, { style: {
                                        color: disableFindAbbr()
                                            ? 'var(--ankus-disable-color)'
                                            : 'var(--jp-ui-font-color1)'
                                    } }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ankus-term-setting-input", style: { width: 'calc(100% - 17px)' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { 
                                /* ref={this._catRef} */
                                title: "Enter english full name (max 200 characters)", maxLength: 200, placeholder: "English Full Name", value: engFullname, onChange: e => {
                                    setEngFullname(e.target.value);
                                    setDirty(true);
                                }, style: { fontSize: 14, height: '30px' } }), txtfldDeleteButton(engFullname.length < 1, deleteEngDesc)] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "ankus-term-setting-input align-vt-center", style: { width: 'calc(100% - 17px)', margin: '10px 0 13px 0' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("textarea", { placeholder: "Description", title: "Enter description (max 300 characters)", onChange: e => {
                                    setDesc(e.target.value);
                                    setDirty(true);
                                }, maxLength: 300, style: {
                                    fontSize: 15,
                                    fontFamily: 'Noto Sans',
                                    width: 'calc(100% - 30px)',
                                    height: '68px',
                                    padding: '4px 2px',
                                    color: 'var(--jp-ui-font-color0)',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    resize: 'none'
                                }, value: desc }), txtfldDeleteButton(desc.length < 1, deleteDesc)] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: btnContainerStyle, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.Button, { "aria-label": "add", title: "Add Term", size: "small", variant: "outlined", color: "primary", style: {
                            color: 'white',
                            backgroundColor: fulfillRequired()
                                ? 'var(--ankus-control-color)'
                                : 'var(--ankus-disable-color)'
                        }, disabled: !fulfillRequired(), onClick: async () => onClickAdd(), children: "Add" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__.Button, { title: "Update Term", size: "small", variant: "outlined", color: "primary", style: {
                            margin: '0 18px 0 10px',
                            color: 'white',
                            backgroundColor: disableUpdate()
                                ? 'var(--ankus-disable-color)'
                                : 'var(--ankus-control-color)'
                        }, disabled: disableUpdate(), onClick: async (e) => updateWord(), children: "Update" })] })] }));
};


/***/ }),

/***/ "./lib/component/statusbar.js":
/*!************************************!*\
  !*** ./lib/component/statusbar.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AnkusStatusbar: () => (/* binding */ AnkusStatusbar)
/* harmony export */ });
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ankusCommon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ankusCommon */ "./lib/ankusCommon.js");


class AnkusStatusbar {
    constructor() {
        this._onUpdate = (sender, change) => {
            this.item.node.innerHTML = `작성자: ${change.writer}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;최종 작성일: ${_ankusCommon__WEBPACK_IMPORTED_MODULE_1__.Ankus.dateToString(change.date)}`;
        };
        this.isActive = () => this._isActive;
        this.align = 'right';
        this.rank = 10;
        const node = document.createElement('div');
        node.className = 'ankus-statusbar';
        this.item = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_0__.Widget({ node });
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


/***/ }),

/***/ "./lib/doc/docModel.js":
/*!*****************************!*\
  !*** ./lib/doc/docModel.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AnkusDoc: () => (/* binding */ AnkusDoc),
/* harmony export */   AnkusDocModel: () => (/* binding */ AnkusDocModel),
/* harmony export */   CodeTag: () => (/* binding */ CodeTag)
/* harmony export */ });
/* harmony import */ var _jupyterlab_observables__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/observables */ "webpack/sharing/consume/default/@jupyterlab/observables");
/* harmony import */ var _jupyterlab_observables__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_observables__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyter_ydoc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyter/ydoc */ "webpack/sharing/consume/default/@jupyter/ydoc");
/* harmony import */ var _jupyter_ydoc__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyter_ydoc__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lumino_signaling__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @lumino/signaling */ "webpack/sharing/consume/default/@lumino/signaling");
/* harmony import */ var _lumino_signaling__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_lumino_signaling__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _ankusCommon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../ankusCommon */ "./lib/ankusCommon.js");




var TagState;
(function (TagState) {
    TagState[TagState["Normal"] = 0] = "Normal";
    TagState[TagState["New"] = 1] = "New";
    TagState[TagState["Delete"] = 2] = "Delete";
})(TagState || (TagState = {}));
class CodeTag {
    constructor(name, id) {
        this._state = TagState.Normal;
        this.name = '';
        this.name = name;
        this.id = id;
    }
    static newTag(name) {
        const tag = new CodeTag(name);
        tag._state = TagState.New;
        return tag;
    }
    get added() {
        return this._state === TagState.New;
    }
    get deleted() {
        return this._state === TagState.Delete;
    }
    setDeleted() {
        this._state = TagState.Delete;
    }
    setNormal() {
        this._state = TagState.Normal;
    }
} //CodeTag
class AnkusDocModel {
    constructor(languagePreference, modelDB) {
        this.readOnly = false;
        /**
         * New datastore introduced in JupyterLab v3.1 to store shared data and make notebooks
         * collaborative
         */
        this.sharedModel = AnkusDoc.create();
        this._onSharedModelChanged = (sender, changes) => {
            this._sharedModelChanged.emit(changes);
        };
        this._dirty = false;
        this._isDisposed = false;
        this._contentChanged = new _lumino_signaling__WEBPACK_IMPORTED_MODULE_2__.Signal(this);
        this._stateChanged = new _lumino_signaling__WEBPACK_IMPORTED_MODULE_2__.Signal(this);
        this._sharedModelChanged = new _lumino_signaling__WEBPACK_IMPORTED_MODULE_2__.Signal(this);
        this._saved = new _lumino_signaling__WEBPACK_IMPORTED_MODULE_2__.Signal(this);
        this.modelDB = modelDB || new _jupyterlab_observables__WEBPACK_IMPORTED_MODULE_0__.ModelDB();
        this.codeTag = [];
        this.sharedModel.changed.connect(this._onSharedModelChanged);
    }
    get contentChanged() {
        return this._contentChanged;
    }
    get stateChanged() {
        return this._stateChanged;
    }
    get dirty() {
        return this._dirty;
    }
    set dirty(value) {
        this._dirty = value;
    }
    toString() {
        throw new Error('Method not implemented.');
    }
    fromString(value) {
        throw new Error('Method not implemented.');
    }
    toJSON() {
        throw new Error('Method not implemented.');
    }
    fromJSON(value) {
        throw new Error('Method not implemented.');
    }
    initialize() {
        throw new Error('Method not implemented.');
    }
    get isDisposed() {
        return this._isDisposed;
    }
    dispose() {
        if (this._isDisposed) {
            return;
        }
        this._isDisposed = true;
        this.sharedModel.changed.disconnect(this._onSharedModelChanged);
        _lumino_signaling__WEBPACK_IMPORTED_MODULE_2__.Signal.clearData(this);
    }
    /*  getCodeObject(): CodeProperty {
      return {
        comment: this.sharedModel.getContent(CodePropertyName.comment),
        tag: this.sharedModel.getContent(CodePropertyName.tag),
        content: this.sharedModel.getContent(CodePropertyName.content),
        id: this.sharedModel.codeId,
        name: this.sharedModel.codeName,
        writer: this.sharedModel.writer,
        date: this.sharedModel.updateDate
      };
    } */
    setComment(comment) {
        this.sharedModel.setContent(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.comment, comment);
    }
    addTag(name) {
        /*     const regex = /[\s#]/g;
        if (name.search(regex) !== -1) {
          return false;
        }
     */
        const tags = this.codeTag;
        //const found = tags.find(tag => tag.name === name);
        //추가
        //if (found === undefined) {
        tags.push(CodeTag.newTag(name));
        this.sharedModel.setContent(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.tag, tags);
    }
    deleteTag(name) {
        const tags = this.codeTag;
        const found = tags.find(tag => tag.name === name);
        if (found !== undefined) {
            tags.splice(tags.indexOf(found), 1);
            this.sharedModel.setContent(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.tag, tags);
        }
    }
    updateTag(name, idx) {
        const tags = this.codeTag;
        tags[idx].name = name;
        this.sharedModel.setContent(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.tag, tags);
    }
    get comment() {
        return this.sharedModel.getContent(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.comment);
    }
    get codeContent() {
        return this.sharedModel.getContent(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.content);
    }
    set codeContent(content) {
        this.sharedModel.setContent(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.content, content);
    }
    get codeTag() {
        return this.sharedModel.getContent(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.tag);
    }
    set codeTag(list) {
        this.sharedModel.setContent(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.tag, list);
    }
    get sharedModelChanged() {
        return this._sharedModelChanged;
    }
    get saved() {
        return this._saved;
    }
    get codeId() {
        return this.sharedModel.getContent(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.id);
    }
    set codeId(value) {
        this.sharedModel.setContent(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.id, value);
    }
    get codeName() {
        return this.sharedModel.getContent(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.name);
    }
    set codeName(value) {
        this.sharedModel.setContent(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.name, value);
    }
    get writer() {
        return this.sharedModel.getContent(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.userName);
    }
    set writer(value) {
        this.sharedModel.setContent(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.userName, value);
    }
    get userNumber() {
        return this.sharedModel.getContent(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.userNo);
    }
    set userNumber(value) {
        this.sharedModel.setContent(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.userNo, value);
    }
    get updateDate() {
        return this.sharedModel.updateDate;
    }
    set updateDate(value) {
        this.sharedModel.updateDate = value;
    }
    /*   private commitTagDeletion(): void {
      const deltags: Array<number> = [];
      //삭제할 태그 아이디 목록
      this.codeTag.forEach(tag => {
        //check deletion
        if (tag.deleted && tag.id !== undefined) {
          deltags.push(tag.id);
        }
      });
  
      //삭제할 태그 있음
      if (deltags.length !== 0) {
        fetch(ANKUS_URL + '/share-code/delete-tag/' + this.codeId, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: Ankus.ankusPlugin.loginToken, //login token
            tags: deltags //삭제할 태그
          })
        })
          .then(response => {
            //response fail
            if (!response.ok) {
              throw new Error('fail');
            }
  
            const tags: Array<CodeTag> = [];
            //태그 목록에서, 삭제된 태그 제거
            this.codeTag.forEach(tag => {
              //check deletion tag
              if (!tag.deleted) {
                tags.push(tag);
              }
            });
  
            this.sharedModel.setContent(CodePropertyName.tag, tags);
            this.updateCode();
          })
          .catch(error => {
            alert('태그 저장 오류');
          }); //fetch
      } else {
        this.updateCode();
      }
    } //commitTagDeletion */
    updateCode() {
        const contents = this.codeContent.filter(value => {
            return value.source.trim().length !== 0;
        });
        const code = {};
        code[_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.name] = this.codeName; //code name
        code[_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.comment] = this.comment; //code comment
        code[_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.content] = contents; //code content
        //code[CodePropertyName.date] = this.updateDate;
        code[_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.userNo] = this.userNumber; //code writer(number)
        //tag list
        code[_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.tag] = this.codeTag.map((tag, index) => tag.name);
        //code id
        code[_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.id] = this.codeId;
        //update code
        fetch(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.Ankus.ankusURL + '/share-code/modify', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: _ankusCommon__WEBPACK_IMPORTED_MODULE_3__.Ankus.loginToken,
                code: code //code detail
            })
        })
            .then(response => {
            //response ok
            if (response.ok) {
                return response.json();
            }
            //response fail
            else {
                throw new Error('fail');
            }
        })
            .then(jsresp => {
            console.log('code updated');
            //update date
            this.updateDate = jsresp[_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.date];
            //reset dirty
            this.dirty = false;
            //saved signal
            this._saved.emit();
        })
            .catch(error => {
            alert('공유 코드 저장 오류');
        }); //fetch
    } //update code
    save() {
        //new code
        if (this.codeId === undefined) {
            const contents = this.codeContent.filter(value => {
                //빈 문자열 제외
                return value.source.trim().length !== 0;
            });
            const code = {};
            code[_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.name] = this.codeName; //code name
            code[_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.comment] = this.comment; //code comment
            code[_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.content] = contents; //code content
            //code[CodePropertyName.date] = this.updateDate;
            code[_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.userNo] = this.userNumber; //code writer(number)
            //tag list
            code[_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.tag] = this.codeTag.map((tag, index) => tag.name);
            fetch(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.Ankus.ankusURL + '/share-code/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: _ankusCommon__WEBPACK_IMPORTED_MODULE_3__.Ankus.loginToken,
                    code: code //code detail
                })
            })
                .then(response => {
                //response ok
                if (response.ok) {
                    return response.json();
                }
                //response fail
                else {
                    throw new Error('fail');
                }
            })
                .then(jsresp => {
                //code id
                this.codeId = jsresp[_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.id];
                //update date
                this.updateDate = jsresp[_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.date];
                //reset dirty
                this.dirty = false;
                //saved signal
                this._saved.emit();
            })
                .catch(error => {
                alert('공유 코드 저장 오류');
            }); //fetch
        } //if : new code
        //update code
        else {
            this.updateCode();
            //new tag exists
            /*       if (addtags.length > 0) {
              //add tag
              fetch(ANKUS_URL + '/share-code/add-tag/' + this.codeId, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  token: Ankus.ankusPlugin.loginToken, //login token
                  tags: addtags //tag name list
                })
              })
                .then(response => {
                  //response ok
                  if (response.ok) {
                    return response.json();
                  }
                  //response fail
                  else {
                    throw new Error('fail');
                  }
                })
                .then((response: Array<any>) => {
                  //new tag list
                  response.forEach(val => {
                    //find tag
                    const found = this.codeTag.find(tag => val.name === tag.name);
                    if (found !== undefined) {
                      //tag id
                      found.id = val.id;
                      //new tag -> normal tag
                      found.setNormal();
                    }
                  }); //new tag list
      
                  //delete tag
                  this.commitTagDeletion();
                })
                .catch(error => {
                  alert('태그 저장 오류');
                }); //fetch
            } //if : new tag exists
            else {
              //delete tag
              this.commitTagDeletion();
            } */
        } //update code
    } //save
}
class AnkusDoc extends _jupyter_ydoc__WEBPACK_IMPORTED_MODULE_1__.YDocument {
    constructor() {
        super();
        this.version = '1.0';
        /**
         * Handle a change.
         *
         * @param event Model event
         */
        this._contentObserver = (event) => {
            const changes = {};
            // Checks which object changed and propagates them.
            if (event.keysChanged.has(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.tag)) {
                changes.tagChange = this._content.get(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.tag);
            }
            else if (event.keysChanged.has(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.comment)) {
                changes.commentChange = this._content.get(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.comment);
            }
            else if (event.keysChanged.has(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.content)) {
                changes.codeChange = this._content.get(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.content);
            }
            else if (event.keysChanged.has(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.name)) {
                changes.nameChange = this._content.get(_ankusCommon__WEBPACK_IMPORTED_MODULE_3__.ShareCode.CodePropertyName.name);
            }
            else {
                return;
            }
            this._changed.emit(changes);
        };
        this._date = new Date();
        // Creating a new shared object and listen to its changes
        this._content = this.ydoc.getMap('content');
        this._content.observe(this._contentObserver);
    }
    /**
     * Dispose of the resources.
     */
    dispose() {
        this._content.unobserve(this._contentObserver);
    }
    /**
     * Static method to create instances on the sharedModel
     *
     * @returns The sharedModel instance
     */
    static create() {
        return new AnkusDoc();
    }
    /**
     * Returns an the requested object.
     *
     * @param key The key of the object.
     * @returns The content
     */
    getContent(key) {
        return this._content.get(key);
    }
    /**
     * Adds new data.
     *
     * @param key The key of the object.
     * @param value New object.
     */
    setContent(key, value) {
        this._content.set(key, value);
    }
    /*   get codeId(): number {
      return this._id;
    }
  
    set codeId(value: number) {
      this._id = value;
    }
  
    get codeName(): string {
      return this._name;
    }
  
    set codeName(value: string) {
      this._name = value;
    }
  
    get writer(): string {
      return this._writer;
    }
  
    set writer(value: string) {
      this._writer = value;
    }
  
  
    private _id = 0;
    private _name = '';
    private _writer = '';
    
  */
    get updateDate() {
        return this._date;
    }
    set updateDate(value) {
        this._date = value;
    }
}


/***/ }),

/***/ "./lib/doc/widgetFactory.js":
/*!**********************************!*\
  !*** ./lib/doc/widgetFactory.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AnkusDocModelFactory: () => (/* binding */ AnkusDocModelFactory),
/* harmony export */   AnkusWidgetFactory: () => (/* binding */ AnkusWidgetFactory)
/* harmony export */ });
/* harmony import */ var _jupyterlab_docregistry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/docregistry */ "webpack/sharing/consume/default/@jupyterlab/docregistry");
/* harmony import */ var _jupyterlab_docregistry__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_docregistry__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _docModel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./docModel */ "./lib/doc/docModel.js");
/* harmony import */ var _component_ankusCodeEditor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../component/ankusCodeEditor */ "./lib/component/ankusCodeEditor.js");

//ver4//import { IModelDB } from '@jupyterlab/observables';


class AnkusWidgetFactory extends _jupyterlab_docregistry__WEBPACK_IMPORTED_MODULE_0__.ABCWidgetFactory {
    constructor(options) {
        super(options);
    }
    createNewWidget(context) {
        return new _component_ankusCodeEditor__WEBPACK_IMPORTED_MODULE_1__.AnkusDocWidget({
            context,
            content: new _component_ankusCodeEditor__WEBPACK_IMPORTED_MODULE_1__.AnkusCodeEditor(context.model)
        });
    }
}
class AnkusDocModelFactory {
    constructor() {
        this._disposed = false;
    }
    /**
     * The name of the model.
     *
     * @returns The name
     */
    get name() {
        return 'ankus-model';
    }
    /**
     * The content type of the file.
     *
     * @returns The content type
     */
    get contentType() {
        return 'file';
    }
    /**
     * The format of the file.
     *
     * @returns the file format
     */
    get fileFormat() {
        return 'text';
    }
    /**
     * Get whether the model factory has been disposed.
     *
     * @returns disposed status
     */
    get isDisposed() {
        return this._disposed;
    }
    /**
     * Dispose the model factory.
     */
    dispose() {
        this._disposed = true;
    }
    /**
     * Get the preferred language given the path on the file.
     *
     * @param path path of the file represented by this document model
     * @returns The preferred language
     */
    preferredLanguage(path) {
        return '';
    }
    /**
     * Create a new instance of ExampleDocModel.
     *
     * @param languagePreference Language
     * @param modelDB Model database
     * @returns The model
     */
    //ver4//createNew(languagePreference?: string, modelDB?: IModelDB): AnkusDocModel {
    createNew(modelOpt) {
        return new _docModel__WEBPACK_IMPORTED_MODULE_2__.AnkusDocModel();
    }
}


/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/notebook */ "webpack/sharing/consume/default/@jupyterlab/notebook");
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/statedb */ "webpack/sharing/consume/default/@jupyterlab/statedb");
/* harmony import */ var _jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _jupyterlab_statusbar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/statusbar */ "webpack/sharing/consume/default/@jupyterlab/statusbar");
/* harmony import */ var _jupyterlab_statusbar__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_statusbar__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _jupyterlab_mainmenu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @jupyterlab/mainmenu */ "webpack/sharing/consume/default/@jupyterlab/mainmenu");
/* harmony import */ var _jupyterlab_mainmenu__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_mainmenu__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _component_ankusSidebar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./component/ankusSidebar */ "./lib/component/ankusSidebar.js");
/* harmony import */ var _ankusCommands__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ankusCommands */ "./lib/ankusCommands.js");
/* harmony import */ var _style_sidebar_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../style/sidebar.css */ "./style/sidebar.css");
/* harmony import */ var _ankusCommon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ankusCommon */ "./lib/ankusCommon.js");
/**
 * Initialization data for the jupyter_ankus extension.
 */
/* const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyter_ankus:plugin',
  description: 'ankus JupyterLab extension.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyter_ankus is activated!');
  }
};

export default plugin; */










/**
 * Initialization data for the jupyter_ankus extension.
 */
const extension = {
    id: _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.ANKUS_EXT_ID,
    autoStart: true,
    requires: [_jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_1__.IStateDB, _jupyterlab_statusbar__WEBPACK_IMPORTED_MODULE_2__.IStatusBar, _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_0__.INotebookTracker, _jupyterlab_mainmenu__WEBPACK_IMPORTED_MODULE_4__.IMainMenu, _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_5__.IThemeManager],
    activate
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (extension);
async function activate(app, state, statusBar, tracker, 
//  filebrowser: IFileBrowserFactory,
mainmenu, theme
//  completMgr: ICompletionManager,
) {
    console.log('JupyterLab extension jupyter_ankus is activated!');
    /*  tracker.widgetAdded.connect(
      (sender: INotebookTracker, panel: NotebookPanel) => {
        let editor = panel.content.activeCell?.editor ?? null;
        const session = panel.sessionContext.session;
        const options = { session, editor };
        const connector = new CompletionConnector([]);
        const handler = completMgr.register({
          connector,
          editor,
          parent: panel
        });
  
        const updateConnector = () => {
          editor = panel.content.activeCell?.editor ?? null;
          options.session = panel.sessionContext.session;
          options.editor = editor;
          handler.editor = editor;
  
          const kernel = new KernelConnector(options);
          const context = new ContextConnector(options);
          const custom = new CustomConnector(options);
          handler.connector = new CompletionConnector([kernel, context, custom]);
        };
  
        // Update the handler whenever the prompt or session changes
        panel.content.activeCellChanged.connect(updateConnector);
        panel.sessionContext.sessionChanged.connect(updateConnector);
      }
    );
  
    // Add notebook completer command.
    app.commands.addCommand('completer:invoke-notebook', {
      execute: () => {
        const panel = tracker.currentWidget;
        if (panel && panel.content.activeCell?.model.type === 'code') {
          return app.commands.execute('completer:invoke', { id: panel.id });
        }
      }
    });
  */
    _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.initialize(app, state, statusBar, tracker);
    (0,_ankusCommands__WEBPACK_IMPORTED_MODULE_8__.createCommands)(app, mainmenu);
    //add code
    app.commands.addCommand(_ankusCommands__WEBPACK_IMPORTED_MODULE_8__.CommandID.addCode.id, {
        label: _ankusCommands__WEBPACK_IMPORTED_MODULE_8__.CommandID.addCode.label,
        icon: _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_3__.addIcon,
        isVisible: () => _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.logged,
        isEnabled: () => {
            const panel = tracker.currentWidget;
            if (
            //로그인 확인
            !_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.logged ||
                panel === null ||
                panel.content.activeCell === null ||
                !(app.shell.currentWidget instanceof _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_0__.NotebookPanel)) {
                return false;
            }
            const itr = panel.content.children();
            let wg;
            let txt = '';
            while ((wg = itr.next().value) !== undefined) {
                //selected  code, markdown
                if (wg.hasClass('jp-mod-selected') &&
                    (wg.hasClass('jp-CodeCell') || wg.hasClass('jp-MarkdownCell'))) {
                    txt += wg.model.sharedModel.getSource(); //.toJSON().source.toString(); //ver4//.value.text;
                }
            }
            //cell is not empty
            return txt.length !== 0;
        },
        execute: async (event) => {
            //notebook name
            const title = tracker.currentWidget.title.label.replace('.ipynb', '');
            //cell list
            const itr = tracker.currentWidget.content.children();
            let wg;
            const content = [];
            while ((wg = itr.next().value) !== undefined) {
                //selected  cell
                if (wg.hasClass('jp-mod-selected')) {
                    //cell text
                    const txt = wg.model.sharedModel.getSource().trim(); //ver4//.value.text.trim();
                    if (txt.length !== 0) {
                        //code
                        if (wg.hasClass('jp-CodeCell')) {
                            content.push({
                                source: wg.model.sharedModel.getSource(),
                                cell_type: 'code'
                            });
                        }
                        //markdown
                        else if (wg.hasClass('jp-MarkdownCell')) {
                            content.push({
                                source: wg.model.sharedModel.getSource(),
                                cell_type: 'markdown'
                            });
                        }
                    } //if : text is not empty
                } //if : selected
            } //while : cell list
            const data = {};
            data[_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.ShareCode.CodePropertyName.name] = title;
            data[_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.ShareCode.CodePropertyName.userNo] = _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.userNumber;
            data[_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.ShareCode.CodePropertyName.content] = content;
            data[_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.ShareCode.CodePropertyName.tag] = [title];
            fetch(_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.ankusURL + '/share-code/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.loginToken,
                    code: data
                })
            })
                .then(response => {
                if (!response.ok) {
                    throw new Error('Fail');
                }
                else {
                    //update code list
                    _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.ankusPlugin.updateCodelist();
                }
            })
                .catch(error => {
                alert('공유 코드 추가 오류');
            });
        } //execute
    }); //add Code
    //update code
    app.commands.addCommand(_ankusCommands__WEBPACK_IMPORTED_MODULE_8__.CommandID.updateCode.id, {
        //label
        label: () => {
            //selected code
            const cd = _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.ankusPlugin.currentCode();
            //none selected
            if (cd === undefined) {
                return _ankusCommands__WEBPACK_IMPORTED_MODULE_8__.CommandID.updateCode.label;
            }
            else {
                //코드명은 10글자까지 표시
                const nm = cd.name.length > 20 ? cd.name.substring(0, 20) + '...' : cd.name;
                return 'Update "' + nm + '" with selected Cells';
            }
        },
        //icon
        icon: _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_3__.editIcon,
        isVisible: () => _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.logged,
        //활성화 여부
        isEnabled: () => {
            const ntbk = _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.activeNotebook;
            if (
            //로그인 확인
            !_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.logged ||
                //노트북 확인
                ntbk === null ||
                //노트북의 선택셀 확인
                ntbk.activeCell === null ||
                //코드 목록에서 선택코드 확인
                _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.ankusPlugin.currentCode() === undefined ||
                //코드 작성자와 사용자가 다름
                _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.ankusPlugin.currentCode().writerNo !== _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.userID) {
                //disable
                return false;
            }
            const itr = ntbk.children();
            let wg;
            let txt = '';
            //cell list
            while ((wg = itr.next().value) !== undefined) {
                //selected  code, markdown
                if (wg.hasClass('jp-mod-selected') &&
                    (wg.hasClass('jp-CodeCell') || wg.hasClass('jp-MarkdownCell'))) {
                    txt += wg.model.sharedModel.getSource().trim(); //.toJSON().source.toString(); //ver4//.value.text;
                }
            } //while : cell list
            //cell is not empty
            return txt.length !== 0;
        },
        execute: async (event) => {
            //cell list
            const itr = tracker.currentWidget.content.children();
            let wg;
            const content = [];
            while ((wg = itr.next().value) !== undefined) {
                //selected  cell
                if (wg.hasClass('jp-mod-selected')) {
                    //cell text
                    const txt = wg.model.sharedModel.getSource().trim(); //ver4//.value.text.trim();
                    if (txt.length !== 0) {
                        //code
                        if (wg.hasClass('jp-CodeCell')) {
                            content.push({
                                source: wg.model.sharedModel.getSource(),
                                cell_type: 'code'
                            });
                        }
                        //markdown
                        else if (wg.hasClass('jp-MarkdownCell')) {
                            content.push({
                                source: wg.model.sharedModel.getSource(),
                                cell_type: 'markdown'
                            });
                        }
                    } //if : text is not empty
                } //if : selected
            } //while : cell list
            const code = {};
            //code[CodePropertyName.name] = this.codeName; //code name
            //code[CodePropertyName.comment] = this.comment; //code comment
            code[_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.ShareCode.CodePropertyName.content] = content; //code content
            //code[CodePropertyName.date] = this.updateDate;
            //code[CodePropertyName.userNo] = this.userNumber; //code writer(number)
            //code id
            code[_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.ShareCode.CodePropertyName.id] = _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.ankusPlugin.currentCode().id;
            //update code
            fetch(_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.ankusURL + '/share-code/modify/code', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.loginToken,
                    code: code //code detail
                })
            })
                .then(response => {
                //response ok
                if (response.ok) {
                    return response.json();
                }
                //response fail
                else {
                    throw new Error('fail');
                }
            })
                .then(jsresp => {
                console.log('code updated');
                //update code list
                _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.ankusPlugin.updateCodelist();
            })
                .catch(error => {
                alert('공유 코드 저장 오류');
            }); //fetch
        } //execute
    }); //update code
    //open notebook
    app.commands.addCommand(_ankusCommands__WEBPACK_IMPORTED_MODULE_8__.CommandID.openNtbk.id, {
        label: _ankusCommands__WEBPACK_IMPORTED_MODULE_8__.CommandID.openNtbk.label,
        icon: _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_3__.notebookIcon,
        isEnabled: () => _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.ankusPlugin.currentCode() !== undefined,
        execute: () => {
            //get code detail
            fetch(_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.ankusURL +
                '/share-code/view?token=' +
                _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.loginToken +
                '&codeId=' +
                _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.ankusPlugin.currentCode().id)
                .then(response => {
                //check response
                if (response.ok) {
                    return response.json();
                }
                else {
                    throw new Error('Fail');
                }
            })
                .then(codedat => {
                var _a;
                //new notebook
                app.commands
                    .execute('notebook:create-new', {
                    //cwd: filebrowser.defaultBrowser.model.path,
                    kernelName: (_a = app.serviceManager.kernelspecs.specs) === null || _a === void 0 ? void 0 : _a.default
                })
                    .then(response => {
                    //check new notebook response
                    Promise.all([
                        response.revealed,
                        response.sessionContext.ready
                    ]).then(() => {
                        //notebook name
                        //app.commands.execute('docmanager:rename', {});
                        tracker.currentWidget.context.rename(codedat[_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.ShareCode.CodePropertyName.name] + '.ipynb');
                        //notebook
                        const note = tracker.currentWidget.content;
                        //code content
                        const celldat = codedat[_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.ShareCode.CodePropertyName.content];
                        //cell data list
                        celldat.forEach((dat, idx) => {
                            //if (idx !== 0) {
                            //새로운 셀 추가
                            _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_0__.NotebookActions.insertBelow(note);
                            //markdown
                            if (dat.cell_type === 'markdown') {
                                //app.commands.execute('notebook:change-cell-to-markdown');
                                _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_0__.NotebookActions.changeCellType(note, 'markdown');
                            }
                            //셀에 코드 삽입
                            note.activeCell.model.sharedModel.setSource(dat.source); //ver4//.value.text = dat.source;
                        }); //cell data list
                        //render markdown
                        _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_0__.NotebookActions.renderAllMarkdown(note);
                    }); //promise-then : new notebook response
                }); //command execute-then : new notebook
            }) //fetch-then : get code detail
                .catch(error => {
                alert('공유 코드 가져오기 오류');
            });
        } //execute
    }); //open notebook
    //insert code into notebook
    app.commands.addCommand(_ankusCommands__WEBPACK_IMPORTED_MODULE_8__.CommandID.insertCode.id, {
        label: _ankusCommands__WEBPACK_IMPORTED_MODULE_8__.CommandID.insertCode.label,
        icon: _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_3__.addIcon,
        //enable/disable
        isEnabled: () => 
        //check selected code
        _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.ankusPlugin.currentCode() !== undefined &&
            //check notebook
            _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.activeNotebook !== null &&
            //check cell
            _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.activeNotebook.activeCell !== null,
        //execute function
        execute: async (args) => {
            //get code detail
            fetch(_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.ankusURL +
                '/share-code/view?token=' +
                _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.loginToken +
                '&codeId=' +
                args['id'])
                .then(response => {
                //check response
                if (response.ok) {
                    return response.json();
                }
                else {
                    throw new Error('Fail');
                }
            })
                .then(response => {
                //앵커스 코드 정보 표시
                const desc = '## ankus Share Code - ' +
                    response[_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.ShareCode.CodePropertyName.name] +
                    //코드 설명이 있을 경우
                    (response[_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.ShareCode.CodePropertyName.comment] !== null //코드 설명에 줄바꿈이 있을 때
                        ? '\n> ' +
                            response[_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.ShareCode.CodePropertyName.comment].replace('\n', '   ')
                        : '');
                //notebook
                const note = tracker.currentWidget.content;
                //아래 셀 추가
                _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_0__.NotebookActions.insertBelow(note);
                //셀에 설명 삽입
                note.activeCell.model.sharedModel.setSource(desc); //ver4//.value.text = desc;
                //render markdown
                app.commands.execute('notebook:change-cell-to-markdown');
                app.commands.execute('notebook:run-cell');
                //code content
                const celldat = response[_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.ShareCode.CodePropertyName.content];
                //cell data list
                celldat.forEach((dat, idx) => {
                    //아래 셀 추가
                    _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_0__.NotebookActions.insertBelow(note);
                    //markdown
                    if (dat.cell_type === 'markdown') {
                        //셀에 코드 삽입
                        note.activeCell.model.sharedModel.setSource(dat.source); //ver4//.value.text = dat.source;
                        //render markdown
                        app.commands.execute('notebook:change-cell-to-markdown');
                        app.commands.execute('notebook:run-cell');
                    }
                    else {
                        //셀에 코드 삽입
                        note.activeCell.model.sharedModel.setSource(dat.source); //ver4//.value.text = dat.source;
                    }
                }); //cell data list
            }) //get code detail - response
                .catch(error => {
                alert('공유 코드 가져오기 오류');
            });
        } //execute
    }); //addCommand - insert code into notebook
    /*  const namespace = 'ankus-documents';
    const FACTORY = 'ankus editor';
    // Creating the tracker for the document
    const tracker = new WidgetTracker<AnkusDocWidget>({ namespace });
  
    const widgetFactory = new AnkusWidgetFactory({
      name: FACTORY,
      modelName: 'ankus-model',
      fileTypes: ['ankus']
    });
  
    widgetFactory.widgetCreated.connect((sender, widget) => {
      // Notify the instance tracker if restore data needs to update.
      widget.context.pathChanged.connect(() => {
        tracker.save(widget);
      });
      tracker.add(widget);
    });
    app.docRegistry.addWidgetFactory(widgetFactory);
  */
    // theme.themeChanged.connect((sender: IThemeManager, args: any) => {
    //   Ankus.themeIsLight = sender.isLight(args.newValue);
    // });
    // Load the saved plugin state and apply it once the app
    // has finished restoring its former layout.
    state.fetch(_ankusCommon__WEBPACK_IMPORTED_MODULE_7__.ANKUS_EXT_ID).then(value => {
        let usr = '';
        let rem = false;
        let url = '';
        if (value) {
            const settings = value;
            //remember id
            rem = settings['remID'];
            if (rem) {
                //user id
                usr = settings['loginID'];
            }
            url = settings['serverURL'];
            //standard term category
            const cat = settings['stdTermCategory'];
            _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.stdtermCategory = cat === undefined ? 0 : cat;
            //standard term format
            const fmt = settings['stdTermFormat'];
            _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.Ankus.stdtermFormat =
                fmt === undefined ? _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.StandardTermPart.Format.upper : fmt;
        } //if : check state value
        const sidebar = new _component_ankusSidebar__WEBPACK_IMPORTED_MODULE_9__.AnkusSidebar(usr, rem, url);
        sidebar.id = 'jupyter-ankus-sessions';
        sidebar.title.icon = _ankusCommon__WEBPACK_IMPORTED_MODULE_7__.ANKUS_ICON;
        sidebar.title.iconClass = 'ankus-sidebar-icon';
        sidebar.title.caption = 'ankus';
        app.shell.add(sidebar, 'left', { rank: 501 });
    }); //state db
} //activate


/***/ }),

/***/ "./lib/notebookAction.js":
/*!*******************************!*\
  !*** ./lib/notebookAction.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NotebookPlugin: () => (/* binding */ NotebookPlugin)
/* harmony export */ });
/* harmony import */ var _ankusCommon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ankusCommon */ "./lib/ankusCommon.js");

var NotebookPlugin;
(function (NotebookPlugin) {
    //자동완성 용어를 노트북에 삽입
    function insertCompletionText(text, replace) {
        if (_ankusCommon__WEBPACK_IMPORTED_MODULE_0__.Ankus.activeNotebook !== null &&
            _ankusCommon__WEBPACK_IMPORTED_MODULE_0__.Ankus.activeNotebook.activeCell !== null) {
            const editor = _ankusCommon__WEBPACK_IMPORTED_MODULE_0__.Ankus.activeNotebook.activeCell.editor;
            //셀 편집기 확인
            if (editor !== null) {
                const curpos = editor.getCursorPosition();
                //replace token
                if (replace) {
                    const token = editor.getTokenAtCursor(); //ver4//.getTokenForPosition(curpos); //검색어
                    //검색어 확인
                    if (token !== undefined) {
                        editor.setSelection({
                            start: editor.getPositionAt(token.offset),
                            end: curpos
                        });
                        editor.replaceSelection(formatText(text));
                    }
                } //if: replace token
                //insert
                else {
                    editor.setSelection({
                        start: curpos,
                        end: curpos
                    });
                    editor.replaceSelection(formatText(text));
                }
            } //if : check cell editor
        } //if: check notebook
    } //insertCompletionText
    NotebookPlugin.insertCompletionText = insertCompletionText;
    const formatText = (text) => {
        switch (_ankusCommon__WEBPACK_IMPORTED_MODULE_0__.Ankus.stdtermFormat) {
            case _ankusCommon__WEBPACK_IMPORTED_MODULE_0__.StandardTermPart.Format.camel:
                return camelize(text);
            case _ankusCommon__WEBPACK_IMPORTED_MODULE_0__.StandardTermPart.Format.sentence:
                return titlize(text);
            case _ankusCommon__WEBPACK_IMPORTED_MODULE_0__.StandardTermPart.Format.lower:
                return text.toLowerCase();
            default:
                return text.toUpperCase();
        }
    }; //format text
    const camelize = (text) => {
        const a = text
            .toLowerCase()
            .replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
        return a.substring(0, 1).toLowerCase() + a.substring(1);
    };
    const titlize = (text) => {
        const a = text
            .toLowerCase()
            .replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
        return a.substring(0, 1).toUpperCase() + a.substring(1);
    };
    function updateCodeWithCell() {
        //cell list
        const itr = _ankusCommon__WEBPACK_IMPORTED_MODULE_0__.Ankus.activeNotebook.children();
        let wg;
        const content = [];
        while ((wg = itr.next().value) !== undefined) {
            //selected  cell
            if (wg.hasClass('jp-mod-selected')) {
                //cell text
                const txt = wg.model.sharedModel.getSource().trim(); //ver4//.value.text.trim();
                if (txt.length !== 0) {
                    //code
                    if (wg.hasClass('jp-CodeCell')) {
                        content.push({
                            source: wg.model.sharedModel.getSource(),
                            cell_type: 'code'
                        });
                    }
                    //markdown
                    else if (wg.hasClass('jp-MarkdownCell')) {
                        content.push({
                            source: wg.model.sharedModel.getSource(),
                            cell_type: 'markdown'
                        });
                    }
                } //if : text is not empty
            } //if : selected
        } //while : cell list
        const code = {};
        //code[CodePropertyName.name] = this.codeName; //code name
        //code[CodePropertyName.comment] = this.comment; //code comment
        code[_ankusCommon__WEBPACK_IMPORTED_MODULE_0__.ShareCode.CodePropertyName.content] = content; //code content
        //code[CodePropertyName.date] = this.updateDate;
        //code[CodePropertyName.userNo] = this.userNumber; //code writer(number)
        //code id
        code[_ankusCommon__WEBPACK_IMPORTED_MODULE_0__.ShareCode.CodePropertyName.id] = _ankusCommon__WEBPACK_IMPORTED_MODULE_0__.Ankus.ankusPlugin.currentCode().id;
        //update code
        fetch(_ankusCommon__WEBPACK_IMPORTED_MODULE_0__.Ankus.ankusURL + '/share-code/modify/code', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: _ankusCommon__WEBPACK_IMPORTED_MODULE_0__.Ankus.loginToken,
                code: code //code detail
            })
        })
            .then(response => {
            //response ok
            if (response.ok) {
                return response.json();
            }
            //response fail
            else {
                throw new Error('fail');
            }
        })
            .then(jsresp => {
            console.log('code updated');
            //update code list
            _ankusCommon__WEBPACK_IMPORTED_MODULE_0__.Ankus.ankusPlugin.updateCodelist();
        })
            .catch(error => {
            alert('공유 코드 저장 오류');
        }); //fetch
    } //updateCodeWithCell
    NotebookPlugin.updateCodeWithCell = updateCodeWithCell;
})(NotebookPlugin || (NotebookPlugin = {}));


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./style/codecontent.css":
/*!*********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./style/codecontent.css ***!
  \*********************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `@charset "uft-8";

.ankus-code-wrap {
    height: calc(100% - 90px);
    margin-top: 10px;
}

.ankus-code-wrap .tbl-container {
    height: calc(100% - 20px);
    width: 100%;
    overflow: auto;      
}

.ankus-cod-cel-tbl {
    width: 100%;
    resize: none;
}

.ankus-cod-cel-tbl tbody {
    max-height: calc(100% - 50px); 
    table-layout: fixed;
    display: block;
}

.ankus-cod-cel-tbl thead tr {
    display: table;
    width: 100%;
    table-layout: fixed;
}
.ankus-cod-cel-tbl tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
}

.ankus-code-wrap .th-cell {
    display: inline-block;
    text-align: center;
    width: calc(100% - 80px); 
}

.ankus-cod-cel-tbl td button {
    margin: 0;
    padding: 0;
    border: none;
    background-color: rgba( 255, 255, 255, 0 );
    cursor: pointer;
    width: 30px;
    /* height: 20px;
    background-color: transparent;
    background-image: url('./images/menu.svg');
    background-repeat: no-repeat;
    background-position: center; */
}

/* syntax highlighter */
.ankus-Cell.sel-cell.hl-wrap pre {
    margin: 0;
    min-height: 50px;
}
.ankus-Cell.hl-wrap pre {
    margin: 0;
    min-height: 50px;
}

/* markdown wrapper */
.ankus-code-wrap .md-wrap {
    background-color: var(--jp-layout-color0);
    color: var(--jp-content-font-color0);
    font-family: var(--jp-content-font-family);
    padding: 5px;
    min-height: 50px;
}

.ankus-Cell.sel-cell {
    border: 1px solid var(--jp-cell-editor-active-border-color);
}
.ankus-Cell {
    border: none;
    background-color: var(--jp-cell-editor-background);
    border: 1px solid var(--jp-cell-editor-border-color);
    color: var(--jp-content-font-color0);
    font-family: var(--jp-code-font-family);
}

textarea.ankus-Cell {
    resize: none;
    white-space: nowrap; 
    min-height: 50px; 
    width: calc(100% - 17px);
    overflow-x: auto;
    padding: 7px;
}  

/* .cell-text {
    background-color: white;
    white-space: pre;
    min-width: calc(100% - 12px);
    min-height: 40px;
    padding: 5px;
    border: 1px solid silver;
    display: inline-block;
} */`, "",{"version":3,"sources":["webpack://./style/codecontent.css"],"names":[],"mappings":"AAAA,gBAAgB;;AAEhB;IACI,yBAAyB;IACzB,gBAAgB;AACpB;;AAEA;IACI,yBAAyB;IACzB,WAAW;IACX,cAAc;AAClB;;AAEA;IACI,WAAW;IACX,YAAY;AAChB;;AAEA;IACI,6BAA6B;IAC7B,mBAAmB;IACnB,cAAc;AAClB;;AAEA;IACI,cAAc;IACd,WAAW;IACX,mBAAmB;AACvB;AACA;IACI,cAAc;IACd,WAAW;IACX,mBAAmB;AACvB;;AAEA;IACI,qBAAqB;IACrB,kBAAkB;IAClB,wBAAwB;AAC5B;;AAEA;IACI,SAAS;IACT,UAAU;IACV,YAAY;IACZ,0CAA0C;IAC1C,eAAe;IACf,WAAW;IACX;;;;kCAI8B;AAClC;;AAEA,uBAAuB;AACvB;IACI,SAAS;IACT,gBAAgB;AACpB;AACA;IACI,SAAS;IACT,gBAAgB;AACpB;;AAEA,qBAAqB;AACrB;IACI,yCAAyC;IACzC,oCAAoC;IACpC,0CAA0C;IAC1C,YAAY;IACZ,gBAAgB;AACpB;;AAEA;IACI,2DAA2D;AAC/D;AACA;IACI,YAAY;IACZ,kDAAkD;IAClD,oDAAoD;IACpD,oCAAoC;IACpC,uCAAuC;AAC3C;;AAEA;IACI,YAAY;IACZ,mBAAmB;IACnB,gBAAgB;IAChB,wBAAwB;IACxB,gBAAgB;IAChB,YAAY;AAChB;;AAEA;;;;;;;;GAQG","sourcesContent":["@charset \"uft-8\";\n\n.ankus-code-wrap {\n    height: calc(100% - 90px);\n    margin-top: 10px;\n}\n\n.ankus-code-wrap .tbl-container {\n    height: calc(100% - 20px);\n    width: 100%;\n    overflow: auto;      \n}\n\n.ankus-cod-cel-tbl {\n    width: 100%;\n    resize: none;\n}\n\n.ankus-cod-cel-tbl tbody {\n    max-height: calc(100% - 50px); \n    table-layout: fixed;\n    display: block;\n}\n\n.ankus-cod-cel-tbl thead tr {\n    display: table;\n    width: 100%;\n    table-layout: fixed;\n}\n.ankus-cod-cel-tbl tbody tr {\n    display: table;\n    width: 100%;\n    table-layout: fixed;\n}\n\n.ankus-code-wrap .th-cell {\n    display: inline-block;\n    text-align: center;\n    width: calc(100% - 80px); \n}\n\n.ankus-cod-cel-tbl td button {\n    margin: 0;\n    padding: 0;\n    border: none;\n    background-color: rgba( 255, 255, 255, 0 );\n    cursor: pointer;\n    width: 30px;\n    /* height: 20px;\n    background-color: transparent;\n    background-image: url('./images/menu.svg');\n    background-repeat: no-repeat;\n    background-position: center; */\n}\n\n/* syntax highlighter */\n.ankus-Cell.sel-cell.hl-wrap pre {\n    margin: 0;\n    min-height: 50px;\n}\n.ankus-Cell.hl-wrap pre {\n    margin: 0;\n    min-height: 50px;\n}\n\n/* markdown wrapper */\n.ankus-code-wrap .md-wrap {\n    background-color: var(--jp-layout-color0);\n    color: var(--jp-content-font-color0);\n    font-family: var(--jp-content-font-family);\n    padding: 5px;\n    min-height: 50px;\n}\n\n.ankus-Cell.sel-cell {\n    border: 1px solid var(--jp-cell-editor-active-border-color);\n}\n.ankus-Cell {\n    border: none;\n    background-color: var(--jp-cell-editor-background);\n    border: 1px solid var(--jp-cell-editor-border-color);\n    color: var(--jp-content-font-color0);\n    font-family: var(--jp-code-font-family);\n}\n\ntextarea.ankus-Cell {\n    resize: none;\n    white-space: nowrap; \n    min-height: 50px; \n    width: calc(100% - 17px);\n    overflow-x: auto;\n    padding: 7px;\n}  \n\n/* .cell-text {\n    background-color: white;\n    white-space: pre;\n    min-width: calc(100% - 12px);\n    min-height: 40px;\n    padding: 5px;\n    border: 1px solid silver;\n    display: inline-block;\n} */"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./style/codedesc.css":
/*!******************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./style/codedesc.css ***!
  \******************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `@charset "uft-8";

.ankus-desc-page {
  height: calc(100% - 90px);
  margin-top: 15px;
}

.ankus-desc-page p {
  font-weight: 600;
}

.ankus-desc-page .sub-title {
  color: var(--jp-ui-font-color2);
}

.ankus-code-tag-tbl tr {
  /* display: table; */
  width: clac(100%-5px);
  height: 30px;
  /* table-layout: fixed; */
  border-bottom: 1px solid var(--jp-border-color2);
}

.ankus-code-tag-tbl tr td:first-child {
  width: 30px;
  text-align: center;
  color: var(--jp-content-font-color2);
  font-weight: bold;
}

.ankus-code-tag-tbl tr td:nth-child(3) {
  width: 30px;
}
.ankus-code-tag-tbl tr td:nth-child(3) button {
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  background-color: transparent;
  cursor: pointer;
}
.ankus-code-tag-tbl tr td:nth-child(3) button:hover {
  background-color: var(--jp-layout-color2);
}

.ankus-code-tag-tbl .input-tag {
  background-color: transparent;
  color: var(--jp-content-font-color0);
  font-family: var(--jp-content-font-family);
  font-size: 13px;
  border: none;
  width: 100%;
  height: 25px;
  display: inline-block;
}

.ankus-desc-page .td-tag {
  width: calc(100% - 60px);
  color: var(--jp-content-font-color0);
  font-family: var(--jp-content-font-family);
}
.ankus-desc-page .td-tag span {
  cursor: text;
}

.description-wrap {
  margin-top: 20px;
  height: 100px;
  padding: 0 6px;
}

.ankus-code-desc-txt {
  width: 100%;
  height: 83px;
  box-sizing: border-box;
  padding: 10px 0 0px 8px;
  resize: none;
  border: 1px solid var(--jp-border-color1);
  background-color: var(--jp-layout-color1);
  color: var(--jp-content-font-color0);
  font-family: var(--jp-content-font-family);
}

/* code property dialog => code preview font */
code.language-python {
  font-size: 11px;
}`, "",{"version":3,"sources":["webpack://./style/codedesc.css"],"names":[],"mappings":"AAAA,gBAAgB;;AAEhB;EACE,yBAAyB;EACzB,gBAAgB;AAClB;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,+BAA+B;AACjC;;AAEA;EACE,oBAAoB;EACpB,qBAAqB;EACrB,YAAY;EACZ,yBAAyB;EACzB,gDAAgD;AAClD;;AAEA;EACE,WAAW;EACX,kBAAkB;EAClB,oCAAoC;EACpC,iBAAiB;AACnB;;AAEA;EACE,WAAW;AACb;AACA;EACE,WAAW;EACX,YAAY;EACZ,UAAU;EACV,YAAY;EACZ,6BAA6B;EAC7B,eAAe;AACjB;AACA;EACE,yCAAyC;AAC3C;;AAEA;EACE,6BAA6B;EAC7B,oCAAoC;EACpC,0CAA0C;EAC1C,eAAe;EACf,YAAY;EACZ,WAAW;EACX,YAAY;EACZ,qBAAqB;AACvB;;AAEA;EACE,wBAAwB;EACxB,oCAAoC;EACpC,0CAA0C;AAC5C;AACA;EACE,YAAY;AACd;;AAEA;EACE,gBAAgB;EAChB,aAAa;EACb,cAAc;AAChB;;AAEA;EACE,WAAW;EACX,YAAY;EACZ,sBAAsB;EACtB,uBAAuB;EACvB,YAAY;EACZ,yCAAyC;EACzC,yCAAyC;EACzC,oCAAoC;EACpC,0CAA0C;AAC5C;;AAEA,8CAA8C;AAC9C;EACE,eAAe;AACjB","sourcesContent":["@charset \"uft-8\";\n\n.ankus-desc-page {\n  height: calc(100% - 90px);\n  margin-top: 15px;\n}\n\n.ankus-desc-page p {\n  font-weight: 600;\n}\n\n.ankus-desc-page .sub-title {\n  color: var(--jp-ui-font-color2);\n}\n\n.ankus-code-tag-tbl tr {\n  /* display: table; */\n  width: clac(100%-5px);\n  height: 30px;\n  /* table-layout: fixed; */\n  border-bottom: 1px solid var(--jp-border-color2);\n}\n\n.ankus-code-tag-tbl tr td:first-child {\n  width: 30px;\n  text-align: center;\n  color: var(--jp-content-font-color2);\n  font-weight: bold;\n}\n\n.ankus-code-tag-tbl tr td:nth-child(3) {\n  width: 30px;\n}\n.ankus-code-tag-tbl tr td:nth-child(3) button {\n  width: 18px;\n  height: 18px;\n  padding: 0;\n  border: none;\n  background-color: transparent;\n  cursor: pointer;\n}\n.ankus-code-tag-tbl tr td:nth-child(3) button:hover {\n  background-color: var(--jp-layout-color2);\n}\n\n.ankus-code-tag-tbl .input-tag {\n  background-color: transparent;\n  color: var(--jp-content-font-color0);\n  font-family: var(--jp-content-font-family);\n  font-size: 13px;\n  border: none;\n  width: 100%;\n  height: 25px;\n  display: inline-block;\n}\n\n.ankus-desc-page .td-tag {\n  width: calc(100% - 60px);\n  color: var(--jp-content-font-color0);\n  font-family: var(--jp-content-font-family);\n}\n.ankus-desc-page .td-tag span {\n  cursor: text;\n}\n\n.description-wrap {\n  margin-top: 20px;\n  height: 100px;\n  padding: 0 6px;\n}\n\n.ankus-code-desc-txt {\n  width: 100%;\n  height: 83px;\n  box-sizing: border-box;\n  padding: 10px 0 0px 8px;\n  resize: none;\n  border: 1px solid var(--jp-border-color1);\n  background-color: var(--jp-layout-color1);\n  color: var(--jp-content-font-color0);\n  font-family: var(--jp-content-font-family);\n}\n\n/* code property dialog => code preview font */\ncode.language-python {\n  font-size: 11px;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./style/codeedit.css":
/*!******************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./style/codeedit.css ***!
  \******************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ./images/tag_plus.svg */ "./style/images/tag_plus.svg"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `@charset "uft-8";

.ankus-editor {
    /* margin: 0 auto;   */
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    /* max-height: 90%; */
    padding: 20px;
    background: transparent;
}


.ankus-editor .tab_title.select_tab {
    text-decoration: underline;
    font-weight: bold;
    font-size: 15px;
}
.ankus-editor .tab_title {
    text-decoration: none;
    font-weight: normal;
    font-size: 13px;
    margin: 5px;
    cursor: pointer;
    color: var(--jp-ui-font-color1);
}
.ankus-editor .tab_title:hover {
    color: var(--jp-ui-font-color3);
}

/* .editor-wrap p {
    font-size: 14px;
    font-weight: 600;
    color: #525252;
}
 */
 
 .ankus-editor .title-wrap button {
    background-color: var(--ankus-control-color);
    cursor: pointer;
    border: none;
    color: white;
    margin: 3px;
    padding: 3px 5px;
    font-size: 12px;
}

.tag-wrap {
    height: 30px;
    display: flex;
    align-items: center;
    margin-top: 6px;
}
.tag-wrap input {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 1px solid #707070;
    border-right: none;
    padding-left: 8px;
}
.tag-wrap input::placeholder {
    font-size: 12px;
}

.tag-wrap button {
    width: 30px;
    height: 30px;
    box-sizing: border-box;
    border: none;
    background-color: #001949;
    background-image: url(${___CSS_LOADER_URL_REPLACEMENT_0___});
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
}
.tag-wrap button:disabled {
    background-color: #cccccc;
    cursor: auto;
}

    .tag-box {
    width: 100%;
    height: 80px;
    background-color: #e8e8e8;
    padding-left: 7px;
    padding-top: 7px;
    box-sizing: border-box;
    overflow: auto;
}

.element-tag {
    display: inline-block;
    margin-bottom: 5px;
    margin-right: 5px;
    background-color: #898989;
    color: #fff;
    padding: 3px 5px;
    border-radius: 5px;
    font-size: small;
}

.save-wrap {
    margin-top: 15px;
    display: flex;
    align-items: center;
    justify-content: right;
}
.save-wrap button:first-child {
    width: 60px;
    height: 26px;
    background-color: #cccccc;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
.save-wrap button:last-child {
    width: 52px;
    height: 26px;
    color: #fff;
    background-color: #3e3e3e;
    border: none;
    border-radius: 5px;
    margin-left: 8px;
    cursor: pointer;
}

.ankus-editor .btn-save:disabled {
    background-color: var(--ankus-disable-color);
    cursor: auto;
}

.ankus-statusbar {
    font-size: 12px;
    font-weight: 400;
    margin-top: 10px;
}

.button-close {
    width: 13px;
    margin-left: 3px;
    display: inline-block;
}
.button-close:hover {
    cursor: pointer;
}

`, "",{"version":3,"sources":["webpack://./style/codeedit.css"],"names":[],"mappings":"AAAA,gBAAgB;;AAEhB;IACI,sBAAsB;IACtB,wBAAwB;IACxB,yBAAyB;IACzB,qBAAqB;IACrB,aAAa;IACb,uBAAuB;AAC3B;;;AAGA;IACI,0BAA0B;IAC1B,iBAAiB;IACjB,eAAe;AACnB;AACA;IACI,qBAAqB;IACrB,mBAAmB;IACnB,eAAe;IACf,WAAW;IACX,eAAe;IACf,+BAA+B;AACnC;AACA;IACI,+BAA+B;AACnC;;AAEA;;;;;EAKE;;CAED;IACG,4CAA4C;IAC5C,eAAe;IACf,YAAY;IACZ,YAAY;IACZ,WAAW;IACX,gBAAgB;IAChB,eAAe;AACnB;;AAEA;IACI,YAAY;IACZ,aAAa;IACb,mBAAmB;IACnB,eAAe;AACnB;AACA;IACI,WAAW;IACX,YAAY;IACZ,sBAAsB;IACtB,yBAAyB;IACzB,kBAAkB;IAClB,iBAAiB;AACrB;AACA;IACI,eAAe;AACnB;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,sBAAsB;IACtB,YAAY;IACZ,yBAAyB;IACzB,yDAA8C;IAC9C,4BAA4B;IAC5B,2BAA2B;IAC3B,eAAe;AACnB;AACA;IACI,yBAAyB;IACzB,YAAY;AAChB;;IAEI;IACA,WAAW;IACX,YAAY;IACZ,yBAAyB;IACzB,iBAAiB;IACjB,gBAAgB;IAChB,sBAAsB;IACtB,cAAc;AAClB;;AAEA;IACI,qBAAqB;IACrB,kBAAkB;IAClB,iBAAiB;IACjB,yBAAyB;IACzB,WAAW;IACX,gBAAgB;IAChB,kBAAkB;IAClB,gBAAgB;AACpB;;AAEA;IACI,gBAAgB;IAChB,aAAa;IACb,mBAAmB;IACnB,sBAAsB;AAC1B;AACA;IACI,WAAW;IACX,YAAY;IACZ,yBAAyB;IACzB,YAAY;IACZ,kBAAkB;IAClB,eAAe;AACnB;AACA;IACI,WAAW;IACX,YAAY;IACZ,WAAW;IACX,yBAAyB;IACzB,YAAY;IACZ,kBAAkB;IAClB,gBAAgB;IAChB,eAAe;AACnB;;AAEA;IACI,4CAA4C;IAC5C,YAAY;AAChB;;AAEA;IACI,eAAe;IACf,gBAAgB;IAChB,gBAAgB;AACpB;;AAEA;IACI,WAAW;IACX,gBAAgB;IAChB,qBAAqB;AACzB;AACA;IACI,eAAe;AACnB","sourcesContent":["@charset \"uft-8\";\n\n.ankus-editor {\n    /* margin: 0 auto;   */\n    width: calc(100% - 40px);\n    height: calc(100% - 40px);\n    /* max-height: 90%; */\n    padding: 20px;\n    background: transparent;\n}\n\n\n.ankus-editor .tab_title.select_tab {\n    text-decoration: underline;\n    font-weight: bold;\n    font-size: 15px;\n}\n.ankus-editor .tab_title {\n    text-decoration: none;\n    font-weight: normal;\n    font-size: 13px;\n    margin: 5px;\n    cursor: pointer;\n    color: var(--jp-ui-font-color1);\n}\n.ankus-editor .tab_title:hover {\n    color: var(--jp-ui-font-color3);\n}\n\n/* .editor-wrap p {\n    font-size: 14px;\n    font-weight: 600;\n    color: #525252;\n}\n */\n \n .ankus-editor .title-wrap button {\n    background-color: var(--ankus-control-color);\n    cursor: pointer;\n    border: none;\n    color: white;\n    margin: 3px;\n    padding: 3px 5px;\n    font-size: 12px;\n}\n\n.tag-wrap {\n    height: 30px;\n    display: flex;\n    align-items: center;\n    margin-top: 6px;\n}\n.tag-wrap input {\n    width: 100%;\n    height: 100%;\n    box-sizing: border-box;\n    border: 1px solid #707070;\n    border-right: none;\n    padding-left: 8px;\n}\n.tag-wrap input::placeholder {\n    font-size: 12px;\n}\n\n.tag-wrap button {\n    width: 30px;\n    height: 30px;\n    box-sizing: border-box;\n    border: none;\n    background-color: #001949;\n    background-image: url('./images/tag_plus.svg');\n    background-repeat: no-repeat;\n    background-position: center;\n    cursor: pointer;\n}\n.tag-wrap button:disabled {\n    background-color: #cccccc;\n    cursor: auto;\n}\n\n    .tag-box {\n    width: 100%;\n    height: 80px;\n    background-color: #e8e8e8;\n    padding-left: 7px;\n    padding-top: 7px;\n    box-sizing: border-box;\n    overflow: auto;\n}\n\n.element-tag {\n    display: inline-block;\n    margin-bottom: 5px;\n    margin-right: 5px;\n    background-color: #898989;\n    color: #fff;\n    padding: 3px 5px;\n    border-radius: 5px;\n    font-size: small;\n}\n\n.save-wrap {\n    margin-top: 15px;\n    display: flex;\n    align-items: center;\n    justify-content: right;\n}\n.save-wrap button:first-child {\n    width: 60px;\n    height: 26px;\n    background-color: #cccccc;\n    border: none;\n    border-radius: 5px;\n    cursor: pointer;\n}\n.save-wrap button:last-child {\n    width: 52px;\n    height: 26px;\n    color: #fff;\n    background-color: #3e3e3e;\n    border: none;\n    border-radius: 5px;\n    margin-left: 8px;\n    cursor: pointer;\n}\n\n.ankus-editor .btn-save:disabled {\n    background-color: var(--ankus-disable-color);\n    cursor: auto;\n}\n\n.ankus-statusbar {\n    font-size: 12px;\n    font-weight: 400;\n    margin-top: 10px;\n}\n\n.button-close {\n    width: 13px;\n    margin-left: 3px;\n    display: inline-block;\n}\n.button-close:hover {\n    cursor: pointer;\n}\n\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./style/codelist.css":
/*!******************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./style/codelist.css ***!
  \******************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ./images/arrow.svg */ "./style/images/arrow.svg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(/*! ./images/search.svg */ "./style/images/search.svg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_2___ = new URL(/* asset import */ __webpack_require__(/*! ./images/uparrow.svg */ "./style/images/uparrow.svg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_3___ = new URL(/* asset import */ __webpack_require__(/*! ./images/downarrow.svg */ "./style/images/downarrow.svg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_4___ = new URL(/* asset import */ __webpack_require__(/*! ./images/leftarrow.svg */ "./style/images/leftarrow.svg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_5___ = new URL(/* asset import */ __webpack_require__(/*! ./images/rightarrow.svg */ "./style/images/rightarrow.svg"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_2___);
var ___CSS_LOADER_URL_REPLACEMENT_3___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_3___);
var ___CSS_LOADER_URL_REPLACEMENT_4___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_4___);
var ___CSS_LOADER_URL_REPLACEMENT_5___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_5___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `@charset "uft-8";

.ankus-code-list-wrap {
    height: calc(100% - 10px);
    /* min-height: 400px; */
    /* margin-left: 4px; */
    padding-top: 12px;
    background-color: var(--jp-layout-color1);
}

.ankus-code-list-wrap .go-icon {
    width: 18px;
    background-image: url(${___CSS_LOADER_URL_REPLACEMENT_0___});
    background-repeat: no-repeat;
    background-position: center;
}

.search-wrap {
    display: flex;
    justify-content: flex-start;
    margin-left: 4px;
}

#input-search-word::placeholder {
    font-size: 12px;
}

.ankus-code-list-wrap .search-btn {
    width: 30px;
    height: 24px;
    margin-right: 4px;
    border:1px solid var(--jp-toolbar-border-color);
    /* border-left: none; */
    border-radius: 0;
    box-sizing: border-box;
    background-color: transparent;
    background-image: url(${___CSS_LOADER_URL_REPLACEMENT_1___});
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
    padding-right: 22px;
}
.ankus-code-list-wrap .search-btn:hover {
    background-color: var(--jp-layout-color2);
}

.ankus-code-list-wrap .title {
    margin-top: 0;
    display: flex;
    box-sizing: border-box;
    border: 1px solid var(--jp-toolbar-border-color);
    box-shadow: var(--jp-toolbar-box-shadow);
    color: var(--jp-ui-font-color1);
}
.ankus-code-list-wrap .title > div {
    height: 18px;
    display: flex;
    align-items: center;
    padding: 3px 6px 3px 6px;
    cursor: pointer;
}
.ankus-code-list-wrap .title > div:hover {
    background-color: var(--jp-layout-color2);
}

.ankus-code-list-wrap .title .name-wrap {
    width: calc(100% - 160px);
    flex: auto;
    justify-content: space-between;
    border-right: 1px solid var(--jp-toolbar-border-color);
}

.ankus-code-list-wrap .name-up {
    width: 10px;
    height: 8px;
    border: none;
    background-color: transparent;
    background-image: url(${___CSS_LOADER_URL_REPLACEMENT_2___});
    background-repeat: no-repeat;
    background-position: center;
    color: var(--jp-ui-font-color1);
}
.ankus-code-list-wrap .name-down {
    width: 10px;
    height: 8px;
    border: none;
    background-color: transparent;
    background-image: url(${___CSS_LOADER_URL_REPLACEMENT_3___});
    background-repeat: no-repeat;
    background-position: center;
    color: var(--jp-ui-font-color1);
}

.ankus-code-list-wrap .title .date-wrap {
    width: 160px;
    justify-content: right;
    position: relative;
}
.ankus-code-list-wrap .date-wrap p {
    margin-left: 10px;
}

.ankus-code-list-wrap .date-up {
    width: 10px;
    height: 8px;
    border: none;
    background-color: transparent;
    background-image: url(${___CSS_LOADER_URL_REPLACEMENT_2___});
    background-repeat: no-repeat;
    background-position: center;
    position: absolute;
    left: 6px;
    top: 7px;
    z-index: 200;
}
.ankus-code-list-wrap .date-down {
    width: 10px;
    height: 8px;
    border: none;
    background-color: transparent;
    background-image: url(${___CSS_LOADER_URL_REPLACEMENT_3___});
    background-repeat: no-repeat;
    background-position: center;
    position: absolute;
    left: 6px;
    top: 7px;
    z-index: 200;
}

.ankus-code-list-wrap .code-item {
    width: 100%;
    line-height: 1.5;
    padding-top : 8px;
    padding-bottom: 6px;
    border-bottom: 1px solid var(--jp-border-color2);
    cursor: pointer;
    color: var(--jp-ui-font-color1);
}
.ankus-code-list-wrap .code-item:hover {
    background-color: var(--jp-layout-color2);
}
.ankus-code-list-wrap .code-item.sel-code {
    background-color: var(--jp-brand-color1);
    color: var(--jp-ui-inverse-font-color1);
}

.ankus-code-list-wrap .code-item p {
    margin: 1px 10px;
}

/* code name */
.ankus-code-list-wrap .code-item p:nth-child(1) {
    color: var(--jp-brand-color1);
}
.ankus-code-list-wrap .code-item.sel-code p:nth-child(1) {
    color: var(--jp-ui-inverse-font-color0);
}

/* description */
.ankus-code-list-wrap .code-item p:nth-child(2) {
    font-size: 14px;
    font-weight: 400;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

/* tag list */
.ankus-code-list-wrap .code-item p:nth-child(3) {
    font-size: 14px;
    font-weight: 600;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

/* writer, date */
.ankus-code-list-wrap .code-item p:nth-child(4) {
    font-size: 14px;
    font-weight: 400;
    color: var(--jp-ui-font-color2);
    margin-top: 12px;
}
.ankus-code-list-wrap .code-item p:nth-child(4) span {
    font-size: 14px;
    font-weight: 500;
    margin-top: 12px;
    margin-right: 2px;
}
.ankus-code-list-wrap .code-item.sel-code p:nth-child(4) {
    color: var(--jp-ui-inverse-font-color1);
}

/* .ankus-code-list-wrap .code-menu {
    width: 6px;
    height: 16px;
    border: none;
    background-color: transparent;
    background-image: url('./images/menu.svg');
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
    margin-top: 2px;
    margin-right: 8px;
}
.ankus-code-list-wrap .code-item.sel-code .code-menu {
    background-image: url('./images/click_menu.svg');
}
.ankus-code-list-wrap .code-menu:hover {
    color: 'var(--jp-ui-font-color2)'
} */

.ankus-code-list-wrap .page {
    margin-top: 10px;
    letter-spacing: 10px;
    display: flex;
    justify-content: center;
    color: var(--jp-ui-font-color1); 
}
.ankus-code-list-wrap .page button {
    width: 6px;
    height: 16px;
    border: none;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
}
.ankus-code-list-wrap .page button:hover {
    background-color: var(--jp-layout-color2);
    /* background-image: url('./images/leftarrow_h.svg'); */
}
.ankus-code-list-wrap .page button:disabled {
    background-color: transparent;
    cursor: auto;
}

.ankus-code-list-wrap .page button:first-child {
    margin-right: 6px;
    background-image: url(${___CSS_LOADER_URL_REPLACEMENT_4___});
}
.ankus-code-list-wrap .page button:last-child {
    background-image: url(${___CSS_LOADER_URL_REPLACEMENT_5___});
}`, "",{"version":3,"sources":["webpack://./style/codelist.css"],"names":[],"mappings":"AAAA,gBAAgB;;AAEhB;IACI,yBAAyB;IACzB,uBAAuB;IACvB,sBAAsB;IACtB,iBAAiB;IACjB,yCAAyC;AAC7C;;AAEA;IACI,WAAW;IACX,yDAA2C;IAC3C,4BAA4B;IAC5B,2BAA2B;AAC/B;;AAEA;IACI,aAAa;IACb,2BAA2B;IAC3B,gBAAgB;AACpB;;AAEA;IACI,eAAe;AACnB;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,iBAAiB;IACjB,+CAA+C;IAC/C,uBAAuB;IACvB,gBAAgB;IAChB,sBAAsB;IACtB,6BAA6B;IAC7B,yDAA4C;IAC5C,4BAA4B;IAC5B,2BAA2B;IAC3B,eAAe;IACf,mBAAmB;AACvB;AACA;IACI,yCAAyC;AAC7C;;AAEA;IACI,aAAa;IACb,aAAa;IACb,sBAAsB;IACtB,gDAAgD;IAChD,wCAAwC;IACxC,+BAA+B;AACnC;AACA;IACI,YAAY;IACZ,aAAa;IACb,mBAAmB;IACnB,wBAAwB;IACxB,eAAe;AACnB;AACA;IACI,yCAAyC;AAC7C;;AAEA;IACI,yBAAyB;IACzB,UAAU;IACV,8BAA8B;IAC9B,sDAAsD;AAC1D;;AAEA;IACI,WAAW;IACX,WAAW;IACX,YAAY;IACZ,6BAA6B;IAC7B,yDAA6C;IAC7C,4BAA4B;IAC5B,2BAA2B;IAC3B,+BAA+B;AACnC;AACA;IACI,WAAW;IACX,WAAW;IACX,YAAY;IACZ,6BAA6B;IAC7B,yDAA+C;IAC/C,4BAA4B;IAC5B,2BAA2B;IAC3B,+BAA+B;AACnC;;AAEA;IACI,YAAY;IACZ,sBAAsB;IACtB,kBAAkB;AACtB;AACA;IACI,iBAAiB;AACrB;;AAEA;IACI,WAAW;IACX,WAAW;IACX,YAAY;IACZ,6BAA6B;IAC7B,yDAA6C;IAC7C,4BAA4B;IAC5B,2BAA2B;IAC3B,kBAAkB;IAClB,SAAS;IACT,QAAQ;IACR,YAAY;AAChB;AACA;IACI,WAAW;IACX,WAAW;IACX,YAAY;IACZ,6BAA6B;IAC7B,yDAA+C;IAC/C,4BAA4B;IAC5B,2BAA2B;IAC3B,kBAAkB;IAClB,SAAS;IACT,QAAQ;IACR,YAAY;AAChB;;AAEA;IACI,WAAW;IACX,gBAAgB;IAChB,iBAAiB;IACjB,mBAAmB;IACnB,gDAAgD;IAChD,eAAe;IACf,+BAA+B;AACnC;AACA;IACI,yCAAyC;AAC7C;AACA;IACI,wCAAwC;IACxC,uCAAuC;AAC3C;;AAEA;IACI,gBAAgB;AACpB;;AAEA,cAAc;AACd;IACI,6BAA6B;AACjC;AACA;IACI,uCAAuC;AAC3C;;AAEA,gBAAgB;AAChB;IACI,eAAe;IACf,gBAAgB;IAChB,gBAAgB;IAChB,mBAAmB;IACnB,uBAAuB;AAC3B;;AAEA,aAAa;AACb;IACI,eAAe;IACf,gBAAgB;IAChB,gBAAgB;IAChB,mBAAmB;IACnB,uBAAuB;AAC3B;;AAEA,iBAAiB;AACjB;IACI,eAAe;IACf,gBAAgB;IAChB,+BAA+B;IAC/B,gBAAgB;AACpB;AACA;IACI,eAAe;IACf,gBAAgB;IAChB,gBAAgB;IAChB,iBAAiB;AACrB;AACA;IACI,uCAAuC;AAC3C;;AAEA;;;;;;;;;;;;;;;;;GAiBG;;AAEH;IACI,gBAAgB;IAChB,oBAAoB;IACpB,aAAa;IACb,uBAAuB;IACvB,+BAA+B;AACnC;AACA;IACI,UAAU;IACV,YAAY;IACZ,YAAY;IACZ,6BAA6B;IAC7B,4BAA4B;IAC5B,2BAA2B;IAC3B,eAAe;AACnB;AACA;IACI,yCAAyC;IACzC,uDAAuD;AAC3D;AACA;IACI,6BAA6B;IAC7B,YAAY;AAChB;;AAEA;IACI,iBAAiB;IACjB,yDAA+C;AACnD;AACA;IACI,yDAAgD;AACpD","sourcesContent":["@charset \"uft-8\";\n\n.ankus-code-list-wrap {\n    height: calc(100% - 10px);\n    /* min-height: 400px; */\n    /* margin-left: 4px; */\n    padding-top: 12px;\n    background-color: var(--jp-layout-color1);\n}\n\n.ankus-code-list-wrap .go-icon {\n    width: 18px;\n    background-image: url('./images/arrow.svg');\n    background-repeat: no-repeat;\n    background-position: center;\n}\n\n.search-wrap {\n    display: flex;\n    justify-content: flex-start;\n    margin-left: 4px;\n}\n\n#input-search-word::placeholder {\n    font-size: 12px;\n}\n\n.ankus-code-list-wrap .search-btn {\n    width: 30px;\n    height: 24px;\n    margin-right: 4px;\n    border:1px solid var(--jp-toolbar-border-color);\n    /* border-left: none; */\n    border-radius: 0;\n    box-sizing: border-box;\n    background-color: transparent;\n    background-image: url('./images/search.svg');\n    background-repeat: no-repeat;\n    background-position: center;\n    cursor: pointer;\n    padding-right: 22px;\n}\n.ankus-code-list-wrap .search-btn:hover {\n    background-color: var(--jp-layout-color2);\n}\n\n.ankus-code-list-wrap .title {\n    margin-top: 0;\n    display: flex;\n    box-sizing: border-box;\n    border: 1px solid var(--jp-toolbar-border-color);\n    box-shadow: var(--jp-toolbar-box-shadow);\n    color: var(--jp-ui-font-color1);\n}\n.ankus-code-list-wrap .title > div {\n    height: 18px;\n    display: flex;\n    align-items: center;\n    padding: 3px 6px 3px 6px;\n    cursor: pointer;\n}\n.ankus-code-list-wrap .title > div:hover {\n    background-color: var(--jp-layout-color2);\n}\n\n.ankus-code-list-wrap .title .name-wrap {\n    width: calc(100% - 160px);\n    flex: auto;\n    justify-content: space-between;\n    border-right: 1px solid var(--jp-toolbar-border-color);\n}\n\n.ankus-code-list-wrap .name-up {\n    width: 10px;\n    height: 8px;\n    border: none;\n    background-color: transparent;\n    background-image: url('./images/uparrow.svg');\n    background-repeat: no-repeat;\n    background-position: center;\n    color: var(--jp-ui-font-color1);\n}\n.ankus-code-list-wrap .name-down {\n    width: 10px;\n    height: 8px;\n    border: none;\n    background-color: transparent;\n    background-image: url('./images/downarrow.svg');\n    background-repeat: no-repeat;\n    background-position: center;\n    color: var(--jp-ui-font-color1);\n}\n\n.ankus-code-list-wrap .title .date-wrap {\n    width: 160px;\n    justify-content: right;\n    position: relative;\n}\n.ankus-code-list-wrap .date-wrap p {\n    margin-left: 10px;\n}\n\n.ankus-code-list-wrap .date-up {\n    width: 10px;\n    height: 8px;\n    border: none;\n    background-color: transparent;\n    background-image: url('./images/uparrow.svg');\n    background-repeat: no-repeat;\n    background-position: center;\n    position: absolute;\n    left: 6px;\n    top: 7px;\n    z-index: 200;\n}\n.ankus-code-list-wrap .date-down {\n    width: 10px;\n    height: 8px;\n    border: none;\n    background-color: transparent;\n    background-image: url('./images/downarrow.svg');\n    background-repeat: no-repeat;\n    background-position: center;\n    position: absolute;\n    left: 6px;\n    top: 7px;\n    z-index: 200;\n}\n\n.ankus-code-list-wrap .code-item {\n    width: 100%;\n    line-height: 1.5;\n    padding-top : 8px;\n    padding-bottom: 6px;\n    border-bottom: 1px solid var(--jp-border-color2);\n    cursor: pointer;\n    color: var(--jp-ui-font-color1);\n}\n.ankus-code-list-wrap .code-item:hover {\n    background-color: var(--jp-layout-color2);\n}\n.ankus-code-list-wrap .code-item.sel-code {\n    background-color: var(--jp-brand-color1);\n    color: var(--jp-ui-inverse-font-color1);\n}\n\n.ankus-code-list-wrap .code-item p {\n    margin: 1px 10px;\n}\n\n/* code name */\n.ankus-code-list-wrap .code-item p:nth-child(1) {\n    color: var(--jp-brand-color1);\n}\n.ankus-code-list-wrap .code-item.sel-code p:nth-child(1) {\n    color: var(--jp-ui-inverse-font-color0);\n}\n\n/* description */\n.ankus-code-list-wrap .code-item p:nth-child(2) {\n    font-size: 14px;\n    font-weight: 400;\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n}\n\n/* tag list */\n.ankus-code-list-wrap .code-item p:nth-child(3) {\n    font-size: 14px;\n    font-weight: 600;\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n}\n\n/* writer, date */\n.ankus-code-list-wrap .code-item p:nth-child(4) {\n    font-size: 14px;\n    font-weight: 400;\n    color: var(--jp-ui-font-color2);\n    margin-top: 12px;\n}\n.ankus-code-list-wrap .code-item p:nth-child(4) span {\n    font-size: 14px;\n    font-weight: 500;\n    margin-top: 12px;\n    margin-right: 2px;\n}\n.ankus-code-list-wrap .code-item.sel-code p:nth-child(4) {\n    color: var(--jp-ui-inverse-font-color1);\n}\n\n/* .ankus-code-list-wrap .code-menu {\n    width: 6px;\n    height: 16px;\n    border: none;\n    background-color: transparent;\n    background-image: url('./images/menu.svg');\n    background-repeat: no-repeat;\n    background-position: center;\n    cursor: pointer;\n    margin-top: 2px;\n    margin-right: 8px;\n}\n.ankus-code-list-wrap .code-item.sel-code .code-menu {\n    background-image: url('./images/click_menu.svg');\n}\n.ankus-code-list-wrap .code-menu:hover {\n    color: 'var(--jp-ui-font-color2)'\n} */\n\n.ankus-code-list-wrap .page {\n    margin-top: 10px;\n    letter-spacing: 10px;\n    display: flex;\n    justify-content: center;\n    color: var(--jp-ui-font-color1); \n}\n.ankus-code-list-wrap .page button {\n    width: 6px;\n    height: 16px;\n    border: none;\n    background-color: transparent;\n    background-repeat: no-repeat;\n    background-position: center;\n    cursor: pointer;\n}\n.ankus-code-list-wrap .page button:hover {\n    background-color: var(--jp-layout-color2);\n    /* background-image: url('./images/leftarrow_h.svg'); */\n}\n.ankus-code-list-wrap .page button:disabled {\n    background-color: transparent;\n    cursor: auto;\n}\n\n.ankus-code-list-wrap .page button:first-child {\n    margin-right: 6px;\n    background-image: url('./images/leftarrow.svg');\n}\n.ankus-code-list-wrap .page button:last-child {\n    background-image: url('./images/rightarrow.svg');\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./style/sidebar.css":
/*!*****************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./style/sidebar.css ***!
  \*****************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ./images/id.svg */ "./style/images/id.svg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(/*! ./images/id_f.svg */ "./style/images/id_f.svg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_2___ = new URL(/* asset import */ __webpack_require__(/*! ./images/pw.svg */ "./style/images/pw.svg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_3___ = new URL(/* asset import */ __webpack_require__(/*! ./images/pw_f.svg */ "./style/images/pw_f.svg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_4___ = new URL(/* asset import */ __webpack_require__(/*! ./images/web.svg */ "./style/images/web.svg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_5___ = new URL(/* asset import */ __webpack_require__(/*! ./images/web_f.svg */ "./style/images/web_f.svg"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_2___);
var ___CSS_LOADER_URL_REPLACEMENT_3___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_3___);
var ___CSS_LOADER_URL_REPLACEMENT_4___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_4___);
var ___CSS_LOADER_URL_REPLACEMENT_5___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_5___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `@charset "uft-8";

body {font-family: 'Noto Sans', sans-serif;}

.ankus-container .inputLogin {
    width: 158px;
    height: 30px;
    margin-left: 15px;
    margin-bottom: 10px;
    padding-left: 30px;
    background-repeat: no-repeat;
    background-position: 6%;
    font-size: 14px;
    border: 1px solid var(--jp-border-color2);
    background-color: var(--jp-layout-color1);
    color: var(--jp-ui-font-color0);
}
.ankus-container .inputLogin:focus {
    outline: none;
    border-color: #6495ED;
}

.ankus-container .inpID {
    margin-top: 20px;
    background-image: url(${___CSS_LOADER_URL_REPLACEMENT_0___});
}
.ankus-container .inpID:focus {
    background-image: url(${___CSS_LOADER_URL_REPLACEMENT_1___});
}

.ankus-container .inpPw {
    background-image: url(${___CSS_LOADER_URL_REPLACEMENT_2___});
}
.ankus-container .inpPw:focus {
    background-image: url(${___CSS_LOADER_URL_REPLACEMENT_3___});
}

.ankus-container .inputUrl {
    padding-left: 25px;
    margin-top: 20px;
    background-image: url(${___CSS_LOADER_URL_REPLACEMENT_4___});
    background-position: 3%;
}
.ankus-container .inputUrl:focus {
    background-image: url(${___CSS_LOADER_URL_REPLACEMENT_5___});
}

.ankus-container .remstyle {
    margin-left: 12px;
    font-size: 12px;
    vertical-align: center;
    color: var(--jp-ui-font-color0);
}
.ankus-container .remstyle label {
    display: flex;
    align-items: center;
}

.ankus-container .btnLogin {
    width: 180px;
    height: 30px;
    background-color: var(--ankus-control-color);
    color: white;
    font-size: 14px;
    font-weight: 100;
    margin-top: 34px;
    margin-left: 15px;
    border: none;
    cursor: pointer;
}
.ankus-container .btnLogin:disabled {
    background-color: var(--ankus-disable-color);
    cursor: auto;
}

.ankus-container .errmsg {
    margin-left: 70px;
    margin-top: 8px;
    color: red;
    font-size: 12px;
}

.ankus-container .inputUrl {
    font-size: 14px;
    background-color: transparent;
    border: 1px solid var(--jp-border-color2);
    width: 220px;
    height: 27px;
    margin: 20px 0 5px 0;
    display: flex;
    align-items: center;
}

.ankus-container .inputUrl input:focus {
    border-color: #6495ED;
}

.ankus-sidebar-icon {
    width: 29px;
    padding: 0;
    margin: 0;
}
.ankus-sidebar-icon .cls-1 {
    fill: var(--jp-inverse-layout-color3);
}

.ankus-term-title-btn {
    background-color: transparent;
    color: var(--jp-ui-font-color1);
    height: 20px;
    border: none;
    padding: 0 5px;
    margin: 0;
    vertical-align: middle;
    font-size: 11px;
    font-weight: bold;
    cursor: pointer;
  }
  .ankus-term-title-btn:hover {
    color: var(--jp-ui-font-color2);
}`, "",{"version":3,"sources":["webpack://./style/sidebar.css"],"names":[],"mappings":"AAAA,gBAAgB;;AAEhB,MAAM,oCAAoC,CAAC;;AAE3C;IACI,YAAY;IACZ,YAAY;IACZ,iBAAiB;IACjB,mBAAmB;IACnB,kBAAkB;IAClB,4BAA4B;IAC5B,uBAAuB;IACvB,eAAe;IACf,yCAAyC;IACzC,yCAAyC;IACzC,+BAA+B;AACnC;AACA;IACI,aAAa;IACb,qBAAqB;AACzB;;AAEA;IACI,gBAAgB;IAChB,yDAAwC;AAC5C;AACA;IACI,yDAA0C;AAC9C;;AAEA;IACI,yDAAwC;AAC5C;AACA;IACI,yDAA0C;AAC9C;;AAEA;IACI,kBAAkB;IAClB,gBAAgB;IAChB,yDAAyC;IACzC,uBAAuB;AAC3B;AACA;IACI,yDAA2C;AAC/C;;AAEA;IACI,iBAAiB;IACjB,eAAe;IACf,sBAAsB;IACtB,+BAA+B;AACnC;AACA;IACI,aAAa;IACb,mBAAmB;AACvB;;AAEA;IACI,YAAY;IACZ,YAAY;IACZ,4CAA4C;IAC5C,YAAY;IACZ,eAAe;IACf,gBAAgB;IAChB,gBAAgB;IAChB,iBAAiB;IACjB,YAAY;IACZ,eAAe;AACnB;AACA;IACI,4CAA4C;IAC5C,YAAY;AAChB;;AAEA;IACI,iBAAiB;IACjB,eAAe;IACf,UAAU;IACV,eAAe;AACnB;;AAEA;IACI,eAAe;IACf,6BAA6B;IAC7B,yCAAyC;IACzC,YAAY;IACZ,YAAY;IACZ,oBAAoB;IACpB,aAAa;IACb,mBAAmB;AACvB;;AAEA;IACI,qBAAqB;AACzB;;AAEA;IACI,WAAW;IACX,UAAU;IACV,SAAS;AACb;AACA;IACI,qCAAqC;AACzC;;AAEA;IACI,6BAA6B;IAC7B,+BAA+B;IAC/B,YAAY;IACZ,YAAY;IACZ,cAAc;IACd,SAAS;IACT,sBAAsB;IACtB,eAAe;IACf,iBAAiB;IACjB,eAAe;EACjB;EACA;IACE,+BAA+B;AACnC","sourcesContent":["@charset \"uft-8\";\n\nbody {font-family: 'Noto Sans', sans-serif;}\n\n.ankus-container .inputLogin {\n    width: 158px;\n    height: 30px;\n    margin-left: 15px;\n    margin-bottom: 10px;\n    padding-left: 30px;\n    background-repeat: no-repeat;\n    background-position: 6%;\n    font-size: 14px;\n    border: 1px solid var(--jp-border-color2);\n    background-color: var(--jp-layout-color1);\n    color: var(--jp-ui-font-color0);\n}\n.ankus-container .inputLogin:focus {\n    outline: none;\n    border-color: #6495ED;\n}\n\n.ankus-container .inpID {\n    margin-top: 20px;\n    background-image: url('./images/id.svg');\n}\n.ankus-container .inpID:focus {\n    background-image: url('./images/id_f.svg');\n}\n\n.ankus-container .inpPw {\n    background-image: url('./images/pw.svg');\n}\n.ankus-container .inpPw:focus {\n    background-image: url('./images/pw_f.svg');\n}\n\n.ankus-container .inputUrl {\n    padding-left: 25px;\n    margin-top: 20px;\n    background-image: url('./images/web.svg');\n    background-position: 3%;\n}\n.ankus-container .inputUrl:focus {\n    background-image: url('./images/web_f.svg');\n}\n\n.ankus-container .remstyle {\n    margin-left: 12px;\n    font-size: 12px;\n    vertical-align: center;\n    color: var(--jp-ui-font-color0);\n}\n.ankus-container .remstyle label {\n    display: flex;\n    align-items: center;\n}\n\n.ankus-container .btnLogin {\n    width: 180px;\n    height: 30px;\n    background-color: var(--ankus-control-color);\n    color: white;\n    font-size: 14px;\n    font-weight: 100;\n    margin-top: 34px;\n    margin-left: 15px;\n    border: none;\n    cursor: pointer;\n}\n.ankus-container .btnLogin:disabled {\n    background-color: var(--ankus-disable-color);\n    cursor: auto;\n}\n\n.ankus-container .errmsg {\n    margin-left: 70px;\n    margin-top: 8px;\n    color: red;\n    font-size: 12px;\n}\n\n.ankus-container .inputUrl {\n    font-size: 14px;\n    background-color: transparent;\n    border: 1px solid var(--jp-border-color2);\n    width: 220px;\n    height: 27px;\n    margin: 20px 0 5px 0;\n    display: flex;\n    align-items: center;\n}\n\n.ankus-container .inputUrl input:focus {\n    border-color: #6495ED;\n}\n\n.ankus-sidebar-icon {\n    width: 29px;\n    padding: 0;\n    margin: 0;\n}\n.ankus-sidebar-icon .cls-1 {\n    fill: var(--jp-inverse-layout-color3);\n}\n\n.ankus-term-title-btn {\n    background-color: transparent;\n    color: var(--jp-ui-font-color1);\n    height: 20px;\n    border: none;\n    padding: 0 5px;\n    margin: 0;\n    vertical-align: middle;\n    font-size: 11px;\n    font-weight: bold;\n    cursor: pointer;\n  }\n  .ankus-term-title-btn:hover {\n    color: var(--jp-ui-font-color2);\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./style/standardterm.css":
/*!**********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./style/standardterm.css ***!
  \**********************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `@charset "uft-8";

.ankus-standard-wrap {
    height: calc(100% - 15px);
    width: 100%;
    flex-grow: 1;
    background-color: var(--jp-layout-color1);
    color: var(--jp-ui-font-color1);
}

.ankus-standard-wrap .btn-search {
    background-color: transparent;
    color: var(--jp-ui-font-color1);
    border: none;
    padding: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}
.ankus-standard-wrap .btn-search:hover {
    color: var(--jp-ui-font-color3);
}
.ankus-standard-wrap .btn-search:disabled {
    color: var(--ankus-disable-color);
    cursor: auto;
}

.ankus-std-order-title {
    display: flex;
    box-sizing: border-box;
    border: 1px solid var(--jp-border-color2);
    font-size: 11px;
    height: 20px;
}
.ankus-std-order-title > div {
    display: flex; 
    justify-content: space-between;
    padding: 3px 6px 3px 6px;
    cursor: pointer;
}
.ankus-std-order-title > div:hover {    
    background-color: var(--jp-layout-color2);
}

/* name order */
.ankus-std-order-title .name-tab {
    width: 45%;
    flex: auto;
    border-right: 1px solid var(--jp-border-color2);
}

/* english name order */
.ankus-std-order-title .eng-tab {
    width: 55%;
}
.ankus-std-order-title .eng-tab p {
    margin: 0 0 0 10px;
}

.ankus-std-btn-order {
    width: 15px;
    height: 15px;
    border: none;
    background-color: transparent;
    margin: 0;
    padding: 0;
    justify-content: center;
    z-index: '200'
}

.ankus-std-term-list {
    overflow: auto;
    height: calc(100% - 35px);
    background-color: var(--jp-layout-color0);
    font-family: var(--jp-content-font-family);
}

.ankus-std-term {
    width: calc(100% - 7px);
    /* line-height: 1.5; */
    font-size: 11px;
    border-bottom: 1px solid var(--jp-border-color2);
    padding : 3px;
    cursor: pointer;
}
.ankus-std-term:hover {
    background-color: var(--jp-layout-color2);
}
.ankus-std-term p {
    margin: 2px 3px;
}

.ankus-std-term .keyword {
    color: var(--jp-error-color1);
}

.ankus-std-term p:nth-child(2) {
    word-break: break-all;
    font-size: 10px;
    color: var(--jp-content-font-color2);
}
.ankus-std-term p:nth-child(3) {
    color: var(--jp-content-font-color2);
    font-size: 10px;
}

.ankus-term-autocompl-menu {
    position: fixed;
    z-index: 99;
    background-color: #FFFAFA; 
    border: 1px solid #C0C0C0;
    min-width: 150px;
    /* overflow-y: auto; */
}

.ankus-completer-sel {
    background-color: #87CEFA;
}

.ankus-term-autocompl-menu dl {
    padding: 2px;
    margin: 0;
    max-height: 300px;
    max-width: 300px;
    overflow-y: auto;
}
.ankus-term-autocompl-menu dt {
    padding: 2px;
}
.ankus-term-autocompl-menu dt:hover {
    background-color: #DCDCDC;
}
.ankus-term-autocompl-menu dd {
    font-size: 10px;
    color: #696969;
    /* text-overflow: ellipsis; */
}

.ankus-term-setting-input {
    border: 1px solid var(--jp-input-border-color);
    width: 100%;
    margin: 0;
    padding: 0;
}
.ankus-term-setting-input>input {
    width: calc(100% - 30px);
    height: 30px;
    background-color: transparent;
    color: var(--jp-ui-font-color0);
    border: none;
    font-size: 14px;
}
.ankus-term-setting-input>.del-btn:disabled svg {
    color: var(--ankus-disable-color)
}
.ankus-term-setting-input>.del-btn:hover {
    color: var(--jp-ui-font-color2);
}

.ankus-term-setting-catlist {
    overflow: auto;
    background-color: var(--jp-layout-color1);
    border: 1px solid var(--jp-border-color1);
}
.ankus-term-setting-catlist li:hover {
    background-color: var(--jp-layout-color2);
}
/* dictionary setting > category list > select category */ 
.ankus-term-setting-catlist li .Mui-selected {
    background-color: var(--jp-brand-color1);
    color: var(--jp-ui-inverse-font-color1);
}

.ankus-dict-tm-list .Mui-selected {
    color: var(--jp-ui-inverse-font-color1);
}
`, "",{"version":3,"sources":["webpack://./style/standardterm.css"],"names":[],"mappings":"AAAA,gBAAgB;;AAEhB;IACI,yBAAyB;IACzB,WAAW;IACX,YAAY;IACZ,yCAAyC;IACzC,+BAA+B;AACnC;;AAEA;IACI,6BAA6B;IAC7B,+BAA+B;IAC/B,YAAY;IACZ,UAAU;IACV,YAAY;IACZ,aAAa;IACb,uBAAuB;IACvB,mBAAmB;IACnB,eAAe;AACnB;AACA;IACI,+BAA+B;AACnC;AACA;IACI,iCAAiC;IACjC,YAAY;AAChB;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,yCAAyC;IACzC,eAAe;IACf,YAAY;AAChB;AACA;IACI,aAAa;IACb,8BAA8B;IAC9B,wBAAwB;IACxB,eAAe;AACnB;AACA;IACI,yCAAyC;AAC7C;;AAEA,eAAe;AACf;IACI,UAAU;IACV,UAAU;IACV,+CAA+C;AACnD;;AAEA,uBAAuB;AACvB;IACI,UAAU;AACd;AACA;IACI,kBAAkB;AACtB;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,YAAY;IACZ,6BAA6B;IAC7B,SAAS;IACT,UAAU;IACV,uBAAuB;IACvB;AACJ;;AAEA;IACI,cAAc;IACd,yBAAyB;IACzB,yCAAyC;IACzC,0CAA0C;AAC9C;;AAEA;IACI,uBAAuB;IACvB,sBAAsB;IACtB,eAAe;IACf,gDAAgD;IAChD,aAAa;IACb,eAAe;AACnB;AACA;IACI,yCAAyC;AAC7C;AACA;IACI,eAAe;AACnB;;AAEA;IACI,6BAA6B;AACjC;;AAEA;IACI,qBAAqB;IACrB,eAAe;IACf,oCAAoC;AACxC;AACA;IACI,oCAAoC;IACpC,eAAe;AACnB;;AAEA;IACI,eAAe;IACf,WAAW;IACX,yBAAyB;IACzB,yBAAyB;IACzB,gBAAgB;IAChB,sBAAsB;AAC1B;;AAEA;IACI,yBAAyB;AAC7B;;AAEA;IACI,YAAY;IACZ,SAAS;IACT,iBAAiB;IACjB,gBAAgB;IAChB,gBAAgB;AACpB;AACA;IACI,YAAY;AAChB;AACA;IACI,yBAAyB;AAC7B;AACA;IACI,eAAe;IACf,cAAc;IACd,6BAA6B;AACjC;;AAEA;IACI,8CAA8C;IAC9C,WAAW;IACX,SAAS;IACT,UAAU;AACd;AACA;IACI,wBAAwB;IACxB,YAAY;IACZ,6BAA6B;IAC7B,+BAA+B;IAC/B,YAAY;IACZ,eAAe;AACnB;AACA;IACI;AACJ;AACA;IACI,+BAA+B;AACnC;;AAEA;IACI,cAAc;IACd,yCAAyC;IACzC,yCAAyC;AAC7C;AACA;IACI,yCAAyC;AAC7C;AACA,yDAAyD;AACzD;IACI,wCAAwC;IACxC,uCAAuC;AAC3C;;AAEA;IACI,uCAAuC;AAC3C","sourcesContent":["@charset \"uft-8\";\n\n.ankus-standard-wrap {\n    height: calc(100% - 15px);\n    width: 100%;\n    flex-grow: 1;\n    background-color: var(--jp-layout-color1);\n    color: var(--jp-ui-font-color1);\n}\n\n.ankus-standard-wrap .btn-search {\n    background-color: transparent;\n    color: var(--jp-ui-font-color1);\n    border: none;\n    padding: 0;\n    height: 100%;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    cursor: pointer;\n}\n.ankus-standard-wrap .btn-search:hover {\n    color: var(--jp-ui-font-color3);\n}\n.ankus-standard-wrap .btn-search:disabled {\n    color: var(--ankus-disable-color);\n    cursor: auto;\n}\n\n.ankus-std-order-title {\n    display: flex;\n    box-sizing: border-box;\n    border: 1px solid var(--jp-border-color2);\n    font-size: 11px;\n    height: 20px;\n}\n.ankus-std-order-title > div {\n    display: flex; \n    justify-content: space-between;\n    padding: 3px 6px 3px 6px;\n    cursor: pointer;\n}\n.ankus-std-order-title > div:hover {    \n    background-color: var(--jp-layout-color2);\n}\n\n/* name order */\n.ankus-std-order-title .name-tab {\n    width: 45%;\n    flex: auto;\n    border-right: 1px solid var(--jp-border-color2);\n}\n\n/* english name order */\n.ankus-std-order-title .eng-tab {\n    width: 55%;\n}\n.ankus-std-order-title .eng-tab p {\n    margin: 0 0 0 10px;\n}\n\n.ankus-std-btn-order {\n    width: 15px;\n    height: 15px;\n    border: none;\n    background-color: transparent;\n    margin: 0;\n    padding: 0;\n    justify-content: center;\n    z-index: '200'\n}\n\n.ankus-std-term-list {\n    overflow: auto;\n    height: calc(100% - 35px);\n    background-color: var(--jp-layout-color0);\n    font-family: var(--jp-content-font-family);\n}\n\n.ankus-std-term {\n    width: calc(100% - 7px);\n    /* line-height: 1.5; */\n    font-size: 11px;\n    border-bottom: 1px solid var(--jp-border-color2);\n    padding : 3px;\n    cursor: pointer;\n}\n.ankus-std-term:hover {\n    background-color: var(--jp-layout-color2);\n}\n.ankus-std-term p {\n    margin: 2px 3px;\n}\n\n.ankus-std-term .keyword {\n    color: var(--jp-error-color1);\n}\n\n.ankus-std-term p:nth-child(2) {\n    word-break: break-all;\n    font-size: 10px;\n    color: var(--jp-content-font-color2);\n}\n.ankus-std-term p:nth-child(3) {\n    color: var(--jp-content-font-color2);\n    font-size: 10px;\n}\n\n.ankus-term-autocompl-menu {\n    position: fixed;\n    z-index: 99;\n    background-color: #FFFAFA; \n    border: 1px solid #C0C0C0;\n    min-width: 150px;\n    /* overflow-y: auto; */\n}\n\n.ankus-completer-sel {\n    background-color: #87CEFA;\n}\n\n.ankus-term-autocompl-menu dl {\n    padding: 2px;\n    margin: 0;\n    max-height: 300px;\n    max-width: 300px;\n    overflow-y: auto;\n}\n.ankus-term-autocompl-menu dt {\n    padding: 2px;\n}\n.ankus-term-autocompl-menu dt:hover {\n    background-color: #DCDCDC;\n}\n.ankus-term-autocompl-menu dd {\n    font-size: 10px;\n    color: #696969;\n    /* text-overflow: ellipsis; */\n}\n\n.ankus-term-setting-input {\n    border: 1px solid var(--jp-input-border-color);\n    width: 100%;\n    margin: 0;\n    padding: 0;\n}\n.ankus-term-setting-input>input {\n    width: calc(100% - 30px);\n    height: 30px;\n    background-color: transparent;\n    color: var(--jp-ui-font-color0);\n    border: none;\n    font-size: 14px;\n}\n.ankus-term-setting-input>.del-btn:disabled svg {\n    color: var(--ankus-disable-color)\n}\n.ankus-term-setting-input>.del-btn:hover {\n    color: var(--jp-ui-font-color2);\n}\n\n.ankus-term-setting-catlist {\n    overflow: auto;\n    background-color: var(--jp-layout-color1);\n    border: 1px solid var(--jp-border-color1);\n}\n.ankus-term-setting-catlist li:hover {\n    background-color: var(--jp-layout-color2);\n}\n/* dictionary setting > category list > select category */ \n.ankus-term-setting-catlist li .Mui-selected {\n    background-color: var(--jp-brand-color1);\n    color: var(--jp-ui-inverse-font-color1);\n}\n\n.ankus-dict-tm-list .Mui-selected {\n    color: var(--jp-ui-inverse-font-color1);\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./style/codecontent.css":
/*!*******************************!*\
  !*** ./style/codecontent.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_codecontent_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./codecontent.css */ "./node_modules/css-loader/dist/cjs.js!./style/codecontent.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_codecontent_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_codecontent_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_codecontent_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_codecontent_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./style/codedesc.css":
/*!****************************!*\
  !*** ./style/codedesc.css ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_codedesc_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./codedesc.css */ "./node_modules/css-loader/dist/cjs.js!./style/codedesc.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_codedesc_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_codedesc_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_codedesc_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_codedesc_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./style/codeedit.css":
/*!****************************!*\
  !*** ./style/codeedit.css ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_codeedit_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./codeedit.css */ "./node_modules/css-loader/dist/cjs.js!./style/codeedit.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_codeedit_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_codeedit_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_codeedit_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_codeedit_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./style/codelist.css":
/*!****************************!*\
  !*** ./style/codelist.css ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_codelist_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./codelist.css */ "./node_modules/css-loader/dist/cjs.js!./style/codelist.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_codelist_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_codelist_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_codelist_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_codelist_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./style/sidebar.css":
/*!***************************!*\
  !*** ./style/sidebar.css ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_sidebar_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./sidebar.css */ "./node_modules/css-loader/dist/cjs.js!./style/sidebar.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_sidebar_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_sidebar_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_sidebar_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_sidebar_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./style/standardterm.css":
/*!********************************!*\
  !*** ./style/standardterm.css ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_standardterm_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./standardterm.css */ "./node_modules/css-loader/dist/cjs.js!./style/standardterm.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_standardterm_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_standardterm_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_standardterm_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_standardterm_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./style/images/ankusbg.png":
/*!**********************************!*\
  !*** ./style/images/ankusbg.png ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "66d24de7897815ff0e21.png";

/***/ }),

/***/ "./style/images/ankus.svg":
/*!********************************!*\
  !*** ./style/images/ankus.svg ***!
  \********************************/
/***/ ((module) => {

module.exports = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg id=\"Layer_2\" data-name=\"Layer 2\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 236.15 234.12\">\n  <defs>\n    <style>\n      .cls-1 {\n        fill: #b7b7b7;\n        stroke-width: 0px;\n      }\n    </style>\n  </defs>\n  <g id=\"Layer_1-2\" data-name=\"Layer 1\">\n    <path class=\"cls-1\" d=\"m145.76,0h-44.3v.07h0C58.84.07,24.29,34.62,24.29,77.24v45.66h.02v18.09c0,10.75,5.3,20.79-19.47,20.79-2.67,0-4.83,2.16-4.83,4.83v25.97c0,2.67,2.16,4.83,10.09,4.83h18.17c17.34-1.75,31.29-16.37,31.29-36.56v-.39h-.02v-32.73c0-2.67,2.16-4.83,4.83-4.83h32.26c2.67,0,4.83,2.16,4.83,4.83v64.6c0,2.67-2.16,4.83-4.83,4.83h-14.61c-2.67,0-4.83,2.16-4.83,4.83v27.28c0,2.67,2.16,4.83,4.83,4.83h19.45s0,0,0,0h45.92c60.95,0,88.77-49.37,88.77-111.5C236.15,54.43,210.88,0,145.76,0Zm-54.24,72.1c-6.1,0-11.05-4.95-11.05-11.05s4.95-11.05,11.05-11.05,11.05,4.95,11.05,11.05-4.95,11.05-11.05,11.05Zm41.87,28.55h-8.49c-1.45,0-2.63-1.5-2.63-3.36V29.31c0-1.85,1.18-3.36,2.63-3.36h8.08c16.76,0,23.26,17.36,23.26,39.12,0,19.83-7.16,35.58-22.84,35.58Z\"/>\n  </g>\n</svg>";

/***/ }),

/***/ "./style/images/arrow.svg":
/*!********************************!*\
  !*** ./style/images/arrow.svg ***!
  \********************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg id='%ea%b7%b8%eb%a3%b9_152' data-name='%ea%b7%b8%eb%a3%b9 152' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='12' height='12' viewBox='0 0 12 12'%3e %3cdefs%3e %3cclipPath id='clip-path'%3e %3crect id='%ec%82%ac%ea%b0%81%ed%98%95_120' data-name='%ec%82%ac%ea%b0%81%ed%98%95 120' width='12' height='12' fill='none'/%3e %3c/clipPath%3e %3c/defs%3e %3cg id='%ea%b7%b8%eb%a3%b9_151' data-name='%ea%b7%b8%eb%a3%b9 151' transform='translate(0 0)' clip-path='url(%23clip-path)'%3e %3cg id='%ea%b7%b8%eb%a3%b9_150' data-name='%ea%b7%b8%eb%a3%b9 150' style='isolation: isolate'%3e %3cg id='%ea%b7%b8%eb%a3%b9_149' data-name='%ea%b7%b8%eb%a3%b9 149'%3e %3cg id='%ea%b7%b8%eb%a3%b9_148' data-name='%ea%b7%b8%eb%a3%b9 148' clip-path='url(%23clip-path)'%3e %3cpath id='%ed%8c%a8%ec%8a%a4_43' data-name='%ed%8c%a8%ec%8a%a4 43' d='M11.629%2c3.783%2c6.061.04a.783.783%2c0%2c0%2c0-.528.021.765.765%2c0%2c0%2c0-.314.22c-.235.272-.131.657-.131.978v.487C2.027%2c1.891-.357%2c4.07.044%2c7.443a5.629%2c5.629%2c0%2c0%2c0%2c1.44%2c3.311c.071.075.142.144.214.211a4.5%2c4.5%2c0%2c0%2c0%2c1.659.991c.619.2.837-.288.642-.648a2.135%2c2.135%2c0%2c0%2c0-.619-.637C2.4%2c9.793%2c2%2c9.125%2c1.966%2c8.616a.979.979%2c0%2c0%2c1%2c.043-.376C2.4%2c7.048%2c5.088%2c6.99%2c5.088%2c6.99q.009.567.019%2c1.134a.593.593%2c0%2c0%2c0%2c.311.581.773.773%2c0%2c0%2c0%2c.783.017c.011-.007%2c5.146-3.309%2c5.627-3.85s-.2-1.09-.2-1.09' transform='translate(0 -0.001)' fill='%23208ade'/%3e %3c/g%3e %3c/g%3e %3c/g%3e %3c/g%3e %3c/svg%3e";

/***/ }),

/***/ "./style/images/downarrow.svg":
/*!************************************!*\
  !*** ./style/images/downarrow.svg ***!
  \************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='10' height='8' viewBox='0 0 10 8'%3e %3cpath id='%eb%8b%a4%ea%b0%81%ed%98%95_3' data-name='%eb%8b%a4%ea%b0%81%ed%98%95 3' d='M5%2c0l5%2c8H0Z' transform='translate(10 8) rotate(180)' fill='%23b0b0b0'/%3e %3c/svg%3e";

/***/ }),

/***/ "./style/images/id.svg":
/*!*****************************!*\
  !*** ./style/images/id.svg ***!
  \*****************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12.2' height='13.533' viewBox='0 0 12.2 13.533'%3e %3cg id='pngwing.com' transform='translate(-0.538 981.124)'%3e %3cpath id='%ed%8c%a8%ec%8a%a4_7' data-name='%ed%8c%a8%ec%8a%a4 7' d='M6.272-981.009a4.282%2c4.282%2c0%2c0%2c0-3.633%2c2.8%2c5.022%2c5.022%2c0%2c0%2c0-.216.864%2c3.32%2c3.32%2c0%2c0%2c0-.032.626%2c3.45%2c3.45%2c0%2c0%2c0%2c.03.6%2c4.311%2c4.311%2c0%2c0%2c0%2c.9%2c2.081%2c4.462%2c4.462%2c0%2c0%2c0%2c.968.889c.085.057.173.113.2.125a.193.193%2c0%2c0%2c1%2c.05.034.763.763%2c0%2c0%2c1-.185.09%2c6.117%2c6.117%2c0%2c0%2c0-2.982%2c2.637%2c6.123%2c6.123%2c0%2c0%2c0-.693%2c1.889.786.786%2c0%2c0%2c0-.034.3.465.465%2c0%2c0%2c0%2c.142.268.382.382%2c0%2c0%2c0%2c.31.117.32.32%2c0%2c0%2c0%2c.2-.041.526.526%2c0%2c0%2c0%2c.138-.106.483.483%2c0%2c0%2c0%2c.115-.248%2c4.607%2c4.607%2c0%2c0%2c1%2c.108-.51%2c5.174%2c5.174%2c0%2c0%2c1%2c1.336-2.314%2c5.085%2c5.085%2c0%2c0%2c1%2c3.237-1.512%2c6.659%2c6.659%2c0%2c0%2c1%2c1.079.027%2c5.118%2c5.118%2c0%2c0%2c1%2c2.6%2c1.137%2c6.8%2c6.8%2c0%2c0%2c1%2c.717.723%2c5.251%2c5.251%2c0%2c0%2c1%2c1.091%2c2.374.515.515%2c0%2c0%2c0%2c.163.354.377.377%2c0%2c0%2c0%2c.3.117.383.383%2c0%2c0%2c0%2c.31-.124.451.451%2c0%2c0%2c0%2c.123-.476c-.015-.067-.045-.195-.063-.284a6.148%2c6.148%2c0%2c0%2c0-1.272-2.593%2c8.468%2c8.468%2c0%2c0%2c0-.725-.736%2c6.142%2c6.142%2c0%2c0%2c0-1.629-1%2c1.1%2c1.1%2c0%2c0%2c1-.193-.09s.058-.041.124-.082a4.311%2c4.311%2c0%2c0%2c0%2c1.933-2.732%2c3.346%2c3.346%2c0%2c0%2c0%2c.089-.93%2c3.454%2c3.454%2c0%2c0%2c0-.1-.98%2c4.286%2c4.286%2c0%2c0%2c0-2.057-2.756A4.269%2c4.269%2c0%2c0%2c0%2c6.272-981.009Zm.908.95a3.154%2c3.154%2c0%2c0%2c1%2c.921.3%2c3.324%2c3.324%2c0%2c0%2c1%2c1.4%2c1.29%2c3.393%2c3.393%2c0%2c0%2c1-.084%2c3.607%2c3.353%2c3.353%2c0%2c0%2c1-2.308%2c1.47%2c4.4%2c4.4%2c0%2c0%2c1-.945%2c0%2c3.335%2c3.335%2c0%2c0%2c1-1.93-1%2c3.363%2c3.363%2c0%2c0%2c1-.907-1.85%2c3.969%2c3.969%2c0%2c0%2c1%2c0-.98%2c3.364%2c3.364%2c0%2c0%2c1%2c1.035-1.98%2c3.377%2c3.377%2c0%2c0%2c1%2c1.809-.87l.148-.02c.023%2c0%2c.189%2c0%2c.371%2c0A2.6%2c2.6%2c0%2c0%2c1%2c7.181-980.059Z' transform='translate(0 0)' fill='%23a4a4a4'/%3e %3cpath id='%ed%8c%a8%ec%8a%a4_7_-_%ec%9c%a4%ea%b3%bd%ec%84%a0' data-name='%ed%8c%a8%ec%8a%a4 7 - %ec%9c%a4%ea%b3%bd%ec%84%a0' d='M6.625-981.124a4.387%2c4.387%2c0%2c0%2c1%2c2.147.565%2c4.369%2c4.369%2c0%2c0%2c1%2c2.1%2c2.82%2c3.53%2c3.53%2c0%2c0%2c1%2c.105%2c1%2c3.454%2c3.454%2c0%2c0%2c1-.091.951%2c4.388%2c4.388%2c0%2c0%2c1-1.951%2c2.779l.027.011a6.215%2c6.215%2c0%2c0%2c1%2c1.656%2c1.014%2c8.588%2c8.588%2c0%2c0%2c1%2c.738.749%2c6.276%2c6.276%2c0%2c0%2c1%2c1.292%2c2.636c.013.062.031.141.046.206l.018.078a.55.55%2c0%2c0%2c1-.152.571.482.482%2c0%2c0%2c1-.379.151.477.477%2c0%2c0%2c1-.372-.144.611.611%2c0%2c0%2c1-.193-.408%2c5.138%2c5.138%2c0%2c0%2c0-1.07-2.33%2c6.757%2c6.757%2c0%2c0%2c0-.7-.708A4.989%2c4.989%2c0%2c0%2c0%2c7.294-972.3a6.245%2c6.245%2c0%2c0%2c0-.724-.037c-.134%2c0-.249%2c0-.333.01a4.954%2c4.954%2c0%2c0%2c0-3.174%2c1.483%2c5.052%2c5.052%2c0%2c0%2c0-1.311%2c2.27%2c4.942%2c4.942%2c0%2c0%2c0-.1.486.574.574%2c0%2c0%2c1-.141.314.617.617%2c0%2c0%2c1-.168.129.413.413%2c0%2c0%2c1-.244.051.478.478%2c0%2c0%2c1-.378-.144.569.569%2c0%2c0%2c1-.173-.326.864.864%2c0%2c0%2c1%2c.035-.337%2c6.2%2c6.2%2c0%2c0%2c1%2c.7-1.919A6.231%2c6.231%2c0%2c0%2c1%2c4.314-973l.02-.008-.1-.065a4.551%2c4.551%2c0%2c0%2c1-.99-.91%2c4.417%2c4.417%2c0%2c0%2c1-.921-2.128%2c3.529%2c3.529%2c0%2c0%2c1-.031-.614%2c3.4%2c3.4%2c0%2c0%2c1%2c.034-.641%2c5.094%2c5.094%2c0%2c0%2c1%2c.221-.884%2c4.393%2c4.393%2c0%2c0%2c1%2c3.718-2.861C6.382-981.119%2c6.5-981.124%2c6.625-981.124Zm5.56%2c13.333a.285.285%2c0%2c0%2c0%2c.242-.1.353.353%2c0%2c0%2c0%2c.094-.38l-.018-.079c-.015-.066-.033-.146-.046-.209a6.075%2c6.075%2c0%2c0%2c0-1.251-2.551%2c8.472%2c8.472%2c0%2c0%2c0-.712-.723%2c6.013%2c6.013%2c0%2c0%2c0-1.6-.982c-.221-.091-.233-.1-.249-.147L8.627-973l.025-.049c.011-.017.018-.027.156-.112a4.187%2c4.187%2c0%2c0%2c0%2c1.888-2.668%2c3.266%2c3.266%2c0%2c0%2c0%2c.087-.908%2c3.371%2c3.371%2c0%2c0%2c0-.1-.957%2c4.171%2c4.171%2c0%2c0%2c0-2.01-2.693%2c4.184%2c4.184%2c0%2c0%2c0-2.048-.539c-.115%2c0-.231.005-.344.015a4.193%2c4.193%2c0%2c0%2c0-3.547%2c2.731%2c4.948%2c4.948%2c0%2c0%2c0-.211.845%2c3.221%2c3.221%2c0%2c0%2c0-.031.611%2c3.352%2c3.352%2c0%2c0%2c0%2c.029.583A4.223%2c4.223%2c0%2c0%2c0%2c3.4-974.1a4.341%2c4.341%2c0%2c0%2c0%2c.945.868c.093.062.171.111.187.119.07.038.084.061.091.072l.024.04-.015.045c-.014.042-.028.062-.242.15a6.03%2c6.03%2c0%2c0%2c0-2.933%2c2.594%2c6%2c6%2c0%2c0%2c0-.681%2c1.86.723.723%2c0%2c0%2c0-.033.266.368.368%2c0%2c0%2c0%2c.111.212.286.286%2c0%2c0%2c0%2c.242.09c.1%2c0%2c.1%2c0%2c.153-.029a.437.437%2c0%2c0%2c0%2c.11-.084.413.413%2c0%2c0%2c0%2c.09-.182%2c4.4%2c4.4%2c0%2c0%2c1%2c.111-.536%2c5.25%2c5.25%2c0%2c0%2c1%2c1.362-2.359%2c5.218%2c5.218%2c0%2c0%2c1%2c3.3-1.542c.09-.007.21-.011.349-.011a6.349%2c6.349%2c0%2c0%2c1%2c.751.039%2c5.183%2c5.183%2c0%2c0%2c1%2c2.652%2c1.158%2c6.9%2c6.9%2c0%2c0%2c1%2c.731.738%2c5.333%2c5.333%2c0%2c0%2c1%2c1.111%2c2.418c.037.193.058.229.134.3A.279.279%2c0%2c0%2c0%2c12.185-967.791Zm-5.692-12.4.2%2c0a2.688%2c2.688%2c0%2c0%2c1%2c.507.034%2c3.25%2c3.25%2c0%2c0%2c1%2c.947.308%2c3.427%2c3.427%2c0%2c0%2c1%2c1.441%2c1.329%2c3.5%2c3.5%2c0%2c0%2c1-.086%2c3.714%2c3.45%2c3.45%2c0%2c0%2c1-2.376%2c1.514%2c3.576%2c3.576%2c0%2c0%2c1-.488.027%2c3.552%2c3.552%2c0%2c0%2c1-.487-.027%2c3.431%2c3.431%2c0%2c0%2c1-1.987-1.027%2c3.452%2c3.452%2c0%2c0%2c1-.934-1.9%2c4.031%2c4.031%2c0%2c0%2c1%2c0-1.01%2c3.47%2c3.47%2c0%2c0%2c1%2c1.066-2.038%2c3.48%2c3.48%2c0%2c0%2c1%2c1.864-.9l.059-.008.091-.012C6.327-980.192%2c6.389-980.193%2c6.493-980.193Zm.143%2c6.727a3.432%2c3.432%2c0%2c0%2c0%2c.458-.024%2c3.253%2c3.253%2c0%2c0%2c0%2c2.24-1.427%2c3.294%2c3.294%2c0%2c0%2c0%2c.081-3.5%2c3.229%2c3.229%2c0%2c0%2c0-1.358-1.252%2c3.067%2c3.067%2c0%2c0%2c0-.894-.291%2c2.542%2c2.542%2c0%2c0%2c0-.473-.031h-.2c-.1%2c0-.152%2c0-.162%2c0l-.086.012-.06.008a3.273%2c3.273%2c0%2c0%2c0-1.754.843A3.274%2c3.274%2c0%2c0%2c0%2c3.426-977.2a3.859%2c3.859%2c0%2c0%2c0%2c0%2c.95%2c3.256%2c3.256%2c0%2c0%2c0%2c.88%2c1.8%2c3.235%2c3.235%2c0%2c0%2c0%2c1.874.968A3.414%2c3.414%2c0%2c0%2c0%2c6.636-973.466Z' transform='translate(0 0)' fill='%23a3a3a3'/%3e %3c/g%3e %3c/svg%3e";

/***/ }),

/***/ "./style/images/id_f.svg":
/*!*******************************!*\
  !*** ./style/images/id_f.svg ***!
  \*******************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12.2' height='13.533' viewBox='0 0 12.2 13.533'%3e %3cg id='pngwing.com' transform='translate(-0.538 981.124)'%3e %3cpath id='%ed%8c%a8%ec%8a%a4_7' data-name='%ed%8c%a8%ec%8a%a4 7' d='M6.272-981.009a4.282%2c4.282%2c0%2c0%2c0-3.633%2c2.8%2c5.022%2c5.022%2c0%2c0%2c0-.216.864%2c3.32%2c3.32%2c0%2c0%2c0-.032.626%2c3.45%2c3.45%2c0%2c0%2c0%2c.03.6%2c4.311%2c4.311%2c0%2c0%2c0%2c.9%2c2.081%2c4.462%2c4.462%2c0%2c0%2c0%2c.968.889c.085.057.173.113.2.125a.193.193%2c0%2c0%2c1%2c.05.034.763.763%2c0%2c0%2c1-.185.09%2c6.117%2c6.117%2c0%2c0%2c0-2.982%2c2.637%2c6.123%2c6.123%2c0%2c0%2c0-.693%2c1.889.786.786%2c0%2c0%2c0-.034.3.465.465%2c0%2c0%2c0%2c.142.268.382.382%2c0%2c0%2c0%2c.31.117.32.32%2c0%2c0%2c0%2c.2-.041.526.526%2c0%2c0%2c0%2c.138-.106.483.483%2c0%2c0%2c0%2c.115-.248%2c4.607%2c4.607%2c0%2c0%2c1%2c.108-.51%2c5.174%2c5.174%2c0%2c0%2c1%2c1.336-2.314%2c5.085%2c5.085%2c0%2c0%2c1%2c3.237-1.512%2c6.659%2c6.659%2c0%2c0%2c1%2c1.079.027%2c5.118%2c5.118%2c0%2c0%2c1%2c2.6%2c1.137%2c6.8%2c6.8%2c0%2c0%2c1%2c.717.723%2c5.251%2c5.251%2c0%2c0%2c1%2c1.091%2c2.374.515.515%2c0%2c0%2c0%2c.163.354.377.377%2c0%2c0%2c0%2c.3.117.383.383%2c0%2c0%2c0%2c.31-.124.451.451%2c0%2c0%2c0%2c.123-.476c-.015-.067-.045-.195-.063-.284a6.148%2c6.148%2c0%2c0%2c0-1.272-2.593%2c8.468%2c8.468%2c0%2c0%2c0-.725-.736%2c6.142%2c6.142%2c0%2c0%2c0-1.629-1%2c1.1%2c1.1%2c0%2c0%2c1-.193-.09s.058-.041.124-.082a4.311%2c4.311%2c0%2c0%2c0%2c1.933-2.732%2c3.346%2c3.346%2c0%2c0%2c0%2c.089-.93%2c3.454%2c3.454%2c0%2c0%2c0-.1-.98%2c4.286%2c4.286%2c0%2c0%2c0-2.057-2.756A4.269%2c4.269%2c0%2c0%2c0%2c6.272-981.009Zm.908.95a3.154%2c3.154%2c0%2c0%2c1%2c.921.3%2c3.324%2c3.324%2c0%2c0%2c1%2c1.4%2c1.29%2c3.393%2c3.393%2c0%2c0%2c1-.084%2c3.607%2c3.353%2c3.353%2c0%2c0%2c1-2.308%2c1.47%2c4.4%2c4.4%2c0%2c0%2c1-.945%2c0%2c3.335%2c3.335%2c0%2c0%2c1-1.93-1%2c3.363%2c3.363%2c0%2c0%2c1-.907-1.85%2c3.969%2c3.969%2c0%2c0%2c1%2c0-.98%2c3.364%2c3.364%2c0%2c0%2c1%2c1.035-1.98%2c3.377%2c3.377%2c0%2c0%2c1%2c1.809-.87l.148-.02c.023%2c0%2c.189%2c0%2c.371%2c0A2.6%2c2.6%2c0%2c0%2c1%2c7.181-980.059Z' transform='translate(0 0)' fill='%23404040'/%3e %3cpath id='%ed%8c%a8%ec%8a%a4_7_-_%ec%9c%a4%ea%b3%bd%ec%84%a0' data-name='%ed%8c%a8%ec%8a%a4 7 - %ec%9c%a4%ea%b3%bd%ec%84%a0' d='M6.625-981.124a4.387%2c4.387%2c0%2c0%2c1%2c2.147.565%2c4.369%2c4.369%2c0%2c0%2c1%2c2.1%2c2.82%2c3.53%2c3.53%2c0%2c0%2c1%2c.105%2c1%2c3.454%2c3.454%2c0%2c0%2c1-.091.951%2c4.388%2c4.388%2c0%2c0%2c1-1.951%2c2.779l.027.011a6.215%2c6.215%2c0%2c0%2c1%2c1.656%2c1.014%2c8.588%2c8.588%2c0%2c0%2c1%2c.738.749%2c6.276%2c6.276%2c0%2c0%2c1%2c1.292%2c2.636c.013.062.031.141.046.206l.018.078a.55.55%2c0%2c0%2c1-.152.571.482.482%2c0%2c0%2c1-.379.151.477.477%2c0%2c0%2c1-.372-.144.611.611%2c0%2c0%2c1-.193-.408%2c5.138%2c5.138%2c0%2c0%2c0-1.07-2.33%2c6.757%2c6.757%2c0%2c0%2c0-.7-.708A4.989%2c4.989%2c0%2c0%2c0%2c7.294-972.3a6.245%2c6.245%2c0%2c0%2c0-.724-.037c-.134%2c0-.249%2c0-.333.01a4.954%2c4.954%2c0%2c0%2c0-3.174%2c1.483%2c5.052%2c5.052%2c0%2c0%2c0-1.311%2c2.27%2c4.942%2c4.942%2c0%2c0%2c0-.1.486.574.574%2c0%2c0%2c1-.141.314.617.617%2c0%2c0%2c1-.168.129.413.413%2c0%2c0%2c1-.244.051.478.478%2c0%2c0%2c1-.378-.144.569.569%2c0%2c0%2c1-.173-.326.864.864%2c0%2c0%2c1%2c.035-.337%2c6.2%2c6.2%2c0%2c0%2c1%2c.7-1.919A6.231%2c6.231%2c0%2c0%2c1%2c4.314-973l.02-.008-.1-.065a4.551%2c4.551%2c0%2c0%2c1-.99-.91%2c4.417%2c4.417%2c0%2c0%2c1-.921-2.128%2c3.529%2c3.529%2c0%2c0%2c1-.031-.614%2c3.4%2c3.4%2c0%2c0%2c1%2c.034-.641%2c5.094%2c5.094%2c0%2c0%2c1%2c.221-.884%2c4.393%2c4.393%2c0%2c0%2c1%2c3.718-2.861C6.382-981.119%2c6.5-981.124%2c6.625-981.124Zm5.56%2c13.333a.285.285%2c0%2c0%2c0%2c.242-.1.353.353%2c0%2c0%2c0%2c.094-.38l-.018-.079c-.015-.066-.033-.146-.046-.209a6.075%2c6.075%2c0%2c0%2c0-1.251-2.551%2c8.472%2c8.472%2c0%2c0%2c0-.712-.723%2c6.013%2c6.013%2c0%2c0%2c0-1.6-.982c-.221-.091-.233-.1-.249-.147L8.627-973l.025-.049c.011-.017.018-.027.156-.112a4.187%2c4.187%2c0%2c0%2c0%2c1.888-2.668%2c3.266%2c3.266%2c0%2c0%2c0%2c.087-.908%2c3.371%2c3.371%2c0%2c0%2c0-.1-.957%2c4.171%2c4.171%2c0%2c0%2c0-2.01-2.693%2c4.184%2c4.184%2c0%2c0%2c0-2.048-.539c-.115%2c0-.231.005-.344.015a4.193%2c4.193%2c0%2c0%2c0-3.547%2c2.731%2c4.948%2c4.948%2c0%2c0%2c0-.211.845%2c3.221%2c3.221%2c0%2c0%2c0-.031.611%2c3.352%2c3.352%2c0%2c0%2c0%2c.029.583A4.223%2c4.223%2c0%2c0%2c0%2c3.4-974.1a4.341%2c4.341%2c0%2c0%2c0%2c.945.868c.093.062.171.111.187.119.07.038.084.061.091.072l.024.04-.015.045c-.014.042-.028.062-.242.15a6.03%2c6.03%2c0%2c0%2c0-2.933%2c2.594%2c6%2c6%2c0%2c0%2c0-.681%2c1.86.723.723%2c0%2c0%2c0-.033.266.368.368%2c0%2c0%2c0%2c.111.212.286.286%2c0%2c0%2c0%2c.242.09c.1%2c0%2c.1%2c0%2c.153-.029a.437.437%2c0%2c0%2c0%2c.11-.084.413.413%2c0%2c0%2c0%2c.09-.182%2c4.4%2c4.4%2c0%2c0%2c1%2c.111-.536%2c5.25%2c5.25%2c0%2c0%2c1%2c1.362-2.359%2c5.218%2c5.218%2c0%2c0%2c1%2c3.3-1.542c.09-.007.21-.011.349-.011a6.349%2c6.349%2c0%2c0%2c1%2c.751.039%2c5.183%2c5.183%2c0%2c0%2c1%2c2.652%2c1.158%2c6.9%2c6.9%2c0%2c0%2c1%2c.731.738%2c5.333%2c5.333%2c0%2c0%2c1%2c1.111%2c2.418c.037.193.058.229.134.3A.279.279%2c0%2c0%2c0%2c12.185-967.791Zm-5.692-12.4.2%2c0a2.688%2c2.688%2c0%2c0%2c1%2c.507.034%2c3.25%2c3.25%2c0%2c0%2c1%2c.947.308%2c3.427%2c3.427%2c0%2c0%2c1%2c1.441%2c1.329%2c3.5%2c3.5%2c0%2c0%2c1-.086%2c3.714%2c3.45%2c3.45%2c0%2c0%2c1-2.376%2c1.514%2c3.576%2c3.576%2c0%2c0%2c1-.488.027%2c3.552%2c3.552%2c0%2c0%2c1-.487-.027%2c3.431%2c3.431%2c0%2c0%2c1-1.987-1.027%2c3.452%2c3.452%2c0%2c0%2c1-.934-1.9%2c4.031%2c4.031%2c0%2c0%2c1%2c0-1.01%2c3.47%2c3.47%2c0%2c0%2c1%2c1.066-2.038%2c3.48%2c3.48%2c0%2c0%2c1%2c1.864-.9l.059-.008.091-.012C6.327-980.192%2c6.389-980.193%2c6.493-980.193Zm.143%2c6.727a3.432%2c3.432%2c0%2c0%2c0%2c.458-.024%2c3.253%2c3.253%2c0%2c0%2c0%2c2.24-1.427%2c3.294%2c3.294%2c0%2c0%2c0%2c.081-3.5%2c3.229%2c3.229%2c0%2c0%2c0-1.358-1.252%2c3.067%2c3.067%2c0%2c0%2c0-.894-.291%2c2.542%2c2.542%2c0%2c0%2c0-.473-.031h-.2c-.1%2c0-.152%2c0-.162%2c0l-.086.012-.06.008a3.273%2c3.273%2c0%2c0%2c0-1.754.843A3.274%2c3.274%2c0%2c0%2c0%2c3.426-977.2a3.859%2c3.859%2c0%2c0%2c0%2c0%2c.95%2c3.256%2c3.256%2c0%2c0%2c0%2c.88%2c1.8%2c3.235%2c3.235%2c0%2c0%2c0%2c1.874.968A3.414%2c3.414%2c0%2c0%2c0%2c6.636-973.466Z' transform='translate(0 0)' fill='grey'/%3e %3c/g%3e %3c/svg%3e";

/***/ }),

/***/ "./style/images/leftarrow.svg":
/*!************************************!*\
  !*** ./style/images/leftarrow.svg ***!
  \************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg id='%ea%b7%b8%eb%a3%b9_64' data-name='%ea%b7%b8%eb%a3%b9 64' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='6' height='12' viewBox='0 0 6 12'%3e %3cdefs%3e %3cclipPath id='clip-path'%3e %3crect id='%ec%82%ac%ea%b0%81%ed%98%95_80' data-name='%ec%82%ac%ea%b0%81%ed%98%95 80' width='6' height='12' fill='%236f6f6f'/%3e %3c/clipPath%3e %3c/defs%3e %3cg id='%ea%b7%b8%eb%a3%b9_63' data-name='%ea%b7%b8%eb%a3%b9 63' clip-path='url(%23clip-path)'%3e %3cpath id='%ed%8c%a8%ec%8a%a4_37' data-name='%ed%8c%a8%ec%8a%a4 37' d='M5.516%2c12a.454.454%2c0%2c0%2c1-.33-.147L.262%2c6.679a1.012%2c1.012%2c0%2c0%2c1%2c0-1.358L5.186.146A.446.446%2c0%2c0%2c1%2c5.87.173a.6.6%2c0%2c0%2c1-.024.771L1.035%2c6l4.811%2c5.056a.6.6%2c0%2c0%2c1%2c.024.771A.458.458%2c0%2c0%2c1%2c5.516%2c12' transform='translate(0 0)' fill='darkgrey'/%3e %3c/g%3e %3c/svg%3e";

/***/ }),

/***/ "./style/images/pw.svg":
/*!*****************************!*\
  !*** ./style/images/pw.svg ***!
  \*****************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12.2' height='14.6' viewBox='0 0 12.2 14.6'%3e %3cg id='pngwing.com-_2_' transform='translate(-1.028 979.743)'%3e %3cpath id='%ed%8c%a8%ec%8a%a4_10' data-name='%ed%8c%a8%ec%8a%a4 10' d='M6.728-979.634a3.549%2c3.549%2c0%2c0%2c0-3.182%2c2.727%2c6.229%2c6.229%2c0%2c0%2c0-.113%2c1.716v.95l-.388.007a1.679%2c1.679%2c0%2c0%2c0-.7.1%2c1.866%2c1.866%2c0%2c0%2c0-1.119%2c1.11c-.1.279-.089.022-.093%2c3.214-.006%2c3.17-.009%2c3.034.08%2c3.309a1.84%2c1.84%2c0%2c0%2c0%2c1.173%2c1.167c.29.094-.122.087%2c4.646.093%2c2.906%2c0%2c4.373%2c0%2c4.463-.01a1.858%2c1.858%2c0%2c0%2c0%2c1.362-.844%2c1.9%2c1.9%2c0%2c0%2c0%2c.226-.522l.041-.143%2c0-2.911c0-3.206.009-3.053-.089-3.334a1.842%2c1.842%2c0%2c0%2c0-1.43-1.208%2c3.1%2c3.1%2c0%2c0%2c0-.455-.022h-.33v-.945a6.187%2c6.187%2c0%2c0%2c0-.115-1.73%2c3.549%2c3.549%2c0%2c0%2c0-.992-1.727%2c3.589%2c3.589%2c0%2c0%2c0-2.007-.964A5.936%2c5.936%2c0%2c0%2c0%2c6.728-979.634Zm.84.919a2.8%2c2.8%2c0%2c0%2c1%2c1.188.46%2c3.133%2c3.133%2c0%2c0%2c1%2c.6.588%2c2.822%2c2.822%2c0%2c0%2c1%2c.528%2c1.458c.011.122.015.541.012%2c1.081l0%2c.882H4.36v-.992a8.706%2c8.706%2c0%2c0%2c1%2c.027-1.166%2c2.642%2c2.642%2c0%2c0%2c1%2c2.431-2.333A4.149%2c4.149%2c0%2c0%2c1%2c7.567-978.715Zm4.023%2c5.42a.911.911%2c0%2c0%2c1%2c.588.638%2c26.721%2c26.721%2c0%2c0%2c1%2c.03%2c2.908c0%2c3.1.006%2c2.9-.1%2c3.111a1%2c1%2c0%2c0%2c1-.416.4c-.225.1.134.1-4.614.094-3.545%2c0-4.3-.009-4.347-.025a.965.965%2c0%2c0%2c1-.663-.686c-.033-.153-.033-5.623%2c0-5.775a.923.923%2c0%2c0%2c1%2c.312-.5%2c1.165%2c1.165%2c0%2c0%2c1%2c.377-.19c.065-.015.93-.018%2c4.4-.016l4.32%2c0Z' transform='translate(0 0)' fill='%23a4a4a4'/%3e %3cpath id='%ed%8c%a8%ec%8a%a4_10_-_%ec%9c%a4%ea%b3%bd%ec%84%a0' data-name='%ed%8c%a8%ec%8a%a4 10 - %ec%9c%a4%ea%b3%bd%ec%84%a0' d='M7.007-979.743a5.975%2c5.975%2c0%2c0%2c1%2c.715.038%2c3.7%2c3.7%2c0%2c0%2c1%2c2.062.992%2c3.635%2c3.635%2c0%2c0%2c1%2c1.02%2c1.775%2c6.274%2c6.274%2c0%2c0%2c1%2c.118%2c1.755v.845h.23a3.164%2c3.164%2c0%2c0%2c1%2c.472.023%2c1.953%2c1.953%2c0%2c0%2c1%2c1.507%2c1.275l.011.032c.088.245.088.245.084%2c2.912l-.005%2c3.347-.045.156a1.991%2c1.991%2c0%2c0%2c1-.238.549%2c1.966%2c1.966%2c0%2c0%2c1-1.434.889c-.049.006-.39.012-2.613.012H6.124c-3.516%2c0-3.516%2c0-3.718-.078l-.053-.019a1.952%2c1.952%2c0%2c0%2c1-1.237-1.232l-.01-.029c-.081-.246-.081-.246-.076-2.987v-.944c0-2.367%2c0-2.367.08-2.577l.018-.05a1.96%2c1.96%2c0%2c0%2c1%2c1.181-1.172%2c1.76%2c1.76%2c0%2c0%2c1%2c.733-.1l.289-.005v-.852a6.329%2c6.329%2c0%2c0%2c1%2c.116-1.739%2c3.639%2c3.639%2c0%2c0%2c1%2c3.269-2.8C6.8-979.741%2c6.923-979.743%2c7.007-979.743Zm6.014%2c12.966.005-3.319c0-2.608%2c0-2.634-.072-2.845l-.012-.034a1.751%2c1.751%2c0%2c0%2c0-1.352-1.143%2c3.067%2c3.067%2c0%2c0%2c0-.439-.021h-.43v-1.045a6.079%2c6.079%2c0%2c0%2c0-.112-1.706%2c3.44%2c3.44%2c0%2c0%2c0-.965-1.68%2c3.506%2c3.506%2c0%2c0%2c0-1.952-.937%2c5.738%2c5.738%2c0%2c0%2c0-.686-.036c-.115%2c0-.208%2c0-.27.009a3.443%2c3.443%2c0%2c0%2c0-3.094%2c2.651%2c6.132%2c6.132%2c0%2c0%2c0-.11%2c1.692v1.048l-.486.009a1.588%2c1.588%2c0%2c0%2c0-.672.092%2c1.778%2c1.778%2c0%2c0%2c0-1.057%2c1.048l-.019.054a10.49%2c10.49%2c0%2c0%2c0-.068%2c2.508v.944a13.1%2c13.1%2c0%2c0%2c0%2c.066%2c2.924l.01.03a1.749%2c1.749%2c0%2c0%2c0%2c1.109%2c1.1l.06.021c.167.061.2.062%2c3.65.066H8.891c1.65%2c0%2c2.521%2c0%2c2.59-.011a1.767%2c1.767%2c0%2c0%2c0%2c1.289-.8%2c1.819%2c1.819%2c0%2c0%2c0%2c.214-.494Zm-5.98-12.068a4.2%2c4.2%2c0%2c0%2c1%2c.541.031%2c2.884%2c2.884%2c0%2c0%2c1%2c1.23.477%2c3.252%2c3.252%2c0%2c0%2c1%2c.628.612%2c2.929%2c2.929%2c0%2c0%2c1%2c.546%2c1.508c.011.124.015.541.012%2c1.089l-.005.982H4.26v-1.092a8.581%2c8.581%2c0%2c0%2c1%2c.028-1.181%2c2.748%2c2.748%2c0%2c0%2c1%2c2.52-2.417C6.866-978.842%2c6.946-978.845%2c7.041-978.845Zm2.753%2c4.5%2c0-.783c0-.534%2c0-.955-.012-1.071a2.735%2c2.735%2c0%2c0%2c0-.509-1.409%2c3.053%2c3.053%2c0%2c0%2c0-.579-.564%2c2.686%2c2.686%2c0%2c0%2c0-1.146-.444%2c4.055%2c4.055%2c0%2c0%2c0-.511-.029c-.088%2c0-.162%2c0-.213.008a2.555%2c2.555%2c0%2c0%2c0-2.342%2c2.249%2c8.807%2c8.807%2c0%2c0%2c0-.026%2c1.151v.892Zm-4.018.908H7.157l4.337%2c0%2c.129.045a1.013%2c1.013%2c0%2c0%2c1%2c.652.707%2c23.731%2c23.731%2c0%2c0%2c1%2c.033%2c2.933v.475c0%2c2.47%2c0%2c2.47-.094%2c2.65l-.016.031a1.1%2c1.1%2c0%2c0%2c1-.463.449l-.036.018c-.148.078-.167.088-2.235.088H7.079c-4.132-.005-4.318-.01-4.378-.03a1.066%2c1.066%2c0%2c0%2c1-.73-.76c-.036-.164-.036-5.655%2c0-5.817a1.016%2c1.016%2c0%2c0%2c1%2c.347-.56%2c1.268%2c1.268%2c0%2c0%2c1%2c.417-.209C2.795-973.432%2c3.086-973.437%2c5.777-973.437Zm5.684.2-4.3%2c0H5.777c-1.883%2c0-2.919%2c0-3%2c.015a1.069%2c1.069%2c0%2c0%2c0-.334.17.824.824%2c0%2c0%2c0-.277.448c-.03.211-.03%2c5.521%2c0%2c5.735a.864.864%2c0%2c0%2c0%2c.591.608c.107.014%2c1.187.018%2c4.322.022H9.465a8.1%2c8.1%2c0%2c0%2c0%2c2.142-.065l.044-.022a.9.9%2c0%2c0%2c0%2c.369-.357l.018-.034c.07-.133.071-.181.071-2.557v-.475c0-2.626%2c0-2.783-.027-2.882a.817.817%2c0%2c0%2c0-.525-.57Z' transform='translate(0 0)' fill='%23a4a4a4'/%3e %3cpath id='%ed%8c%a8%ec%8a%a4_11' data-name='%ed%8c%a8%ec%8a%a4 11' d='M338.969-428.508a.946.946%2c0%2c0%2c0-.695.512.843.843%2c0%2c0%2c0-.088.453.841.841%2c0%2c0%2c0%2c.129.439%2c1.009%2c1.009%2c0%2c0%2c0%2c.275.289l.046.024%2c0%2c.818%2c0%2c.816.043.087a.463.463%2c0%2c0%2c0%2c.842%2c0l.043-.087%2c0-.813.006-.813.076-.053a1%2c1%2c0%2c0%2c0%2c.157-.149.929.929%2c0%2c0%2c0-.125-1.327%2c1.1%2c1.1%2c0%2c0%2c0-.357-.179A1.154%2c1.154%2c0%2c0%2c0%2c338.969-428.508Z' transform='translate(-331.981 -543.116)' fill='%23a4a4a4'/%3e %3cpath id='%ed%8c%a8%ec%8a%a4_11_-_%ec%9c%a4%ea%b3%bd%ec%84%a0' data-name='%ed%8c%a8%ec%8a%a4 11 - %ec%9c%a4%ea%b3%bd%ec%84%a0' d='M339.085-428.616a1.28%2c1.28%2c0%2c0%2c1%2c.272.027%2c1.193%2c1.193%2c0%2c0%2c1%2c.4.2%2c1.044%2c1.044%2c0%2c0%2c1%2c.379.711%2c1.029%2c1.029%2c0%2c0%2c1-.241.757%2c1.089%2c1.089%2c0%2c0%2c1-.176.167l-.034.024-.01%2c1.6-.053.107a.569.569%2c0%2c0%2c1-.511.326.569.569%2c0%2c0%2c1-.511-.326l-.053-.107-.009-1.6a1.11%2c1.11%2c0%2c0%2c1-.307-.322.935.935%2c0%2c0%2c1-.143-.486.939.939%2c0%2c0%2c1%2c.1-.5%2c1.049%2c1.049%2c0%2c0%2c1%2c.767-.566A.82.82%2c0%2c0%2c1%2c339.085-428.616Zm.387%2c3.436.011-1.655.118-.083a.916.916%2c0%2c0%2c0%2c.137-.131.83.83%2c0%2c0%2c0%2c.2-.611.845.845%2c0%2c0%2c0-.307-.575%2c1%2c1%2c0%2c0%2c0-.317-.159%2c1.086%2c1.086%2c0%2c0%2c0-.225-.022.613.613%2c0%2c0%2c0-.1.006.851.851%2c0%2c0%2c0-.623.458.746.746%2c0%2c0%2c0-.078.4.743.743%2c0%2c0%2c0%2c.114.392.948.948%2c0%2c0%2c0%2c.235.252l.1.054.009%2c1.671.032.066a.366.366%2c0%2c0%2c0%2c.331.214.366.366%2c0%2c0%2c0%2c.331-.214Z' transform='translate(-331.981 -543.116)' fill='%23a4a4a4'/%3e %3c/g%3e %3c/svg%3e";

/***/ }),

/***/ "./style/images/pw_f.svg":
/*!*******************************!*\
  !*** ./style/images/pw_f.svg ***!
  \*******************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12.2' height='14.6' viewBox='0 0 12.2 14.6'%3e %3cg id='pngwing.com-_2_' transform='translate(-1.028 979.743)'%3e %3cpath id='%ed%8c%a8%ec%8a%a4_10' data-name='%ed%8c%a8%ec%8a%a4 10' d='M6.728-979.634a3.549%2c3.549%2c0%2c0%2c0-3.182%2c2.727%2c6.229%2c6.229%2c0%2c0%2c0-.113%2c1.716v.95l-.388.007a1.679%2c1.679%2c0%2c0%2c0-.7.1%2c1.866%2c1.866%2c0%2c0%2c0-1.119%2c1.11c-.1.279-.089.022-.093%2c3.214-.006%2c3.17-.009%2c3.034.08%2c3.309a1.84%2c1.84%2c0%2c0%2c0%2c1.173%2c1.167c.29.094-.122.087%2c4.646.093%2c2.906%2c0%2c4.373%2c0%2c4.463-.01a1.858%2c1.858%2c0%2c0%2c0%2c1.362-.844%2c1.9%2c1.9%2c0%2c0%2c0%2c.226-.522l.041-.143%2c0-2.911c0-3.206.009-3.053-.089-3.334a1.842%2c1.842%2c0%2c0%2c0-1.43-1.208%2c3.1%2c3.1%2c0%2c0%2c0-.455-.022h-.33v-.945a6.187%2c6.187%2c0%2c0%2c0-.115-1.73%2c3.549%2c3.549%2c0%2c0%2c0-.992-1.727%2c3.589%2c3.589%2c0%2c0%2c0-2.007-.964A5.936%2c5.936%2c0%2c0%2c0%2c6.728-979.634Zm.84.919a2.8%2c2.8%2c0%2c0%2c1%2c1.188.46%2c3.133%2c3.133%2c0%2c0%2c1%2c.6.588%2c2.822%2c2.822%2c0%2c0%2c1%2c.528%2c1.458c.011.122.015.541.012%2c1.081l0%2c.882H4.36v-.992a8.706%2c8.706%2c0%2c0%2c1%2c.027-1.166%2c2.642%2c2.642%2c0%2c0%2c1%2c2.431-2.333A4.149%2c4.149%2c0%2c0%2c1%2c7.567-978.715Zm4.023%2c5.42a.911.911%2c0%2c0%2c1%2c.588.638%2c26.721%2c26.721%2c0%2c0%2c1%2c.03%2c2.908c0%2c3.1.006%2c2.9-.1%2c3.111a1%2c1%2c0%2c0%2c1-.416.4c-.225.1.134.1-4.614.094-3.545%2c0-4.3-.009-4.347-.025a.965.965%2c0%2c0%2c1-.663-.686c-.033-.153-.033-5.623%2c0-5.775a.923.923%2c0%2c0%2c1%2c.312-.5%2c1.165%2c1.165%2c0%2c0%2c1%2c.377-.19c.065-.015.93-.018%2c4.4-.016l4.32%2c0Z' transform='translate(0 0)' fill='%23404040'/%3e %3cpath id='%ed%8c%a8%ec%8a%a4_10_-_%ec%9c%a4%ea%b3%bd%ec%84%a0' data-name='%ed%8c%a8%ec%8a%a4 10 - %ec%9c%a4%ea%b3%bd%ec%84%a0' d='M7.007-979.743a5.975%2c5.975%2c0%2c0%2c1%2c.715.038%2c3.7%2c3.7%2c0%2c0%2c1%2c2.062.992%2c3.635%2c3.635%2c0%2c0%2c1%2c1.02%2c1.775%2c6.274%2c6.274%2c0%2c0%2c1%2c.118%2c1.755v.845h.23a3.164%2c3.164%2c0%2c0%2c1%2c.472.023%2c1.953%2c1.953%2c0%2c0%2c1%2c1.507%2c1.275l.011.032c.088.245.088.245.084%2c2.912l-.005%2c3.347-.045.156a1.991%2c1.991%2c0%2c0%2c1-.238.549%2c1.966%2c1.966%2c0%2c0%2c1-1.434.889c-.049.006-.39.012-2.613.012H6.124c-3.516%2c0-3.516%2c0-3.718-.078l-.053-.019a1.952%2c1.952%2c0%2c0%2c1-1.237-1.232l-.01-.029c-.081-.246-.081-.246-.076-2.987v-.944c0-2.367%2c0-2.367.08-2.577l.018-.05a1.96%2c1.96%2c0%2c0%2c1%2c1.181-1.172%2c1.76%2c1.76%2c0%2c0%2c1%2c.733-.1l.289-.005v-.852a6.329%2c6.329%2c0%2c0%2c1%2c.116-1.739%2c3.639%2c3.639%2c0%2c0%2c1%2c3.269-2.8C6.8-979.741%2c6.923-979.743%2c7.007-979.743Zm6.014%2c12.966.005-3.319c0-2.608%2c0-2.634-.072-2.845l-.012-.034a1.751%2c1.751%2c0%2c0%2c0-1.352-1.143%2c3.067%2c3.067%2c0%2c0%2c0-.439-.021h-.43v-1.045a6.079%2c6.079%2c0%2c0%2c0-.112-1.706%2c3.44%2c3.44%2c0%2c0%2c0-.965-1.68%2c3.506%2c3.506%2c0%2c0%2c0-1.952-.937%2c5.738%2c5.738%2c0%2c0%2c0-.686-.036c-.115%2c0-.208%2c0-.27.009a3.443%2c3.443%2c0%2c0%2c0-3.094%2c2.651%2c6.132%2c6.132%2c0%2c0%2c0-.11%2c1.692v1.048l-.486.009a1.588%2c1.588%2c0%2c0%2c0-.672.092%2c1.778%2c1.778%2c0%2c0%2c0-1.057%2c1.048l-.019.054a10.49%2c10.49%2c0%2c0%2c0-.068%2c2.508v.944a13.1%2c13.1%2c0%2c0%2c0%2c.066%2c2.924l.01.03a1.749%2c1.749%2c0%2c0%2c0%2c1.109%2c1.1l.06.021c.167.061.2.062%2c3.65.066H8.891c1.65%2c0%2c2.521%2c0%2c2.59-.011a1.767%2c1.767%2c0%2c0%2c0%2c1.289-.8%2c1.819%2c1.819%2c0%2c0%2c0%2c.214-.494Zm-5.98-12.068a4.2%2c4.2%2c0%2c0%2c1%2c.541.031%2c2.884%2c2.884%2c0%2c0%2c1%2c1.23.477%2c3.252%2c3.252%2c0%2c0%2c1%2c.628.612%2c2.929%2c2.929%2c0%2c0%2c1%2c.546%2c1.508c.011.124.015.541.012%2c1.089l-.005.982H4.26v-1.092a8.581%2c8.581%2c0%2c0%2c1%2c.028-1.181%2c2.748%2c2.748%2c0%2c0%2c1%2c2.52-2.417C6.866-978.842%2c6.946-978.845%2c7.041-978.845Zm2.753%2c4.5%2c0-.783c0-.534%2c0-.955-.012-1.071a2.735%2c2.735%2c0%2c0%2c0-.509-1.409%2c3.053%2c3.053%2c0%2c0%2c0-.579-.564%2c2.686%2c2.686%2c0%2c0%2c0-1.146-.444%2c4.055%2c4.055%2c0%2c0%2c0-.511-.029c-.088%2c0-.162%2c0-.213.008a2.555%2c2.555%2c0%2c0%2c0-2.342%2c2.249%2c8.807%2c8.807%2c0%2c0%2c0-.026%2c1.151v.892Zm-4.018.908H7.157l4.337%2c0%2c.129.045a1.013%2c1.013%2c0%2c0%2c1%2c.652.707%2c23.731%2c23.731%2c0%2c0%2c1%2c.033%2c2.933v.475c0%2c2.47%2c0%2c2.47-.094%2c2.65l-.016.031a1.1%2c1.1%2c0%2c0%2c1-.463.449l-.036.018c-.148.078-.167.088-2.235.088H7.079c-4.132-.005-4.318-.01-4.378-.03a1.066%2c1.066%2c0%2c0%2c1-.73-.76c-.036-.164-.036-5.655%2c0-5.817a1.016%2c1.016%2c0%2c0%2c1%2c.347-.56%2c1.268%2c1.268%2c0%2c0%2c1%2c.417-.209C2.795-973.432%2c3.086-973.437%2c5.777-973.437Zm5.684.2-4.3%2c0H5.777c-1.883%2c0-2.919%2c0-3%2c.015a1.069%2c1.069%2c0%2c0%2c0-.334.17.824.824%2c0%2c0%2c0-.277.448c-.03.211-.03%2c5.521%2c0%2c5.735a.864.864%2c0%2c0%2c0%2c.591.608c.107.014%2c1.187.018%2c4.322.022H9.465a8.1%2c8.1%2c0%2c0%2c0%2c2.142-.065l.044-.022a.9.9%2c0%2c0%2c0%2c.369-.357l.018-.034c.07-.133.071-.181.071-2.557v-.475c0-2.626%2c0-2.783-.027-2.882a.817.817%2c0%2c0%2c0-.525-.57Z' transform='translate(0 0)' fill='grey'/%3e %3cpath id='%ed%8c%a8%ec%8a%a4_11' data-name='%ed%8c%a8%ec%8a%a4 11' d='M338.969-428.508a.946.946%2c0%2c0%2c0-.695.512.843.843%2c0%2c0%2c0-.088.453.841.841%2c0%2c0%2c0%2c.129.439%2c1.009%2c1.009%2c0%2c0%2c0%2c.275.289l.046.024%2c0%2c.818%2c0%2c.816.043.087a.463.463%2c0%2c0%2c0%2c.842%2c0l.043-.087%2c0-.813.006-.813.076-.053a1%2c1%2c0%2c0%2c0%2c.157-.149.929.929%2c0%2c0%2c0-.125-1.327%2c1.1%2c1.1%2c0%2c0%2c0-.357-.179A1.154%2c1.154%2c0%2c0%2c0%2c338.969-428.508Z' transform='translate(-331.981 -543.116)' fill='%23404040'/%3e %3cpath id='%ed%8c%a8%ec%8a%a4_11_-_%ec%9c%a4%ea%b3%bd%ec%84%a0' data-name='%ed%8c%a8%ec%8a%a4 11 - %ec%9c%a4%ea%b3%bd%ec%84%a0' d='M339.085-428.616a1.28%2c1.28%2c0%2c0%2c1%2c.272.027%2c1.193%2c1.193%2c0%2c0%2c1%2c.4.2%2c1.044%2c1.044%2c0%2c0%2c1%2c.379.711%2c1.029%2c1.029%2c0%2c0%2c1-.241.757%2c1.089%2c1.089%2c0%2c0%2c1-.176.167l-.034.024-.01%2c1.6-.053.107a.569.569%2c0%2c0%2c1-.511.326.569.569%2c0%2c0%2c1-.511-.326l-.053-.107-.009-1.6a1.11%2c1.11%2c0%2c0%2c1-.307-.322.935.935%2c0%2c0%2c1-.143-.486.939.939%2c0%2c0%2c1%2c.1-.5%2c1.049%2c1.049%2c0%2c0%2c1%2c.767-.566A.82.82%2c0%2c0%2c1%2c339.085-428.616Zm.387%2c3.436.011-1.655.118-.083a.916.916%2c0%2c0%2c0%2c.137-.131.83.83%2c0%2c0%2c0%2c.2-.611.845.845%2c0%2c0%2c0-.307-.575%2c1%2c1%2c0%2c0%2c0-.317-.159%2c1.086%2c1.086%2c0%2c0%2c0-.225-.022.613.613%2c0%2c0%2c0-.1.006.851.851%2c0%2c0%2c0-.623.458.746.746%2c0%2c0%2c0-.078.4.743.743%2c0%2c0%2c0%2c.114.392.948.948%2c0%2c0%2c0%2c.235.252l.1.054.009%2c1.671.032.066a.366.366%2c0%2c0%2c0%2c.331.214.366.366%2c0%2c0%2c0%2c.331-.214Z' transform='translate(-331.981 -543.116)' fill='%23404040'/%3e %3c/g%3e %3c/svg%3e";

/***/ }),

/***/ "./style/images/rightarrow.svg":
/*!*************************************!*\
  !*** ./style/images/rightarrow.svg ***!
  \*************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='6' height='12' viewBox='0 0 6 12'%3e %3cdefs%3e %3cclipPath id='clip-path'%3e %3crect id='%ec%82%ac%ea%b0%81%ed%98%95_80' data-name='%ec%82%ac%ea%b0%81%ed%98%95 80' width='6' height='12' fill='%236f6f6f'/%3e %3c/clipPath%3e %3c/defs%3e %3cg id='%ea%b7%b8%eb%a3%b9_65' data-name='%ea%b7%b8%eb%a3%b9 65' transform='translate(6 12) rotate(180)'%3e %3cg id='%ea%b7%b8%eb%a3%b9_63' data-name='%ea%b7%b8%eb%a3%b9 63' clip-path='url(%23clip-path)'%3e %3cpath id='%ed%8c%a8%ec%8a%a4_37' data-name='%ed%8c%a8%ec%8a%a4 37' d='M5.516%2c12a.454.454%2c0%2c0%2c1-.33-.147L.262%2c6.679a1.012%2c1.012%2c0%2c0%2c1%2c0-1.358L5.186.146A.446.446%2c0%2c0%2c1%2c5.87.173a.6.6%2c0%2c0%2c1-.024.771L1.035%2c6l4.811%2c5.056a.6.6%2c0%2c0%2c1%2c.024.771A.458.458%2c0%2c0%2c1%2c5.516%2c12' transform='translate(0 0)' fill='darkgrey'/%3e %3c/g%3e %3c/g%3e %3c/svg%3e";

/***/ }),

/***/ "./style/images/search.svg":
/*!*********************************!*\
  !*** ./style/images/search.svg ***!
  \*********************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12.004' viewBox='0 0 12 12.004'%3e %3cg id='premium-icon-magnifier-2319177' transform='translate(-64.4 447.731)'%3e %3cpath id='%ed%8c%a8%ec%8a%a4_20' data-name='%ed%8c%a8%ec%8a%a4 20' d='M68.909-447.721a5.05%2c5.05%2c0%2c0%2c0-4.434%2c4.059%2c5.788%2c5.788%2c0%2c0%2c0%2c0%2c1.859%2c5.033%2c5.033%2c0%2c0%2c0%2c3.981%2c3.987%2c5.634%2c5.634%2c0%2c0%2c0%2c1.862%2c0%2c4.979%2c4.979%2c0%2c0%2c0%2c2.015-.876l.232-.169%2c1.552%2c1.549c1.364%2c1.364%2c1.568%2c1.552%2c1.671%2c1.571a.482.482%2c0%2c0%2c0%2c.463-.138.486.486%2c0%2c0%2c0%2c.138-.466c-.019-.1-.207-.3-1.568-1.668l-1.549-1.552.175-.247a4.957%2c4.957%2c0%2c0%2c0%2c.867-2%2c5.75%2c5.75%2c0%2c0%2c0%2c0-1.853%2c5.031%2c5.031%2c0%2c0%2c0-3.965-3.984A7.478%2c7.478%2c0%2c0%2c0%2c68.909-447.721Zm1.33%2c1.073a3.857%2c3.857%2c0%2c0%2c1%2c1.975%2c1.1%2c3.924%2c3.924%2c0%2c0%2c1%2c1.111%2c2.037%2c5.045%2c5.045%2c0%2c0%2c1%2c0%2c1.565%2c3.924%2c3.924%2c0%2c0%2c1-1.111%2c2.037%2c3.947%2c3.947%2c0%2c0%2c1-2.037%2c1.111%2c4.99%2c4.99%2c0%2c0%2c1-1.615-.013%2c3.886%2c3.886%2c0%2c0%2c1-1.987-1.1%2c3.925%2c3.925%2c0%2c0%2c1-1.111-2.037%2c5.045%2c5.045%2c0%2c0%2c1%2c0-1.565%2c3.926%2c3.926%2c0%2c0%2c1%2c1.111-2.037%2c3.856%2c3.856%2c0%2c0%2c1%2c1.972-1.092%2c2.967%2c2.967%2c0%2c0%2c1%2c.973-.075A3.712%2c3.712%2c0%2c0%2c1%2c70.239-446.647Z' transform='translate(0 0)' fill='%23b0b0b0'/%3e %3c/g%3e %3c/svg%3e";

/***/ }),

/***/ "./style/images/tag_plus.svg":
/*!***********************************!*\
  !*** ./style/images/tag_plus.svg ***!
  \***********************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg id='%ea%b7%b8%eb%a3%b9_134' data-name='%ea%b7%b8%eb%a3%b9 134' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='14' height='14' viewBox='0 0 14 14'%3e %3cdefs%3e %3cclipPath id='clip-path'%3e %3crect id='%ec%82%ac%ea%b0%81%ed%98%95_38' data-name='%ec%82%ac%ea%b0%81%ed%98%95 38' width='14' height='14' fill='white'/%3e %3c/clipPath%3e %3c/defs%3e %3cg id='%ea%b7%b8%eb%a3%b9_24' data-name='%ea%b7%b8%eb%a3%b9 24' clip-path='url(%23clip-path)'%3e %3cpath id='%ed%8c%a8%ec%8a%a4_32' data-name='%ed%8c%a8%ec%8a%a4 32' d='M13.3%2c6.3H7.7V.7A.7.7%2c0%2c0%2c0%2c6.3.7V6.3H.7a.7.7%2c0%2c0%2c0%2c0%2c1.4H6.3v5.6a.7.7%2c0%2c0%2c0%2c1.4%2c0V7.7h5.6a.7.7%2c0%2c0%2c0%2c0-1.4' transform='translate(0 0)' fill='white'/%3e %3c/g%3e %3c/svg%3e";

/***/ }),

/***/ "./style/images/uparrow.svg":
/*!**********************************!*\
  !*** ./style/images/uparrow.svg ***!
  \**********************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='10' height='8' viewBox='0 0 10 8'%3e %3cpath id='%eb%8b%a4%ea%b0%81%ed%98%95_3' data-name='%eb%8b%a4%ea%b0%81%ed%98%95 3' d='M5%2c0l5%2c8H0Z' fill='%23b0b0b0'/%3e %3c/svg%3e";

/***/ }),

/***/ "./style/images/web.svg":
/*!******************************!*\
  !*** ./style/images/web.svg ***!
  \******************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3c%3fxml version='1.0' encoding='UTF-8'%3f%3e%3csvg id='Layer_2' xmlns='http://www.w3.org/2000/svg' width='12.68' height='12.68' viewBox='0 0 12.68 12.68'%3e%3cdefs%3e%3cstyle%3e.cls-1%7bfill:%23a3a3a3%3bstroke-width:0px%3b%7d%3c/style%3e%3c/defs%3e%3cg id='Layer_1-2'%3e%3cpath class='cls-1' d='m12.54%2c5c-.2-.92-.58-1.75-1.18-2.54-.22-.29-.79-.86-1.08-1.09C9.35.63%2c8.2.15%2c7.05.03c-.38-.04-1.15-.04-1.53.01h0c-1.59.21-3.04%2c1.02-4.1%2c2.27-.44.53-.88%2c1.32-1.11%2c2.03-.22.69-.32%2c1.26-.32%2c1.99s.09%2c1.31.32%2c1.99c.45%2c1.38%2c1.35%2c2.54%2c2.61%2c3.37.54.35%2c1.35.69%2c2.01.84.44.1.98.15%2c1.48.15.22%2c0%2c.43-.01.62-.03%2c1.14-.13%2c2.24-.57%2c3.17-1.27.54-.41%2c1.2-1.15%2c1.58-1.77.82-1.36%2c1.09-3.03.76-4.6Zm-9.27%2c3.61c-.43.05-1.26.16-1.56.19-.02-.03-.04-.07-.07-.13-.25-.5-.43-1.07-.5-1.6%2c0-.05-.01-.11-.02-.16h1.84c.02.42.16%2c1.21.3%2c1.7Zm8.27-1.7c0%2c.06-.01.12-.02.18-.04.31-.15.75-.26%2c1.06-.1.27-.23.53-.3.65-.14-.01-.36-.04-.61-.07-.32-.04-.64-.08-.83-.1l.02-.06c.13-.45.23-1.02.28-1.51v-.15h1.72Zm-8.82%2c2.89l.8-.1s.09%2c0%2c.14-.01l.06.12c.22.47.56%2c1.02.91%2c1.49-.84-.29-1.63-.81-2.2-1.46.09-.01.19-.02.29-.04Zm-1.59-4.02c0-.06.02-.12.02-.18.07-.52.24-1.08.49-1.59.03-.06.05-.1.07-.13.17.02.5.06.87.1h.12c.22.04.42.07.56.09-.15.5-.28%2c1.28-.3%2c1.7h-1.84ZM6.6%2c1.3c.21.1.94%2c1%2c1.35%2c1.77h-.15c-.65.05-2.25.04-2.93%2c0%2c.09-.17.23-.4.35-.6.37-.56.87-1.11%2c1-1.18.13-.07.24-.07.39%2c0Zm-1.17%2c7.15c-.44.01-.85.04-1.02.05v-.04c-.16-.48-.28-1.07-.32-1.56h4.64c-.06.59-.14.99-.28%2c1.49l-.03.12h-.01c-.61-.05-1.34-.07-2.02-.07-.33%2c0-.65%2c0-.94.02Zm3.3-2.69h-4.63c.04-.5.15-1.06.31-1.57v-.04c.19.01.61.03%2c1.03.05.89.03%2c2.05.01%2c2.96-.05h.03s.03.12.03.12c.15.5.22.9.28%2c1.49Zm1.12%2c0v-.15c-.06-.49-.16-1.06-.29-1.51%2c0-.02-.01-.04-.02-.06.1-.01.23-.03.36-.04h.09c.27-.04.58-.08.71-.1h.1c.07-.02.13-.03.18-.03%2c0%2c.02.02.04.03.07l.03.07c.25.5.43%2c1.07.49%2c1.59%2c0%2c.06.02.12.02.18h-1.71Zm-.7-2.79l-.05-.1c-.2-.44-.53-.98-.87-1.43.64.25%2c1.27.65%2c1.79%2c1.15.07.07.16.16.24.25-.31.04-.74.09-1.11.13Zm-5.34-.25l-.13.26h-.05c-.19-.02-.78-.09-1.19-.15.05-.05.1-.11.15-.16.5-.52%2c1.2-.98%2c1.91-1.25.04-.02.09-.03.15-.05-.31.41-.63.92-.84%2c1.35Zm1.42%2c7.46c-.1-.15-.25-.41-.36-.6.46-.02%2c1.41-.05%2c1.72-.03.17%2c0%2c.55.01.84.02.18%2c0%2c.38.01.53.02-.3.58-.72%2c1.16-1.15%2c1.6-.17.17-.19.18-.27.21-.17.05-.25.05-.55-.26-.28-.29-.51-.58-.76-.96Zm3.86-.37s.04-.09.06-.13c.14.02.36.04.61.07h.09c.15.03.29.05.41.06-.55.62-1.25%2c1.1-2.03%2c1.4.33-.45.66-.98.86-1.41Z'/%3e%3c/g%3e%3c/svg%3e";

/***/ }),

/***/ "./style/images/web_f.svg":
/*!********************************!*\
  !*** ./style/images/web_f.svg ***!
  \********************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3c%3fxml version='1.0' encoding='UTF-8'%3f%3e%3csvg id='Layer_2' xmlns='http://www.w3.org/2000/svg' width='12.69' height='12.68' viewBox='0 0 12.69 12.68'%3e%3cdefs%3e%3cstyle%3e.cls-1%7bfill:grey%3bstroke-width:0px%3b%7d%3c/style%3e%3c/defs%3e%3cg id='Layer_2-2'%3e%3cg id='Layer_1-2'%3e%3cpath class='cls-1' d='m12.55%2c5c-.2-.92-.58-1.75-1.18-2.54-.22-.29-.79-.86-1.08-1.09C9.36.63%2c8.21.15%2c7.06.03c-.38-.04-1.15-.04-1.53%2c0h0C3.94.25%2c2.49%2c1.06%2c1.43%2c2.31c-.44.53-.88%2c1.32-1.11%2c2.03-.22.69-.32%2c1.26-.32%2c1.99s.09%2c1.31.32%2c1.99c.45%2c1.38%2c1.35%2c2.54%2c2.61%2c3.37.54.35%2c1.35.69%2c2.01.84.44.1.98.15%2c1.48.15.22%2c0%2c.43-.01.62-.03%2c1.14-.13%2c2.24-.57%2c3.17-1.27.54-.41%2c1.2-1.15%2c1.58-1.77.82-1.36%2c1.09-3.03.76-4.6h0Zm-9.27%2c3.61c-.43.05-1.26.16-1.56.19-.02-.03-.04-.07-.07-.13-.25-.5-.43-1.07-.5-1.6%2c0-.05%2c0-.11-.02-.16h1.84c.02.42.16%2c1.21.3%2c1.7h0Zm8.27-1.7c0%2c.06-.01.12-.02.18-.04.31-.15.75-.26%2c1.06-.1.27-.23.53-.3.65-.14-.01-.36-.04-.61-.07-.32-.04-.64-.08-.83-.1l.02-.06c.13-.45.23-1.02.28-1.51v-.15s1.72%2c0%2c1.72%2c0Zm-8.82%2c2.89l.8-.1s.09%2c0%2c.14-.01l.06.12c.22.47.56%2c1.02.91%2c1.49-.84-.29-1.63-.81-2.2-1.46.09-.01.19-.02.29-.04Zm-1.59-4.02c0-.06.02-.12.02-.18.07-.52.24-1.08.49-1.59.03-.06.05-.1.07-.13.17.02.5.06.87.1h.12c.22.04.42.07.56.09-.15.5-.28%2c1.28-.3%2c1.7h-1.84%2c0ZM6.61%2c1.3c.21.1.94%2c1%2c1.35%2c1.77h-.15c-.65.05-2.25.04-2.93%2c0%2c.09-.17.23-.4.35-.6.37-.56.87-1.11%2c1-1.18.13-.07.24-.07.39%2c0h0Zm-1.17%2c7.15c-.44.01-.85.04-1.02.05v-.04c-.16-.48-.28-1.07-.32-1.56h4.64c-.06.59-.14.99-.28%2c1.49l-.03.12h-.01c-.61-.05-1.34-.07-2.02-.07-.33%2c0-.65%2c0-.94.02h-.02Zm3.3-2.69h-4.63c.04-.5.15-1.06.31-1.57v-.04c.19.01.61.03%2c1.03.05.89.03%2c2.05.01%2c2.96-.05h.03l.03.12c.15.5.22.9.28%2c1.49h0Zm1.12%2c0v-.15c-.06-.49-.16-1.06-.29-1.51%2c0-.02-.01-.04-.02-.06.1-.01.23-.03.36-.04h.09c.27-.04.58-.08.71-.1h.1c.07-.02.13-.03.18-.03%2c0%2c.02.02.04.03.07l.03.07c.25.5.43%2c1.07.49%2c1.59%2c0%2c.06.02.12.02.18h-1.71v-.02Zm-.7-2.79l-.05-.1c-.2-.44-.53-.98-.87-1.43.64.25%2c1.27.65%2c1.79%2c1.15.07.07.16.16.24.25-.31.04-.74.09-1.11.13Zm-5.34-.25l-.13.26h-.05c-.19-.02-.78-.09-1.19-.15.05-.05.1-.11.15-.16.5-.52%2c1.2-.98%2c1.91-1.25.04-.02.09-.03.15-.05-.31.41-.63.92-.84%2c1.35Zm1.42%2c7.46c-.1-.15-.25-.41-.36-.6.46-.02%2c1.41-.05%2c1.72-.03.17%2c0%2c.55.01.84.02.18%2c0%2c.38.01.53.02-.3.58-.72%2c1.16-1.15%2c1.6-.17.17-.19.18-.27.21-.17.05-.25.05-.55-.26-.28-.29-.51-.58-.76-.96Zm3.86-.37s.04-.09.06-.13c.14.02.36.04.61.07h.09c.15.03.29.05.41.06-.55.62-1.25%2c1.1-2.03%2c1.4.33-.45.66-.98.86-1.41h0Z'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e";

/***/ })

}]);
//# sourceMappingURL=lib_index_js.f704fb6cbfd0a4b58bd2.js.map