import { SourceFile } from 'typescript';
import * as ts from 'typescript';
import { AttributeSelector } from 'css-what';
import { CssSelectorBase } from './css-selector-base';
export interface CssSelectorForTsOptions {
    childrenMode: 'getChildren' | 'forEachChild';
}
export function createCssSelectorForTs(
    nodeOrString: SourceFile | string | ts.Node,
    options: CssSelectorForTsOptions = { childrenMode: 'getChildren' }
) {
    if (typeof nodeOrString == 'string') {
        nodeOrString = ts.createSourceFile('', nodeOrString, ts.ScriptTarget.Latest, true);
    }
    return new CssSelectorForTs(nodeOrString, options);
}

export class CssSelectorForTs extends CssSelectorBase<ts.Node> {
    private sourceFile: SourceFile;
    constructor(public rootNode: SourceFile | ts.Node, private options: CssSelectorForTsOptions) {
        super();
        this.sourceFile = ts.isSourceFile(rootNode) ? rootNode : undefined;
    }
    /** 如果传入的rootNode不是SourceFile,那么在遍历时就需要传入sf确定子节点及text */
    public setSourceFile(sf: SourceFile) {
        this.sourceFile = sf;
    }
    protected getTagAttribute(selector: AttributeSelector, node: ts.Node): { value: string } {
        try {
            return node[selector.name] && Number.isInteger(node[selector.name].kind)
                ? {
                      value: node[selector.name].getText && node[selector.name].getText(this.sourceFile),
                  }
                : undefined;
        } catch (error) {
            return undefined;
        }
    }
    protected findTag(name: string, node: ts.Node): boolean {
        return ts.SyntaxKind[name] === node.kind;
    }

    protected getChildren(node: ts.Node): ts.Node[] {
        if (this.options.childrenMode === 'forEachChild') {
            let children: ts.Node[] = [];
            node.forEachChild((node) => children.push(node) && undefined);
            return children;
        } else {
            return node.getChildren(this.sourceFile);
        }
    }
}
