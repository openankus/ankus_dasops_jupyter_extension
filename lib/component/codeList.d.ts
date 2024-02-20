/// <reference types="react-addons-linked-state-mixin" />
import React from 'react';
import { ShareCode } from '../ankusCommon';
import '../../style/codelist.css';
declare enum CodeView {
    simple = 0,
    detail = 1
}
interface ICodelistProp {
    logout: () => void;
}
type SearchOption = {
    name: string;
    label: string;
    guide: string;
};
export declare class CodelistWidget extends React.Component<ICodelistProp, any> {
    SEARCH_OPTION: Array<SearchOption>;
    constructor(props: any);
    private _errMsg;
    private _codeList;
    private _searchKeyword;
    SearchResult: import("styled-components").IStyledComponent<"web", import("styled-components/dist/types").FastOmit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, never>>;
    ViewButton: import("styled-components").IStyledComponent<"web", import("styled-components/dist/types").FastOmit<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, never>>;
    CodeList: import("styled-components").IStyledComponent<"web", import("styled-components/dist/types").FastOmit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>, never>>;
    get selectedCode(): ShareCode.CodeProperty | undefined;
    openCodeProp(): Promise<void>;
    openRenameDlg(): void;
    private clbkSelectCode;
    private clbkCloseProp;
    private clbkCloseRename;
    getSearchKeywords(): Array<string>;
    private prevPage;
    private nextPage;
    refresh(): void;
    resultMessage(keyword: string, count: number): string;
    private searchCode;
    changeSearchOption: (e: any) => void;
    changeSearchKeyword: (e: any) => void;
    changeOrderOption: (e: any) => void;
    changeOrder: (e: any) => void;
    changeCodeView: (viewType: CodeView) => void;
    private __selectStyle;
    private __searchInputStyle;
    render(): React.ReactElement;
}
export {};
