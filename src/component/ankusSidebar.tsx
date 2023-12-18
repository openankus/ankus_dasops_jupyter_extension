import { ReactWidget } from '@jupyterlab/apputils';
import * as React from 'react';
import { style } from 'typestyle';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import {
  MdKeyboardArrowRight,
  MdKeyboardArrowDown,
  MdSettings
} from 'react-icons/md';

import '../../style/sidebar.css';
import ankusBg from '../../style/images/ankusbg.png';

import { CodelistWidget } from './codeList';
import { Ankus } from '../ankusCommon';
import { StandardTerm } from './standardTerm';

export const LoginMessage = 'ankus-login:';

interface ILoginProps {
  loginID: string;
  remID: boolean;
  url: string;
}

enum LoginState {
  logout,
  logging,
  logged
}

//const centerStyle = {
//display: 'flex'
// justifyContent: 'center',
// alignItems: 'center'
//};

function AnkusView(props: ILoginProps) {
  const [loginState, login] = React.useState(LoginState.logout);
  const [loginID, setId] = React.useState(props.loginID);
  const [passwd, setPasswd] = React.useState('');
  const [remID, remember] = React.useState(props.remID);

  const [url, setUrl] = React.useState(props.url);
  const [errmsg, loginFail] = React.useState('');
  const [collapsed, collapsePane] = React.useState(false);

  let _inputRef: HTMLInputElement | null;

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
        } else {
          throw new Error(`${response.status}`);
        }
      })
      .then(response => {
        Ankus.ankusPlugin.login(
          {
            token: response['token'],
            idx: response['id'],
            name: response['name'],
            loginId: loginID,
            admin: response['admin']
          },
          remID,
          u
        );
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

      <Allotment vertical>
        <Allotment.Pane minSize={350}>
          <CodelistWidget logout={() => login(LoginState.logout)} />
        </Allotment.Pane>
        <Allotment.Pane
          preferredSize="30%"
          minSize={collapsed ? 20 : 200}
          maxSize={collapsed ? 20 : 500}
        >
          {/* standard term title */}
          <div className={standardTitleClass}>
            <button
              className="ankus-term-title-btn"
              onClick={() => {
                collapsePane(collapsed => !collapsed);
              }}
              title={collapsed ? 'Expand Dictionary' : 'Collapse Dictionary'}
            >
              {collapsed ? <MdKeyboardArrowRight /> : <MdKeyboardArrowDown />}
              Dictionary
            </button>

            <button
              title="Setting"
              className="ankus-term-title-btn"
              onClick={() => Ankus.ankusPlugin.openStdtermSetting(undefined)}
            >
              <MdSettings />
            </button>
          </div>
          <StandardTerm />
        </Allotment.Pane>
      </Allotment>
    );
  } //code list

  //login page
  else {
    return (
      <div style={loginStyle}>
        <img src={ankusBg} style={imgStyle} />
        <input
          className="inputLogin inpID"
          type="text"
          placeholder="ID"
          value={loginID}
          onChange={evt => setId(evt.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              if (loginID.length !== 0) {
                _inputRef!.focus();
              }
            } //if : enter
          }}
        ></input>
        <input
          className="inputLogin inpPw"
          type="password"
          placeholder="Password"
          onChange={evt => setPasswd(evt.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              if (loginID.length !== 0 && passwd.length !== 0) {
                clickLogin();
              }
            } //if : enter
          }}
          ref={c => {
            _inputRef = c;
          }}
        ></input>
        <div className="remstyle">
          <label>
            <input
              type="checkbox"
              checked={remID}
              onChange={e => {
                remember(e.target.checked);
              }}
            ></input>
            <p style={{ margin: '2px 0 0 2px' }}>Remember</p>
          </label>
        </div>

        {/* login */}
        <button
          className="btnLogin"
          disabled={
            loginState !== LoginState.logout ||
            !loginID ||
            !passwd ||
            url.trim().length < 1
          }
          onClick={clickLogin} //onclick
        >
          Login
        </button>
        <div className="errmsg">{errmsg}</div>

        <input
          className="inputLogin inputUrl"
          style={{ width: '195px' }}
          type="text"
          placeholder="ankus URL"
          title="Enter ankus server URL(http://ankus.com)"
          value={url}
          onChange={evt => setUrl(evt.target.value)}
        ></input>

        {/* <TextField
          style={{
            width: '220px'
          }}
          InputLabelProps={{
            style: { color: 'var(--jp-cell-editor-border-color)' }
          }}
          inputProps={{
            style: {
              fontSize: 14,
              color: 'var(--jp-ui-font-color0)'
            }
          }}
        /> */}
        <div className="ankus-ui-text" style={{ marginLeft: '43px' }}>
          <a href={url} target="_blank">
            Go to ankus website
          </a>
        </div>
      </div>
    );
  }
} //LoginElement

export class AnkusSidebar extends ReactWidget {
  private _loginID: string;
  private _remID: boolean;
  private _url: string;

  constructor(loginID: string, remID: boolean, url: string) {
    super();

    this._loginID = loginID;
    this._remID = remID;
    this._url = url;
  }

  render(): JSX.Element {
    return (
      <div className="ankus-container" style={{ height: '100%' }}>
        <AnkusView
          loginID={this._loginID}
          remID={this._remID}
          url={this._url}
        />
      </div>
    );
  } //render
} //AnkusSidebar
