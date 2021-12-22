import { CharStreams, CommonTokenStream } from 'antlr4ts';
import type { AttributeSelector } from 'css-what';
import { CssSelectorBase } from './css-selector-base';
import { XMLLexer } from './xml/XMLLexer';
import { ContentContext, ElementContext, XMLParser } from './xml/XMLParser';

export function createCssSelectorForXml(htmlContent: string) {
    return new CssSelectorForXml(htmlContent);
}

export class CssSelectorForXml extends CssSelectorBase<ElementContext> {
    rootNode: ElementContext;

    constructor(xmlString: string) {
        super();
        const parser = new XMLParser(new CommonTokenStream(new XMLLexer(CharStreams.fromString(xmlString))));
        parser.removeErrorListeners();
        parser.addErrorListener({
            syntaxError(recognizer, line, charPositionInLine, msg, e) {
                throw e;
            },
        });
        const parseTreeResult = parser.document();
        this.rootNode = parseTreeResult.element();
    }

    protected getTagAttribute(selector: AttributeSelector, node: ElementContext): { value: string } {
        const value = node
            .attribute()
            .find((item) => item.Name().text === selector.name)
            ?.STRING().text;
        return value ? { value: value.substring(1, value.length - 1) } : undefined;
    }
    protected findTag(name: string, node: ElementContext): boolean {
        return name === node.Name(0).text;
    }
    protected getChildren(node: ElementContext): ElementContext[] {
        const contents = node.children.filter((content) => content instanceof ContentContext) as ContentContext[];
        return contents
            .map((element) => element.children.filter((node) => node instanceof ElementContext).reduce((acc, val) => acc.concat(val), []))
            .reduce((acc, val) => acc.concat(val), []);
    }
}
