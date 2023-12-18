import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { ReactWidget } from '@jupyterlab/apputils';
import Grid from '@material-ui/core/Grid';
import { style } from 'typestyle';
import ReactLoading from 'react-loading';
import { AiFillDelete, AiOutlineClose, AiOutlineSearch, AiOutlineReload, AiOutlineInfoCircle } from 'react-icons/ai';
import { IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Divider, Button, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, InputLabel, FormControl } from '@material-ui/core';
import { Ankus, StandardTermPart } from '../ankusCommon';
import '../../style/standardterm.css';
const headStyle = style({
    width: '100%',
    height: '50px',
    fontSize: '17px'
});
const btnContainerStyle = style({
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '7px'
});
const invalidListStyle = style({
    color: 'gray',
    fontWeight: 600,
    fontSize: '15px',
    textAlign: 'center'
});
export class StandardTermSetting extends ReactWidget {
    constructor(word) {
        super();
        this._category = Ankus.stdtermCategory; //initial value : default category
        //    this._catRef = React.createRef<HTMLInputElement>();
        this._word = word;
        //category list changed
        /* StandardTermPart.categoryLoadSignal().connect(
          async (_, cats: StandardTermPart.Category[]) => {
            console.log('category load signal - setting');
    
            this._categories = [...cats];
            this.update();
            
          }
        ); */
    }
    setSelection(word, cat) {
        this._word = word;
        this._category = cat;
        this.update();
    }
    //  private _catRef: React.RefObject<HTMLInputElement>;
    /* private sortCat = () => {
      const cats = this.state.categories;
  
      cats.sort((a, b) => {
        const an = a.name.toUpperCase();
        const bn = b.name.toUpperCase();
  
        if (an < bn) {
          return -1;
        }
        if (an > bn) {
          return 1;
        }
        return 0;
      });
      this.setState({ categories: cats });
    }; */
    //const input = this._catRef.current?.lastChild
    //?.firstChild as HTMLInputElement;
    //(this._catRef.current?.lastChild?.firstChild as HTMLInputElement).value =
    //value;
    render() {
        return _jsx(CategoryBar, { word: this._word, cat: this._category });
    }
}
//delete button in text field
const txtfldDeleteButton = (disable, click) => {
    return (_jsx(IconButton, { className: "del-btn", size: "small", onClick: click, style: {
            width: '18px',
            marginLeft: '5px',
            color: 'var(--jp-ui-font-color1)',
            border: 'none'
        }, disabled: disable, children: _jsx(AiOutlineClose, {}) }));
};
class CategoryBar extends React.Component {
    constructor(props) {
        super(props);
        this.listRef = React.createRef();
        this.loadCategories = async () => {
            this.setState({ loading: true });
            try {
                const cats = await StandardTermPart.loadCategories();
                this.setState({ categories: cats });
            }
            catch (e) {
                this.setState({ categories: undefined });
            }
            this.setState({ loading: false });
        };
        this.scrollToListitem = (value) => {
            if (this.listRef.current) {
                //목록에서 카테고리 찾으면, 스크롤 위치 조정
                for (const item of this.listRef.current.children) {
                    if (item.textContent === value) {
                        item.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        break;
                    }
                }
            }
        };
        //add category
        this.onAdd = async () => {
            const name = this.state.inputVal.trim();
            const prevsel = this.state.selected;
            if (this.state.categories) {
                //동일한 이름 확인
                const found = this.state.categories.find(cat => cat.name === name);
                if (found !== undefined) {
                    //change category
                    if (prevsel !== found.id) {
                        //select category
                        this.setState({ selected: found.id });
                        this.loadWords(found.id, this.state.searchKeyword);
                    }
                    //scroll list
                    this.scrollToListitem(found.name);
                    return;
                } //if : check same name
            }
            const cats = await StandardTermPart.addCategory(name, true);
            this.setState({ categories: cats });
            const fnd = cats.find(cat => cat.name === name);
            if (fnd !== undefined) {
                this.setState({ selected: fnd.id });
                this.setState({ wordlist: [] });
                this.scrollToListitem(fnd.name);
            }
        }; //add
        //delete category
        this.onDelete = async (id) => {
            //alert
            if (confirm('Delete this category and terms belonging to it?')) {
                const cats = await StandardTermPart.delCategory(id, true);
                this.setState({ categories: cats });
                //선택 카테고리 삭제
                if (id === this.state.selected) {
                    this.setState({ selected: 0 });
                }
            }
        }; //delete
        this.onUpdate = async () => {
            //none selected
            if (this.state.selected === 0) {
                return;
            }
            const name = this.state.inputVal.trim();
            if (this.state.categories) {
                //동일한 이름 확인
                const found = this.state.categories.find(cat => cat.name === name);
                if (found !== undefined) {
                    //no change
                    if (found.id === this.state.selected) {
                        return;
                    }
                    //select category
                    this.setState({ selected: found.id });
                    //scroll list
                    this.scrollToListitem(found.name);
                    //load word list
                    this.loadWords(found.id, this.state.searchKeyword);
                    return;
                } //if : check name
            }
            const cats = await StandardTermPart.updateCategory(this.state.selected, name, true);
            this.setState({ categories: cats });
            //scroll list
            this.scrollToListitem(name);
        }; //update category
        this.loadWords = async (catid, keyword) => {
            //check category
            if (catid !== 0) {
                this.setState({ loadingWords: true });
                try {
                    this.setState({
                        wordlist: await StandardTermPart.searchWords(StandardTermPart.Field.engName, keyword, StandardTermPart.Field.engName, true, catid)
                    });
                }
                catch (e) {
                    this.setState({ wordlist: undefined });
                }
                this.setState({ loadingWords: false });
            }
            //no category -> no word list
            else {
                this.setState({ wordlist: [] });
            }
        }; //load words
        this.onRequestReloadWords = async (search) => {
            this.setState({ searchKeyword: search });
            this.loadWords(this.state.selected, search);
        };
        this.openCategorySelectDlg = () => {
            this.setState({ openCatdlg: true });
        };
        this.categorySelectDialog = () => {
            return (_jsxs(Dialog, { onClose: e => this.setState({ openCatdlg: false }), open: this.state.openCatdlg, children: [_jsx(DialogTitle, { children: "Select Category" }), _jsx(DialogContent, { children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { id: "ankus-move-cat-input-label", children: "Category" }), _jsx(Select, { value: this.state.catdlgSel, labelId: "ankus-move-cat-input-label", style: { minWidth: '300px' }, label: "Category", onChange: e => this.setState({ catdlgSel: e.target.value }), children: this.state.categories === undefined
                                        ? ''
                                        : this.state.categories.map(cat => cat.id !== this.state.selected ? (_jsx(MenuItem, { value: cat.id, children: cat.name }, cat.id)) : null) })] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { disabled: this.state.categories === undefined ||
                                    this.state.categories.length < 2, onClick: () => this.onClickCategoryPopupOk(), children: "Ok" }), _jsx(Button, { onClick: e => this.setState({ openCatdlg: false }), children: "Cancel" })] })] }));
        }; //categorySelectDialog
        this.onClickCategoryPopupOk = () => {
            this.setState({ openCatdlg: false });
            const found = this.state.categories.find(cat => cat.id === Number(this.state.catdlgSel));
            if (found !== undefined) {
                this.setState({ selected: found.id });
                this.scrollToListitem(found.name);
                this.setState({ inputVal: found.name });
                //카테고리 선택 알림
                this.setState({ catdlgSeq: this.state.catdlgSeq + 1 });
            }
        };
        //click category
        this.onClickListitem = (cat) => {
            //no change
            if (cat.id === this.state.selected) {
                return;
            }
            //select category
            this.setState({ selected: cat.id });
            this.setState({ inputVal: cat.name });
            this.loadWords(cat.id, this.state.searchKeyword);
        }; //click category
        this.deleteCatName = () => {
            this.setState({ inputVal: '' });
        };
        this.categoryListitem = () => {
            return this.state.categories === undefined ? (_jsx("p", { className: invalidListStyle, style: {
                    margin: '0 10px 15px 15px',
                    paddingTop: '20px',
                    height: 'calc(100% - 185px)',
                    width: 'calc(100% - 25px)',
                    border: '1px solid #D3D3D3'
                }, children: "unavailable" })) : (_jsx("div", { style: {
                    height: 'calc(100% - 155px)',
                    padding: '0'
                }, children: _jsx(List, { dense: true, className: "ankus-term-setting-catlist", style: { padding: '0', height: '100%' }, ref: this.listRef, children: this.state.categories.map(cat => {
                        return (_jsxs(ListItem, { button: true, selected: this.state.selected === cat.id, onClick: e => this.onClickListitem(cat), children: [_jsx(ListItemText, { primary: cat.name }), Ankus.userIsAdmin ? (_jsx(ListItemSecondaryAction, { children: _jsx(IconButton, { edge: "end", "aria-label": "delete", title: "Delete Category", size: "small", onClick: () => this.onDelete(cat.id), children: _jsx(AiFillDelete, { color: this.state.selected === cat.id
                                                ? 'var(--jp-ui-inverse-font-color1)'
                                                : 'var(--jp-ui-font-color1)' }) }) })) : ('')] }, cat.id)); //return
                    }) }) })
            //카테고리 목록
            ); //return
        }; //categoryListitem
        this.__containerStyle = style({
            color: 'var(--jp-ui-font-color1)',
            height: '100%',
            margin: '0'
        });
        this.inputCategoryIsValid = () => {
            return this.state.inputVal.trim().length > 0;
        };
        this.updateCategoryIsEnable = () => {
            return this.inputCategoryIsValid() && this.state.selected !== undefined;
        };
        this.state = {
            inputVal: '',
            //search keyword
            searchKeyword: '',
            loading: false,
            //select category
            selected: props.cat,
            categories: undefined,
            loadingWords: false,
            wordlist: [],
            //category select dialog
            openCatdlg: false,
            catdlgSel: '',
            //카테고리 선택에 따른 일련번호
            catdlgSeq: 0
        }; //state
    } //constructor
    componentDidMount() {
        this.loadCategories();
        this.loadWords(this.props.cat, '');
    }
    render() {
        return (_jsxs(Grid, { container: true, spacing: 1, className: this.__containerStyle, children: [_jsxs(Grid, { item: true, xs: 5, style: { display: 'flex', height: '100%' }, children: [_jsxs("div", { style: { width: '100%', height: '100%', padding: '0 10px 0 15px' }, children: [_jsxs("div", { className: headStyle, style: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'end'
                                    }, children: [_jsx("span", { style: { padding: '0 0 5px 5px' }, children: "Categories" }), _jsx(IconButton, { title: "Refresh category list", disabled: this.state.loading, onClick: async () => this.loadCategories(), children: _jsx(AiOutlineReload, { color: "var(--jp-ui-font-color1)", style: {
                                                    width: '15px',
                                                    height: '15px',
                                                    margin: '0',
                                                    padding: '0'
                                                } }) })] }), this.state.loading ? (
                                //category loading image
                                _jsx("div", { className: "ankus-loading-container", style: {
                                        height: 'calc(100% - 155px)'
                                    }, children: _jsx(ReactLoading, { type: "spin", color: "var(--jp-brand-color1)", height: "50px", width: "50px" }) })) : (
                                //category list
                                this.categoryListitem()), _jsx("br", {}), _jsxs("div", { className: "ankus-term-setting-input", children: [_jsx("input", { 
                                            /* ref={this._catRef} */
                                            title: "Enter category name (max 50 characters)", maxLength: 50, placeholder: "Category Name", value: this.state.inputVal, onChange: e => {
                                                this.setState({ inputVal: e.target.value });
                                            } }), txtfldDeleteButton(this.state.inputVal.length < 1, this.deleteCatName)] }), _jsxs("div", { className: btnContainerStyle, style: { marginTop: '13px' }, children: [_jsx(Button, { title: "Add Category", size: "small", variant: "outlined", 
                                            //color="primary"
                                            disabled: !this.inputCategoryIsValid(), onClick: e => this.onAdd(), style: {
                                                color: 'white',
                                                backgroundColor: this.inputCategoryIsValid()
                                                    ? 'var(--ankus-control-color)'
                                                    : 'var(--ankus-disable-color)'
                                            }, children: "Add" }), _jsx(Button, { title: "Update Category", size: "small", variant: "outlined", 
                                            //color="primary"
                                            disabled: !this.updateCategoryIsEnable(), onClick: e => this.onUpdate(), style: {
                                                marginLeft: '10px',
                                                color: 'white',
                                                backgroundColor: this.updateCategoryIsEnable()
                                                    ? 'var(--ankus-control-color)'
                                                    : 'var(--ankus-disable-color)'
                                            }, children: "Update" })] })] }), _jsx(Divider, { orientation: "vertical", variant: "middle", flexItem: true, style: { margin: '8px 0 0 0' } })] }), _jsxs(Grid, { item: true, xs: 7, style: { height: '100%' }, children: [_jsx(WordPage, { loading: this.state.loadingWords, words: this.state.wordlist, refreshWords: this.onRequestReloadWords, category: this.state.selected, initVal: this.props.word, openCategorySelectDialog: this.openCategorySelectDlg, catseldlgOk: this.state.catdlgSeq, categoryList: this.state.categories }), this.categorySelectDialog()] })] }));
    }
}
const WordPage = (props) => {
    const { initVal, category, words, refreshWords } = props;
    //name
    const [name, setName] = React.useState((initVal === null || initVal === void 0 ? void 0 : initVal.name) ? initVal.name : '');
    //english name
    const [engName, setEngName] = React.useState((initVal === null || initVal === void 0 ? void 0 : initVal.engName) ? initVal.engName : '');
    //english full name
    const [engFullname, setEngFullname] = React.useState((initVal === null || initVal === void 0 ? void 0 : initVal.engDesc) ? initVal.engDesc : '');
    //description
    const [desc, setDesc] = React.useState((initVal === null || initVal === void 0 ? void 0 : initVal.desc) ? initVal.desc : '');
    //select word
    const [selected, selectWord] = React.useState(undefined);
    /* new Array<boolean>(props.words.length) */
    //search keyword
    const [searchKeyword, setSearchKeyword] = React.useState('');
    //check change
    const [dirty, setDirty] = React.useState(false);
    //search detail
    const [searchingTerm, setSearchTerm] = React.useState(false);
    //show import info
    const [importInfo, showImportInfo] = React.useState(false);
    //check word
    const [checked, setWordChecked] = React.useState([]);
    //check all word
    const [allChecked, setAllChecked] = React.useState(false);
    const ABBR_RULE = /^[a-zA-Z0-9-_.]*$/;
    const listRef = React.createRef();
    const fileRef = React.createRef();
    const infoStyle = style({
        position: 'absolute',
        left: 'calc(100% - 400px)',
        width: '380px',
        height: '95px',
        padding: '5px',
        fontSize: '12px',
        display: importInfo ? 'block' : 'none',
        backgroundColor: 'var(--jp-layout-color2)',
        border: '1px solid var(--jp-border-color1)',
        //boxShadow: '1px 1px 5px 0px',
        zIndex: '999'
    });
    //change detail
    React.useEffect(() => {
        (async () => {
            setName((initVal === null || initVal === void 0 ? void 0 : initVal.name) ? initVal.name : '');
            setEngName((initVal === null || initVal === void 0 ? void 0 : initVal.engName) ? initVal.engName : '');
            setEngFullname((initVal === null || initVal === void 0 ? void 0 : initVal.engDesc) ? initVal.engDesc : '');
            setDesc((initVal === null || initVal === void 0 ? void 0 : initVal.desc) ? initVal.desc : '');
        })();
    }, [props.initVal]);
    //select category for copy
    React.useEffect(() => {
        (async () => {
            if (props.catseldlgOk > 0) {
                copyTo();
            }
        })();
    }, [props.catseldlgOk]);
    //change category
    React.useEffect(() => {
        (async () => {
            //init check box
            setWordChecked([]);
            //uncheck all
            setAllChecked(false);
            //none selected
            selectWord(undefined);
            //init dirty
            setDirty(false);
        })();
    }, [props.category]);
    //change word list
    React.useEffect(() => {
        (async () => {
            if (props.words !== undefined && selected !== undefined) {
                //check id or name
                const found = props.words.find(w => w.nameId === selected.nameId || w.name === selected.name);
                //selection
                selectWord(found);
                return;
            } //if : valid selection
            selectWord(undefined);
        })();
    }, [props.words]);
    const updateWord = async () => {
        if (selected === undefined) {
            return;
        }
        if (!confirm('Update "' + selected.name + '"?')) {
            return;
        }
        fetch(Ankus.ankusURL +
            '/standard-term/update-term?token=' +
            encodeURIComponent(Ankus.loginToken), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nameId: selected.nameId,
                wordId: selected.wordId,
                name: name.trim(),
                engName: engName.trim(),
                desc: desc.trim(),
                engDesc: engFullname.trim(),
                category: category
            })
        })
            .then(response => {
            if (response.ok) {
                //init dirty
                setDirty(false);
                //refresh terms
                refreshWords(searchKeyword);
            }
            else {
                throw new Error('Error Response');
            }
        })
            .catch(error => {
            console.log('Failed to edit Category');
        });
    }; //update word
    const onSelectWord = (word) => {
        selectWord(word);
        setName(word.name);
        setEngFullname(word.engDesc ? word.engDesc : '');
        setEngName(word.engName);
        setDesc(word.desc ? word.desc : '');
    };
    const clickImport = (e) => {
        fileRef.current.click();
    };
    const importFile = (e) => {
        //e.preventDefault();
        const fd = new FormData();
        fd.append('file', e.target.files[0]);
        fetch(Ankus.ankusURL +
            '/standard-term/import?category=' +
            props.category +
            '&token=' +
            encodeURIComponent(Ankus.loginToken), {
            method: 'POST',
            //headers: {
            //'Content-Type': 'multipart/form-data'
            //},
            body: fd
        })
            .then(response => {
            if (response.ok) {
                //refresh term list
                refreshWords(searchKeyword);
            }
        })
            .catch(error => {
            throw new Error('Failed to import file');
        });
    }; //importFile
    const onDeleteWord = async () => {
        if (confirm('Delete checked terms?')) {
            const idlist = checked.map(w => w.nameId);
            fetch(Ankus.ankusURL +
                '/standard-term/delete-term?token=' +
                encodeURIComponent(Ankus.loginToken), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(idlist)
            })
                .then(response => {
                if (response.ok) {
                    //init check box
                    setWordChecked([]);
                    //uncheck all
                    setAllChecked(false);
                    //selected term is deleted
                    if (selected !== undefined &&
                        idlist.find(wd => wd === selected.nameId)) {
                        //none selected
                        selectWord(undefined);
                        //init dirty
                        setDirty(false);
                    }
                    //refresh terms
                    refreshWords(searchKeyword);
                }
                else {
                    throw new Error('Error Response');
                }
            })
                .catch(error => {
                throw new Error('Failed to delete word');
            });
        } //if : confirm
    }; //delete word
    const copyTo = async () => {
        await saveWords(words.filter(w => checked.find(chk => w.nameId === chk.nameId && w.wordId === chk.wordId)));
        //init keyword
        setSearchKeyword('');
        //clear name
        setName('');
        //clear english name
        setEngName('');
        //clear english full name
        setEngFullname('');
        //clear description
        setDesc('');
        refreshWords('');
    };
    //add term
    const onClickAdd = async () => {
        //init dirty
        setDirty(false);
        const word = {
            name: name.trim(),
            engName: engName.trim(),
            desc: desc.trim(),
            engDesc: engFullname.trim(),
            category: category
        };
        await fetch(Ankus.ankusURL +
            '/standard-term/add-term?token=' +
            encodeURIComponent(Ankus.loginToken), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(word)
        })
            .then(response => {
            if (response.ok) {
                return response.json();
            }
            else if (response.status === 409) {
                //conflict
                alert('The same term name exists');
                throw new Error('Term exists');
            }
            else {
                throw new Error('Error Response');
            }
        })
            .then(response => {
            const wrd = response;
            //select new
            selectWord(wrd);
            //응답 내용은, name id, word id, name, category id
            //show detail
            /* setName(wrd.name!);
            setEngName(wrd.engName!);
            setEngFullname(wrd.engDesc!);
            setDesc(wrd.desc!); */
        })
            .catch(error => {
            throw new Error('Failed to add term');
        });
        //refresh term list
        refreshWords(searchKeyword);
        //scroll list
        scrollToListitem(word.name);
    }; // click add
    const saveWords = async (wdlst) => {
        fetch(Ankus.ankusURL +
            '/standard-term/save-term?token=' +
            encodeURIComponent(Ankus.loginToken) +
            '&category=' +
            category, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(wdlst)
        })
            .then(response => {
            if (response.ok) {
                return;
            }
            else {
                throw new Error('Error Response');
            }
        })
            .catch(error => {
            throw new Error('Failed to add word');
        });
    }; //save word list
    const checkAll = (check) => {
        setAllChecked(check);
        //setWordChecked(new Array<boolean>(words.length).fill(check));
        if (check) {
            setWordChecked(words);
        }
        else {
            setWordChecked([]);
        }
    };
    const onCheckListitem = async (event, word) => {
        const lst = [...checked];
        //lst[index] = event.target.checked;
        if (event.target.checked) {
            lst.push(word);
        }
        else {
            const i = lst.indexOf(word);
            lst.splice(i, 1);
        }
        setWordChecked(lst);
    }; //check word
    //delete keyword
    const deleteSearchKeyword = () => {
        setSearchKeyword('');
        //init check box
        setWordChecked([]);
        //uncheck all
        setAllChecked(false);
        //none selected
        selectWord(undefined);
        refreshWords('');
    };
    //change keyword
    const changeSearchKeyword = (evt) => {
        if (evt.target.value.search(ABBR_RULE) !== -1) {
            //keyword
            setSearchKeyword(evt.target.value);
            //init check box
            setWordChecked([]);
            //uncheck all
            setAllChecked(false);
            //none selected
            selectWord(undefined);
            //load word list
            refreshWords(evt.target.value);
        }
    };
    //key down-abbr
    const keydownAbbr = (evt) => {
        if (evt.key.length === 1 && evt.key.search(ABBR_RULE) === -1) {
            evt.preventDefault();
        }
    };
    const deleteName = () => {
        setName('');
    };
    const deleteEngName = () => {
        setEngName('');
    };
    const deleteEngDesc = () => {
        setEngFullname('');
    };
    const deleteDesc = () => {
        setDesc('');
    };
    /*   const engKey = (evt: React.KeyboardEvent) => {
      if (evt.key.length === 1) {
        //alphabet, -, _, .
        const engRule = /[a-zA-Z0-9.-_]+/g;
  
        if (!engRule.test(evt.key)) {
          evt.preventDefault();
        }
      }
    }; */
    //change abbr
    const changeEngName = (evt) => {
        if (evt.target.value.search(ABBR_RULE) !== -1) {
            setEngName(evt.target.value);
            setDirty(true);
        }
    };
    const loadWordOfName = async (name) => {
        //searching state
        setSearchTerm(true);
        //find term
        const res = await fetch(Ankus.ankusURL +
            '/standard-term/find-name?token=' +
            encodeURIComponent(Ankus.loginToken) +
            '&name=' +
            encodeURIComponent(name) +
            '&category=' +
            category)
            .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error('Response Error');
            }
        })
            .then(json => {
            const trm = {
                nameId: json['nameId'],
                wordId: json['wordId'],
                name: json['name'],
                engName: json['engName'],
                category: json['category'],
                desc: json['desc'],
                engDesc: json['engDesc']
            };
            setEngName(trm.engName);
            setEngFullname(trm.engDesc);
            setDesc(trm.desc);
            return trm;
        })
            .catch(error => {
            //no searching state
            setSearchTerm(false);
            //검색된 용어가 없을 때도, 여기서 오류 발생
            throw new Error('Search Dictionary Error');
        });
        //no searching state
        setSearchTerm(false);
        //return term
        return res;
    }; //findWordOfName
    const loadWordOfEng = async (eng) => {
        setSearchTerm(true);
        const res = await fetch(Ankus.ankusURL +
            '/standard-term/find-abbr?token=' +
            encodeURIComponent(Ankus.loginToken) +
            '&engName=' +
            encodeURIComponent(eng) +
            '&category=' +
            category)
            .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error('Response Error');
            }
        })
            .then(json => {
            const trm = {
                nameId: json['nameId'],
                wordId: json['wordId'],
                name: json['name'],
                engName: json['engName'],
                category: json['category'],
                desc: json['desc'],
                engDesc: json['engDesc']
            };
            setEngFullname(trm.engDesc);
            setDesc(trm.desc);
            return trm;
        })
            .catch(error => {
            setSearchTerm(false);
            throw new Error('Search Dictionary Error');
        });
        setSearchTerm(false);
        return res;
    }; //findWordOfEng
    const scrollToListitem = (value) => {
        var _a;
        if (listRef.current) {
            //목록에서 용어명 찾으면, 스크롤 위치 조정
            for (const item of listRef.current.children) {
                if ((_a = item.textContent) === null || _a === void 0 ? void 0 : _a.endsWith('(' + value + ')')) {
                    item.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    break;
                }
            } //for : list item
        } //if : check list
    }; //scroll list
    const wordListitem = () => {
        return words === undefined ? (_jsx("div", { className: invalidListStyle, style: {
                margin: 0,
                height: 'calc(100% - 394px)',
                width: 'calc(100% - 25px)',
                border: '1px solid #D3D3D3',
                paddingTop: '20px'
            }, children: "unavailable" })) : (_jsx(List, { className: "ankus-dict-tm-list", dense: true, ref: listRef, style: {
                margin: 0,
                padding: '2px',
                height: 'calc(100% - 376px)',
                overflow: 'auto',
                width: 'calc(100% - 25px)',
                border: '1px solid var(--jp-border-color1)',
                backgroundColor: 'var(--jp-layout-color1)'
            }, children: words.map((word, index) => {
                return (_jsxs(ListItem, { button: true, selected: (selected === null || selected === void 0 ? void 0 : selected.nameId) === word.nameId, onClick: e => onSelectWord(word), style: {
                        padding: '4px 7px 4px 7px',
                        height: '22px',
                        backgroundColor: (selected === null || selected === void 0 ? void 0 : selected.nameId) === word.nameId
                            ? 'var(--jp-brand-color1)'
                            : 'transparent'
                    }, children: [_jsx("input", { type: "checkbox", checked: checked.includes(word), onChange: async (e) => onCheckListitem(e, word), style: { margin: '0 10px 0 5px' } }), _jsx(ListItemText, { primary: word.engName + ' (' + word.name + ')', primaryTypographyProps: {
                                style: {
                                    fontSize: '0.8rem',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis'
                                }
                            } })] }, index)); //return
            }) })); //return
    }; //wordListitem
    //import info
    const drawImportInfo = () => {
        return (_jsxs("div", { className: infoStyle, children: ["Only CSV files(UTF-8) are imported. ", _jsx("br", {}), " ", '•', " First row is header.", _jsx("br", {}), _jsxs("span", { style: { color: 'var(--jp-ui-font-color2)', fontWeight: '800' }, children: ["\u00A0\u00A0\u00A0", ' » ', "name, abbreviation(english), english full name, description"] }), _jsx("br", {}), '•', " Bellow is an example of file.", _jsx("br", {}), _jsxs("span", { style: {
                        color: 'var(--jp-info-color0)',
                        fontWeight: '800',
                        position: 'relative',
                        left: '80px',
                        top: '5px'
                    }, children: ["name, abbreviation, english, description", _jsx("br", {}), "\uC6A9\uC5B4\uBA85, NM, term name, \uC6A9\uC5B4 \uC124\uBA85"] })] }));
    }; //drawImportInfo
    const disableRefresh = () => {
        return props.loading || props.category === 0;
    };
    const disableCopy = () => {
        return (checked.length < 1 ||
            props.categoryList === undefined ||
            props.categoryList.length < 2);
    };
    const disableCheck = () => {
        return words ? words.length < 1 : true;
    };
    const disableUpdate = () => {
        return (selected === undefined || //no selection
            !dirty || //not modified
            !fulfillRequired() //필수항목 미기입
        );
    };
    const fulfillRequired = () => {
        return (name.trim().length > 0 && //name
            engName.trim().length > 0 //english name
        );
    };
    const disableFindAbbr = () => {
        return searchingTerm || engName.trim().length < 1;
    };
    const disableFindName = () => {
        return searchingTerm || name.trim().length < 1;
    };
    return (_jsxs("div", { style: { width: '100%', height: '100%' }, children: [_jsxs("div", { className: headStyle, style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: 'calc(100% - 5px)'
                }, children: [_jsxs("div", { className: "ankus-term-setting-input", style: { height: '30px', marginTop: '12px' }, children: [_jsx("input", { 
                                /* ref={this._catRef} */
                                title: "Enter english abbreviation", maxLength: 50, placeholder: "Search Term", value: searchKeyword, onChange: changeSearchKeyword, onKeyDown: keydownAbbr }), txtfldDeleteButton(searchKeyword.length < 1, deleteSearchKeyword)] }), _jsx(IconButton, { title: "Refresh term list", style: { margin: '10px 10px 0 0' }, disabled: disableRefresh(), onClick: async () => refreshWords(searchKeyword), children: _jsx(AiOutlineReload, { style: {
                                width: '15px',
                                height: '15px',
                                margin: '0',
                                padding: '0',
                                color: disableRefresh()
                                    ? 'var(--ankus-disable-color)'
                                    : 'var(--jp-ui-font-color1)'
                            } }) })] }), props.loading ? (_jsx("div", { className: "ankus-loading-container", style: {
                    height: 'calc(100% - 370px)'
                }, children: _jsx(ReactLoading, { type: "spin", color: "#1E90FF", height: '50px', width: '50px' }) })) : (wordListitem()), _jsxs("div", { style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    margin: '8px 20px 0 7px'
                }, children: [_jsxs("div", { style: { width: '100px' }, children: [_jsx(Checkbox, { id: "ankus-dict-chkall-term", checked: allChecked, color: "primary", size: "small", disabled: disableCheck(), style: {
                                    padding: '0 0 0 5px',
                                    color: disableCheck()
                                        ? 'var(--ankus-disable-color)'
                                        : 'var(--jp-brand-color1)'
                                }, onClick: e => checkAll(!allChecked) }), _jsx("label", { htmlFor: "ankus-dict-chkall-term", style: {
                                    cursor: disableCheck() ? 'auto' : 'pointer',
                                    color: disableCheck()
                                        ? 'var(--ankus-disable-color)'
                                        : 'var(--jp-ui-font-color1)'
                                }, children: "Check All" })] }), _jsxs("div", { style: { width: '230px' }, children: [_jsx(Button, { variant: "outlined", size: "small", title: "Delete checked terms", style: {
                                    padding: 0,
                                    backgroundColor: checked.length < 1
                                        ? 'var(--ankus-disable-color)'
                                        : 'var(--ankus-control-color)',
                                    color: 'white',
                                    fontSize: '12px'
                                }, disabled: checked.length < 1, onClick: async () => onDeleteWord(), children: "Delete" }), _jsx(Button, { variant: "outlined", size: "small", title: "Copy checked terms to a category", style: {
                                    margin: '0 5px',
                                    padding: 0,
                                    backgroundColor: disableCopy()
                                        ? 'var(--ankus-disable-color)'
                                        : 'var(--ankus-control-color)',
                                    color: 'white',
                                    fontSize: '12px'
                                }, disabled: disableCopy(), onClick: () => props.openCategorySelectDialog(), children: "Copy To" }), _jsx("input", { type: "file", name: "file", ref: fileRef, accept: ".csv", onChange: importFile, style: { display: 'none' } }), _jsx(Button, { variant: "outlined", size: "small", title: "Import CSV file", type: "submit", style: {
                                    marginRight: '5px',
                                    padding: 0,
                                    backgroundColor: props.category === 0
                                        ? 'var(--ankus-disable-color)'
                                        : 'var(--ankus-control-color)',
                                    color: 'white',
                                    fontSize: '12px'
                                }, disabled: props.category === 0, onClick: clickImport, children: "Import" }), _jsx("span", { children: _jsx(AiOutlineInfoCircle, { style: {
                                        color: 'var(--jp-info-color0)',
                                        width: '15px',
                                        height: '15px'
                                    }, onMouseOver: e => showImportInfo(true), onMouseLeave: e => showImportInfo(false) }) }), drawImportInfo()] })] }), _jsxs("div", { style: { width: 'calc(100%-5px)', margin: '23px 3px 0 0' }, children: [_jsxs("div", { className: "align-vt-center", children: [_jsxs("div", { className: "ankus-term-setting-input", style: { width: 'calc(100% - 50px)' }, children: [_jsx("input", { 
                                        /* ref={this._catRef} */
                                        title: "Enter term name (max 50 characters)", maxLength: 50, placeholder: "Term Name", value: name, onChange: e => {
                                            setName(e.target.value.replace(' ', ''));
                                            setDirty(true);
                                        }, onKeyDown: e => {
                                            if (e.key === ' ') {
                                                e.preventDefault();
                                            }
                                        }, style: { fontSize: 14 } }), txtfldDeleteButton(name.length < 1, deleteName)] }), _jsx(IconButton, { title: "Find Term", size: "small", onClick: async () => loadWordOfName(name), style: { marginLeft: '5px' }, disabled: disableFindName(), children: _jsx(AiOutlineSearch, { style: {
                                        color: disableFindName()
                                            ? 'var(--ankus-disable-color)'
                                            : 'var(--jp-ui-font-color1)'
                                    } }) })] }), _jsxs("div", { className: "align-vt-center", style: { padding: '10px 0' }, children: [_jsxs("div", { className: "ankus-term-setting-input", style: { width: 'calc(100% - 50px)' }, children: [_jsx("input", { 
                                        /* ref={this._catRef} */
                                        title: "Enter english abbreviation (max 50 characters)", maxLength: 50, placeholder: "English Abbreviation", value: engName, onChange: changeEngName, onKeyDown: keydownAbbr, style: { fontSize: 14 } }), txtfldDeleteButton(engName.length < 1, deleteEngName)] }), _jsx(IconButton, { title: "Find Term", size: "small", onClick: async () => loadWordOfEng(engName), style: { marginLeft: '5px' }, disabled: disableFindAbbr(), children: _jsx(AiOutlineSearch, { style: {
                                        color: disableFindAbbr()
                                            ? 'var(--ankus-disable-color)'
                                            : 'var(--jp-ui-font-color1)'
                                    } }) })] }), _jsxs("div", { className: "ankus-term-setting-input", style: { width: 'calc(100% - 17px)' }, children: [_jsx("input", { 
                                /* ref={this._catRef} */
                                title: "Enter english full name (max 200 characters)", maxLength: 200, placeholder: "English Full Name", value: engFullname, onChange: e => {
                                    setEngFullname(e.target.value);
                                    setDirty(true);
                                }, style: { fontSize: 14, height: '30px' } }), txtfldDeleteButton(engFullname.length < 1, deleteEngDesc)] }), _jsxs("div", { className: "ankus-term-setting-input align-vt-center", style: { width: 'calc(100% - 17px)', margin: '10px 0 13px 0' }, children: [_jsx("textarea", { placeholder: "Description", title: "Enter description (max 300 characters)", onChange: e => {
                                    setDesc(e.target.value);
                                    setDirty(true);
                                }, maxLength: 300, style: {
                                    fontSize: 15,
                                    fontFamily: 'Noto Sans',
                                    width: 'calc(100% - 30px)',
                                    height: '68px',
                                    padding: '4px 2px',
                                    color: 'var(--jp-ui-font-color0)',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    resize: 'none'
                                }, value: desc }), txtfldDeleteButton(desc.length < 1, deleteDesc)] })] }), _jsxs("div", { className: btnContainerStyle, children: [_jsx(Button, { "aria-label": "add", title: "Add Term", size: "small", variant: "outlined", color: "primary", style: {
                            color: 'white',
                            backgroundColor: fulfillRequired()
                                ? 'var(--ankus-control-color)'
                                : 'var(--ankus-disable-color)'
                        }, disabled: !fulfillRequired(), onClick: async () => onClickAdd(), children: "Add" }), _jsx(Button, { title: "Update Term", size: "small", variant: "outlined", color: "primary", style: {
                            margin: '0 18px 0 10px',
                            color: 'white',
                            backgroundColor: disableUpdate()
                                ? 'var(--ankus-disable-color)'
                                : 'var(--ankus-control-color)'
                        }, disabled: disableUpdate(), onClick: async (e) => updateWord(), children: "Update" })] })] }));
};
//# sourceMappingURL=standardTermSetting.js.map