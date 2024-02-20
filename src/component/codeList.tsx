import React from 'react';
import ReactLoading from 'react-loading';
import { style } from 'typestyle';
import styled from 'styled-components';

import {
  AiOutlineLogout,
  AiOutlineAlignLeft,
  AiOutlineBars
} from 'react-icons/ai';

import { Ankus, ShareCode } from '../ankusCommon';
import '../../style/codelist.css';
import { CodePropDlg, RenameDialog } from './codeDescTab';
import { NotebookPlugin } from '../notebookAction';

enum CodeView {
  simple,
  detail
}

interface ICodeProps {
  codeobj: ShareCode.CodeProperty;
  select: boolean;
  viewType: CodeView;
  onClick?: (event: any, codeobj: ShareCode.CodeProperty) => void;
}

const SimpleCodeItem = styled.div`
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
const SelSimpleCodeItem = styled.div`
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
const SimpleCodeName = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: calc(100% - 150px);
`;
const SimpleCodeDate = styled.span`
  width: 135px;
  text-align: right;
`;

const DetailCodeName = styled.p`
  font-size: 16px;
  font-weight: 600;
`;

const CodeElement: React.FunctionComponent<ICodeProps> = (
  props: ICodeProps
) => {
  const onClick = (event: any): void => {
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
    Ankus.cmdReg.execute('ankus:ntbk-open-code');
  };

  const tooltip = () => {
    return (
      '• Writer: ' +
      props.codeobj.writer +
      '\n• Description:\n' +
      (props.codeobj.comment ? props.codeobj.comment : '')
    );
  };

  return props.viewType === CodeView.detail ? (
    <li
      className="ankus-code-list-item"
      onClick={onClick}
      onDoubleClick={dblclickCode}
      onContextMenu={onClick}
    >
      <div className={props.select ? 'code-item sel-code' : 'code-item'}>
        <DetailCodeName>{props.codeobj.name}</DetailCodeName>
        <p>{props.codeobj.comment}</p>
        <p>{props.codeobj.tag}</p>
        <p>
          <span>{props.codeobj.writer} | </span>
          {Ankus.dateToString(props.codeobj.date!)}
        </p>
      </div>
    </li>
  ) : (
    <li
      className="ankus-code-list-item"
      onClick={onClick}
      onDoubleClick={dblclickCode}
      onContextMenu={onClick}
      title={tooltip()}
    >
      {props.select ? (
        <SelSimpleCodeItem>
          <SimpleCodeName>{props.codeobj.name}</SimpleCodeName>
          <SimpleCodeDate>
            {Ankus.dateToString(props.codeobj.date!)}
          </SimpleCodeDate>
        </SelSimpleCodeItem>
      ) : (
        <SimpleCodeItem>
          <SimpleCodeName>{props.codeobj.name}</SimpleCodeName>
          <SimpleCodeDate>
            {Ankus.dateToString(props.codeobj.date!)}
          </SimpleCodeDate>
        </SimpleCodeItem>
      )}
    </li>
  );
}; //CodeElement

interface ICodelistProp {
  logout: () => void;
}

type SearchOption = {
  name: string;
  label: string;
  guide: string;
};

export class CodelistWidget extends React.Component<ICodelistProp, any> {
  SEARCH_OPTION: Array<SearchOption> = [
    {
      name: ShareCode.CodePropertyName.name,
      label: 'Name',
      guide: 'Search Name'
    },
    {
      name: ShareCode.CodePropertyName.tag,
      label: 'Tag',
      guide: 'Search Tag(ex: tag1 tag2)'
    },
    {
      name: ShareCode.CodePropertyName.comment,
      label: 'Comments',
      guide: 'Search Comments(ex: word1 word2)'
    },
    {
      name: ShareCode.CodePropertyName.userNo,
      label: 'Writer',
      guide: 'Search Writer'
    }
  ];

  constructor(props: any) {
    super(props);

    Ankus.ankusPlugin.codeList = this;

    this.state = {
      searchOption: ShareCode.CodePropertyName.name,
      searchResult: '',
      orderDirection: 'asc',
      orderOption: ShareCode.CodePropertyName.name,
      codeSize: 0,
      loading: false,
      selection: undefined,
      viewType: CodeView.simple,
      pageNo: 0,
      pageSize: 0,
      openProp: false,
      openRename: false
    };

    this.searchCode(
      this.state.viewType === CodeView.detail ? 0 : -1,
      ShareCode.CodePropertyName.name,
      true
    );
  } //constructor

  private _errMsg = '';
  private _codeList: Array<ShareCode.CodeProperty> = [];
  private _searchKeyword = '';

  SearchResult = styled.span`
    font-size: 12px;
    color: var(--jp-ui-font-color2);
    margin: 15px 0 0 5px;
  `;

  ViewButton = styled.button`
    color: var(--jp-ui-font-color2);
    display: inline-block;
    width: 17px;
    height: 17px;
    padding: 2px;
  `;

  CodeList = styled.ul`
    margin: 0;
    padding: 0;
    overflow: auto;
    font-family: var(--jp-content-font-family);
    list-style: none;
    background-color: var(--jp-layout-color0);
  `;

  get selectedCode(): ShareCode.CodeProperty | undefined {
    return this.state.selection?.prop;
  }

  //open code property
  async openCodeProp() {
    try {
      //get code
      const response = await fetch(
        `${Ankus.ankusURL}/share-code/view?token=` +
          Ankus.loginToken +
          '&codeId=' +
          this.state.selection!.prop.id
      );

      //fail
      if (!response.ok) {
        throw new Error('fail');
      }

      const jsrp = await response.json();
      const codetail: ShareCode.CodeProperty = {
        ...this.state.selection!.prop
      };

      // codetail.id = this.state.selection?.id;
      // codetail.name = jsrp[ShareCode.CodePropertyName.name];
      // codetail.writer = jsrp[ShareCode.CodePropertyName.userName];
      // codetail.date = jsrp[ShareCode.CodePropertyName.date];
      // codetail.writerNo = jsrp[ShareCode.CodePropertyName.userNo];

      const content: NotebookPlugin.CellData[] =
        jsrp[ShareCode.CodePropertyName.content];

      //comment
      if (jsrp[ShareCode.CodePropertyName.comment] !== null) {
        codetail.comment = jsrp[ShareCode.CodePropertyName.comment];
      }

      //tag list
      if (jsrp[ShareCode.CodePropertyName.tag] !== null) {
        codetail.taglist = jsrp[ShareCode.CodePropertyName.tag].map(
          (value: any) => value.name
        );
      }

      this.setState({ selection: { prop: codetail, content: content } });
      this.setState({ openProp: true });
    } catch (error) {
      alert('공유 코드 정보 가져오기 오류');
    }
  } //openCodeProp

  //open rename dialog
  openRenameDlg() {
    this.setState({ openRename: true });
  }

  //on select code
  private clbkSelectCode = (
    event: any,
    codeobj: ShareCode.CodeProperty
  ): void => {
    //update selection
    this.setState({ selection: { prop: codeobj } });
  };

  //callback - close property dialog
  private clbkCloseProp = (
    save: boolean,
    taglist?: Array<string>,
    desc?: string
  ) => {
    //close
    this.setState({ openProp: false });

    if (save) {
      const code: any = {};
      code[ShareCode.CodePropertyName.comment] = desc;
      //tag list
      code[ShareCode.CodePropertyName.tag] = taglist;
      //code id
      code[ShareCode.CodePropertyName.id] = this.state.selection!.prop.id;

      //update code
      fetch(Ankus.ankusURL + '/share-code/modify/prop', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: Ankus.loginToken, //login token
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
  private clbkCloseRename = async (name: string | undefined) => {
    //close dialog
    this.setState({ openRename: false });

    if (
      name !== undefined &&
      name.length > 0 &&
      name !== this.state.selection!.prop.name
    ) {
      const code: any = {};
      //code name
      code[ShareCode.CodePropertyName.name] = name;
      //code id
      code[ShareCode.CodePropertyName.id] = this.state.selection!.prop.id;

      //update code
      fetch(Ankus.ankusURL + '/share-code/modify/name', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: Ankus.loginToken, //login token
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

  getSearchKeywords(): Array<string> {
    if (
      this.state.searchOption === ShareCode.CodePropertyName.tag ||
      this.state.searchOption === ShareCode.CodePropertyName.comment
    ) {
      return this._searchKeyword.trim().split(' ');
    } else {
      return this._searchKeyword === '' ? [] : [this._searchKeyword];
    }
  }

  private prevPage = () => {
    this.searchCode(
      this.state.pageNo - 1,
      this.state.orderOption,
      this.state.orderDirection === 'asc'
    );
  };

  private nextPage = () => {
    this.searchCode(
      this.state.pageNo + 1,
      this.state.orderOption,
      this.state.orderDirection === 'asc'
    );
  };

  //refresh list
  refresh() {
    this.searchCode(
      this.state.pageNo,
      this.state.orderOption,
      this.state.orderDirection === 'asc'
    );
  }

  resultMessage(keyword: string, count: number): string {
    if (keyword) {
      return (
        'Search for "' +
        keyword +
        '" in ' +
        this.SEARCH_OPTION.find(
          option => option.name === this.state.searchOption
        )?.label +
        ' - Total ' +
        count
      );
    } else {
      return 'Total ' + count;
    }
  } //resultMessage

  //code list
  private searchCode = async (page: number, orderCol: string, asc: boolean) => {
    //search keyword list
    const words = this.getSearchKeywords();
    //search option
    const searchOption = this.state.searchOption;

    //show wait image
    this.setState({ loading: true });

    const out = await ShareCode.codelist(
      words,
      searchOption,
      orderCol,
      asc,
      page
    );

    this.setState({
      //hide wait image
      loading: false,
      //init code selection
      selection: undefined,
      //code list order
      orderDirection: asc ? 'asc' : 'desc',
      orderOption: orderCol
    });

    if (out !== null) {
      this._codeList = out.list;

      this.setState({
        codeSize: out.totalSize,
        searchOption: searchOption,
        searchResult: this.resultMessage(words.join(', '), out.totalSize),
        pageSize: out.pageSize,
        pageNo: page
      });
    } else {
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

  changeSearchOption = (e: any) => {
    this.SEARCH_OPTION.forEach(element => {
      if (element.name === e.target.value) {
        const res = this.state.searchResult;
        this.setState({ searchOption: element.name, searchResult: res });
        return false;
      }
    });
  };

  changeSearchKeyword = (e: any) => {
    //this.setState({ searchKeyword: e.target.value });
    console.log(e.target.value);
    this._searchKeyword = e.target.value;
  };

  //change order by
  changeOrderOption = (e: any) => {
    //제목 정렬 선택
    if (e.target.className === 'name-wrap') {
      //현재 제목 정렬 상태
      if (this.state.orderOption === ShareCode.CodePropertyName.name) {
        //정렬 순서 변경
        this.searchCode(
          this.state.viewType === CodeView.detail ? 0 : -1,
          this.state.orderOption,
          this.state.orderDirection !== 'asc'
        );
      }
      //제목 정렬로 변경
      else {
        this.searchCode(
          this.state.viewType === CodeView.detail ? 0 : -1,
          ShareCode.CodePropertyName.name,
          this.state.orderDirection === 'asc'
        );
      }
    }
    //select date order
    else {
      //current date order
      if (this.state.orderOption === ShareCode.CodePropertyName.date) {
        //정렬 순서 변경
        this.searchCode(
          this.state.viewType === CodeView.detail ? 0 : -1,
          this.state.orderOption,
          this.state.orderDirection !== 'asc'
        );
      }
      //change to date order
      else {
        this.searchCode(
          this.state.viewType === CodeView.detail ? 0 : -1,
          ShareCode.CodePropertyName.date,
          this.state.orderDirection === 'asc'
        );
      }
    }
  }; //changeOrderOption

  //change order
  changeOrder = (e: any) => {
    this.searchCode(
      this.state.viewType === CodeView.detail ? 0 : -1,
      this.state.orderOption,
      this.state.orderDirection !== 'asc'
    );
  };

  //change view mode
  changeCodeView = (viewType: CodeView) => {
    this.setState({ viewType: viewType });

    this.searchCode(
      viewType === CodeView.detail ? 0 : -1,
      this.state.orderOption,
      this.state.orderDirection === 'asc'
    );
  };

  private __selectStyle = style({
    width: '85px',
    height: '24px',
    border: '1px solid var(--jp-toolbar-border-color)',
    backgroundColor: 'transparent',
    display: 'flex',
    boxSizing: 'border-box',
    color: 'var(--jp-ui-font-color1)',
    cursor: 'pointer'
  });

  private __searchInputStyle = style({
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

  render(): React.ReactElement {
    return (
      <div className="ankus-code-list-wrap">
        {/* website, logout */}
        <div
          style={{
            margin: '0 5px 10px 10px',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          {/* website */}
          <div className="ankus-ui-text">
            <a
              href={Ankus.ankusURL}
              target="_blank"
              style={{ display: 'flex', justifySelf: 'end' }}
            >
              <button className="ankus-icon-btn go-icon"></button>
              Go to ankus website
            </a>
          </div>

          {/* logout */}
          <button
            className="ankus-icon-btn"
            title="Logout"
            onClick={this.props.logout}
            style={{ width: '24px', height: '20px' }}
          >
            <AiOutlineLogout
              style={{
                width: '16px',
                height: '16px',
                color: 'var(--jp-ui-font-color2)'
              }}
            />
          </button>
        </div>

        <div className="search-wrap">
          <select
            onChange={this.changeSearchOption}
            className={this.__selectStyle}
          >
            {this.SEARCH_OPTION.map((option, index) => (
              <option key={index} value={option.name}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            className={this.__searchInputStyle}
            type="text"
            placeholder={
              this.SEARCH_OPTION.find(
                option => option.name === this.state.searchOption
              )?.guide
            }
            onChange={this.changeSearchKeyword}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                this.searchCode(
                  this.state.viewType === CodeView.detail ? 0 : -1,
                  this.state.orderOption,
                  this.state.orderDirection === 'asc'
                );
              }
            }}
          ></input>
          <button
            className="search-btn"
            onClick={() =>
              this.searchCode(
                this.state.viewType === CodeView.detail ? 0 : -1,
                this.state.orderOption,
                this.state.orderDirection === 'asc'
              )
            }
            title="Filter code list"
          ></button>
        </div>

        {/* search result, view type */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* search result */}
          <this.SearchResult>{this.state.searchResult}</this.SearchResult>

          {/* view type */}
          <div style={{ padding: '10px 5px 0 0' }}>
            {/* detail view */}
            <this.ViewButton
              className="ankus-icon-btn"
              title="Detail"
              onClick={() => this.changeCodeView(CodeView.detail)}
            >
              <AiOutlineAlignLeft
                style={{
                  color:
                    this.state.viewType === CodeView.detail
                      ? 'var(--jp-ui-font-color0)'
                      : 'var(--jp-ui-font-color2)'
                }}
              />
            </this.ViewButton>

            {/* simple view */}
            <this.ViewButton
              className="ankus-icon-btn"
              title="List"
              onClick={() => this.changeCodeView(CodeView.simple)}
            >
              <AiOutlineBars
                style={{
                  color:
                    this.state.viewType === CodeView.simple
                      ? 'var(--jp-ui-font-color0)'
                      : 'var(--jp-ui-font-color2)'
                }}
              />
            </this.ViewButton>
          </div>
        </div>

        {/* name/date order */}
        <div className="title">
          <div className="name-wrap" onClick={this.changeOrderOption}>
            <p>Name</p>
            <div
              // arrown up/down
              className={
                this.state.orderDirection === 'asc' ? 'name-up' : 'name-down'
              }
              style={{
                display:
                  //arrow show/hide
                  this.state.orderOption === ShareCode.CodePropertyName.name
                    ? 'block'
                    : 'none'
              }}
            ></div>
          </div>
          <div className="date-wrap" onClick={this.changeOrderOption}>
            <div
              className={
                this.state.orderDirection === 'asc' ? 'date-up' : 'date-down'
              }
              style={{
                display:
                  this.state.orderOption === ShareCode.CodePropertyName.date
                    ? 'block'
                    : 'none'
              }}
            ></div>
            <p>Date Updated</p>
          </div>
        </div>

        <div
          style={{
            display: this.state.errMsg === '' ? 'block' : 'none'
          }}
        >
          {this.state.errMsg}
        </div>
        <div
          style={{
            height: 'calc(100% - 110px)',
            display: this._codeList.length > 0 ? 'block' : 'none'
          }}
        >
          <this.CodeList
            style={{
              maxHeight:
                this.state.viewType === CodeView.detail
                  ? 'calc(100% - 40px)'
                  : '100%'
            }}
          >
            {/* code list */}
            {this._codeList.map((item, index) => (
              <CodeElement
                viewType={this.state.viewType}
                key={index}
                onClick={this.clbkSelectCode}
                codeobj={{
                  name: item.name,
                  id: item.id,
                  comment: item.comment,
                  writer: item.writer,
                  date: item.date,
                  tag: item.tag,
                  writerNo: item.writerNo
                }}
                select={this.state.selection?.prop.id === item.id}
              />
            ))}
          </this.CodeList>

          {/* rename dialog */}
          <RenameDialog
            name={
              this.state.selection?.prop.name === undefined
                ? ''
                : this.state.selection!.prop.name
            }
            open={this.state.openRename}
            onClose={this.clbkCloseRename}
          />

          {/* code property dialog */}
          <CodePropDlg
            open={this.state.openProp}
            //코드 작성자와 현재 사용자가 동일하면, 수정 가능
            editable={this.state.selection?.prop.writerNo === Ankus.userNumber}
            prop={this.state.selection?.prop}
            content={
              this.state.selection?.content === undefined
                ? []
                : this.state.selection!.content
            }
            onClose={(save, taglist, desc) =>
              this.clbkCloseProp(save, taglist, desc)
            }
          />

          {/* page navigation */}
          {this.state.viewType === CodeView.detail ? (
            <div className="page">
              <button
                onClick={this.prevPage}
                disabled={this.state.pageNo === 0}
                title="Prev"
              ></button>
              {this.state.pageNo + 1}/{this.state.pageSize}
              {/* {Math.ceil(this.state.codeSize / this.state.pageSize)} */}
              <button
                onClick={this.nextPage}
                disabled={this.state.pageNo + 1 === this.state.pageSize}
                title="Next"
              ></button>
            </div>
          ) : (
            ''
          )}

          <div
            style={{
              display: this.state.loading ? 'block' : 'none',
              textAlign: 'center'
            }}
          >
            <ReactLoading
              type="spin"
              color="#1E90FF"
              height={'50px'}
              width={'50px'}
            />
          </div>
        </div>
      </div>
    );
  }
} //CodelistWidget
