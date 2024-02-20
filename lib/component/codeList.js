import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import ReactLoading from 'react-loading';
import { style } from 'typestyle';
import styled from 'styled-components';
import { AiOutlineLogout, AiOutlineAlignLeft, AiOutlineBars } from 'react-icons/ai';
import { Ankus, ShareCode } from '../ankusCommon';
import '../../style/codelist.css';
import { CodePropDlg, RenameDialog } from './codeDescTab';
var CodeView;
(function (CodeView) {
    CodeView[CodeView["simple"] = 0] = "simple";
    CodeView[CodeView["detail"] = 1] = "detail";
})(CodeView || (CodeView = {}));
const SimpleCodeItem = styled.div `
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
const SelSimpleCodeItem = styled.div `
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
const SimpleCodeName = styled.span `
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: calc(100% - 150px);
`;
const SimpleCodeDate = styled.span `
  width: 135px;
  text-align: right;
`;
const DetailCodeName = styled.p `
  font-size: 16px;
  font-weight: 600;
`;
const CodeElement = (props) => {
    const onClick = (event) => {
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
        return ('• Writer: ' +
            props.codeobj.writer +
            '\n• Description:\n' +
            (props.codeobj.comment ? props.codeobj.comment : ''));
    };
    return props.viewType === CodeView.detail ? (_jsx("li", { className: "ankus-code-list-item", onClick: onClick, onDoubleClick: dblclickCode, onContextMenu: onClick, children: _jsxs("div", { className: props.select ? 'code-item sel-code' : 'code-item', children: [_jsx(DetailCodeName, { children: props.codeobj.name }), _jsx("p", { children: props.codeobj.comment }), _jsx("p", { children: props.codeobj.tag }), _jsxs("p", { children: [_jsxs("span", { children: [props.codeobj.writer, " | "] }), Ankus.dateToString(props.codeobj.date)] })] }) })) : (_jsx("li", { className: "ankus-code-list-item", onClick: onClick, onDoubleClick: dblclickCode, onContextMenu: onClick, title: tooltip(), children: props.select ? (_jsxs(SelSimpleCodeItem, { children: [_jsx(SimpleCodeName, { children: props.codeobj.name }), _jsx(SimpleCodeDate, { children: Ankus.dateToString(props.codeobj.date) })] })) : (_jsxs(SimpleCodeItem, { children: [_jsx(SimpleCodeName, { children: props.codeobj.name }), _jsx(SimpleCodeDate, { children: Ankus.dateToString(props.codeobj.date) })] })) }));
}; //CodeElement
export class CodelistWidget extends React.Component {
    constructor(props) {
        super(props);
        this.SEARCH_OPTION = [
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
        this._errMsg = '';
        this._codeList = [];
        this._searchKeyword = '';
        this.SearchResult = styled.span `
    font-size: 12px;
    color: var(--jp-ui-font-color2);
    margin: 15px 0 0 5px;
  `;
        this.ViewButton = styled.button `
    color: var(--jp-ui-font-color2);
    display: inline-block;
    width: 17px;
    height: 17px;
    padding: 2px;
  `;
        this.CodeList = styled.ul `
    margin: 0;
    padding: 0;
    overflow: auto;
    font-family: var(--jp-content-font-family);
    list-style: none;
    background-color: var(--jp-layout-color0);
  `;
        //on select code
        this.clbkSelectCode = (event, codeobj) => {
            //update selection
            this.setState({ selection: { prop: codeobj } });
        };
        //callback - close property dialog
        this.clbkCloseProp = (save, taglist, desc) => {
            //close
            this.setState({ openProp: false });
            if (save) {
                const code = {};
                code[ShareCode.CodePropertyName.comment] = desc;
                //tag list
                code[ShareCode.CodePropertyName.tag] = taglist;
                //code id
                code[ShareCode.CodePropertyName.id] = this.state.selection.prop.id;
                //update code
                fetch(Ankus.ankusURL + '/share-code/modify/prop', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: Ankus.loginToken,
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
        this.clbkCloseRename = async (name) => {
            //close dialog
            this.setState({ openRename: false });
            if (name !== undefined &&
                name.length > 0 &&
                name !== this.state.selection.prop.name) {
                const code = {};
                //code name
                code[ShareCode.CodePropertyName.name] = name;
                //code id
                code[ShareCode.CodePropertyName.id] = this.state.selection.prop.id;
                //update code
                fetch(Ankus.ankusURL + '/share-code/modify/name', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: Ankus.loginToken,
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
        this.prevPage = () => {
            this.searchCode(this.state.pageNo - 1, this.state.orderOption, this.state.orderDirection === 'asc');
        };
        this.nextPage = () => {
            this.searchCode(this.state.pageNo + 1, this.state.orderOption, this.state.orderDirection === 'asc');
        };
        //code list
        this.searchCode = async (page, orderCol, asc) => {
            //search keyword list
            const words = this.getSearchKeywords();
            //search option
            const searchOption = this.state.searchOption;
            //show wait image
            this.setState({ loading: true });
            const out = await ShareCode.codelist(words, searchOption, orderCol, asc, page);
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
            }
            else {
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
        this.changeSearchOption = (e) => {
            this.SEARCH_OPTION.forEach(element => {
                if (element.name === e.target.value) {
                    const res = this.state.searchResult;
                    this.setState({ searchOption: element.name, searchResult: res });
                    return false;
                }
            });
        };
        this.changeSearchKeyword = (e) => {
            //this.setState({ searchKeyword: e.target.value });
            console.log(e.target.value);
            this._searchKeyword = e.target.value;
        };
        //change order by
        this.changeOrderOption = (e) => {
            //제목 정렬 선택
            if (e.target.className === 'name-wrap') {
                //현재 제목 정렬 상태
                if (this.state.orderOption === ShareCode.CodePropertyName.name) {
                    //정렬 순서 변경
                    this.searchCode(this.state.viewType === CodeView.detail ? 0 : -1, this.state.orderOption, this.state.orderDirection !== 'asc');
                }
                //제목 정렬로 변경
                else {
                    this.searchCode(this.state.viewType === CodeView.detail ? 0 : -1, ShareCode.CodePropertyName.name, this.state.orderDirection === 'asc');
                }
            }
            //select date order
            else {
                //current date order
                if (this.state.orderOption === ShareCode.CodePropertyName.date) {
                    //정렬 순서 변경
                    this.searchCode(this.state.viewType === CodeView.detail ? 0 : -1, this.state.orderOption, this.state.orderDirection !== 'asc');
                }
                //change to date order
                else {
                    this.searchCode(this.state.viewType === CodeView.detail ? 0 : -1, ShareCode.CodePropertyName.date, this.state.orderDirection === 'asc');
                }
            }
        }; //changeOrderOption
        //change order
        this.changeOrder = (e) => {
            this.searchCode(this.state.viewType === CodeView.detail ? 0 : -1, this.state.orderOption, this.state.orderDirection !== 'asc');
        };
        //change view mode
        this.changeCodeView = (viewType) => {
            this.setState({ viewType: viewType });
            this.searchCode(viewType === CodeView.detail ? 0 : -1, this.state.orderOption, this.state.orderDirection === 'asc');
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
        this.searchCode(this.state.viewType === CodeView.detail ? 0 : -1, ShareCode.CodePropertyName.name, true);
    } //constructor
    get selectedCode() {
        var _a;
        return (_a = this.state.selection) === null || _a === void 0 ? void 0 : _a.prop;
    }
    //open code property
    async openCodeProp() {
        try {
            //get code
            const response = await fetch(`${Ankus.ankusURL}/share-code/view?token=` +
                Ankus.loginToken +
                '&codeId=' +
                this.state.selection.prop.id);
            //fail
            if (!response.ok) {
                throw new Error('fail');
            }
            const jsrp = await response.json();
            const codetail = {
                ...this.state.selection.prop
            };
            // codetail.id = this.state.selection?.id;
            // codetail.name = jsrp[ShareCode.CodePropertyName.name];
            // codetail.writer = jsrp[ShareCode.CodePropertyName.userName];
            // codetail.date = jsrp[ShareCode.CodePropertyName.date];
            // codetail.writerNo = jsrp[ShareCode.CodePropertyName.userNo];
            const content = jsrp[ShareCode.CodePropertyName.content];
            //comment
            if (jsrp[ShareCode.CodePropertyName.comment] !== null) {
                codetail.comment = jsrp[ShareCode.CodePropertyName.comment];
            }
            //tag list
            if (jsrp[ShareCode.CodePropertyName.tag] !== null) {
                codetail.taglist = jsrp[ShareCode.CodePropertyName.tag].map((value) => value.name);
            }
            this.setState({ selection: { prop: codetail, content: content } });
            this.setState({ openProp: true });
        }
        catch (error) {
            alert('공유 코드 정보 가져오기 오류');
        }
    } //openCodeProp
    //open rename dialog
    openRenameDlg() {
        this.setState({ openRename: true });
    }
    getSearchKeywords() {
        if (this.state.searchOption === ShareCode.CodePropertyName.tag ||
            this.state.searchOption === ShareCode.CodePropertyName.comment) {
            return this._searchKeyword.trim().split(' ');
        }
        else {
            return this._searchKeyword === '' ? [] : [this._searchKeyword];
        }
    }
    //refresh list
    refresh() {
        this.searchCode(this.state.pageNo, this.state.orderOption, this.state.orderDirection === 'asc');
    }
    resultMessage(keyword, count) {
        var _a;
        if (keyword) {
            return ('Search for "' +
                keyword +
                '" in ' +
                ((_a = this.SEARCH_OPTION.find(option => option.name === this.state.searchOption)) === null || _a === void 0 ? void 0 : _a.label) +
                ' - Total ' +
                count);
        }
        else {
            return 'Total ' + count;
        }
    } //resultMessage
    render() {
        var _a, _b, _c, _d, _e;
        return (_jsxs("div", { className: "ankus-code-list-wrap", children: [_jsxs("div", { style: {
                        margin: '0 5px 10px 10px',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }, children: [_jsx("div", { className: "ankus-ui-text", children: _jsxs("a", { href: Ankus.ankusURL, target: "_blank", style: { display: 'flex', justifySelf: 'end' }, children: [_jsx("button", { className: "ankus-icon-btn go-icon" }), "Go to ankus website"] }) }), _jsx("button", { className: "ankus-icon-btn", title: "Logout", onClick: this.props.logout, style: { width: '24px', height: '20px' }, children: _jsx(AiOutlineLogout, { style: {
                                    width: '16px',
                                    height: '16px',
                                    color: 'var(--jp-ui-font-color2)'
                                } }) })] }), _jsxs("div", { className: "search-wrap", children: [_jsx("select", { onChange: this.changeSearchOption, className: this.__selectStyle, children: this.SEARCH_OPTION.map((option, index) => (_jsx("option", { value: option.name, children: option.label }, index))) }), _jsx("input", { className: this.__searchInputStyle, type: "text", placeholder: (_a = this.SEARCH_OPTION.find(option => option.name === this.state.searchOption)) === null || _a === void 0 ? void 0 : _a.guide, onChange: this.changeSearchKeyword, onKeyDown: e => {
                                if (e.key === 'Enter') {
                                    this.searchCode(this.state.viewType === CodeView.detail ? 0 : -1, this.state.orderOption, this.state.orderDirection === 'asc');
                                }
                            } }), _jsx("button", { className: "search-btn", onClick: () => this.searchCode(this.state.viewType === CodeView.detail ? 0 : -1, this.state.orderOption, this.state.orderDirection === 'asc'), title: "Filter code list" })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [_jsx(this.SearchResult, { children: this.state.searchResult }), _jsxs("div", { style: { padding: '10px 5px 0 0' }, children: [_jsx(this.ViewButton, { className: "ankus-icon-btn", title: "Detail", onClick: () => this.changeCodeView(CodeView.detail), children: _jsx(AiOutlineAlignLeft, { style: {
                                            color: this.state.viewType === CodeView.detail
                                                ? 'var(--jp-ui-font-color0)'
                                                : 'var(--jp-ui-font-color2)'
                                        } }) }), _jsx(this.ViewButton, { className: "ankus-icon-btn", title: "List", onClick: () => this.changeCodeView(CodeView.simple), children: _jsx(AiOutlineBars, { style: {
                                            color: this.state.viewType === CodeView.simple
                                                ? 'var(--jp-ui-font-color0)'
                                                : 'var(--jp-ui-font-color2)'
                                        } }) })] })] }), _jsxs("div", { className: "title", children: [_jsxs("div", { className: "name-wrap", onClick: this.changeOrderOption, children: [_jsx("p", { children: "Name" }), _jsx("div", { 
                                    // arrown up/down
                                    className: this.state.orderDirection === 'asc' ? 'name-up' : 'name-down', style: {
                                        display: 
                                        //arrow show/hide
                                        this.state.orderOption === ShareCode.CodePropertyName.name
                                            ? 'block'
                                            : 'none'
                                    } })] }), _jsxs("div", { className: "date-wrap", onClick: this.changeOrderOption, children: [_jsx("div", { className: this.state.orderDirection === 'asc' ? 'date-up' : 'date-down', style: {
                                        display: this.state.orderOption === ShareCode.CodePropertyName.date
                                            ? 'block'
                                            : 'none'
                                    } }), _jsx("p", { children: "Date Updated" })] })] }), _jsx("div", { style: {
                        display: this.state.errMsg === '' ? 'block' : 'none'
                    }, children: this.state.errMsg }), _jsxs("div", { style: {
                        height: 'calc(100% - 110px)',
                        display: this._codeList.length > 0 ? 'block' : 'none'
                    }, children: [_jsx(this.CodeList, { style: {
                                maxHeight: this.state.viewType === CodeView.detail
                                    ? 'calc(100% - 40px)'
                                    : '100%'
                            }, children: this._codeList.map((item, index) => {
                                var _a;
                                return (_jsx(CodeElement, { viewType: this.state.viewType, onClick: this.clbkSelectCode, codeobj: {
                                        name: item.name,
                                        id: item.id,
                                        comment: item.comment,
                                        writer: item.writer,
                                        date: item.date,
                                        tag: item.tag,
                                        writerNo: item.writerNo
                                    }, select: ((_a = this.state.selection) === null || _a === void 0 ? void 0 : _a.prop.id) === item.id }, index));
                            }) }), _jsx(RenameDialog, { name: ((_b = this.state.selection) === null || _b === void 0 ? void 0 : _b.prop.name) === undefined
                                ? ''
                                : this.state.selection.prop.name, open: this.state.openRename, onClose: this.clbkCloseRename }), _jsx(CodePropDlg, { open: this.state.openProp, 
                            //코드 작성자와 현재 사용자가 동일하면, 수정 가능
                            editable: ((_c = this.state.selection) === null || _c === void 0 ? void 0 : _c.prop.writerNo) === Ankus.userNumber, prop: (_d = this.state.selection) === null || _d === void 0 ? void 0 : _d.prop, content: ((_e = this.state.selection) === null || _e === void 0 ? void 0 : _e.content) === undefined
                                ? []
                                : this.state.selection.content, onClose: (save, taglist, desc) => this.clbkCloseProp(save, taglist, desc) }), this.state.viewType === CodeView.detail ? (_jsxs("div", { className: "page", children: [_jsx("button", { onClick: this.prevPage, disabled: this.state.pageNo === 0, title: "Prev" }), this.state.pageNo + 1, "/", this.state.pageSize, _jsx("button", { onClick: this.nextPage, disabled: this.state.pageNo + 1 === this.state.pageSize, title: "Next" })] })) : (''), _jsx("div", { style: {
                                display: this.state.loading ? 'block' : 'none',
                                textAlign: 'center'
                            }, children: _jsx(ReactLoading, { type: "spin", color: "#1E90FF", height: '50px', width: '50px' }) })] })] }));
    }
} //CodelistWidget
//# sourceMappingURL=codeList.js.map