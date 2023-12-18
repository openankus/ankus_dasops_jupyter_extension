import { Ankus, StandardTermPart } from './ankusCommon';

export namespace NotebookAction {
  //자동완성 용어를 노트북에 삽입
  export function insertCompletionText(text: string, replace: boolean) {
    if (
      Ankus.ankusPlugin.activeNotebook !== null &&
      Ankus.ankusPlugin.activeNotebook.activeCell !== null
    ) {
      const editor = Ankus.ankusPlugin.activeNotebook.activeCell.editor;
      //셀 편집기 확인
      if (editor !== null) {
        const curpos = editor.getCursorPosition();

        //replace token
        if (replace) {
          const token = editor.getTokenAtCursor(); //ver4//.getTokenForPosition(curpos); //검색어
          //검색어 확인
          if (token !== undefined) {
            editor.setSelection({
              start: editor.getPositionAt(token.offset)!,
              end: curpos
            });

            editor.replaceSelection!(formatText(text));
          }
        } //if: replace token
        //insert
        else {
          editor.setSelection({
            start: curpos,
            end: curpos
          });
          editor.replaceSelection!(formatText(text));
        }
      } //if : check cell editor
    } //if: check notebook
  } //insertCompletionText

  const formatText = (text: string): string => {
    switch (Ankus.stdtermFormat) {
      case StandardTermPart.Format.camel:
        return camelize(text);

      case StandardTermPart.Format.sentence:
        return titlize(text);

      case StandardTermPart.Format.lower:
        return text.toLowerCase();

      default:
        return text.toUpperCase();
    }
  }; //format text

  const camelize = (text: string) => {
    const a = text
      .toLowerCase()
      .replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
    return a.substring(0, 1).toLowerCase() + a.substring(1);
  };

  const titlize = (text: string) => {
    const a = text
      .toLowerCase()
      .replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
    return a.substring(0, 1).toUpperCase() + a.substring(1);
  };
}
