import React from 'react';
import { style } from 'typestyle';
//import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import TextareaAutosize from 'react-autosize-textarea';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {
  markdownIcon,
  pythonIcon,
  editIcon,
  imageIcon
} from '@jupyterlab/ui-components';

import '../../style/codecontent.css';
import { CellData } from '../doc/docModel';

export interface ICodeCell {
  //type, source
  data: Array<CellData>;
  //편집 여부
  edit: Array<boolean>;
  //선택된 셀 번호
  selectedCell: number;
  //셀 내용 변경시
  onChangeCell: (rowIdx: number, value: string) => void;
  //셀 선택
  onSelectCell: (idx: number) => void;
  onChangeCellEditMode: () => void;
  //셀에서 입력포커스를 가졌을 때
  onFocusCellEditor: (ref: HTMLTextAreaElement) => void;
}

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

export class CodeContentTab extends React.Component<ICodeCell> {
  /*   const pasteText = (
    event: React.ClipboardEvent<HTMLTextAreaElement>
  ): void => {
    console.log(event.clipboardData.getData('text/html'));
  };
 */

  constructor(props: ICodeCell) {
    super(props);

    this.state = {};
  }

  renderCell = (value: string, row: number) => {
    const cellClass =
      row === this.props.selectedCell ? 'ankus-Cell sel-cell' : 'ankus-Cell';
    //code
    if (this.props.data[row].cell_type === 'code') {
      //edit
      if (this.props.edit[row]) {
        return (
          <CodeCellEditor
            idx={row}
            defaultValue={value}
            clazzName={cellClass}
            //셀에서 입력포커스를 가졌을 때 호출
            onBeginEdit={celref => {
              this._focusCelref = celref;
              //입력포커스를 가져간 셀을 알려줌
              this.props.onFocusCellEditor(celref);
            }}
            //셀에서 입력포커스를 버렸을 때 호출
            onEndEdit={(idx, val) => {
              this._focusCelref = null;
              this.props.onChangeCell(idx, val);
            }}
          ></CodeCellEditor>
        ); //return
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
        return (
          <div
            className={cellClass + ' hl-wrap'}
            style={{
              marginBottom: '5px',
              display: this.props.edit[row] ? 'none' : 'block'
            }}
          >
            <SyntaxHighlighter
              language="python"
              style={docco}
              customStyle={{
                backgroundColor: 'var(--jp-layout-color2)',
                fontFamily: 'var(--jp-code-font-family)',
                color: 'var(--jp-content-font-color0)'
              }}
            >
              {/* obsidian,foundation,github */}
              {value}
            </SyntaxHighlighter>
          </div>
        );
      }
    } //if: code
    //markdown
    else {
      //edit
      if (this.props.edit[row]) {
        return (
          <CodeCellEditor
            idx={row}
            defaultValue={value}
            clazzName={cellClass}
            //셀에서 입력포커스를 가졌을 때 호출
            onBeginEdit={celref => {
              this._focusCelref = celref;
              //입력포커스를 가져간 셀을 알려줌
              this.props.onFocusCellEditor(celref);
            }}
            //셀에서 입력포커스를 버렸을 때 호출
            onEndEdit={(idx, val) => {
              this._focusCelref = null;
              this.props.onChangeCell(idx, val);
            }}
          ></CodeCellEditor>
        );
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
        return (
          <div
            className={cellClass + ' md-wrap'}
            style={{ marginBottom: '5px' }}
          >
            <ReactMarkdown>{value}</ReactMarkdown>
          </div>
        );
      }
    } //else : markdown
  }; //render cell

  tableKeydown = (event: React.KeyboardEvent<HTMLTableElement>): boolean => {
    //셀 편집 상태 아님 확인
    if (this._focusCelref === null) {
      //상단 셀 선택
      if (event.key === 'ArrowUp' && this.props.selectedCell > 0) {
        this.props.onSelectCell(this.props.selectedCell - 1);
      }
      //하단 셀 선택
      else if (
        event.key === 'ArrowDown' &&
        this.props.selectedCell < this.props.data.length - 1
      ) {
        this.props.onSelectCell(this.props.selectedCell + 1);
      }

      return false;
    } //if : 셀 편집 상태 아님 확인
    return true;
  }; //tableKeydown

  private _headerStyle = style({
    fontWeight: '700',
    marginBottom: '3px',
    color: 'var(--jp-ui-font-color2)'
  });

  private _noStyle = style({
    width: '35px',
    textAlign: 'center',
    verticalAlign: 'top',
    color: 'var(--jp-ui-font-color1)'
  });

  render(): React.ReactElement {
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

    return (
      <div className="ankus-code-wrap">
        {/* header start */}
        <div className={this._headerStyle}>
          <div
            style={{
              width: '50px',
              display: 'inline-block',
              textAlign: 'center'
            }}
          >
            No
          </div>
          <div className="th-cell">Cell</div>
        </div>
        {/* header end */}

        <div className="tbl-container">
          <table
            className="ankus-cod-cel-tbl"
            //{...getTableProps()}
            onKeyDown={e => {
              this.tableKeydown(e);
            }}
            tabIndex={0}
          >
            {/*         <thead>
          {headerGroups.map(headerGroup => (
            <tr
              style={{ borderBottom: '1px solid gray' }}
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map(col => (
                <th {...col.getHeaderProps()}>{col.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
 */}
            <tbody>
              {/* {...getTableBodyProps()}> */}
              {tbldat.map((row, ri) => (
                //prepareRow(row);
                <tr key={ri}>
                  {/* {...row.getRowProps()}>
                    {row.cells.map((cell, ci) => {
                      if (ci === 0) {
                        return ( */}
                  {/* no */}
                  <td className={this._noStyle}>
                    {/* {...cell.getCellProps()}> */}
                    <p style={{ marginTop: '5px' }}>
                      {ri + 1}
                      {/* {row.value} */}
                    </p>
                    {/* <button onClick={event => showMenu(event, ri)}>
                            <BsMenuDown></BsMenuDown>
                          </button> */}
                  </td>

                  {/* cell */}
                  <td
                    //{...cell.getCellProps()}
                    onClick={e => this.props.onSelectCell(ri)}
                    onContextMenu={e => this.props.onSelectCell(ri)}
                  >
                    {this.renderCell(row.source /* cell.value */, ri)}

                    {/* <textarea
                            // rows={3}
                            onInput={event => {
                              event.currentTarget.style.height = '0';
                              event.currentTarget.style.height =
                                event.currentTarget.scrollHeight - 5 + 'px';
                            }}                    
                            value={cell.value}
                          /> */}

                    {/*  <div
                            style={{
                              overflowX: 'auto',
                              width: '100%',
                              height: '100%'
                            }}
                          >
                            <div
                              className="cell-text"
                              role={'textbox'}
                              contentEditable="true"
                              onPaste={event => pasteText(event)}
                            >
                              {cell.value}
                            </div>
                          </div> */}
                  </td>

                  {/* edit icon */}
                  <td
                    //{...cell.getCellProps()}
                    style={{ width: '30px', verticalAlign: 'top' }}
                  >
                    <button
                      onClick={event => {
                        this.props.onSelectCell(ri);
                        this.props.onChangeCellEditMode();
                      }}
                      style={{ marginTop: '5px' }}
                      title={this.props.edit[ri] ? 'Edit' : 'View'}
                    >
                      {this.props.edit[ri] ? (
                        <editIcon.react></editIcon.react>
                      ) : (
                        <imageIcon.react></imageIcon.react>
                      )}
                    </button>

                    {/* type icon */}
                    <div
                      title={
                        row.cell_type === 'markdown' ? 'Markdown' : 'Python'
                      }
                      style={{ display: 'flex', justifyContent: 'center' }}
                    >
                      {row.cell_type /* row.values['type'] */ === 'markdown' ? (
                        <markdownIcon.react></markdownIcon.react>
                      ) : (
                        <pythonIcon.react></pythonIcon.react>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ); //return
  } //render

  //입력포커스가 있는 셀
  private _focusCelref: HTMLTextAreaElement | null = null;
} //CodeContentTab

interface ICodeCellEditor {
  defaultValue: string;
  clazzName: string;
  idx: number;
  //입력포커스를 가졌을 때 호출
  onBeginEdit: (ref: HTMLTextAreaElement) => void;
  //입력포커스를 잃었을 때 호출
  onEndEdit: (idx: number, value: string) => void;
}

export class CodeCellEditor extends React.Component<ICodeCellEditor, any> {
  private _ref: HTMLTextAreaElement | null = null;

  constructor(props: ICodeCellEditor) {
    super(props);

    this.state = { value: props.defaultValue };
  }

  shouldComponentUpdate(
    nextProps: Readonly<ICodeCellEditor>,
    nextState: Readonly<any>,
    nextContext: any
  ): boolean {
    if (
      nextState.value === this.state.value &&
      nextProps.defaultValue === this.props.defaultValue &&
      nextProps.clazzName === this.props.clazzName
    ) {
      return false;
    }

    if (nextProps.defaultValue !== this.props.defaultValue) {
      this.setState({ value: nextProps.defaultValue });
    }

    return true;
  }

  render(): React.ReactElement {
    return (
      <TextareaAutosize
        className={this.props.clazzName}
        value={this.state.value}
        ref={c => (this._ref = c)}
        onChange={e => {
          this.setState({ value: e.currentTarget.value });
        }}
        onFocus={e => {
          this.props.onBeginEdit(this._ref!);
        }}
        onBlur={e => {
          this.props.onEndEdit(this.props.idx, this.state.value);
        }}
        style={{ overflowX: 'auto' }}
        /* theme={{ textarea: { overflow: 'auto', overflowX: 'scroll' } }} */
      />
    ); //return
  } //render
} //CodeCellEditor
