import { ReactWidget } from '@jupyterlab/apputils';
import { Signal } from '@lumino/signaling';
import { DocumentWidget } from '@jupyterlab/docregistry';
import { Message } from '@lumino/messaging';
import Tooltip from '@material-ui/core/Tooltip';
import { style } from 'typestyle';
import { Widget } from '@lumino/widgets';

import { Ankus, ShareCode } from '../ankusCommon';
import * as AnkusDoc from '../doc/docModel';
import { CodeContentTab } from './codeContentTab';

import '../../style/codeedit.css';

export class AnkusDocWidget extends DocumentWidget<
  AnkusCodeEditor,
  AnkusDoc.AnkusDocModel
> {
  constructor(
    options: DocumentWidget.IOptions<AnkusCodeEditor, AnkusDoc.AnkusDocModel>
  ) {
    super(options);
  }

  dispose(): void {
    this.content.dispose();
    super.dispose();
  }
}

//import styled from 'styled-components';
/* const StyledCloseBtn = styled.div`
  color: blue;
  cursor: pointer;
`;
 */

export class AnkusCodeEditor extends ReactWidget {
  //입력커서가 있는 셀
  private _edcelRef: HTMLTextAreaElement | null = null;

  constructor(doc: AnkusDoc.AnkusDocModel) {
    super();

    this._doc = doc;
    this.title.label = doc.codeName;

    if (doc.codeContent !== undefined) {
      //셀 편집 상태를 false로 초기화
      this._editCell = new Array(doc.codeContent.length);
      this._editCell.fill(false);
    }
    //코드 새로 만들기 -> 비어있는 셀 하나 추가
    else {
      this._doc.codeContent = [{ cell_type: 'code', source: '' }];
      this._editCell = [true];
    }

    this._doc.sharedModelChanged.connect(this._onContentChanged);
    this._doc.saved.connect(this._onSaved);
  }

  forceClose() {
    this._doc.dirty = false;
    this.parent?.close();
  }

  /* private saveConfirm() {
    <Dialog
      onClose={e => {
        this._askSave = false;
        this.update();
      }}
      open={this._askSave}
    >
      <DialogTitle>Save Code</DialogTitle>
      <DialogContent>
        <DialogContentText>
          '{this._doc.codeName}' changed. Save?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={e => this.setState({ openCatdlg: false })}>
          Cancel
        </Button>
        <Button onClick={e => this.setState({ openCatdlg: false })}>Yes</Button>
        <Button onClick={e => this.setState({ openCatdlg: false })}>No</Button>
      </DialogActions>
    </Dialog>;
  } */

  public prepareClose(): boolean {
    if (this._doc.dirty) {
      //confirm close
      if (!confirm('작업중인 편집창을 닫으시겠습니까?')) {
        return false;
      }

      //confirm save
      if (
        !confirm('"' + this._doc.codeName + '"의 변경 내용을 저장하시겠습니까?')
      ) {
        return true;
      }

      //content is empty
      if (
        this._doc.codeContent === undefined ||
        this._doc.codeContent.length < 1
      ) {
        alert('코드 내용이 비어있습니다.');
        return false;
      }

      //new code
      if (this._doc.codeId === undefined) {
        //prompt name
        const nm = prompt('코드명을 입력하세요.', this._doc.codeName);
        if (nm !== null && nm.trim().length > 0) {
          this._doc.codeName = nm.trim();
        }
      }

      this._doc.save();

      /* showDialog({
        title: 'save ankus-code',
        body: 'Save changes in "' + this._doc.codeName + '" before closing?',
        focusNodeSelector: 'button.jp-mod-accept',
        buttons: [
          Dialog.cancelButton(),
          Dialog.warnButton({ label: 'Discard' }),
          Dialog.okButton({ label: 'Save' })
        ]
      }).then(result => console.log(result)); */
    } //if : dirty
    return true;
  } //prepareClose

  protected onResize(msg: Widget.ResizeMessage): void {
    //this._contentH = msg.height - this._contentRef!.offsetTop - 30;
    this.update();
  }

  dispose(): void {
    if (this.isDisposed) {
      return;
    }
    this._doc.sharedModelChanged.disconnect(this._onContentChanged);
    Signal.clearData(this);
    super.dispose();
  }

  //private _context: DocumentRegistry.IContext<AnkusDocModel>;
  //private keyword = '';

  private _selectedTab = 'code';
  private _doc: AnkusDoc.AnkusDocModel;
  private _updateStatusbar = new Signal<this, ShareCode.CodeProperty>(this);
  private _editCell: Array<boolean> = [];
  private _selectedCell = 0;
  private _resetCode = false;
  //  private _ref: HTMLDivElement | null = null;

  private _onContentChanged = (
    sender: AnkusDoc.AnkusDocModel,
    change: AnkusDoc.AnkusDocChange
  ): void => {
    // Wrapping the updates into a flag to prevent apply changes triggered by the same client
    //if (change.codeChange !== undefined) {
    // updating the widgets to re-render it
    //this.update();
    //}

    this._doc.dirty = true;
    this.title.label = this._doc.codeName + '*';

    // updating the widgets to re-render it
    this.update();
  }; //_onContentChanged

  private _onSaved = (sender: AnkusDoc.AnkusDocModel, change: void): void => {
    this.update();
    Ankus.ankusPlugin.updateCodelist();

    console.log('editor title = ' + this._doc.codeName);
    this.title.label = this._doc.codeName; //change title

    //update status bar
    this._updateStatusbar.emit({
      id: this._doc.codeId,
      date: this._doc.updateDate,
      writer: this._doc.writer
    });
  }; //_onSaved

  addTag = (tag: string) => {
    if (this._doc.codeTag === undefined || this._doc.codeTag.length < 30) {
      this._doc.addTag(tag);
    }
  };

  delTag = (name: string) => {
    this._doc.deleteTag(name);
  };

  updateTag = (tag: string, idx: number) => {
    this._doc.updateTag(tag, idx);
  };

  updateComment = (comment: string) => {
    this._doc.setComment(comment);
  };

  //new empty cell
  newCell(type: string): void {
    //check code tab
    if (this._selectedTab === 'code') {
      const content = [...this._doc.codeContent];
      const editlist = [...this._editCell];

      //insert empty cell
      content.splice(this._selectedCell + 1, 0, {
        cell_type: type,
        source: ''
      });
      //set editable
      editlist.splice(this._selectedCell + 1, 0, true);

      //update content
      this._selectedCell++;
      this._editCell = editlist;
      this._doc.codeContent = content;
    }
  }

  //update content
  private updateContent = (idx: number, value: string) => {
    const content = this._doc.codeContent;
    content[idx]['source'] = value;
    this._doc.codeContent = content;
  };

  //shift code cell edit mode
  shiftEditMode = () => {
    if (this._selectedTab === 'code') {
      //현재 편집 중인 셀의 입력 포커스 제거
      //단축키 사용할 경우, 입력 포커스를 임의로 처리해서, 편집 완료 및 내용 저장 수행
      if (this._edcelRef) {
        this._edcelRef.blur();
        this._edcelRef = null;
      }
      //선택한 셀의 편집 모드 전환
      this._editCell[this._selectedCell] = !this._editCell[this._selectedCell];
    }
    //화면 갱신
    this.update();
  }; //shiftEditMode

  onAfterShow(msg: Message): void {
    Ankus.ankusPlugin.connectStatusbar(this._updateStatusbar);
    this._updateStatusbar.emit({
      id: this._doc.codeId,
      date: this._doc.updateDate,
      writer: this._doc.writer
    });

    //    if (this._ref) {
    //    this._ref.focus();
    //}
  }

  protected onBeforeHide(msg: Message): void {
    Ankus.ankusPlugin.disconnectStatusbar(this._updateStatusbar);
  }

  //다른 이름으로 저장
  private saveAs = () => {
    const ret = prompt('코드명을 입력하세요.', this._doc.codeName);
    //cancel, name is empty
    if (ret === null || ret.trim().length === 0) {
      return;
    }

    this._doc.codeName = ret.trim();
  }; //save as

  save = () => {
    //different user
    if (Ankus.userNumber !== this._doc.userNumber) {
      this._doc.codeId = undefined; //add code
      this._doc.userNumber = Ankus.userNumber!; //change user
      this._doc.writer = Ankus.userName!;
    }
    this._doc.save();
  };

  //save 버튼 표시
  get saveVisible() {
    return (
      this._doc.codeId !== undefined && //기존 코드
      this._doc.userNumber === Ankus.userNumber //사용자가 코드 작성자
    );
  }

  //save 버튼 활성화
  get saveAvailable() {
    return (
      this._doc.dirty && //수정 내용 있음
      // 코드 내용이 있음
      this._doc.codeContent !== undefined &&
      this._doc.codeContent.length > 0
    );
  }

  get curActiveTab(): string {
    return this._selectedTab;
  }

  private setActiveCell = (idx: number) => {
    this._selectedCell = idx;
    this.update();
  };

  get cellIsEditMode(): boolean {
    return this._editCell[this._selectedCell];
  }

  //tooltip for save
  /* SaveTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 12
    }
  })); */

  private tooltipText() {
    return this.saveAvailable && this._doc.userNumber !== Ankus.userNumber ? (
      <label>
        Login User and Author are <b>different</b>.
        <p>
          <b>Saved as a new code</b>
        </p>
      </label>
    ) : (
      ''
    );
  } //tooltip text

  private titleStyle = style({
    fontSize: '20px',
    fontWeight: '600',
    margin: '5px 10px 0 10px',
    verticalAlign: 'bottom',
    display: 'inline-block',
    color: 'var(--jp-ui-font-color1)'
  });

  render(): JSX.Element {
    return (
      <div className="ankus-editor">
        <div className="title-wrap">
          <div className={this.titleStyle}>
            ankus Share Code - {this._doc.codeName}
          </div>
          <button onClick={this.saveAs}>Rename</button>
          <Tooltip
            arrow
            title={this.tooltipText()}
            placement="bottom-start"
            PopperProps={{ disablePortal: true }}
          >
            <button
              className="btn-save"
              onClick={this.save}
              disabled={!this.saveAvailable}
            >
              Save
            </button>
          </Tooltip>
        </div>
        <div style={{ margin: '20px 0 10px 10px' }}>
          <span
            className={
              'code' === this._selectedTab
                ? 'tab_title select_tab'
                : 'tab_title'
            }
            onClick={() => {
              this._selectedTab = 'code';
              this.update();
            }}
          >
            Code
          </span>
          <span
            className={
              'desc' === this._selectedTab
                ? 'tab_title select_tab'
                : 'tab_title'
            }
            onClick={() => {
              this._selectedTab = 'desc';
              this.update();
            }}
          >
            Description
          </span>
        </div>
        <hr
          style={{
            border: '1px solid var(--jp-border-color1)'
          }}
        ></hr>
        {/* <CodeDescTab
            open={false}
            tags={this._doc.codeTag.map(t => t.name)}
            comment={this._doc.comment}
            onAddTag={this.addTag}
            onDeleteTag={this.delTag}
            onChangeTag={this.updateTag}
            onChangeComment={this.updateComment}
          /> */}
        {this._selectedTab === 'desc' ? (
          <div />
        ) : this._resetCode ? (
          <div />
        ) : (
          <CodeContentTab
            data={this._doc.codeContent}
            edit={this._editCell}
            onChangeCell={this.updateContent}
            onSelectCell={this.setActiveCell}
            selectedCell={this._selectedCell}
            onChangeCellEditMode={this.shiftEditMode}
            //셀에서 편집 시작
            onFocusCellEditor={(ref: any) => (this._edcelRef = ref)}
          />
        )}
        {/*<div className="save-wrap">
          <button
            style={{
              display: this.saveVisible ? 'inline-block' : 'none'
            }}
            disabled={!this.saveAvailable}
            onClick={() => {
              this._doc.save();
            }}
          >
            Save
          </button>
                     <button
            disabled={
              this._doc.codeContent === undefined ||
              this._doc.codeContent.length < 1
            }
            onClick={this.saveAs}
          >
            Save As
          </button>

        </div>*/}
      </div>
    );
  } //render
}
