import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useTable } from 'react-table';
import { MdClear } from 'react-icons/md';
import Tooltip from '@material-ui/core/Tooltip';
import { style } from 'typestyle';
import '../../style/codedesc.css';
const maxTagCount = 30;
export const CodeDescTab = (props) => {
    const tbldat = [];
    //table data
    props.tags.forEach((value, index) => {
        tbldat.push({ no: index + 1, cell: value.name, delete: '' });
    });
    //새 태그 입력란
    if (tbldat.length < maxTagCount) {
        tbldat.push({
            no: tbldat.length + 1,
            cell: '[Click to enter a new tag]',
            delete: ''
        });
    }
    //  const [tableData, setTableData] = React.useState(tbldat);
    //let tblDivRef: HTMLDivElement | null = null;
    //const [editingTagIdx, editTag] = React.useState(maxTagCount);
    const updateTag = (idx, value) => {
        //중복 검사
        if (props.tags.find((t, index) => index !== idx && t.name === value) !==
            undefined) {
            return false;
        }
        //마지막 줄에 입력
        if (idx === props.tags.length) {
            props.onAddTag(value); //태그 추가
        }
        else {
            props.onChangeTag(value, idx);
        }
        return true;
    }; //updateTag
    const endEditTag = () => {
        //editTag(maxTagCount);
    };
    const tagCell = (cell, row) => {
        return (_jsx("td", { className: "td-tag", ...cell.getCellProps(), children: _jsx(TagCell
            //editing={editingTagIdx === row}
            , { 
                //editing={editingTagIdx === row}
                tag: cell.value, newTag: row === props.tags.length, onEndEdit: endEditTag, onUpdateTag: updateTag, index: row }) })); //return
    }; //tagCell
    const buttonCell = (cell, row) => {
        //new tag
        if (row !== props.tags.length) {
            {
                /*           <button
                    onClick={event => {
                      editTag(row);
                    }}
                  >
                    <MdOutlineNewLabel></MdOutlineNewLabel>
                  </button>
         */
            }
            return (_jsx("td", { ...cell.getCellProps(), children: _jsx("button", { onClick: event => {
                        props.onDeleteTag(props.tags[row].name);
                    }, title: "Delete Tag", children: _jsx(MdClear, { color: "var(--jp-ui-font-color1)" }) }) })); //return
        }
        else {
            return _jsx("td", { ...cell.getCellProps() });
        }
    }; //buttonCell
    const tagBoxStyle = style({
        height: 'calc(100% - 180px)',
        overflow: 'auto',
        margin: '7px 7px 0 7px',
        padding: '0 3px',
        backgroundColor: 'var(--jp-cell-editor-background)',
        color: 'var(--jp-ui-font-color0)',
        border: '1px solid var(--jp-cell-editor-border-color)'
    });
    //table header
    const columns = React.useMemo(() => [
        { Header: 'No', accessor: 'no' },
        {
            Header: 'Cell',
            accessor: 'cell'
        },
        {
            Header: 'Delete',
            accessor: 'delete'
        }
    ], []); //table columns
    //table data
    const data = React.useMemo(() => tbldat, [tbldat]);
    //table
    const { getTableProps, getTableBodyProps, rows, prepareRow } = useTable({ columns, data });
    /*     keywords = this.props.tags.map((tag, index) => {
        if (!tag.deleted) {
          return (
            <TagItem
              id={tag.id}
              name={tag.name}
              onClick={this.selectTag}
              onDelete={this.props.onDeleteTag}
              key={index}
            />
          );
        }
      });
   */
    return (_jsxs("div", { className: "ankus-desc-page", children: [_jsxs("p", { style: { marginBottom: '8px' }, children: [_jsx("span", { className: "sub-title", children: "\u00A0\u00A0- Code Tag" }), "\u00A0\u00A0", _jsx("span", { style: { fontSize: '11px', color: 'var(--jp-info-color1)' }, children: "(\uCD5C\uB300 30\uAC1C \uD0DC\uADF8 \uCD94\uAC00 \uAC00\uB2A5)" })] }), _jsx("div", { className: tagBoxStyle, children: _jsx("table", { className: "tbl-tag", style: { width: '100%', borderCollapse: 'collapse' }, ...getTableProps(), children: _jsx("tbody", { ...getTableBodyProps(), children: rows.map((row, ri) => {
                            prepareRow(row);
                            return (_jsx("tr", { ...row.getRowProps(), children: row.cells.map((cell, ci) => {
                                    //no
                                    if (ci === 0) {
                                        return (_jsx("td", { ...cell.getCellProps(), children: _jsx("span", { children: cell.value }) }));
                                    }
                                    //cell
                                    else if (ci === 1) {
                                        return tagCell(cell, ri);
                                    }
                                    else {
                                        return buttonCell(cell, ri);
                                    } //else : button cell
                                }) }));
                        }) }) }) }), _jsxs("div", { className: "description-wrap", children: [_jsx("p", { className: "sub-title", style: { marginBottom: '3px' }, children: "- Description" }), _jsx("textarea", { className: "text-comment", maxLength: 300, placeholder: "\uCF54\uB4DC \uC124\uBA85 (\uCD5C\uB300 300\uC790)", onChange: e => {
                            props.onChangeComment(e.target.value);
                        }, children: props.comment })] })] }));
};
class TagCell extends React.Component {
    constructor(props) {
        super(props);
        this.onFocusOutTagInput = (e) => {
            //공백, # 삭제
            const trimtag = e.target.value.replace(/[\s#]/g, '');
            if (trimtag.length) {
                this.props.onUpdateTag(this.props.index, trimtag);
            }
            this.endEditCell();
        }; //onFocusOutTagInput
        this.endEditCell = () => {
            this.props.onEndEdit();
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
                        this.setState({ edit: true, input: this.props.tag });
                    }, children: this.props.tag }));
            }
        } //else : display tag
    } //render
} //TagCell
//# sourceMappingURL=codeDescTab.js.map