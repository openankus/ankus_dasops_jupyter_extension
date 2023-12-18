import React from 'react';
import { style } from 'typestyle';
import ReactLoading from 'react-loading';
import {
  AiOutlineSearch,
  AiFillCaretDown,
  AiFillCaretUp
} from 'react-icons/ai';
import Grid from '@material-ui/core/Grid';

import { Ankus, StandardTermPart } from '../ankusCommon';
import { NotebookAction } from '../notebookAction';
import '../../style/standardterm.css';

/**
 * Generate the widget node
 */
interface ITermProps {
  word: StandardTermPart.Word;
  onSelectTerm: (word: StandardTermPart.Word) => void;
  keyword?: string;
  searchField?: string;
}

type termNamePiece = {
  text: string;
  key: boolean;
};

interface ITermState {
  eng: termNamePiece[];
  name: termNamePiece[];
}

///////////////////////// term item ///////////////////////
class TermElement extends React.Component<ITermProps, ITermState> {
  constructor(props: ITermProps) {
    super(props);

    //check keyword
    if (props.keyword !== undefined) {
      const key = props.keyword.toLowerCase();

      //search target
      const lower =
        props.searchField === StandardTermPart.Field.name
          ? props.word.name!.toLowerCase()
          : props.word.engName!.toLowerCase();
      const txt =
        props.searchField === StandardTermPart.Field.name
          ? props.word.name!
          : props.word.engName!;
      const ary: termNamePiece[] = [];

      for (let b = 0; b < txt.length; ) {
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

      if (props.searchField === StandardTermPart.Field.name) {
        this.state = {
          name: ary,
          eng: [{ text: props.word.engName!, key: false }]
        };
      } else {
        this.state = {
          name: [{ text: props.word.name!, key: false }],
          eng: ary
        };
      }
    } //if : check keyword
    else {
      this.state = {
        name: [{ text: props.word.name!, key: false }],
        eng: [{ text: props.word.engName!, key: false }]
      };
    }
  }

  //select term
  private _onClick = (event: any): void => {
    this.props.onSelectTerm(this.props.word);
  };

  render(): React.ReactElement {
    /*     let tagstr = '';
    if (this.props.codeobj.tag !== undefined) {
      tagstr = this.props.codeobj.tag?.reduce(
        (pval, cval) => pval + ' #' + cval.name,
        ''
      );
    } */
    return (
      <div className="ankus-std-term" onClick={this._onClick}>
        <p style={{ color: 'var(--ankus-control-color)' }}>
          {this.state.eng.map((elm, idx) => (
            <span key={idx} className={elm.key ? 'keyword' : ''}>
              {elm.text}
            </span>
          ))}
          <span>{' ('}</span>
          {this.state.name.map((elm, idx) => (
            <span key={idx} className={elm.key ? 'keyword' : ''}>
              {elm.text}
            </span>
          ))}
          <span>{')'}</span>
        </p>
        <p>{this.props.word.engDesc}</p>
        <p>{this.props.word.desc}</p>
      </div>
    );
  } //render
} //CodeElement

interface IListState {
  searchOption: string; //name/engName
  searchResult: string; //검색 결과 요약
  keyword: string; //검색어

  asc: boolean;
  orderOption: string; //name/engName

  editCat: boolean; //관리자만 카테고리 삭제 가능
  category: number; //선택 카테고리
  categories: Array<StandardTermPart.Category>; //카테고리 목록

  catDlg: boolean; //카테고리 설정 팝업 표시
  loading: boolean; //검색 진행중

  format: string;
}

export class StandardTerm extends React.Component<any, IListState> {
  constructor(props: any) {
    super(props);

    this.state = {
      searchOption: 'name',
      searchResult: '',
      keyword: '',

      asc: true,
      orderOption: 'engName',

      editCat: false,
      category: Ankus.stdtermCategory,
      categories: [{ id: 0, name: 'All' }],

      catDlg: false,
      loading: false,

      format: Ankus.stdtermFormat
    };

    this.loadCategories();

    //category list changed
    StandardTermPart.categoryLoadSignal().connect(
      async (_, cats: StandardTermPart.Category[]) => {
        console.log('category load signal - sidebar');

        const catlst = [...cats];
        catlst.unshift({ id: 0, name: 'All' });
        //new category  list
        this.setState({ categories: catlst });
      }
    );
    /* this._keywordRef = React.createRef<HTMLInputElement>(); */
  } //constructor

  private _termList: Array<StandardTermPart.Word> | undefined = undefined;
  /* private _keywordRef: React.RefObject<HTMLInputElement> | null = null; */

  private __searchResultStyle = style({
    fontSize: '11px',
    fontWeight: '500',
    color: 'var(--jp-ui-font-color2)',
    margin: '12px 0 0 5px',
    padding: 0
  });
  private smallTitleStyle = style({
    fontSize: '11px',
    verticalAlign: 'middle',
    lineHeight: '20px'
  });
  private fmtSelectStyle = style({
    fontSize: '11px',
    height: '20px',
    width: '100%',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: 'var(--jp-ui-font-color0)',
    border: '1px solid var(--jp-border-color2)'
  });
  private __searchInputStyle = style({
    height: '20px',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: 'transparent',
    color: 'var(--jp-ui-font-color0)',
    border: '1px solid var(--jp-border-color2)',
    fontSize: '11px'
  });

  private selectWord = (word: StandardTermPart.Word): void => {
    //insert into notebook
    NotebookAction.insertCompletionText(word.engName!, false);
  };

  private loadCategories = async () => {
    //initialize
    const cats: StandardTermPart.Category[] = [{ id: 0, name: 'All' }];
    let cat = 0;

    //category list
    const list = await StandardTermPart.loadCategories();
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

  private searchTerm = async (
    orderCol: string,
    asc: boolean
  ): Promise<void> => {
    this._termList = undefined;
    //show loading
    this.setState({ loading: true });

    try {
      //search term
      this._termList = await StandardTermPart.searchWords(
        this.state.searchOption,
        this.state.keyword,
        orderCol,
        asc,
        this.state.category
      );

      this.setState({
        searchResult:
          this._termList.length +
          ' results in "' +
          this.state.categories.find(c => c.id === this.state.category)?.name +
          '"'
      });
    } catch (e) {
      this._termList = undefined;
    }

    //hide loading
    this.setState({ loading: false });
  }; //searchTerm

  private changeCategory = (evt: any) => {
    Ankus.stdtermCategory = Number(evt.target.value);
    this.setState({
      category: Number(evt.target.value)
    });
    Ankus.ankusPlugin.saveState();
  };

  private changeFormat = (evt: any) => {
    Ankus.stdtermFormat = evt.target.value;
    this.setState({ format: evt.target.value });
    Ankus.ankusPlugin.saveState();
  };

  //change order by
  changeOrderOption = (orderCol: string) => {
    let asc: boolean = this.state.asc;

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

  render(): React.ReactElement {
    return (
      <div className="ankus-standard-wrap">
        <Grid container spacing={1} style={{ padding: '7px' }}>
          <Grid item xs={4}>
            <span className={this.smallTitleStyle}> - term format : </span>
          </Grid>
          <Grid item xs={8}>
            <select
              className={this.fmtSelectStyle}
              title="Select Term Format"
              onChange={this.changeFormat}
            >
              {Object.values(StandardTermPart.Format).map((fmt, index) => (
                <option
                  key={index}
                  value={fmt}
                  selected={this.state.format === fmt}
                >
                  {fmt}
                </option>
              ))}
            </select>
          </Grid>

          <Grid item xs={4}>
            <span className={this.smallTitleStyle}> - category : </span>
          </Grid>

          <Grid item xs={8}>
            <select
              onChange={this.changeCategory}
              className={this.fmtSelectStyle}
              value={this.state.category}
              title="Select Category"
              style={{ width: '100%' }}
            >
              {this.state.categories.map((cat, index) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </Grid>
        </Grid>

        {/* search part */}
        <div
          style={{
            //카테고리 없으면, 검색 불가
            display:
              this.state !== undefined && this.state.categories.length > 0
                ? 'block'
                : 'none',
            height: 'calc(100% - 60px)',
            width: '100%'
          }}
        >
          <div className={this.smallTitleStyle} style={{ paddingLeft: '7px' }}>
            - search term in '
            {
              this.state.categories.find(c => c.id === this.state.category)
                ?.name
            }
            '
          </div>
          <Grid container spacing={1} style={{ padding: '0 7px' }}>
            <Grid item xs={4}>
              <select
                onChange={e => this.setState({ searchOption: e.target.value })}
                className={this.fmtSelectStyle}
                style={{ width: '100%' }}
              >
                <option key={1} value="name">
                  Name
                </option>
                <option key={2} value="engName">
                  Abbreviation
                </option>
              </select>
            </Grid>

            {/* search keyword */}
            <Grid item xs={7}>
              <input
                /* ref={this._keywordRef} */
                className={this.__searchInputStyle}
                type="text"
                placeholder="Input Keyword"
                onKeyDown={e => {
                  //enter key
                  if (
                    e.key === 'Enter' &&
                    this.state.keyword.replace(' ', '').length > 0
                  ) {
                    this.searchTerm(this.state.orderOption, this.state.asc);
                  }
                  //space key
                  else if (e.key === ' ') {
                    e.preventDefault();
                  }
                }} //key down
                onChange={e => this.setState({ keyword: e.target.value })}
              ></input>
            </Grid>

            {/* search button */}
            <Grid
              item
              xs={1}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0'
              }}
            >
              <button
                className="btn-search"
                title="Search Dictionary"
                onClick={e =>
                  this.searchTerm(this.state.orderOption, this.state.asc)
                }
                disabled={
                  this.state.loading || this.state.keyword.trim().length < 1
                }
              >
                <AiOutlineSearch />
              </button>
            </Grid>
          </Grid>

          {this.state.loading ? (
            <div
              className="ankus-loading-container"
              style={{ height: 'calc(100% - 60px)' }}
            >
              <ReactLoading
                type="spin"
                color="#1E90FF"
                height={'50px'}
                width={'50px'}
              />
            </div>
          ) : (
            <div
              style={{
                display: this._termList !== undefined ? 'block' : 'none',
                height: 'calc(100% - 60px)'
              }}
            >
              {/* result message */}
              <div className={this.__searchResultStyle}>
                {this.state.searchResult}
              </div>

              <div className="ankus-std-order-title">
                <div
                  className="name-tab"
                  onClick={() =>
                    this.changeOrderOption(StandardTermPart.Field.name)
                  }
                >
                  <span>Name</span>
                  <div
                    // arrown up/down
                    className="ankus-std-btn-order"
                  >
                    {this.state.orderOption === StandardTermPart.Field.name ? (
                      this.state.asc ? (
                        <AiFillCaretUp />
                      ) : (
                        <AiFillCaretDown />
                      )
                    ) : (
                      ''
                    )}
                  </div>
                </div>

                <div
                  className="eng-tab"
                  onClick={() =>
                    this.changeOrderOption(StandardTermPart.Field.engName)
                  }
                >
                  <div className="ankus-std-btn-order">
                    {this.state.orderOption ===
                    StandardTermPart.Field.engName ? (
                      this.state.asc ? (
                        <AiFillCaretUp />
                      ) : (
                        <AiFillCaretDown />
                      )
                    ) : (
                      ''
                    )}
                  </div>
                  <p>Abbreviation</p>
                </div>
              </div>
              {/* 정렬 버튼 */}

              {/* term list */}
              <div className="ankus-std-term-list">
                {this._termList?.map((item, index) => (
                  <TermElement
                    key={index}
                    onSelectTerm={e => this.selectWord(item)}
                    word={item}
                    keyword={this.state.keyword}
                    searchField={this.state.searchOption}
                  />
                ))}
              </div>
              {/* 용어 목록 */}
            </div>
            /* 검색결과 */
          )}
        </div>
      </div>
    );
  }
} //CodelistWidget
