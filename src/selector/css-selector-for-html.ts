import { HtmlParser, Element, Attribute } from '@angular/compiler';
import type { AttributeSelector } from 'css-what';
import { CssSelectorBase } from './css-selector-base';

export function createCssSelectorForHtml(htmlContent: string) {
    return new CssSelectorForHtml(htmlContent);
}

export class CssSelectorForHtml extends CssSelectorBase<Element> {
    rootNode: Element;

    constructor(htmlString: string) {
        super();
        let parser = new HtmlParser();
        let parseTreeResult = parser.parse(htmlString, '');
        if (parseTreeResult.errors && parseTreeResult.errors.length) {
            throw parseTreeResult.errors;
        }
        this.rootNode = new Element('__root', [], parseTreeResult.rootNodes, undefined, undefined);
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
}
