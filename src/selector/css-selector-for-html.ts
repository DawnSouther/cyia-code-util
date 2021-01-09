import { HtmlParser, ParseTreeResult, Element, Attribute, Text } from '@angular/compiler';
import { AttributeSelector, parse, Selector } from 'css-what';
import { CssSelectorBase, NodeContext } from './css-selector-base';

export function createCssSelectorForHtml(htmlContent: string) {
    return new CssSelectorForHtml(htmlContent);
}

export class CssSelectorForHtml extends CssSelectorBase<Element, ParseTreeResult> {
    protected parseTree: ParseTreeResult;

    constructor(htmlString: string) {
        super();
        let parser = new HtmlParser();
        this.parseTree = parser.parse(htmlString, '');
        if (this.parseTree.errors && this.parseTree.errors.length) {
            throw this.parseTree.errors;
        }
    }
    protected getQueryNode(node: Element): Element {
        if (node) {
            return node;
        }
        return new Element('__root', [], this.parseTree.rootNodes, undefined, undefined);
    }
    protected getTagAttribute(selector: AttributeSelector, node: Element): Attribute {
        return node.attrs.find((item) => item.name === selector.name);
    }
    protected findTag(name: string, node: Element): boolean {
        return name === node.name;
    }
    protected getChildren(node: Element): Element[] {
        return node.children.filter((node) => node instanceof Element) as any[];
    }
    protected findWithEachNode(node: NodeContext<Element>, fn: (node: Element) => boolean, multiLevel?: boolean): NodeContext<Element>[] {
        let list: NodeContext<Element>[] = [node];
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
}
