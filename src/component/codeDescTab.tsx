import React from 'react';
import { Cell, Column, useTable } from 'react-table';
import { MdClear } from 'react-icons/md';
import Tooltip from '@material-ui/core/Tooltip';
import { style } from 'typestyle';

import { CodeTag } from '../doc/docModel';
import '../../style/codedesc.css';

export interface ICodeDescProps {
  tags: Array<CodeTag>;
  comment: string;

  onAddTag: (tag: string) => void;
  onDeleteTag: (tag: string) => void;
  onChangeTag: (tag: string, idx: number) => void;
  onChangeComment: (comment: string) => void;
}

//table column type
type TableData = {
  no: number;
  cell: string;
  delete?: string;
};

const maxTagCount = 30;

export const CodeDescTab: React.FunctionComponent<ICodeDescProps> = (
  props: ICodeDescProps
): React.ReactElement => {
  const tbldat: TableData[] = [];
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

  const updateTag = (idx: number, value: string): boolean => {
    //중복 검사
    if (
      props.tags.find((t, index) => index !== idx && t.name === value) !==
      undefined
    ) {
      return false;
    }

    //마지막 줄에 입력
    if (idx === props.tags.length) {
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
        {/* <div
                  onClick={event => {
                  editTag(row);
            }} //click tag cell
            > */}
        <TagCell
          //editing={editingTagIdx === row}
          tag={cell.value}
          newTag={row === props.tags.length}
          onEndEdit={endEditTag}
          onUpdateTag={updateTag}
          index={row}
        />
      </td>
    ); //return
  }; //tagCell

  const buttonCell = (cell: Cell<TableData>, row: number) => {
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
      return (
        <td {...cell.getCellProps()}>
          <button
            onClick={event => {
              props.onDeleteTag(props.tags[row].name);
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
        /* ref={c => {
          tblDivRef = c;
        }} */
      >
        <table
          className="tbl-tag"
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

      {/*         <div className="tag-wrap">
          <button
            disabled={!this.tagAvailable(keywords.length + 1)}
            onClick={e => this.props.onAddTag}
          ></button>
        </div>
        <div
          className="tag-box"
          // style={{ border: 'solid 1px gray', height: '70px', overflow: 'auto' }}
        >
          {keywords}
        </div> */}

      <div className="description-wrap">
        <p className="sub-title" style={{ marginBottom: '3px' }}>
          - Description
        </p>
        <textarea
          className="text-comment"
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
};

interface ITagCellProp {
  //editing: boolean;
  tag: string;
  newTag: boolean;
  index: number;

  onEndEdit: () => void;
  onUpdateTag: (idx: number, value: string) => boolean;
}

interface ITagCellState {
  input: string;
  tooltip: string;
  edit: boolean;
}

class TagCell extends React.Component<ITagCellProp, ITagCellState> {
  constructor(props: ITagCellProp) {
    super(props);

    this.state = { input: '', tooltip: '', edit: false };
  }

  onFocusOutTagInput = (e: React.FocusEvent<HTMLInputElement>) => {
    //공백, # 삭제
    const trimtag = e.target.value.replace(/[\s#]/g, '');
    if (trimtag.length) {
      this.props.onUpdateTag(this.props.index, trimtag);
    }

    this.endEditCell();
  }; //onFocusOutTagInput

  endEditCell = () => {
    this.props.onEndEdit();
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
              this.setState({ edit: true, input: this.props.tag });
            }} //click tag cell
          >
            {this.props.tag}
          </span>
        );
      }
    } //else : display tag
  } //render
} //TagCell
