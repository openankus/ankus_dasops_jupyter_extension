/// <reference types="react" />
import { ReactWidget } from '@jupyterlab/apputils';
import 'allotment/dist/style.css';
import '../../style/sidebar.css';
export declare const LoginMessage = "ankus-login:";
export declare class AnkusSidebar extends ReactWidget {
    private _loginID;
    private _remID;
    private _url;
    constructor(loginID: string, remID: boolean, url: string);
    render(): JSX.Element;
}
