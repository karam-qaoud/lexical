/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { LexicalNode } from '../LexicalNode';
import { ElementNode } from './LexicalElementNode';
export declare class GridNode extends ElementNode {
}
export declare function $isGridNode(node: LexicalNode | null | undefined): node is GridNode;
