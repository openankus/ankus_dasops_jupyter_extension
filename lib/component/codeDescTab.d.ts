import React from 'react';
import '../../style/codedesc.css';
import { ShareCode } from '../ankusCommon';
import { NotebookPlugin } from '../notebookAction';
export interface IRenameProps {
    open: boolean;
    name: string;
    onClose: (name: string) => void;
}
export declare const RenameDialog: React.FunctionComponent<IRenameProps>;
export interface ICodeDescProps {
    open: boolean;
    editable: boolean;
    prop: ShareCode.CodeProperty;
    content: NotebookPlugin.CellData[];
    onClose: (save: boolean, taglist?: Array<string>, desc?: string) => void;
}
export declare class CodePropDlg extends React.Component<ICodeDescProps, any> {
    constructor(props: ICodeDescProps);
    componentDidUpdate(prevProps: ICodeDescProps): void;
    private DialogTitle;
    private DialogContent;
    private DialogActions;
    private DelButton;
    tagBoxStyle: string;
    private codePreview;
    clbkUpdateTag: (idx: number, value: string) => boolean;
    clbkEndEditTag: (idx: number, tag: string) => void;
    buttonCell: (row: number) => import("react/jsx-runtime").JSX.Element | "";
    private isNewTag;
    private closeDlg;
    render(): React.ReactElement;
}
