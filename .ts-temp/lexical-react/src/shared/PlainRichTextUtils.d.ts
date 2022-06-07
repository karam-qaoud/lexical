/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { EditorState, LexicalEditor } from 'lexical';
export declare type InitialEditorStateType = null | string | EditorState | (() => void);
export declare function initializeEditor(editor: LexicalEditor, initialEditorState?: InitialEditorStateType): void;
