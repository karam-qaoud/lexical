/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {EditorConfig, LexicalEditor} from '../LexicalEditor';
import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  LexicalNode,
} from '../LexicalNode';
import type {
  ElementFormatType,
  SerializedElementNode,
} from './LexicalElementNode';
import type {RangeSelection} from 'lexical';

import {$applyNodeReplacement, getCachedClassNameArray} from '../LexicalUtils';
import {ElementNode} from './LexicalElementNode';
import {$isTextNode} from './LexicalTextNode';

export type SerializedDivNode = SerializedElementNode;

/** @noInheritDoc */
export class DivNode extends ElementNode {
  static getType(): string {
    return 'div';
  }

  static clone(node: DivNode): DivNode {
    return new DivNode(node.__key);
  }

  // View

  createDOM(config: EditorConfig): HTMLElement {
    const dom = document.createElement('div');
    const classNames = getCachedClassNameArray(config.theme, 'div');
    if (classNames !== undefined) {
      const domClassList = dom.classList;
      domClassList.add(...classNames);
    }
    return dom;
  }
  updateDOM(
    prevNode: DivNode,
    dom: HTMLElement,
    config: EditorConfig,
  ): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (node: Node) => ({
        conversion: convertDivElement,
        priority: 0,
      }),
    };
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const {element} = super.exportDOM(editor);

    if (element && this.isEmpty()) {
      element.append(document.createElement('br'));
    }
    if (element) {
      const formatType = this.getFormatType();
      element.style.textAlign = formatType;

      const direction = this.getDirection();
      if (direction) {
        element.dir = direction;
      }
      const indent = this.getIndent();
      if (indent > 0) {
        // padding-inline-start is not widely supported in email HTML, but
        // Lexical Reconciler uses padding-inline-start. Using text-indent instead.
        element.style.textIndent = `${indent * 20}px`;
      }
    }

    return {
      element,
    };
  }

  static importJSON(serializedNode: SerializedDivNode): DivNode {
    const node = $createDivNode();
    node.setFormat(serializedNode.format);
    node.setIndent(serializedNode.indent);
    node.setDirection(serializedNode.direction);
    return node;
  }

  exportJSON(): SerializedElementNode {
    return {
      ...super.exportJSON(),
      type: 'div',
      version: 1,
    };
  }

  // Mutation

  insertNewAfter(_: RangeSelection, restoreSelection: boolean): DivNode {
    const newElement = $createDivNode();
    const direction = this.getDirection();
    newElement.setDirection(direction);
    this.insertAfter(newElement, restoreSelection);
    return newElement;
  }

  collapseAtStart(): boolean {
    const children = this.getChildren();
    // If we have an empty (trimmed) first div and try and remove it,
    // delete the div as long as we have another sibling to go to
    if (
      children.length === 0 ||
      ($isTextNode(children[0]) && children[0].getTextContent().trim() === '')
    ) {
      const nextSibling = this.getNextSibling();
      if (nextSibling !== null) {
        this.selectNext();
        this.remove();
        return true;
      }
      const prevSibling = this.getPreviousSibling();
      if (prevSibling !== null) {
        this.selectPrevious();
        this.remove();
        return true;
      }
    }
    return false;
  }
}

function convertDivElement(element: HTMLElement): DOMConversionOutput {
  const node = $createDivNode();
  if (element.style) {
    node.setFormat(element.style.textAlign as ElementFormatType);
    const indent = parseInt(element.style.textIndent, 10) / 20;
    if (indent > 0) {
      node.setIndent(indent);
    }
  }
  return {node};
}

export function $createDivNode(): DivNode {
  return $applyNodeReplacement(new DivNode());
}

export function $isDivNode(
  node: LexicalNode | null | undefined,
): node is DivNode {
  return node instanceof DivNode;
}
