import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { MdClear } from 'react-icons/md';
import { Dialog, Tooltip, Typography, IconButton, Button, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { style } from 'typestyle';
import styled from 'styled-components';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../../style/codedesc.css';
const maxTagCount = 30;
//rename dialog
export const RenameDialog = (props) => {
    const { open, onClose } = props;
    const [newnm, setName] = React.useState('');
    const [dirty, setDirty] = React.useState(false);
    return (_jsxs(Dialog, { open: open, onClose: onClose, children: [_jsx(DialogTitle, { children: "Rename Code" }), _jsxs(DialogContent, { dividers: true, children: [_jsx(DialogContentText, { children: "Enter new name." }), _jsx(TextField, { autoFocus: true, margin: "dense", id: "name", label: "Name", style: { width: '300px' }, defaultValue: props.name, onChange: e => {
                            setName(e.target.value);
                            setDirty(true);
                        } })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: e => onClose(''), color: "primary", children: "Cancel" }), _jsx(Button, { onClick: e => onClose(newnm), color: "primary", disabled: newnm.length < 1 || !dirty, children: "Rename" })] })] })); //return
}; //RenameDialog
export class CodePropDlg extends React.Component {
    constructor(props) {
        super(props);
        this.DialogTitle = (pr) => {
            var _a;
            //withStyles(this.styles)((props) => {
            const { children, classes, onClose, ...other } = pr;
            return (_jsxs(MuiDialogTitle, { style: {
                    backgroundColor: 'var(--jp-layout-color1)',
                    padding: '10px 20px',
                    display: 'flex',
                    justifyContent: 'space-between'
                }, disableTypography: true, ...other, children: [_jsxs(Typography, { variant: "h6", style: { display: 'inline-block', color: 'var(--jp-ui-font-color1)' }, children: [_jsx("b", { children: (_a = this.props.prop) === null || _a === void 0 ? void 0 : _a.name }), " - Properties"] }), onClose ? (_jsx(IconButton, { style: {
                            display: 'inline-block',
                            width: '30px',
                            height: '30px'
                        }, "aria-label": "close", 
                        /* className={classes.closeButton} */
                        onClick: onClose, children: _jsx(CloseIcon, { style: {
                                position: 'relative',
                                top: '-7px',
                                color: 'var(--jp-ui-font-color2)'
                            } }) })) : null] }));
        };
        this.DialogContent = withStyles(theme => ({
            root: {
                //padding: theme.spacing(2),
                padding: '10px 20px',
                width: '560px',
                height: '550px',
                backgroundColor: 'var(--jp-layout-color1)'
            }
        }))(MuiDialogContent);
        this.DialogActions = withStyles(theme => ({
            root: {
                margin: 0,
                padding: theme.spacing(1),
                backgroundColor: 'var(--jp-layout-color1)'
            }
        }))(MuiDialogActions);
        this.DelButton = styled.button `
    border: none;
    width: 20px;
    background-color: transparent;
    cursor: pointer;
    &:active,
    &:hover {
      background-color: var(--jp-ui-control-color2);
    }
  `;
        this.tagBoxStyle = style({
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
                return (_jsx("button", { onClick: event => {
                        const list = [...this.state.taglist];
                        list.splice(row, 1);
                        this.setState({ taglist: list, dirty: true });
                    }, title: "Delete Tag", className: "align-vt-center", style: { justifyContent: 'center', marginLeft: '7px' }, children: _jsx(MdClear, { color: "var(--jp-ui-font-color1)" }) })); //return
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
        return (_jsxs(Dialog, { onClose: () => this.closeDlg(), open: this.props.open, style: { border: '1px solid var(--jp-border-color1)' }, children: [_jsx(this.DialogTitle, { id: "customized-dialog-title", onClose: () => this.closeDlg() }), _jsxs(this.DialogContent, { dividers: true, children: [_jsx(Typography, { variant: "subtitle2", style: { color: 'var(--jp-ui-font-color1)' }, children: "\u00A0Preview" }), _jsx(SyntaxHighlighter, { language: "python", style: docco, customStyle: {
                                backgroundColor: 'var(--jp-layout-color2)',
                                fontFamily: 'var(--jp-code-font-family)',
                                fontSize: '9px',
                                color: 'var(--jp-content-font-color0)',
                                margin: 0,
                                height: '180px',
                                borderCollapse: 'collapse'
                            }, children: this.codePreview() }), _jsx("br", {}), _jsx(Typography, { variant: "subtitle2", style: { color: 'var(--jp-ui-font-color1)' }, children: "\u00A0Tag" }), _jsx("div", { className: this.tagBoxStyle, children: _jsx("table", { className: "ankus-code-tag-tbl", style: {
                                    width: '100%',
                                    borderCollapse: 'collapse'
                                }, children: _jsx("tbody", { children: this.state
                                        .taglist.filter((t, i) => i < maxTagCount)
                                        .map((row, ri) => {
                                        return (_jsxs("tr", { children: [_jsx("td", { children: _jsx("span", { children: ri + 1 }) }), _jsx("td", { children: _jsx(TagCell
                                                    //editing={editingTagIdx === row}
                                                    , { 
                                                        //editing={editingTagIdx === row}
                                                        tag: row, newTag: this.isNewTag(ri), onEndEdit: this.clbkEndEditTag, onUpdateTag: this.clbkUpdateTag, index: ri, editable: this.props.editable }) }), this.props.editable ? (_jsx("td", { children: this.buttonCell(ri) })) : ('')] }, ri));
                                    }) }) }) }), _jsx("br", {}), _jsx(Typography, { variant: "subtitle2", style: { color: 'var(--jp-ui-font-color1)' }, children: "\u00A0Description" }), _jsx("textarea", { className: "ankus-code-desc-txt", maxLength: 300, placeholder: "\uCF54\uB4DC \uC124\uBA85 (\uCD5C\uB300 300\uC790)", onChange: e => this.setState({ desc: e.target.value, dirty: true }), disabled: !this.props.editable, children: this.state.desc })] }), this.props.editable ? (_jsx(this.DialogActions, { children: _jsx(Button, { autoFocus: true, onClick: () => {
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
class TagCell extends React.Component {
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
            _jsx(Tooltip, { arrow: true, title: this.state.tooltip, placement: "bottom-start", PopperProps: { disablePortal: true }, 
                //onClose={event => {}}
                open: this.state.tooltip.length > 0, disableFocusListener: true, disableHoverListener: true, disableTouchListener: true, children: _jsx("input", { className: "input-tag", 
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
                return (_jsx("span", { style: {
                        color: 'var(--jp-ui-font-color2)'
                    }, onClick: event => {
                        this.setState({ edit: true });
                    }, children: this.props.tag }));
            }
            //태그
            else {
                return (_jsx("span", { onClick: event => {
                        this.setState({
                            edit: this.props.editable,
                            input: this.props.tag
                        });
                    }, children: this.props.tag }));
            }
        } //else : display tag
    } //render
} //TagCell
//# sourceMappingURL=codeDescTab.js.map