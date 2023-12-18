/// <reference types="react" />
import { ReactWidget } from '@jupyterlab/apputils';
import { StandardTermPart } from '../ankusCommon';
import '../../style/standardterm.css';
export declare class StandardTermSetting extends ReactWidget {
    constructor(word: StandardTermPart.Word | undefined);
    private _word;
    private _category;
    setSelection(word: StandardTermPart.Word, cat: number): void;
    render(): JSX.Element;
}
