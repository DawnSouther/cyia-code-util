import { HtmlParser, makeBindingParser, InterpolationConfig, DEFAULT_INTERPOLATION_CONFIG } from '@angular/compiler';
import { Element } from '@angular/compiler/src/render3/r3_ast';
import { htmlAstToRender3Ast } from '@angular/compiler/src/render3/r3_template_transform';
import { AttributeSelector } from 'css-what';
import { CssSelectorBase, NodeContext } from './css-selector-base';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BoundText, Content, Node, Template, Text } from '@angular/compiler/src/render3/r3_ast';

function isElement(node: Node): node is Element {
    return node instanceof Element;
}
function isBoundText(node: Node): node is BoundText {
    return node instanceof BoundText;
}
function isText(node: Node): node is Text {
    return node instanceof Text;
}
function isTemplate(node: Node): node is Template {
    return node instanceof Template;
}
function isContent(node: any): node is Content {
    return node instanceof Content;
}
interface NodeIterationOptions {
    Element: (node: Element) => any;
    BoundText: (node: BoundText) => any;
    Text: (node: Text) => any;
    Template: (node: Template) => any;
    Content: (node: Content) => any;
    default: (node: any) => any;
}
function nodeIteration(node: Node, options: NodeIterationOptions) {
    if (isElement(node)) {
        return options.Element(node);
    } else if (isBoundText(node)) {
        return options.BoundText(node);
    } else if (isText(node)) {
        return options.Text(node);
    } else if (isTemplate(node)) {
        return options.Template(node);
    } else if (isContent(node)) {
        return options.Content(node);
    }
    return options.default(node);
}

export interface Render3ParseOptions {
    collectCommentNodes: boolean;
}
const ROOT_NAME = `__root`;
export function createCssSelectorForNgHtml(htmlContent: string) {
    return new CssSelectorForNgHtml(htmlContent);
}

export class CssSelectorForNgHtml extends CssSelectorBase<Node> {
    rootNode: Node;

    constructor(htmlString: string, render3ParseOptions?: Render3ParseOptions, markers?: [string, string]) {
        super();
        let parser = new HtmlParser();
        let parseTreeResult = parser.parse(htmlString, '');
        if (parseTreeResult.errors && parseTreeResult.errors.length) {
            throw parseTreeResult.errors.map((error) => error.toString()).join('\n');
        }
        let interpolationConfig = DEFAULT_INTERPOLATION_CONFIG;
        if (markers) {
            interpolationConfig = InterpolationConfig.fromArray(markers);
        }
        let ast = htmlAstToRender3Ast(
            parseTreeResult.rootNodes,
            makeBindingParser(interpolationConfig),
            render3ParseOptions || { collectCommentNodes: true }
        );
        if (ast.errors && ast.errors.length) {
            throw ast.errors.map((error) => error.toString()).join('\n');
        }

        this.rootNode = new Element(ROOT_NAME, [], undefined, undefined, ast.nodes, undefined, undefined, undefined, undefined);
    }

    protected getTagAttribute(selector: AttributeSelector, node: Node) {
        if (selector.name === 'input') {
            if (isElement(node)) {
                node;
                return node.inputs?.length ? { value: node.inputs.map((attr) => attr.name).join(' ') } : undefined;
            } else {
                return undefined;
            }
        } else if (selector.name === 'output') {
            if (isElement(node)) {
                return node.outputs?.length ? { value: node.outputs.map((item) => item.name).join(' ') } : undefined;
            } else {
                return undefined;
            }
        } else if (selector.name === 'attribute') {
            if (isElement(node) || isContent(node)) {
                return node.attributes?.length ? { value: node.attributes.map((item) => item.name).join(' ') } : undefined;
            } else {
                return undefined;
            }
        } else if (selector.name === 'templateAttr') {
            if (isTemplate(node)) {
                return node.templateAttrs?.length ? { value: node.templateAttrs.map((item) => item.name).join(' ') } : undefined;
            } else {
                return undefined;
            }
        } else if (selector.name === 'reference') {
            if (isTemplate(node) || isElement(node)) {
                return node.references?.length ? { value: node.references.map((item) => item.name).join(' ') } : undefined;
            } else {
                return undefined;
            }
        } else if (selector.name === 'variable') {
            if (isTemplate(node)) {
                return node.variables?.length ? { value: node.variables.map((item) => item.name).join(' ') } : undefined;
            } else {
                return undefined;
            }
        }
        return undefined;
    }
    protected findTag(name: string, node: Node): boolean {
        return (node as any)?.__proto__?.constructor?.name === name && (node as any).name !== ROOT_NAME;
    }
    protected getChildren(node: Node): Node[] {
        return nodeIteration(node, {
            Element: (node) => node.children,
            Template: (node) => node.children,
            Content: () => [],
            Text: () => [],
            default: () => [],
            BoundText: () => [],
        });
    }
}
