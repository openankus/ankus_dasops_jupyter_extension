import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { style } from 'typestyle';
//import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import TextareaAutosize from 'react-autosize-textarea';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { markdownIcon, pythonIcon, editIcon, imageIcon } from '@jupyterlab/ui-components';
import '../../style/codecontent.css';
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
export class CodeContentTab extends React.Component {
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
                    return (_jsx(CodeCellEditor, { idx: row, defaultValue: value, clazzName: cellClass, 
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
                    return (_jsx("div", { className: cellClass + ' hl-wrap', style: {
                            marginBottom: '5px',
                            display: this.props.edit[row] ? 'none' : 'block'
                        }, children: _jsx(SyntaxHighlighter, { language: "python", style: docco, customStyle: {
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
                    return (_jsx(CodeCellEditor, { idx: row, defaultValue: value, clazzName: cellClass, 
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
                    return (_jsx("div", { className: cellClass + ' md-wrap', style: { marginBottom: '5px' }, children: _jsx(ReactMarkdown, { children: value }) }));
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
        this._headerStyle = style({
            fontWeight: '700',
            marginBottom: '3px',
            color: 'var(--jp-ui-font-color2)'
        });
        this._noStyle = style({
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
        return (_jsxs("div", { className: "ankus-code-wrap", children: [_jsxs("div", { className: this._headerStyle, children: [_jsx("div", { style: {
                                width: '50px',
                                display: 'inline-block',
                                textAlign: 'center'
                            }, children: "No" }), _jsx("div", { className: "th-cell", children: "Cell" })] }), _jsx("div", { className: "tbl-container", children: _jsx("table", { className: "ankus-cod-cel-tbl", 
                        //{...getTableProps()}
                        onKeyDown: e => {
                            this.tableKeydown(e);
                        }, tabIndex: 0, children: _jsx("tbody", { children: tbldat.map((row, ri) => (
                            //prepareRow(row);
                            _jsxs("tr", { children: [_jsx("td", { className: this._noStyle, children: _jsx("p", { style: { marginTop: '5px' }, children: ri + 1 }) }), _jsx("td", { 
                                        //{...cell.getCellProps()}
                                        onClick: e => this.props.onSelectCell(ri), onContextMenu: e => this.props.onSelectCell(ri), children: this.renderCell(row.source /* cell.value */, ri) }), _jsxs("td", { 
                                        //{...cell.getCellProps()}
                                        style: { width: '30px', verticalAlign: 'top' }, children: [_jsx("button", { onClick: event => {
                                                    this.props.onSelectCell(ri);
                                                    this.props.onChangeCellEditMode();
                                                }, style: { marginTop: '5px' }, title: this.props.edit[ri] ? 'Edit' : 'View', children: this.props.edit[ri] ? (_jsx(editIcon.react, {})) : (_jsx(imageIcon.react, {})) }), _jsx("div", { title: row.cell_type === 'markdown' ? 'Markdown' : 'Python', style: { display: 'flex', justifyContent: 'center' }, children: row.cell_type /* row.values['type'] */ === 'markdown' ? (_jsx(markdownIcon.react, {})) : (_jsx(pythonIcon.react, {})) })] })] }, ri))) }) }) })] })); //return
    } //render
} //CodeContentTab
export class CodeCellEditor extends React.Component {
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
        return (_jsx(TextareaAutosize, { className: this.props.clazzName, value: this.state.value, ref: c => (this._ref = c), onChange: e => {
                this.setState({ value: e.currentTarget.value });
            }, onFocus: e => {
                this.props.onBeginEdit(this._ref);
            }, onBlur: e => {
                this.props.onEndEdit(this.props.idx, this.state.value);
            }, style: { overflowX: 'auto' } })); //return
    } //render
} //CodeCellEditor
//# sourceMappingURL=codeContentTab.js.map