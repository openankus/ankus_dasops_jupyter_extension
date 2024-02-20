import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { style } from 'typestyle';
import ReactLoading from 'react-loading';
import { AiOutlineSearch, AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';
import Grid from '@material-ui/core/Grid';
import { Ankus, StandardTermPart } from '../ankusCommon';
import { NotebookPlugin } from '../notebookAction';
import '../../style/standardterm.css';
///////////////////////// term item ///////////////////////
class TermElement extends React.Component {
    constructor(props) {
        super(props);
        //select term
        this._onClick = (event) => {
            this.props.onSelectTerm(this.props.word);
        };
        //check keyword
        if (props.keyword !== undefined) {
            const key = props.keyword.toLowerCase();
            //search target
            const lower = props.searchField === StandardTermPart.Field.name
                ? props.word.name.toLowerCase()
                : props.word.engName.toLowerCase();
            const txt = props.searchField === StandardTermPart.Field.name
                ? props.word.name
                : props.word.engName;
            const ary = [];
            for (let b = 0; b < txt.length;) {
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
                    eng: [{ text: props.word.engName, key: false }]
                };
            }
            else {
                this.state = {
                    name: [{ text: props.word.name, key: false }],
                    eng: ary
                };
            }
        } //if : check keyword
        else {
            this.state = {
                name: [{ text: props.word.name, key: false }],
                eng: [{ text: props.word.engName, key: false }]
            };
        }
    }
    render() {
        /*     let tagstr = '';
        if (this.props.codeobj.tag !== undefined) {
          tagstr = this.props.codeobj.tag?.reduce(
            (pval, cval) => pval + ' #' + cval.name,
            ''
          );
        } */
        return (_jsxs("div", { className: "ankus-std-term", onClick: this._onClick, children: [_jsxs("p", { style: { color: 'var(--ankus-control-color)' }, children: [this.state.eng.map((elm, idx) => (_jsx("span", { className: elm.key ? 'keyword' : '', children: elm.text }, idx))), _jsx("span", { children: ' (' }), this.state.name.map((elm, idx) => (_jsx("span", { className: elm.key ? 'keyword' : '', children: elm.text }, idx))), _jsx("span", { children: ')' })] }), _jsx("p", { children: this.props.word.engDesc }), _jsx("p", { children: this.props.word.desc })] }));
    } //render
} //CodeElement
export class StandardTerm extends React.Component {
    constructor(props) {
        super(props);
        this._termList = undefined;
        /* private _keywordRef: React.RefObject<HTMLInputElement> | null = null; */
        this.__searchResultStyle = style({
            fontSize: '11px',
            fontWeight: '500',
            color: 'var(--jp-ui-font-color2)',
            margin: '12px 0 0 5px',
            padding: 0
        });
        this.smallTitleStyle = style({
            fontSize: '11px',
            verticalAlign: 'middle',
            lineHeight: '20px'
        });
        this.fmtSelectStyle = style({
            fontSize: '11px',
            height: '20px',
            width: '100%',
            cursor: 'pointer',
            backgroundColor: 'transparent',
            color: 'var(--jp-ui-font-color0)',
            border: '1px solid var(--jp-border-color2)'
        });
        this.__searchInputStyle = style({
            height: '20px',
            width: '100%',
            boxSizing: 'border-box',
            backgroundColor: 'transparent',
            color: 'var(--jp-ui-font-color0)',
            border: '1px solid var(--jp-border-color2)',
            fontSize: '11px'
        });
        this.selectWord = (word) => {
            //insert into notebook
            NotebookPlugin.insertCompletionText(word.engName, false);
        };
        this.loadCategories = async () => {
            //initialize
            const cats = [{ id: 0, name: 'All' }];
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
        this.searchTerm = async (orderCol, asc) => {
            var _a;
            this._termList = undefined;
            //show loading
            this.setState({ loading: true });
            //search term
            const lst = await StandardTermPart.searchWords(this.state.searchOption, this.state.keyword, orderCol, asc, this.state.category);
            if (lst !== null) {
                this._termList = lst;
                this.setState({
                    searchResult: this._termList.length +
                        ' results in "' +
                        ((_a = this.state.categories.find(c => c.id === this.state.category)) === null || _a === void 0 ? void 0 : _a.name) +
                        '"'
                });
            }
            //hide loading
            this.setState({ loading: false });
        }; //searchTerm
        this.changeCategory = (evt) => {
            Ankus.stdtermCategory = Number(evt.target.value);
            this.setState({
                category: Number(evt.target.value)
            });
            Ankus.ankusPlugin.saveState();
        };
        this.changeFormat = (evt) => {
            Ankus.stdtermFormat = evt.target.value;
            this.setState({ format: evt.target.value });
            Ankus.ankusPlugin.saveState();
        };
        //change order by
        this.changeOrderOption = (orderCol) => {
            let asc = this.state.asc;
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
        StandardTermPart.categoryLoadSignal().connect(async (_, cats) => {
            console.log('category load signal - sidebar');
            const catlst = [...cats];
            catlst.unshift({ id: 0, name: 'All' });
            //new category  list
            this.setState({ categories: catlst });
        });
        /* this._keywordRef = React.createRef<HTMLInputElement>(); */
    } //constructor
    render() {
        var _a, _b;
        return (_jsxs("div", { className: "ankus-standard-wrap", children: [_jsxs(Grid, { container: true, spacing: 1, style: { padding: '7px' }, children: [_jsx(Grid, { item: true, xs: 4, children: _jsx("span", { className: this.smallTitleStyle, children: " - term format : " }) }), _jsx(Grid, { item: true, xs: 8, children: _jsx("select", { className: this.fmtSelectStyle, title: "Select Term Format", onChange: this.changeFormat, children: Object.values(StandardTermPart.Format).map((fmt, index) => (_jsx("option", { value: fmt, selected: this.state.format === fmt, children: fmt }, index))) }) }), _jsx(Grid, { item: true, xs: 4, children: _jsx("span", { className: this.smallTitleStyle, children: " - category : " }) }), _jsx(Grid, { item: true, xs: 8, children: _jsx("select", { onChange: this.changeCategory, className: this.fmtSelectStyle, value: this.state.category, title: "Select Category", style: { width: '100%' }, children: this.state.categories.map((cat, index) => (_jsx("option", { value: cat.id, children: cat.name }, cat.id))) }) })] }), _jsxs("div", { style: {
                        //카테고리 없으면, 검색 불가
                        display: this.state !== undefined && this.state.categories.length > 0
                            ? 'block'
                            : 'none',
                        height: 'calc(100% - 60px)',
                        width: '100%'
                    }, children: [_jsxs("div", { className: this.smallTitleStyle, style: { paddingLeft: '7px' }, children: ["- search term in '", (_a = this.state.categories.find(c => c.id === this.state.category)) === null || _a === void 0 ? void 0 : _a.name, "'"] }), _jsxs(Grid, { container: true, spacing: 1, style: { padding: '0 7px' }, children: [_jsx(Grid, { item: true, xs: 4, children: _jsxs("select", { onChange: e => this.setState({ searchOption: e.target.value }), className: this.fmtSelectStyle, style: { width: '100%' }, children: [_jsx("option", { value: "name", children: "Name" }, 1), _jsx("option", { value: "engName", children: "Abbreviation" }, 2)] }) }), _jsx(Grid, { item: true, xs: 7, children: _jsx("input", { 
                                        /* ref={this._keywordRef} */
                                        className: this.__searchInputStyle, type: "text", placeholder: "Input Keyword", onKeyDown: e => {
                                            //enter key
                                            if (e.key === 'Enter' &&
                                                this.state.keyword.replace(' ', '').length > 0) {
                                                this.searchTerm(this.state.orderOption, this.state.asc);
                                            }
                                            //space key
                                            else if (e.key === ' ') {
                                                e.preventDefault();
                                            }
                                        }, onChange: e => this.setState({ keyword: e.target.value }) }) }), _jsx(Grid, { item: true, xs: 1, style: {
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: '0'
                                    }, children: _jsx("button", { className: "btn-search", title: "Search Dictionary", onClick: e => this.searchTerm(this.state.orderOption, this.state.asc), disabled: this.state.loading || this.state.keyword.trim().length < 1, children: _jsx(AiOutlineSearch, {}) }) })] }), this.state.loading ? (_jsx("div", { className: "ankus-loading-container", style: { height: 'calc(100% - 60px)' }, children: _jsx(ReactLoading, { type: "spin", color: "#1E90FF", height: '50px', width: '50px' }) })) : (_jsxs("div", { style: {
                                display: this._termList !== undefined ? 'block' : 'none',
                                height: 'calc(100% - 60px)'
                            }, children: [_jsx("div", { className: this.__searchResultStyle, children: this.state.searchResult }), _jsxs("div", { className: "ankus-std-order-title", children: [_jsxs("div", { className: "name-tab", onClick: () => this.changeOrderOption(StandardTermPart.Field.name), children: [_jsx("span", { children: "Name" }), _jsx("div", { 
                                                    // arrown up/down
                                                    className: "ankus-std-btn-order", children: this.state.orderOption === StandardTermPart.Field.name ? (this.state.asc ? (_jsx(AiFillCaretUp, {})) : (_jsx(AiFillCaretDown, {}))) : ('') })] }), _jsxs("div", { className: "eng-tab", onClick: () => this.changeOrderOption(StandardTermPart.Field.engName), children: [_jsx("div", { className: "ankus-std-btn-order", children: this.state.orderOption ===
                                                        StandardTermPart.Field.engName ? (this.state.asc ? (_jsx(AiFillCaretUp, {})) : (_jsx(AiFillCaretDown, {}))) : ('') }), _jsx("p", { children: "Abbreviation" })] })] }), _jsx("div", { className: "ankus-std-term-list", children: (_b = this._termList) === null || _b === void 0 ? void 0 : _b.map((item, index) => (_jsx(TermElement, { onSelectTerm: e => this.selectWord(item), word: item, keyword: this.state.keyword, searchField: this.state.searchOption }, index))) })] })
                        /* 검색결과 */
                        )] })] }));
    }
} //CodelistWidget
//# sourceMappingURL=standardTerm.js.map