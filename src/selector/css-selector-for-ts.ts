import { SourceFile } from 'typescript';
import * as ts from 'typescript';
import { AttributeSelector, parse, Selector } from 'css-what';
import { CssSelectorBase, NodeContext } from './css-selector-base';
export interface CssSelectorForTsOptions {
    childrenMode: 'getChildren' | 'forEachChild';
}
export function createCssSelectorForTs(
    sourceFile: SourceFile | string | ts.Node,
    options: CssSelectorForTsOptions = { childrenMode: 'getChildren' }
) {
    if (typeof sourceFile == 'string') {
        sourceFile = ts.createSourceFile('', sourceFile, ts.ScriptTarget.Latest, true);
    }
    return new CssSelectorForTs(sourceFile, options);
}

export class CssSelectorForTs extends CssSelectorBase<ts.Node> {
    constructor(public rootNode: SourceFile | ts.Node, private options: CssSelectorForTsOptions) {
        super();
    }

    protected getTagAttribute(selector: AttributeSelector, node: ts.Node): { value: string } {
        try {
            return node[selector.name] && Number.isInteger(node[selector.name].kind)
                ? {
                      value: node[selector.name].getText && node[selector.name].getText(),
                  }
                : undefined;
        } catch (error) {
            return undefined;
        }
    }
    protected findTag(name: string, node: ts.Node): boolean {
        return ts.SyntaxKind[name] === node.kind;
    }
    protected findWithEachNode(node: NodeContext<ts.Node>, fn: (node: ts.Node) => boolean, multiLevel?: boolean): NodeContext<ts.Node>[] {
        let list: NodeContext<ts.Node>[] = [node];
        let result = [];
        while (list.length) {
            let node = list.pop();
            if (fn(node.node)) {
                result.push(node);
            }
            if (multiLevel) {
                list.push(...this.getChildren(node.node).map((childNode, i) => new NodeContext<ts.Node>(childNode, node, i)));
            }
        }
        return result;
    }
    protected getChildren(node: ts.Node): ts.Node[] {
        if (this.options.childrenMode === 'forEachChild') {
            let children: ts.Node[] = [];
            node.forEachChild((node) => children.push(node) && undefined);
            return children;
        } else {
            return node.getChildren();
        }
    }
}
