/**
 * Initialization data for the jupyter_ankus extension.
 */
/* const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyter_ankus:plugin',
  description: 'ankus JupyterLab extension.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyter_ankus is activated!');
  }
};

export default plugin; */
import { INotebookTracker, NotebookActions, NotebookPanel } from '@jupyterlab/notebook';
import { IStateDB } from '@jupyterlab/statedb';
import { IStatusBar } from '@jupyterlab/statusbar';
import { addIcon, notebookIcon, copyIcon } from '@jupyterlab/ui-components';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { IThemeManager } from '@jupyterlab/apputils';
import { AnkusSidebar } from './component/ankusSidebar';
import { CodeProperty } from './doc/docModel';
import { createCommands, CommandID } from './ankusCommands';
import '../style/sidebar.css';
import { Ankus, ANKUS_EXT_ID, ANKUS_ICON, StandardTermPart } from './ankusCommon';
/**
 * Initialization data for the jupyter_ankus extension.
 */
const extension = {
    id: ANKUS_EXT_ID,
    autoStart: true,
    requires: [IStateDB, IStatusBar, INotebookTracker, IMainMenu, IThemeManager],
    //  optional: [ILayoutRestorer],
    activate
};
export default extension;
async function activate(app, state, statusBar, tracker, 
//  filebrowser: IFileBrowserFactory,
mainmenu, theme
//  completMgr: ICompletionManager,
) {
    console.log('JupyterLab extension jupyter_ankus is activated!');
    /*  tracker.widgetAdded.connect(
      (sender: INotebookTracker, panel: NotebookPanel) => {
        let editor = panel.content.activeCell?.editor ?? null;
        const session = panel.sessionContext.session;
        const options = { session, editor };
        const connector = new CompletionConnector([]);
        const handler = completMgr.register({
          connector,
          editor,
          parent: panel
        });
  
        const updateConnector = () => {
          editor = panel.content.activeCell?.editor ?? null;
          options.session = panel.sessionContext.session;
          options.editor = editor;
          handler.editor = editor;
  
          const kernel = new KernelConnector(options);
          const context = new ContextConnector(options);
          const custom = new CustomConnector(options);
          handler.connector = new CompletionConnector([kernel, context, custom]);
        };
  
        // Update the handler whenever the prompt or session changes
        panel.content.activeCellChanged.connect(updateConnector);
        panel.sessionContext.sessionChanged.connect(updateConnector);
      }
    );
  
    // Add notebook completer command.
    app.commands.addCommand('completer:invoke-notebook', {
      execute: () => {
        const panel = tracker.currentWidget;
        if (panel && panel.content.activeCell?.model.type === 'code') {
          return app.commands.execute('completer:invoke', { id: panel.id });
        }
      }
    });
  */
    createCommands(app, mainmenu);
    //add share code
    app.commands.addCommand(CommandID.addCode.id, {
        label: CommandID.addCode.label,
        icon: addIcon,
        isEnabled: () => {
            const panel = tracker.currentWidget;
            if (panel === null ||
                panel.content.activeCell === null ||
                !(app.shell.currentWidget instanceof NotebookPanel)) {
                return false;
            }
            const itr = panel.content.children();
            let wg;
            let txt = '';
            while ((wg = itr.next().value) !== undefined) {
                //selected  code, markdown
                if (wg.hasClass('jp-mod-selected') &&
                    (wg.hasClass('jp-CodeCell') || wg.hasClass('jp-MarkdownCell'))) {
                    txt += wg.model.sharedModel.getSource(); //.toJSON().source.toString(); //ver4//.value.text;
                }
            }
            //cell is not empty
            return txt.length !== 0;
        },
        execute: async (event) => {
            //notebook name
            const title = tracker.currentWidget.title.label.replace('.ipynb', '');
            //cell list
            const itr = tracker.currentWidget.content.children();
            let wg;
            const content = [];
            while ((wg = itr.next().value) !== undefined) {
                //selected  cell
                if (wg.hasClass('jp-mod-selected')) {
                    //cell text
                    const txt = wg.model.sharedModel.getSource().trim(); //ver4//.value.text.trim();
                    if (txt.length !== 0) {
                        //code
                        if (wg.hasClass('jp-CodeCell')) {
                            content.push({
                                source: wg.model.sharedModel.getSource(),
                                cell_type: 'code'
                            });
                        }
                        //markdown
                        else if (wg.hasClass('jp-MarkdownCell')) {
                            content.push({
                                source: wg.model.sharedModel.getSource(),
                                cell_type: 'markdown'
                            });
                        }
                    } //if : text is not empty
                } //if : selected
            } //while : cell list
            const data = {};
            data[CodeProperty.name] = title;
            data[CodeProperty.userNo] = Ankus.userNumber;
            data[CodeProperty.content] = content;
            data[CodeProperty.tag] = [title];
            fetch(Ankus.ankusURL + '/share-code/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: Ankus.loginToken,
                    code: data
                })
            })
                .then(response => {
                if (!response.ok) {
                    throw new Error('Fail');
                }
                else {
                    //update code list
                    Ankus.ankusPlugin.updateCodelist();
                }
            })
                .catch(error => {
                alert('공유 코드 추가 오류');
            });
        } //execute
    }); //add Code
    //copy cells
    app.commands.addCommand(CommandID.copyCell.id, {
        label: CommandID.copyCell.label,
        icon: copyIcon,
        isEnabled: () => {
            const panel = tracker.currentWidget;
            if (panel === null ||
                panel.content.activeCell === null ||
                !(app.shell.currentWidget instanceof NotebookPanel)) {
                return false;
            }
            const itr = panel.content.children();
            let wg;
            let txt = '';
            while ((wg = itr.next().value) !== undefined) {
                //selected cell
                if (wg.hasClass('jp-mod-selected')) {
                    txt += wg.model.sharedModel.getSource(); //ver4//.value.text; //cell text
                }
            }
            //cell is not empty
            return txt.length !== 0;
        },
        execute: async (event) => {
            //cell list
            const itr = tracker.currentWidget.content.children();
            let wg;
            const cells = [];
            while ((wg = itr.next().value) !== undefined) {
                //selected code cell
                if (wg.hasClass('jp-mod-selected')) {
                    //cell text
                    const txt = wg.model.sharedModel.getSource().trim(); //ver4//.value.text.trim();
                    if (txt.length !== 0) {
                        //code
                        if (wg.hasClass('jp-CodeCell')) {
                            cells.push({
                                cell_type: 'code',
                                source: wg.model.sharedModel.getSource() //ver4//.value.text
                            });
                        }
                        //markdown
                        else if (wg.hasClass('jp-MarkdownCell')) {
                            cells.push({
                                cell_type: 'markdown',
                                source: wg.model.sharedModel.getSource() //ver4//.value.text
                            });
                        }
                    } //if : text is not empty
                } //if : selected
            } //while : cell list
            Ankus.ankusPlugin.copyCells(cells);
        } //execute
    }); //copy cells
    //open notebook
    app.commands.addCommand(CommandID.openNtbk.id, {
        label: CommandID.openNtbk.label,
        icon: notebookIcon,
        execute: async (args) => {
            //get code detail
            fetch(Ankus.ankusURL +
                '/share-code/view?token=' +
                Ankus.loginToken +
                '&codeId=' +
                args['id'])
                .then(response => {
                //check response
                if (response.ok) {
                    return response.json();
                }
                else {
                    throw new Error('Fail');
                }
            })
                .then(codedat => {
                var _a;
                //new notebook
                app.commands
                    .execute('notebook:create-new', {
                    //cwd: filebrowser.defaultBrowser.model.path,
                    kernelName: (_a = app.serviceManager.kernelspecs.specs) === null || _a === void 0 ? void 0 : _a.default
                })
                    .then(response => {
                    //check new notebook response
                    Promise.all([
                        response.revealed,
                        response.sessionContext.ready
                    ]).then(() => {
                        //notebook
                        const note = tracker.currentWidget.content;
                        //code content
                        const celldat = codedat[CodeProperty.content];
                        //cell data list
                        celldat.forEach((dat, idx) => {
                            //if (idx !== 0) {
                            //새로운 셀 추가
                            NotebookActions.insertBelow(note);
                            //markdown
                            if (dat.cell_type === 'markdown') {
                                //app.commands.execute('notebook:change-cell-to-markdown');
                                NotebookActions.changeCellType(note, 'markdown');
                            }
                            //셀에 코드 삽입
                            note.activeCell.model.sharedModel.setSource(dat.source); //ver4//.value.text = dat.source;
                        }); //cell data list
                        //render markdown
                        NotebookActions.renderAllMarkdown(note);
                    }); //promise-then : new notebook response
                }); //command execute-then : new notebook
            }) //fetch-then : get code detail
                .catch(error => {
                alert('공유 코드 가져오기 오류');
            });
        } //execute
    }); //open notebook
    //insert code into notebook
    app.commands.addCommand(CommandID.insertCode.id, {
        label: CommandID.insertCode.label,
        icon: addIcon,
        //enable/disable
        isEnabled: () => tracker.currentWidget !== null &&
            tracker.currentWidget.content.activeCell !== null &&
            app.shell.currentWidget instanceof NotebookPanel,
        //execute function
        execute: async (args) => {
            //get code detail
            fetch(Ankus.ankusURL +
                '/share-code/view?token=' +
                Ankus.loginToken +
                '&codeId=' +
                args['id'])
                .then(response => {
                //check response
                if (response.ok) {
                    return response.json();
                }
                else {
                    throw new Error('Fail');
                }
            })
                .then(response => {
                //앵커스 코드 정보 표시
                const desc = '## ankus Share Code - ' +
                    response[CodeProperty.name] +
                    //코드 설명이 있을 경우
                    (response[CodeProperty.comment] !== null //코드 설명에 줄바꿈이 있을 때
                        ? '\n> ' + response[CodeProperty.comment].replace('\n', '   ')
                        : '');
                //notebook
                const note = tracker.currentWidget.content;
                //아래 셀 추가
                NotebookActions.insertBelow(note);
                //셀에 설명 삽입
                note.activeCell.model.sharedModel.setSource(desc); //ver4//.value.text = desc;
                //render markdown
                app.commands.execute('notebook:change-cell-to-markdown');
                app.commands.execute('notebook:run-cell');
                //code content
                const celldat = response[CodeProperty.content];
                //cell data list
                celldat.forEach((dat, idx) => {
                    //아래 셀 추가
                    NotebookActions.insertBelow(note);
                    //markdown
                    if (dat.cell_type === 'markdown') {
                        //셀에 코드 삽입
                        note.activeCell.model.sharedModel.setSource(dat.source); //ver4//.value.text = dat.source;
                        //render markdown
                        app.commands.execute('notebook:change-cell-to-markdown');
                        app.commands.execute('notebook:run-cell');
                    }
                    else {
                        //셀에 코드 삽입
                        note.activeCell.model.sharedModel.setSource(dat.source); //ver4//.value.text = dat.source;
                    }
                }); //cell data list
            }) //get code detail - response
                .catch(error => {
                alert('공유 코드 가져오기 오류');
            });
        } //execute
    }); //addCommand - insert code into notebook
    /*  const namespace = 'ankus-documents';
    const FACTORY = 'ankus editor';
    // Creating the tracker for the document
    const tracker = new WidgetTracker<AnkusDocWidget>({ namespace });
  
    const widgetFactory = new AnkusWidgetFactory({
      name: FACTORY,
      modelName: 'ankus-model',
      fileTypes: ['ankus']
    });
  
    widgetFactory.widgetCreated.connect((sender, widget) => {
      // Notify the instance tracker if restore data needs to update.
      widget.context.pathChanged.connect(() => {
        tracker.save(widget);
      });
      tracker.add(widget);
    });
    app.docRegistry.addWidgetFactory(widgetFactory);
  */
    // theme.themeChanged.connect((sender: IThemeManager, args: any) => {
    //   Ankus.themeIsLight = sender.isLight(args.newValue);
    // });
    Ankus.initialize(app, state, statusBar, tracker);
    // Load the saved plugin state and apply it once the app
    // has finished restoring its former layout.
    state.fetch(ANKUS_EXT_ID).then(value => {
        let usr = '';
        let rem = false;
        let url = '';
        if (value) {
            const settings = value;
            //remember id
            rem = settings['remID'];
            if (rem) {
                //user id
                usr = settings['loginID'];
            }
            url = settings['serverURL'];
            //standard term category
            const cat = settings['stdTermCategory'];
            Ankus.stdtermCategory = cat === undefined ? 0 : cat;
            //standard term format
            const fmt = settings['stdTermFormat'];
            Ankus.stdtermFormat =
                fmt === undefined ? StandardTermPart.Format.upper : fmt;
        } //if : check state value
        const sidebar = new AnkusSidebar(usr, rem, url);
        sidebar.id = 'jupyter-ankus-sessions';
        sidebar.title.icon = ANKUS_ICON;
        sidebar.title.iconClass = 'ankus-sidebar-icon';
        sidebar.title.caption = 'ankus';
        app.shell.add(sidebar, 'left', { rank: 501 });
    }); //state db
} //activate
//# sourceMappingURL=index.js.map