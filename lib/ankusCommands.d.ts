import { JupyterFrontEnd } from '@jupyterlab/application';
import { IMainMenu } from '@jupyterlab/mainmenu';
export declare const CommandID: {
    renderCell: {
        id: string;
        label: string;
    };
    addCode: {
        id: string;
        label: string;
    };
    updateCode: {
        id: string;
        label: string;
    };
    stdtrmAutoComplete: {
        id: string;
        label: string;
    };
    selectCodeItem: {
        id: string;
        label: string;
    };
    openNtbk: {
        id: string;
        label: string;
    };
    renameCode: {
        id: string;
        label: string;
    };
    codeProp: {
        id: string;
        label: string;
    };
    duplicCode: {
        id: string;
        label: string;
    };
    deleteCode: {
        id: string;
        label: string;
    };
    insertCode: {
        id: string;
        label: string;
    };
    simpleList: {
        id: string;
        label: string;
    };
    detailList: {
        id: string;
        label: string;
    };
};
export declare function createCommands(app: JupyterFrontEnd, mainmenu: IMainMenu): void;
