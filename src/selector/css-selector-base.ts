import { AttributeSelector, parse, Selector } from 'css-what';
export class NodeContext<T> {
    constructor(public node: T, public parent: NodeContext<T>, public index: number) {}
}
export abstract class CssSelectorBase<NODE> {
    abstract readonly rootNode: NODE;
    private currentNodeList: NodeContext<NODE>[];
    private limit = true;
    protected abstract getTagAttribute(selector: AttributeSelector, node: NODE): { value: string };
    protected abstract findTag(name: string, node: NODE): boolean;
    protected findAttribute(selector: AttributeSelector, node: NODE): boolean {
        let attribute = this.getTagAttribute(selector, node);
        if (attribute) {
            let str: string;
            try {
                str = attribute.value;
                switch (selector.action) {
                    case 'equals':
                        return str === selector.value;
                    case 'any':
                        return str.includes(selector.value);
                    case 'start':
                        return str.startsWith(selector.value);
                    case 'end':
                        return str.endsWith(selector.value);
                    case 'element':
                        return str.split(' ').includes(selector.value);
                    case 'hyphen':
                        return str.split(' ')[0].split('-')[0] === selector.value;
                    case 'not':
                        return str !== selector.value;
                    case 'exists':
                        return !!attribute;
                    default:
                        return str === selector.value;
                }
            } catch (error) {}
        }
        return false;
    }
    protected findWithEachNode(context: NodeContext<NODE>, fn: (node: NODE) => boolean, multi: boolean): NodeContext<NODE>[] {
        let list: NodeContext<NODE>[] = [context];
        let result = [];
        while (list.length) {
            let node = list.pop();
            if (fn(node.node)) {
                result.push(node);
            }
            if (multi) {
                list.push(...this.getChildren(node.node).map((childNode, i) => new NodeContext(childNode, node, i)));
            }
        }
        return result;
    }
    protected abstract getChildren(node: NODE): NODE[];
    protected getInitQueryNodeContext(node: NODE): () => NodeContext<NODE>[] {
        if (node) {
            return () =>
                this.getChildren(node).map((item) => new NodeContext(item, new NodeContext(node, undefined, undefined), undefined));
        }
        return () => [new NodeContext(this.rootNode, undefined, undefined)];
    }
    /** @deprecated */
    query(node: NODE, selector: string): NODE[];
    /** @deprecated */
    query(selector: string): NODE[];
    query(arg1: NODE | string, arg2?: string) {
        let selector: string;
        let initQueryNodeContext: () => NodeContext<NODE>[];

        if (typeof arg1 === 'string') {
            selector = arg1;
            initQueryNodeContext = this.getInitQueryNodeContext(undefined);
        } else if (typeof arg1 === 'undefined' && typeof arg2 === 'string') {
            return [];
        } else {
            selector = arg2;
            initQueryNodeContext = this.getInitQueryNodeContext(arg1);
        }
        let selectedList: NODE[] = [];
        /** css解析为token */
        let result = parse(selector, { lowerCaseAttributeNames: false, lowerCaseTags: false });
        for (let i = 0; i < result.length; i++) {
            this.currentNodeList = initQueryNodeContext();
            this.limit = true;
            const selectorList = result[i];
            for (let j = 0; j < selectorList.length; j++) {
                const selector = selectorList[j];
                if (!this.parse(selector)) {
                    break;
                }
            }
            selectedList.push(...this.currentNodeList.map((node) => node.node));
        }
        return selectedList;
    }
    queryAll(node: NODE, selector: string): NODE[];
    queryAll(selector: string): NODE[];
    queryAll(arg1: any, arg2?: any) {
        return this.query(arg1, arg2);
    }
    queryOne(node: NODE, selector: string): NODE;
    queryOne(selector: string): NODE;
    queryOne(arg1: any, arg2?: any) {
        return this.query(arg1, arg2)[0];
    }
    protected parse(selector: Selector): boolean {
        let list: NodeContext<NODE>[] = [];
        switch (selector.type) {
            // 匹配标签
            case 'tag':
                this.currentNodeList.forEach((nodeContext: NodeContext<NODE>) => {
                    list = list.concat(this.findWithEachNode(nodeContext, (node) => this.findTag(selector.name, node), this.limit));
                });
                this.currentNodeList = list;
                this.limit = false;
                break;
            // 空格
            case 'descendant':
                this.currentNodeList = [].concat(
                    ...this.currentNodeList.map((node) => this.getChildren(node.node).map((child, i) => new NodeContext(child, node, i)))
                );
                this.limit = true;
                break;
            //+
            case 'adjacent':
                this.currentNodeList = [].concat(
                    this.currentNodeList
                        .map(
                            (nodeContext) =>
                                new NodeContext(
                                    this.getChildren(nodeContext.parent.node)[nodeContext.index + 1],
                                    nodeContext.parent,
                                    nodeContext.index + 1
                                )
                        )
                        .filter((node) => node.node)
                );

                this.limit = false;
                break;
            // >
            case 'child':
                this.currentNodeList = [].concat(
                    ...this.currentNodeList.map((node) => this.getChildren(node.node).map((child, i) => new NodeContext(child, node, i)))
                );
                this.limit = false;
                break;
            // ~
            case 'sibling':
                this.currentNodeList = [].concat(
                    ...this.currentNodeList.map((nodeContent) =>
                        this.getChildren(nodeContent.parent.node)
                            .filter((node, i) => i > nodeContent.index)
                            .map((node, i) => new NodeContext(node, nodeContent.parent, i))
                    )
                );

                this.limit = false;
                break;
            //[] .xxx
            case 'attribute':
                this.currentNodeList.forEach((nodeContext: NodeContext<NODE>) => {
                    list = list.concat(
                        this.findWithEachNode(nodeContext, (node) => this.findAttribute(selector as AttributeSelector, node), this.limit)
                    );
                });
                this.currentNodeList = list;
                this.limit = false;
                break;
            // *
            case 'universal':
                this.currentNodeList = [].concat(
                    ...this.currentNodeList.map((nodeContext) => this.findWithEachNode(nodeContext, () => true, true))
                );
                if (this.currentNodeList[0].node === this.rootNode) {
                    this.currentNodeList.shift();
                }
                break;
            default:
                throw new Error(`${selector.type} not support`);
        }

        return !!this.currentNodeList.length;
    }
}
