import { Ankus, StandardTermPart, ShareCode } from './ankusCommon';
export var NotebookPlugin;
(function (NotebookPlugin) {
    //자동완성 용어를 노트북에 삽입
    function insertCompletionText(text, replace) {
        if (Ankus.activeNotebook !== null &&
            Ankus.activeNotebook.activeCell !== null) {
            const editor = Ankus.activeNotebook.activeCell.editor;
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
        switch (Ankus.stdtermFormat) {
            case StandardTermPart.Format.camel:
                return camelize(text);
            case StandardTermPart.Format.sentence:
                return titlize(text);
            case StandardTermPart.Format.lower:
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
        const itr = Ankus.activeNotebook.children();
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
        code[ShareCode.CodePropertyName.content] = content; //code content
        //code[CodePropertyName.date] = this.updateDate;
        //code[CodePropertyName.userNo] = this.userNumber; //code writer(number)
        //code id
        code[ShareCode.CodePropertyName.id] = Ankus.ankusPlugin.currentCode().id;
        //update code
        fetch(Ankus.ankusURL + '/share-code/modify/code', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: Ankus.loginToken,
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
            Ankus.ankusPlugin.updateCodelist();
        })
            .catch(error => {
            alert('공유 코드 저장 오류');
        }); //fetch
    } //updateCodeWithCell
    NotebookPlugin.updateCodeWithCell = updateCodeWithCell;
})(NotebookPlugin || (NotebookPlugin = {}));
//# sourceMappingURL=notebookAction.js.map