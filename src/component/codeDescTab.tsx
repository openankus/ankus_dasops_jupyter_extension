import React from 'react';
import { MdClear } from 'react-icons/md';
import {
  Dialog,
  Tooltip,
  Typography,
  IconButton,
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { style } from 'typestyle';
import styled, { css } from 'styled-components';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import '../../style/codedesc.css';
import { Ankus, ShareCode } from '../ankusCommon';
import { NotebookPlugin } from '../notebookAction';

const maxTagCount = 30;

export interface IRenameProps {
  open: boolean;
  name: string;
  onClose: (name: string) => void;
}

//rename dialog
export const RenameDialog: React.FunctionComponent<IRenameProps> = (
  props: IRenameProps
): React.ReactElement => {
  const { open, onClose } = props;
  const [newnm, setName] = React.useState<string>('');
  const [dirty, setDirty] = React.useState<boolean>(false);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Rename Code</DialogTitle>

      <DialogContent dividers>
        <DialogContentText>Enter new name.</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          style={{ width: '300px' }}
          defaultValue={props.name}
          onChange={e => {
            setName(e.target.value);
            setDirty(true);
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={e => onClose('')} color="primary">
          Cancel
        </Button>
        <Button
          onClick={e => onClose(newnm)}
          color="primary"
          disabled={newnm.length < 1 || !dirty}
        >
          Rename
        </Button>
      </DialogActions>
    </Dialog>
  ); //return
}; //RenameDialog

export interface ICodeDescProps {
  open: boolean;
  editable: boolean;
  prop: ShareCode.CodeProperty;
  content: NotebookPlugin.CellData[];

  onClose: (save: boolean, taglist?: Array<string>, desc?: string) => void;
} //ICodeDescProps

export class CodePropDlg extends React.Component<ICodeDescProps, any> {
  constructor(props: ICodeDescProps) {
    super(props);

    this.state = { taglist: [], desc: '', dirty: false };
  }

  componentDidUpdate(prevProps: ICodeDescProps) {
    // 전형적인 사용 사례 (props 비교를 잊지 마세요)
    //dialog를 다시 여는 경우
    if (this.props.open !== prevProps.open && this.props.open === true) {
      //tag list
      const list =
        this.props.prop.taglist === undefined
          ? []
          : [...this.props.prop.taglist];
      //편집 가능할 경우, 새 태그 입력란 삽입
      if (this.props.editable) {
        list.push('[Click to enter a new tag]');
      }

      //description
      const desc =
        this.props.prop.comment === undefined ? '' : this.props.prop.comment;

      this.setState({ taglist: list, desc: desc, dirty: false });
    } //if : dialog를 다시 여는 경우
  } //componentDidUpdate

  private DialogTitle = (pr: any) => {
    //withStyles(this.styles)((props) => {
    const { children, classes, onClose, ...other } = pr;
    return (
      <MuiDialogTitle
        style={{
          backgroundColor: 'var(--jp-layout-color1)',
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'space-between'
        }}
        disableTypography
        /* className={classes.root} */ {...other}
      >
        <Typography
          variant="h6"
          style={{ display: 'inline-block', color: 'var(--jp-ui-font-color1)' }}
        >
          <b>{this.props.prop?.name}</b> - Properties{/* {children} */}
        </Typography>
        {onClose ? (
          <IconButton
            style={{
              display: 'inline-block',
              width: '30px',
              height: '30px'
            }}
            aria-label="close"
            /* className={classes.closeButton} */
            onClick={onClose}
          >
            <CloseIcon
              style={{
                position: 'relative',
                top: '-7px',
                color: 'var(--jp-ui-font-color2)'
              }}
            />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  };

  private DialogContent = withStyles(theme => ({
    root: {
      //padding: theme.spacing(2),
      padding: '10px 20px',
      width: '560px',
      height: '550px',
      backgroundColor: 'var(--jp-layout-color1)'
    }
  }))(MuiDialogContent);

  private DialogActions = withStyles(theme => ({
    root: {
      margin: 0,
      padding: theme.spacing(1),
      backgroundColor: 'var(--jp-layout-color1)'
    }
  }))(MuiDialogActions);

  private DelButton = styled.button`
    border: none;
    width: 20px;
    background-color: transparent;
    cursor: pointer;
    &:active,
    &:hover {
      background-color: var(--jp-ui-control-color2);
    }
  `;

  tagBoxStyle = style({
    height: '160px',
    padding: '0 5px',
    overflow: 'auto',
    border: '1px solid var(--jp-border-color1)',
    backgroundColor: 'var(--jp-layout-color1)',
    color: 'var(--jp-ui-font-color0)'
  });

  //code preview
  private codePreview = () => {
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
  clbkUpdateTag = (idx: number, value: string): boolean => {
    //중복 검사
    if (
      this.state.taglist!.find(
        (t: string, index: number) => index !== idx && t === value
      ) !== undefined
    ) {
      return false;
    }

    const list = [...this.state.taglist];
    //마지막 줄에 입력 => 항목 추가
    if (idx === this.state.taglist!.length - 1) {
      list.splice(idx, 0, value);
    } else {
      list[idx] = value;
    }

    this.setState({ taglist: list, dirty: true });
    return true;
  }; //clbkUpdateTag

  //end edit tag
  clbkEndEditTag = (idx: number, tag: string): void => {};

  //return delete button
  buttonCell = (row: number) => {
    //new tag
    if (this.isNewTag(row)) {
      //hide button
      return '';
    }
    //delete tag button
    else {
      return (
        <button
          onClick={event => {
            const list = [...this.state.taglist];
            list.splice(row, 1);
            this.setState({ taglist: list, dirty: true });
          }}
          title="Delete Tag"
          className="align-vt-center"
          style={{ justifyContent: 'center', marginLeft: '7px' }}
        >
          <MdClear color="var(--jp-ui-font-color1)"></MdClear>
        </button>
      ); //return
    } //delete tag button
  }; //buttonCell

  //새 태그 입력란인지 확인
  private isNewTag(row: number): boolean {
    //편집 가능하고, 태그 개수가 제한값보다 작고, 마지막 줄일 경우
    return (
      this.props.editable &&
      row === this.state.taglist!.length - 1 &&
      this.state.taglist!.length < maxTagCount
    );
  }

  private closeDlg() {
    if (this.state.dirty) {
      if (!confirm('Close dialog without saving?')) {
        return;
      }
    }
    this.props.onClose(false);
  }

  render(): React.ReactElement {
    return (
      <Dialog
        onClose={() => this.closeDlg()}
        open={this.props.open}
        style={{ border: '1px solid var(--jp-border-color1)' }}
      >
        {/* title */}
        <this.DialogTitle
          id="customized-dialog-title"
          onClose={() => this.closeDlg()}
        ></this.DialogTitle>

        <this.DialogContent dividers>
          {/* code preview */}
          <Typography
            variant="subtitle2"
            style={{ color: 'var(--jp-ui-font-color1)' }}
          >
            &nbsp;Preview
          </Typography>

          <SyntaxHighlighter
            language="python"
            style={docco}
            customStyle={{
              backgroundColor: 'var(--jp-layout-color2)',
              fontFamily: 'var(--jp-code-font-family)',
              fontSize: '9px',
              color: 'var(--jp-content-font-color0)',
              margin: 0,
              height: '180px',
              borderCollapse: 'collapse'
            }}
          >
            {this.codePreview()}
          </SyntaxHighlighter>

          <br />
          {/* tag */}
          <Typography
            variant="subtitle2"
            style={{ color: 'var(--jp-ui-font-color1)' }}
          >
            &nbsp;Tag
          </Typography>
          <div
            className={this.tagBoxStyle}
            /* ref={c => {
          tblDivRef = c;
        }} */
          >
            <table
              className="ankus-code-tag-tbl"
              style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}
            >
              <tbody>
                {this.state
                  .taglist!.filter((t: string, i: number) => i < maxTagCount)
                  .map((row: string, ri: number) => {
                    return (
                      <tr key={ri}>
                        {/* no */}
                        <td>
                          <span>{ri + 1}</span>
                        </td>
                        <td>
                          <TagCell
                            //editing={editingTagIdx === row}
                            tag={row}
                            newTag={this.isNewTag(ri)}
                            onEndEdit={this.clbkEndEditTag}
                            onUpdateTag={this.clbkUpdateTag}
                            index={ri}
                            editable={this.props.editable!}
                          />
                        </td>
                        {this.props.editable! ? (
                          <td>{this.buttonCell(ri)}</td>
                        ) : (
                          ''
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <br />
          <Typography
            variant="subtitle2"
            style={{ color: 'var(--jp-ui-font-color1)' }}
          >
            &nbsp;Description
          </Typography>
          <textarea
            className="ankus-code-desc-txt"
            maxLength={300}
            placeholder="코드 설명 (최대 300자)"
            onChange={e => this.setState({ desc: e.target.value, dirty: true })}
            disabled={!this.props.editable!}
          >
            {this.state.desc}
          </textarea>
        </this.DialogContent>
        {this.props.editable! ? (
          <this.DialogActions>
            <Button
              autoFocus
              onClick={() => {
                const tlst = this.state.taglist as Array<string>;
                this.props.onClose(
                  true,
                  //마지막 항목은 새 태그 입력란이므로, 제외
                  tlst.slice(0, tlst.length - 1),
                  this.state.desc
                );
              }}
              disabled={!this.state.dirty}
              style={{
                color: this.state.dirty
                  ? 'var(--ankus-control-color)'
                  : 'var(--ankus-disable-color)'
              }}
            >
              Save changes
            </Button>
          </this.DialogActions>
        ) : (
          ''
        )}
      </Dialog>
    ); //return
  } //render
} //CodePropDlg

/* 
//table column type
type TableData = {
  no: number;
  cell: string;
  delete?: string;
};

export const CodeDescTab: React.FunctionComponent<ICodeDescProps> = (
  props: ICodeDescProps
): React.ReactElement => {
  const tbldat: TableData[] = [];
  //table data
  props.tags!.forEach((value, index) => {
    tbldat.push({ no: index + 1, cell: value, delete: '' });
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

  const updateTag = (idx: number, value: string): boolean => {
    //중복 검사
    if (
      props.tags!.find((t, index) => index !== idx && t === value) !== undefined
    ) {
      return false;
    }

    //마지막 줄에 입력
    if (idx === props.tags!.length) {
      props.onAddTag(value); //태그 추가
    } else {
      props.onChangeTag(value, idx);
    }
    return true;
  }; //updateTag

  const endEditTag = (): void => {
    //editTag(maxTagCount);
  };

  const tagCell = (cell: Cell<TableData>, row: number) => {
    return (
      <td className="td-tag" {...cell.getCellProps()}>
        // { <div
        //           onClick={event => {
        //           editTag(row);
        //     }} //click tag cell
        //     > }
        <TagCell
          //editing={editingTagIdx === row}
          tag={cell.value}
          newTag={row === props.tags!.length}
          onEndEdit={endEditTag}
          onUpdateTag={updateTag}
          index={row}
          editable={true}
        />
      </td>
    ); //return
  }; //tagCell

  const buttonCell = (cell: Cell<TableData>, row: number) => {
    //new tag
    if (row !== props.tags!.length) {
      {
          //          <button
          //   onClick={event => {
          //     editTag(row);
          //   }}
          // >
          //   <MdOutlineNewLabel></MdOutlineNewLabel>
          // </button>
 
      }
      return (
        <td {...cell.getCellProps()}>
          <button
            onClick={event => {
              props.onDeleteTag(props.tags![row]);
            }}
            title="Delete Tag"
          >
            <MdClear color="var(--jp-ui-font-color1)"></MdClear>
          </button>
        </td>
      ); //return
    } else {
      return <td {...cell.getCellProps()}></td>;
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
  const columns = React.useMemo<Column<TableData>[]>(
    () => [
      { Header: 'No', accessor: 'no' },
      {
        Header: 'Cell',
        accessor: 'cell'
      },
      {
        Header: 'Delete',
        accessor: 'delete'
      }
    ],
    []
  ); //table columns

  //table data
  const data = React.useMemo<TableData[]>(() => tbldat, [tbldat]);

  //table
  const { getTableProps, getTableBodyProps, rows, prepareRow } =
    useTable<TableData>({ columns, data });

    //    keywords = this.props.tags.map((tag, index) => {
    //   if (!tag.deleted) {
    //     return (
    //       <TagItem
    //         id={tag.id}
    //         name={tag.name}
    //         onClick={this.selectTag}
    //         onDelete={this.props.onDeleteTag}
    //         key={index}
    //       />
    //     );
    //   }
    // });
 
  return (
    <div className="ankus-desc-page">
      <p style={{ marginBottom: '8px' }}>
        <span className="sub-title">&nbsp;&nbsp;- Code Tag</span>
        &nbsp;&nbsp;
        <span style={{ fontSize: '11px', color: 'var(--jp-info-color1)' }}>
          (최대 30개 태그 추가 가능)
        </span>
      </p>

      <div
        className={tagBoxStyle}
        //  ref={c => {
        //   tblDivRef = c;
        // }} 
      >
        <table
          className="ankus-code-tag-tbl"
          style={{ width: '100%', borderCollapse: 'collapse' }}
          {...getTableProps()}
        >
          <tbody {...getTableBodyProps()}>
            {rows.map((row, ri) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell, ci) => {
                    //no
                    if (ci === 0) {
                      return (
                        <td {...cell.getCellProps()}>
                          <span>{cell.value}</span>
                        </td>
                      );
                    }
                    //cell
                    else if (ci === 1) {
                      return tagCell(cell, ri);
                    } else {
                      return buttonCell(cell, ri);
                    } //else : button cell
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

        //        <div className="tag-wrap">
        //   <button
        //     disabled={!this.tagAvailable(keywords.length + 1)}
        //     onClick={e => this.props.onAddTag}
        //   ></button>
        // </div>
        // <div
        //   className="tag-box"
        //   // style={{ border: 'solid 1px gray', height: '70px', overflow: 'auto' }}
        // >
        //   {keywords}
        // </div> 

      <div className="description-wrap">
        <p className="sub-title" style={{ marginBottom: '3px' }}>
          - Description
        </p>
        <textarea
          className="ankus-code-desc-txt"
          maxLength={300}
          placeholder="코드 설명 (최대 300자)"
          onChange={e => {
            props.onChangeComment(e.target.value);
          }}
        >
          {props.comment}
        </textarea>
      </div>
    </div>
  );
}; */

interface ITagCellProp {
  editable: boolean;
  tag: string;
  newTag: boolean;
  index: number;

  onEndEdit: (idx: number, value: string) => void;
  onUpdateTag: (idx: number, value: string) => boolean;
}

interface ITagCellState {
  //입력값
  input: string;
  tooltip: string;
  //편집 여부
  edit: boolean;
}

class TagCell extends React.Component<ITagCellProp, ITagCellState> {
  constructor(props: ITagCellProp) {
    super(props);

    this.state = { input: '', tooltip: '', edit: false };
  }

  componentDidUpdate(
    prevProps: Readonly<ITagCellProp>,
    prevState: Readonly<ITagCellState>,
    snapshot?: any
  ): void {
    if (prevProps.tag !== this.props.tag) {
      this.setState({ input: this.props.newTag ? '' : this.props.tag });
    }
  }

  //tag input control focus out
  onFocusOutTagInput = (e: React.FocusEvent<HTMLInputElement>) => {
    //공백, # 삭제
    const trimtag = e.target.value.replace(/[\s#]/g, '');
    if (trimtag.length) {
      //update tag
      this.props.onUpdateTag(this.props.index, trimtag);
    }

    //end edit
    this.endEditCell();
  };

  endEditCell = () => {
    this.props.onEndEdit(this.props.index, this.state.input);
    this.setState({ edit: false });
  };

  onKeyDownTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  render(): React.ReactNode {
    //편집 상태
    if (this.state.edit) {
      return (
        //<ClickAwayListener onClickAway={event => this.props.onEndEdit}>
        //<div>
        <Tooltip
          arrow
          title={this.state.tooltip}
          placement="bottom-start"
          PopperProps={{ disablePortal: true }}
          //onClose={event => {}}
          open={this.state.tooltip.length > 0}
          disableFocusListener
          disableHoverListener
          disableTouchListener
        >
          <input
            className="input-tag"
            // ref={c => {
            //   this._inputRef = c;
            // }}
            maxLength={30}
            type="text"
            onKeyDown={this.onKeyDownTagInput}
            placeholder="검색 태그 (최대 30자. 공백과 #은 입력 불가)"
            onChange={event => {
              this.setState({ input: event.target.value });
            }}
            onBlur={event => this.onFocusOutTagInput(event)}
            value={this.state.input}
            autoFocus
          ></input>
        </Tooltip>

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
        return (
          <span
            style={{
              color: 'var(--jp-ui-font-color2)'
            }}
            onClick={event => {
              this.setState({ edit: true });
            }}
          >
            {this.props.tag}
          </span>
        );
      }
      //태그
      else {
        return (
          <span
            onClick={event => {
              this.setState({
                edit: this.props.editable,
                input: this.props.tag
              });
            }} //click tag cell
          >
            {this.props.tag}
          </span>
        );
      }
    } //else : display tag
  } //render
} //TagCell
