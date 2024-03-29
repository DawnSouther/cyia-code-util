import type { AttributeSelector } from 'css-what';
import { Node, ParseError, parseTree, printParseErrorCode } from 'jsonc-parser';
import { CssSelectorBase } from './css-selector-base';

export function createCssSelectorForJson(htmlContent: string) {
    return new CssSelectorForJson(htmlContent);
}

export class CssSelectorForJson extends CssSelectorBase<Node> {
    rootNode: Node;

    constructor(jsonString: string) {
        super();
        let parseError: ParseError[] = [];
        let parseTreeResult = parseTree(jsonString, parseError);
        if (parseError.length) {
            throw parseError.map((error) => `${printParseErrorCode(error.error)} at offset:${error.offset} length:${error.length}`);
        }
        this.rootNode = parseTreeResult;
    }

    protected getTagAttribute(selector: AttributeSelector, node: Node) {
        if (selector.name === 'value') {
            return node.children[1] && node.children[1].value ? { value: `${node.children[1].value}` } : undefined;
        } else if (selector.name === 'type') {
            return node.children[1] && node.children[1].type ? { value: `${node.children[1].type}` } : undefined;
        }
        return undefined;
    }
    protected findTag(name: string, node: Node): boolean {
        return node.type === 'property' && node.children[0] && node.children[0].value == name;
    }
    protected getChildren(node: Node): Node[] {
        if (node.type === 'property') {
            return node?.children[1]?.children?.filter((item) => item.type === 'property') || [];
        }
        return (node.children && node.children.filter((item) => item.type === 'property')) || [];
    }
}
