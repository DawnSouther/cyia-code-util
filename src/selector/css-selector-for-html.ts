import { HtmlParser, ParseTreeResult, Element, Attribute, Text } from '@angular/compiler';
import { AttributeSelector, parse, Selector } from 'css-what';
import { CssSelectorBase, NodeContext } from './css-selector-base';

export function createCssSelectorForHtml(htmlContent: string) {
    return new CssSelectorForHtml(htmlContent);
}

export class CssSelectorForHtml extends CssSelectorBase<Element> {
    protected rootNode: Element;

    constructor(htmlString: string) {
        super();
        let parser = new HtmlParser();
        let parseTreeResult = parser.parse(htmlString, '');
        if (parseTreeResult.errors && parseTreeResult.errors.length) {
            throw parseTreeResult.errors;
        }
        this.rootNode = new Element('__root', [], parseTreeResult.rootNodes, undefined, undefined);
    }
    protected getQueryNode(node: Element): Element {
        if (node) {
            return node;
        }
        return this.rootNode;
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
