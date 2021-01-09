import { SourceFile } from 'typescript';
import * as ts from 'typescript';
import { AttributeSelector, parse, Selector } from 'css-what';
import { CssSelectorBase } from './css-selector-base';
export interface CssSelectorForTsOptions {
    childrenMode: 'getChildren' | 'forEachChild';
}
export function createCssSelectorForTs(sourceFile: SourceFile, options: CssSelectorForTsOptions = { childrenMode: 'getChildren' }) {
    return new CssSelectorForTs(sourceFile, options);
}

class CssSelectorForTs extends CssSelectorBase<ts.Node> {
    constructor(protected rootNode: SourceFile, private options: CssSelectorForTsOptions) {
        super();
    }
    protected getQueryNode(node: ts.Node) {
        if (node) {
            return node;
        }
        return this.rootNode;
    }
    protected getTagAttribute(selector: AttributeSelector, node: ts.Node): { value: string } {
        return node[selector.name] && Number.isInteger(node[selector.name].kind)
            ? {
                  value: node[selector.name].text && node[selector.name].getText(),
              }
            : undefined;
    }
    findTag(name: string, node: ts.Node): boolean {
        return ts.SyntaxKind[name] === node.kind;
    }
    findWithEachNode(node: NodeContext, fn: (node: ts.Node) => boolean, multiLevel?: boolean): NodeContext[] {
        let list: NodeContext[] = [node];
        let result = [];
        while (list.length) {
            let node = list.pop();
            if (fn(node.node)) {
                result.push(node);
            }
            if (multiLevel) {
                list.push(...this.getChildren(node.node).map((childNode, i) => new NodeContext(childNode, node, i)));
            }
        }
        return result;
    }
    getChildren(node: ts.Node): ts.Node[] {
        if (this.options.childrenMode === 'forEachChild') {
            let children: ts.Node[] = [];
            node.forEachChild((node) => children.push(node) && undefined);
            return children;
        } else {
            return node.getChildren();
        }
    }
}

class NodeContext {
    constructor(public node: ts.Node, public parent: NodeContext, public index: number) {}
}
