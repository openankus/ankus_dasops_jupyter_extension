import React from 'react';
import { CodeTag } from '../doc/docModel';
import '../../style/codedesc.css';
export interface ICodeDescProps {
    tags: Array<CodeTag>;
    comment: string;
    onAddTag: (tag: string) => void;
    onDeleteTag: (tag: string) => void;
    onChangeTag: (tag: string, idx: number) => void;
    onChangeComment: (comment: string) => void;
}
export declare const CodeDescTab: React.FunctionComponent<ICodeDescProps>;
