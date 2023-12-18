import { JupyterFrontEnd } from '@jupyterlab/application';
import { Menu } from '@lumino/widgets';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { CodeObject } from './doc/docModel';
export declare const CommandID: {
    newCodeCell: {
        id: string;
        label: string;
    };
    newMarkdown: {
        id: string;
        label: string;
    };
    deleteCell: {
        id: string;
        label: string;
    };
    pasteCell: {
        id: string;
        label: string;
    };
    editCell: {
        id: string;
        label: string;
    };
    renderCell: {
        id: string;
        label: string;
    };
    addCode: {
        id: string;
        label: string;
    };
    copyCell: {
        id: string;
        label: string;
    };
    stdtrmAutoComplete: {
        id: string;
        label: string;
    };
    openNtbk: {
        id: string;
        label: string;
    };
    openCode: {
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
    saveCode: {
        id: string;
        label: string;
    };
};
export declare function createCommands(app: JupyterFrontEnd, mainmenu: IMainMenu): void;
export declare const codeContextMenu: (code: CodeObject) => Menu;
