import React from 'react';
import ReactLoading from 'react-loading';
import { style } from 'typestyle';
import { AiOutlineLogout } from 'react-icons/ai';

import { Ankus } from '../ankusCommon';
import { codeContextMenu } from '../ankusCommands';
import { CodeObject, CodeProperty } from '../doc/docModel';
import '../../style/codelist.css';

let selectedCode: number | undefined = undefined;

interface ICodeProps {
  codeobj: CodeObject;
  onClick?: (event: any, codeobj: CodeObject) => void;
}

const CodeElement: React.FunctionComponent<ICodeProps> = (
  props: ICodeProps
) => {
  const onClick = (event: any): void => {
    if (props.onClick) {
      props.onClick(event, props.codeobj);
    }
  };

  const showMenu = (event: any): void => {
    //select code
    onClick(event);

    //context menu
    const menu = codeContextMenu(props.codeobj);
    menu.open(event.clientX, event.clientY);
  };

  const dblclickCode = () => {
    Ankus.ankusPlugin.openCodeEditor(props.codeobj.id);
  };

  return (
    <div>
      <div
        className={
          selectedCode === props.codeobj.id ? 'code-item sel-code' : 'code-item'
        }
        onClick={onClick}
        onDoubleClick={dblclickCode}
      >
        <div className="menu-flex">
          <p>{props.codeobj.name}</p>
          <button className="code-menu" onClick={showMenu}></button>
        </div>
        <p>{props.codeobj.comment}</p>
        <p>{props.codeobj.tag}</p>
        <p>
          <span>{props.codeobj.writer} | </span>
          {Ankus.dateToString(props.codeobj.date!)}
        </p>
      </div>
    </div>
  );
}; //CodeElement

interface ICodelistProp {
  logout: () => void;
}

interface IListState {
  searchOption: string;
  order: string; //asc, desc
  page: number;
  errMsg: string;
  orderOption: string;
  selCode?: CodeObject; //selected code
  loading: boolean;
}

type SearchOption = {
  name: string;
  label: string;
  guide: string;
};

export class CodelistWidget extends React.Component<ICodelistProp, IListState> {
  SEARCH_OPTION: Array<SearchOption> = [
    { name: CodeProperty.name, label: 'Name', guide: 'Search Name' },
    {
      name: CodeProperty.tag,
      label: 'Tag',
      guide: 'Search Tag(ex: tag1 tag2)'
    },
    {
      name: CodeProperty.comment,
      label: 'Comments',
      guide: 'Search Comments(ex: word1 word2)'
    },
    { name: CodeProperty.userNo, label: 'Writer', guide: 'Search Writer' }
  ];

  //export const CodelistWidget: React.FunctionComponent = () => {
  constructor(props: any) {
    super(props);

    Ankus.ankusPlugin.codeList = this;

    this.state = {
      searchOption: CodeProperty.name,
      order: 'asc',
      page: 0,
      errMsg: '',
      orderOption: CodeProperty.name,
      loading: false
    };

    this.searchCode(0, CodeProperty.name, true);
  } //constructor

  private _codeList: Array<any> = [];
  private _codeSize = 0;
  private _pageSize = 0;
  private _searchKeyword = '';
  private _searchResultDesc = '';

  private resultStyle = style({
    fontSize: '12px',
    color: 'var(--jp-ui-font-color2)',
    margin: '15px 0 0 5px'
  });

  private selectCode = (event: any, codeobj: CodeObject): void => {
    // const selcode = document.getElementsByClassName(SEL_CLS_NAME);
    // if (selcode.length > 0) {
    //   selcode.item(0)!.classList.remove(SEL_CLS_NAME);
    // }
    // event.target.classList.add(SEL_CLS_NAME);

    selectedCode = codeobj.id;
    //update selection
    this.setState({ selCode: codeobj });
  };

  getSearchKeywords(): Array<string> {
    if (
      this.state.searchOption === CodeProperty.tag ||
      this.state.searchOption === CodeProperty.comment
    ) {
      return this._searchKeyword.trim().split(' ');
    } else {
      return this._searchKeyword === '' ? [] : [this._searchKeyword];
    }
  }

  private prevPage = () => {
    this.searchCode(
      this.state.page - 1,
      this.state.orderOption,
      this.state.order === 'asc'
    );
  };

  private nextPage = () => {
    this.searchCode(
      this.state.page + 1,
      this.state.orderOption,
      this.state.order === 'asc'
    );
  };

  refresh() {
    this.searchCode(
      this.state.page,
      this.state.orderOption,
      this.state.order === 'asc'
    );
  }

  resultMessage(keyword: string): string {
    if (keyword) {
      return (
        'Search for "' +
        keyword +
        '" in ' +
        this.SEARCH_OPTION.find(
          option => option.name === this.state.searchOption
        )?.label +
        ' - Total ' +
        this._codeSize
      );
    } else {
      return 'Total ' + this._codeSize;
    }
  } //resultMessage

  private searchCode = (page: number, orderCol: string, asc: boolean) => {
    const words = this.getSearchKeywords();
    //list option
    const option = {
      token: Ankus.loginToken,
      searchColumn: this.state.searchOption,
      searchKeyword: words,
      orderColumn: orderCol,
      order: asc ? 'asc' : 'desc',
      page: page
    };

    this.setState({ loading: true });

    fetch(Ankus.ankusURL + '/share-code/codelist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(option)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('fail');
        }
      })
      .then(response => {
        this.setState({ loading: false });

        selectedCode = undefined;

        this._codeList = response.content;
        this._codeSize = response.totalElements;
        this._pageSize = response.pageable.pageSize;
        this._searchResultDesc = this.resultMessage(words.join(', '));

        this.setState({
          page: page,
          errMsg: '',
          orderOption: orderCol,
          order: asc ? 'asc' : 'desc'
        });
      })
      .catch(error => {
        //this.setState({ errMsg: '공유 코드 목록 조회 오류' });
        this.setState({ loading: false });

        this._codeList = [];
        this._codeSize = 0;
        this._pageSize = 0;
        this._searchResultDesc = this.resultMessage(words.join(', '));

        this.setState({
          page: 0,
          errMsg: '',
          orderOption: orderCol,
          order: asc ? 'asc' : 'desc'
        });
      }); //fetch
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
        this.setState({ searchOption: element.name });
        return false;
      }
    });
  };

  changeSearchKeyword = (e: any) => {
    //this.setState({ searchKeyword: e.target.value });
    this._searchKeyword = e.target.value;
  };

  //change order by
  changeOrderOption = (e: any) => {
    //제목 정렬 선택
    if (e.target.className === 'name-wrap') {
      //현재 제목 정렬 상태
      if (this.state.orderOption === CodeProperty.name) {
        //정렬 순서 변경
        this.searchCode(0, this.state.orderOption, this.state.order !== 'asc');
      }
      //제목 정렬로 변경
      else {
        this.searchCode(0, CodeProperty.name, this.state.order === 'asc');
      }
    }
    //select date order
    else {
      //current date order
      if (this.state.orderOption === CodeProperty.date) {
        //정렬 순서 변경
        this.searchCode(0, this.state.orderOption, this.state.order !== 'asc');
      }
      //change to date order
      else {
        this.searchCode(0, CodeProperty.date, this.state.order === 'asc');
      }
    }
  }; //changeOrderOption

  //change order
  changeOrder = (e: any) => {
    this.searchCode(0, this.state.orderOption, this.state.order !== 'asc');
  };

  newCode = (e: any) => {
    Ankus.ankusPlugin.openCodeEditor();
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
        {/* website */}
        <div
          className="ankus-ui-text"
          style={{ display: 'grid', marginRight: '10px' }}
        >
          <a
            href={Ankus.ankusURL}
            target="_blank"
            style={{ display: 'flex', justifySelf: 'end' }}
          >
            <button className="ankus-icon-btn go-icon"></button>
            Go to ankus website
          </a>
        </div>

        {/* new, logout */}
        <div className="upper-row">
          <span
            className="ankus-ui-text"
            onClick={this.newCode}
            title="New Code"
            style={{ display: 'flex' }}
          >
            <button className="ankus-icon-btn plus-icon"></button>Code
          </span>
          <button
            className="ankus-icon-btn"
            title="Logout"
            onClick={this.props.logout}
            style={{ width: '24px', height: '20px' }}
          >
            <AiOutlineLogout style={{ width: '16px', height: '16px' }} />
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
                  0,
                  this.state.orderOption,
                  this.state.order === 'asc'
                );
              }
            }}
          ></input>
          <button
            className="search-btn"
            onClick={e => {
              this.searchCode(
                0,
                this.state.orderOption,
                this.state.order === 'asc'
              );
            }}
            title="Filter code list"
          ></button>
        </div>

        {/* <div className="search-result"> Search Results - {this._codeSize}</div> */}
        <div className={this.resultStyle}> {this._searchResultDesc}</div>

        <div className="title">
          <div className="name-wrap" onClick={this.changeOrderOption}>
            <p>Name</p>
            <div
              // arrown up/down
              className={this.state.order === 'asc' ? 'name-up' : 'name-down'}
              style={{
                display:
                  //arrow show/hide
                  this.state.orderOption === CodeProperty.name
                    ? 'block'
                    : 'none'
              }}
            ></div>
          </div>
          <div className="date-wrap" onClick={this.changeOrderOption}>
            <div
              className={this.state.order === 'asc' ? 'date-up' : 'date-down'}
              style={{
                display:
                  this.state.orderOption === CodeProperty.date
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
          className="list-container"
          style={{
            display: this._codeList.length > 0 ? 'block' : 'none'
          }}
        >
          <div className="ankus-code-list">
            <React.Fragment>
              {this._codeList.map((item, index) => (
                <CodeElement
                  key={index}
                  onClick={this.selectCode}
                  codeobj={{
                    name: item[CodeProperty.name],
                    id: item[CodeProperty.id],
                    comment: item[CodeProperty.comment],
                    writer: item[CodeProperty.userName],
                    date: item[CodeProperty.date],
                    tag: item[CodeProperty.tag],
                    writerNo: item[CodeProperty.userNo]
                  }}
                />
              ))}
            </React.Fragment>
          </div>

          {/* page navigation */}
          <div className="page">
            <button
              onClick={this.prevPage}
              disabled={this.state.page === 0}
              title="Prev"
            ></button>
            {this.state.page + 1}/{Math.ceil(this._codeSize / this._pageSize)}
            <button
              onClick={this.nextPage}
              disabled={
                this.state.page + 1 ===
                Math.ceil(this._codeSize / this._pageSize)
              }
              title="Next"
            ></button>
          </div>

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
