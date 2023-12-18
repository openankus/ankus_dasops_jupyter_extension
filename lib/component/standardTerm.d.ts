import React from 'react';
import { StandardTermPart } from '../ankusCommon';
import '../../style/standardterm.css';
interface IListState {
    searchOption: string;
    searchResult: string;
    keyword: string;
    asc: boolean;
    orderOption: string;
    editCat: boolean;
    category: number;
    categories: Array<StandardTermPart.Category>;
    catDlg: boolean;
    loading: boolean;
    format: string;
}
export declare class StandardTerm extends React.Component<any, IListState> {
    constructor(props: any);
    private _termList;
    private __searchResultStyle;
    private smallTitleStyle;
    private fmtSelectStyle;
    private __searchInputStyle;
    private selectWord;
    private loadCategories;
    private searchTerm;
    private changeCategory;
    private changeFormat;
    changeOrderOption: (orderCol: string) => void;
    render(): React.ReactElement;
}
export {};
