import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import ReactLoading from 'react-loading';
import { style } from 'typestyle';
import { AiOutlineLogout } from 'react-icons/ai';
import { Ankus } from '../ankusCommon';
import { codeContextMenu } from '../ankusCommands';
import { CodeProperty } from '../doc/docModel';
import '../../style/codelist.css';
let selectedCode = undefined;
const CodeElement = (props) => {
    const onClick = (event) => {
        if (props.onClick) {
            props.onClick(event, props.codeobj);
        }
    };
    const showMenu = (event) => {
        //select code
        onClick(event);
        //context menu
        const menu = codeContextMenu(props.codeobj);
        menu.open(event.clientX, event.clientY);
    };
    const dblclickCode = () => {
        Ankus.ankusPlugin.openCodeEditor(props.codeobj.id);
    };
    return (_jsx("div", { children: _jsxs("div", { className: selectedCode === props.codeobj.id ? 'code-item sel-code' : 'code-item', onClick: onClick, onDoubleClick: dblclickCode, children: [_jsxs("div", { className: "menu-flex", children: [_jsx("p", { children: props.codeobj.name }), _jsx("button", { className: "code-menu", onClick: showMenu })] }), _jsx("p", { children: props.codeobj.comment }), _jsx("p", { children: props.codeobj.tag }), _jsxs("p", { children: [_jsxs("span", { children: [props.codeobj.writer, " | "] }), Ankus.dateToString(props.codeobj.date)] })] }) }));
}; //CodeElement
export class CodelistWidget extends React.Component {
    //export const CodelistWidget: React.FunctionComponent = () => {
    constructor(props) {
        super(props);
        this.SEARCH_OPTION = [
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
        this._codeList = [];
        this._codeSize = 0;
        this._pageSize = 0;
        this._searchKeyword = '';
        this._searchResultDesc = '';
        this.resultStyle = style({
            fontSize: '12px',
            color: 'var(--jp-ui-font-color2)',
            margin: '15px 0 0 5px'
        });
        this.selectCode = (event, codeobj) => {
            // const selcode = document.getElementsByClassName(SEL_CLS_NAME);
            // if (selcode.length > 0) {
            //   selcode.item(0)!.classList.remove(SEL_CLS_NAME);
            // }
            // event.target.classList.add(SEL_CLS_NAME);
            selectedCode = codeobj.id;
            //update selection
            this.setState({ selCode: codeobj });
        };
        this.prevPage = () => {
            this.searchCode(this.state.page - 1, this.state.orderOption, this.state.order === 'asc');
        };
        this.nextPage = () => {
            this.searchCode(this.state.page + 1, this.state.orderOption, this.state.order === 'asc');
        };
        this.searchCode = (page, orderCol, asc) => {
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
                }
                else {
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
        this.changeSearchOption = (e) => {
            this.SEARCH_OPTION.forEach(element => {
                if (element.name === e.target.value) {
                    this.setState({ searchOption: element.name });
                    return false;
                }
            });
        };
        this.changeSearchKeyword = (e) => {
            //this.setState({ searchKeyword: e.target.value });
            this._searchKeyword = e.target.value;
        };
        //change order by
        this.changeOrderOption = (e) => {
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
        this.changeOrder = (e) => {
            this.searchCode(0, this.state.orderOption, this.state.order !== 'asc');
        };
        this.newCode = (e) => {
            Ankus.ankusPlugin.openCodeEditor();
        };
        this.__selectStyle = style({
            width: '85px',
            height: '24px',
            border: '1px solid var(--jp-toolbar-border-color)',
            backgroundColor: 'transparent',
            display: 'flex',
            boxSizing: 'border-box',
            color: 'var(--jp-ui-font-color1)',
            cursor: 'pointer'
        });
        this.__searchInputStyle = style({
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
    getSearchKeywords() {
        if (this.state.searchOption === CodeProperty.tag ||
            this.state.searchOption === CodeProperty.comment) {
            return this._searchKeyword.trim().split(' ');
        }
        else {
            return this._searchKeyword === '' ? [] : [this._searchKeyword];
        }
    }
    refresh() {
        this.searchCode(this.state.page, this.state.orderOption, this.state.order === 'asc');
    }
    resultMessage(keyword) {
        var _a;
        if (keyword) {
            return ('Search for "' +
                keyword +
                '" in ' +
                ((_a = this.SEARCH_OPTION.find(option => option.name === this.state.searchOption)) === null || _a === void 0 ? void 0 : _a.label) +
                ' - Total ' +
                this._codeSize);
        }
        else {
            return 'Total ' + this._codeSize;
        }
    } //resultMessage
    render() {
        var _a;
        return (_jsxs("div", { className: "ankus-code-list-wrap", children: [_jsx("div", { className: "ankus-ui-text", style: { display: 'grid', marginRight: '10px' }, children: _jsxs("a", { href: Ankus.ankusURL, target: "_blank", style: { display: 'flex', justifySelf: 'end' }, children: [_jsx("button", { className: "ankus-icon-btn go-icon" }), "Go to ankus website"] }) }), _jsxs("div", { className: "upper-row", children: [_jsxs("span", { className: "ankus-ui-text", onClick: this.newCode, title: "New Code", style: { display: 'flex' }, children: [_jsx("button", { className: "ankus-icon-btn plus-icon" }), "Code"] }), _jsx("button", { className: "ankus-icon-btn", title: "Logout", onClick: this.props.logout, style: { width: '24px', height: '20px' }, children: _jsx(AiOutlineLogout, { style: { width: '16px', height: '16px' } }) })] }), _jsxs("div", { className: "search-wrap", children: [_jsx("select", { onChange: this.changeSearchOption, className: this.__selectStyle, children: this.SEARCH_OPTION.map((option, index) => (_jsx("option", { value: option.name, children: option.label }, index))) }), _jsx("input", { className: this.__searchInputStyle, type: "text", placeholder: (_a = this.SEARCH_OPTION.find(option => option.name === this.state.searchOption)) === null || _a === void 0 ? void 0 : _a.guide, onChange: this.changeSearchKeyword, onKeyDown: e => {
                                if (e.key === 'Enter') {
                                    this.searchCode(0, this.state.orderOption, this.state.order === 'asc');
                                }
                            } }), _jsx("button", { className: "search-btn", onClick: e => {
                                this.searchCode(0, this.state.orderOption, this.state.order === 'asc');
                            }, title: "Filter code list" })] }), _jsxs("div", { className: this.resultStyle, children: [" ", this._searchResultDesc] }), _jsxs("div", { className: "title", children: [_jsxs("div", { className: "name-wrap", onClick: this.changeOrderOption, children: [_jsx("p", { children: "Name" }), _jsx("div", { 
                                    // arrown up/down
                                    className: this.state.order === 'asc' ? 'name-up' : 'name-down', style: {
                                        display: 
                                        //arrow show/hide
                                        this.state.orderOption === CodeProperty.name
                                            ? 'block'
                                            : 'none'
                                    } })] }), _jsxs("div", { className: "date-wrap", onClick: this.changeOrderOption, children: [_jsx("div", { className: this.state.order === 'asc' ? 'date-up' : 'date-down', style: {
                                        display: this.state.orderOption === CodeProperty.date
                                            ? 'block'
                                            : 'none'
                                    } }), _jsx("p", { children: "Date Updated" })] })] }), _jsx("div", { style: {
                        display: this.state.errMsg === '' ? 'block' : 'none'
                    }, children: this.state.errMsg }), _jsxs("div", { className: "list-container", style: {
                        display: this._codeList.length > 0 ? 'block' : 'none'
                    }, children: [_jsx("div", { className: "ankus-code-list", children: _jsx(React.Fragment, { children: this._codeList.map((item, index) => (_jsx(CodeElement, { onClick: this.selectCode, codeobj: {
                                        name: item[CodeProperty.name],
                                        id: item[CodeProperty.id],
                                        comment: item[CodeProperty.comment],
                                        writer: item[CodeProperty.userName],
                                        date: item[CodeProperty.date],
                                        tag: item[CodeProperty.tag],
                                        writerNo: item[CodeProperty.userNo]
                                    } }, index))) }) }), _jsxs("div", { className: "page", children: [_jsx("button", { onClick: this.prevPage, disabled: this.state.page === 0, title: "Prev" }), this.state.page + 1, "/", Math.ceil(this._codeSize / this._pageSize), _jsx("button", { onClick: this.nextPage, disabled: this.state.page + 1 ===
                                        Math.ceil(this._codeSize / this._pageSize), title: "Next" })] }), _jsx("div", { style: {
                                display: this.state.loading ? 'block' : 'none',
                                textAlign: 'center'
                            }, children: _jsx(ReactLoading, { type: "spin", color: "#1E90FF", height: '50px', width: '50px' }) })] })] }));
    }
} //CodelistWidget
//# sourceMappingURL=codeList.js.map