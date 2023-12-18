import React from 'react';
import { CodeObject } from '../doc/docModel';
import '../../style/codelist.css';
interface ICodelistProp {
    logout: () => void;
}
interface IListState {
    searchOption: string;
    order: string;
    page: number;
    errMsg: string;
    orderOption: string;
    selCode?: CodeObject;
    loading: boolean;
}
type SearchOption = {
    name: string;
    label: string;
    guide: string;
};
export declare class CodelistWidget extends React.Component<ICodelistProp, IListState> {
    SEARCH_OPTION: Array<SearchOption>;
    constructor(props: any);
    private _codeList;
    private _codeSize;
    private _pageSize;
    private _searchKeyword;
    private _searchResultDesc;
    private resultStyle;
    private selectCode;
    getSearchKeywords(): Array<string>;
    private prevPage;
    private nextPage;
    refresh(): void;
    resultMessage(keyword: string): string;
    private searchCode;
    changeSearchOption: (e: any) => void;
    changeSearchKeyword: (e: any) => void;
    changeOrderOption: (e: any) => void;
    changeOrder: (e: any) => void;
    newCode: (e: any) => void;
    private __selectStyle;
    private __searchInputStyle;
    render(): React.ReactElement;
}
export {};
