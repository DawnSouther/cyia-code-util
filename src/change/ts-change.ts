import { Node, SourceFile } from 'typescript';
import { DeleteChange, InsertChange, ReplaceChange } from './content-change';

interface NodeOptions {
    full?: boolean;
    comment?: boolean;
}
export class TsChange {
    constructor(private sourceFile: SourceFile) {}
    replaceNode(node: Node, content: string, options: NodeOptions = {}) {
        let start = this.getNodeStart(node, options);

        return new ReplaceChange(start, this.getNodeWidth(node, options), content);
    }
    deleteNode(node: Node, options: NodeOptions = {}) {
        let start = this.getNodeStart(node, options);
        return new DeleteChange(start, this.getNodeWidth(node, options));
    }
    insertNode(node: Node, content: string, pos: 'start' | 'end' = 'start', options: NodeOptions = {}) {
        let start = this.getNodeStart(node, options);

        return new InsertChange(pos === 'start' ? start : start + this.getNodeWidth(node, options), content, pos);
    }

    private getNodeStart(node: Node, options: NodeOptions = {}) {
        return options.full ? node.getFullStart() : node.getStart(this.sourceFile, options.comment);
    }
    private getNodeWidth(node: Node, options: NodeOptions = {}) {
        return options.full ? node.getFullWidth() : node.getWidth(this.sourceFile);
    }
}
