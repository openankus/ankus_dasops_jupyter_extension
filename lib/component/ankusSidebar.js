import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ReactWidget } from '@jupyterlab/apputils';
import * as React from 'react';
import { style } from 'typestyle';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { MdKeyboardArrowRight, MdKeyboardArrowDown, MdSettings } from 'react-icons/md';
import '../../style/sidebar.css';
import ankusBg from '../../style/images/ankusbg.png';
import { CodelistWidget } from './codeList';
import { Ankus } from '../ankusCommon';
import { StandardTerm } from './standardTerm';
export const LoginMessage = 'ankus-login:';
var LoginState;
(function (LoginState) {
    LoginState[LoginState["logout"] = 0] = "logout";
    LoginState[LoginState["logging"] = 1] = "logging";
    LoginState[LoginState["logged"] = 2] = "logged";
})(LoginState || (LoginState = {}));
//const centerStyle = {
//display: 'flex'
// justifyContent: 'center',
// alignItems: 'center'
//};
function AnkusView(props) {
    const [loginState, login] = React.useState(LoginState.logout);
    const [loginID, setId] = React.useState(props.loginID);
    const [passwd, setPasswd] = React.useState('');
    const [remID, remember] = React.useState(props.remID);
    const [url, setUrl] = React.useState(props.url);
    const [errmsg, loginFail] = React.useState('');
    const [collapsed, collapsePane] = React.useState(false);
    let _inputRef;
    //      MessageLoop.postMessage(ankusWidget, new Message(LoginMessage));
    const loginStyle = {
        marginLeft: '14px',
        paddingTop: '34px',
        width: '250px'
    };
    const imgStyle = {
        marginLeft: '15px'
    };
    const standardTitleClass = style({
        //    fontSize: '12px',
        //  fontFamily: 'system-ui',
        margin: 0,
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: 'var(--jp-layout-color1)',
        borderTop: '2px solid var(--jp-border-color1)'
    });
    const clickLogin = () => {
        /*    const form = document.createElement('form');
        form.action = ANKUS_URL + '/share-code/login';
        form.method = 'post';
        form.style.display = 'none';
        document.body.appendChild(form);
    
        const id = document.createElement('input');
        id.value = loginID;
        id.type = 'text';
        id.name = 'username';
        form.appendChild(id);
    
        const pass = document.createElement('input');
        pass.value = passwd;
        pass.type = 'password';
        pass.name = 'password';
        form.appendChild(pass);
    
        const submit = document.createElement('input');
        submit.type = 'submit';
        form.appendChild(submit);
        submit.click();
    */
        let u = url.trim();
        const regex = /^https?:\/\/.+/;
        if (u.match(regex) === null) {
            u = 'http://' + u;
            setUrl(u);
        }
        login(LoginState.logging);
        fetch(u + '/share-code/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: loginID, password: passwd })
        })
            .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error(`${response.status}`);
            }
        })
            .then(response => {
            Ankus.ankusPlugin.login({
                token: response['token'],
                idx: response['id'],
                name: response['name'],
                loginId: loginID,
                admin: response['admin']
            }, remID, u);
            login(LoginState.logged);
        })
            .catch(error => {
            loginFail(error.message === '404' ? '로그인 실패' : '네트워크 오류');
            login(LoginState.logout);
        });
        /*    const form = new FormData();
        form.append('username', loginID);
        form.append('password', passwd);
    
        const response = await axios.post(ANKUS_URL + '/share-code/login', form, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
    */
    };
    // code list
    if (loginState === LoginState.logged) {
        return (
        //<React.Fragment>
        //<CodelistWidget />
        //</React.Fragment>
        _jsxs(Allotment, { vertical: true, children: [_jsx(Allotment.Pane, { minSize: 350, children: _jsx(CodelistWidget, { logout: () => login(LoginState.logout) }) }), _jsxs(Allotment.Pane, { preferredSize: "30%", minSize: collapsed ? 20 : 200, maxSize: collapsed ? 20 : 500, children: [_jsxs("div", { className: standardTitleClass, children: [_jsxs("button", { className: "ankus-term-title-btn", onClick: () => {
                                        collapsePane(collapsed => !collapsed);
                                    }, title: collapsed ? 'Expand Dictionary' : 'Collapse Dictionary', children: [collapsed ? _jsx(MdKeyboardArrowRight, {}) : _jsx(MdKeyboardArrowDown, {}), "Dictionary"] }), _jsx("button", { title: "Setting", className: "ankus-term-title-btn", onClick: () => Ankus.ankusPlugin.openStdtermSetting(undefined), children: _jsx(MdSettings, {}) })] }), _jsx(StandardTerm, {})] })] }));
    } //code list
    //login page
    else {
        return (_jsxs("div", { style: loginStyle, children: [_jsx("img", { src: ankusBg, style: imgStyle }), _jsx("input", { className: "inputLogin inpID", type: "text", placeholder: "ID", value: loginID, onChange: evt => setId(evt.target.value), onKeyDown: e => {
                        if (e.key === 'Enter') {
                            if (loginID.length !== 0) {
                                _inputRef.focus();
                            }
                        } //if : enter
                    } }), _jsx("input", { className: "inputLogin inpPw", type: "password", placeholder: "Password", onChange: evt => setPasswd(evt.target.value), onKeyDown: e => {
                        if (e.key === 'Enter') {
                            if (loginID.length !== 0 && passwd.length !== 0) {
                                clickLogin();
                            }
                        } //if : enter
                    }, ref: c => {
                        _inputRef = c;
                    } }), _jsx("div", { className: "remstyle", children: _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: remID, onChange: e => {
                                    remember(e.target.checked);
                                } }), _jsx("p", { style: { margin: '2px 0 0 2px' }, children: "Remember" })] }) }), _jsx("button", { className: "btnLogin", disabled: loginState !== LoginState.logout ||
                        !loginID ||
                        !passwd ||
                        url.trim().length < 1, onClick: clickLogin, children: "Login" }), _jsx("div", { className: "errmsg", children: errmsg }), _jsx("input", { className: "inputLogin inputUrl", style: { width: '195px' }, type: "text", placeholder: "ankus URL", title: "Enter ankus server URL(http://ankus.com)", value: url, onChange: evt => setUrl(evt.target.value) }), _jsx("div", { className: "ankus-ui-text", style: { marginLeft: '43px' }, children: _jsx("a", { href: url, target: "_blank", children: "Go to ankus website" }) })] }));
    }
} //LoginElement
export class AnkusSidebar extends ReactWidget {
    constructor(loginID, remID, url) {
        super();
        this._loginID = loginID;
        this._remID = remID;
        this._url = url;
    }
    render() {
        return (_jsx("div", { className: "ankus-container", style: { height: '100%' }, children: _jsx(AnkusView, { loginID: this._loginID, remID: this._remID, url: this._url }) }));
    } //render
} //AnkusSidebar
//# sourceMappingURL=ankusSidebar.js.map