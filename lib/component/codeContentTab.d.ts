import React from 'react';
import '../../style/codecontent.css';
import { NotebookPlugin } from '../notebookAction';
export interface ICodeCell {
    data: Array<NotebookPlugin.CellData>;
    edit: Array<boolean>;
    selectedCell: number;
    onChangeCell: (rowIdx: number, value: string) => void;
    onSelectCell: (idx: number) => void;
    onChangeCellEditMode: () => void;
    onFocusCellEditor: (ref: HTMLTextAreaElement) => void;
}
export declare class CodeContentTab extends React.Component<ICodeCell> {
    constructor(props: ICodeCell);
    renderCell: (value: string, row: number) => import("react/jsx-runtime").JSX.Element;
    tableKeydown: (event: React.KeyboardEvent<HTMLTableElement>) => boolean;
    private _headerStyle;
    private _noStyle;
    render(): React.ReactElement;
    private _focusCelref;
}
interface ICodeCellEditor {
    defaultValue: string;
    clazzName: string;
    idx: number;
    onBeginEdit: (ref: HTMLTextAreaElement) => void;
    onEndEdit: (idx: number, value: string) => void;
}
export declare class CodeCellEditor extends React.Component<ICodeCellEditor, any> {
    private _ref;
    constructor(props: ICodeCellEditor);
    shouldComponentUpdate(nextProps: Readonly<ICodeCellEditor>, nextState: Readonly<any>, nextContext: any): boolean;
    render(): React.ReactElement;
}
export {};
