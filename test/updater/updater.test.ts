import { Change, DeleteChange, InsertChange, ReplaceChange } from '../../src/change/content-change';

export class UpdaterTest {
    static update(content: string, change: Change) {
        return new UpdaterTest(content, change).update();
    }
    constructor(private content: string, private change: Change) {}
    update() {
        let deleteChange: DeleteChange;
        let insertChange: InsertChange;
        if (this.change instanceof ReplaceChange) {
            insertChange = new InsertChange(this.change.start, this.change.content);
            deleteChange = new DeleteChange(this.change.start, this.change.length);
        } else if (this.change instanceof InsertChange) {
            insertChange = this.change;
        } else if (this.change instanceof DeleteChange) {
            deleteChange = this.change;
        }
        let list: [string, string];
        if (deleteChange) {
            list = this.slice(deleteChange.start, deleteChange.length);
        }
        if (!list && insertChange) {
            list = this.slice(insertChange.start);
            list.splice(1, 0, insertChange.content);
        } else if (insertChange) {
            list.splice(1, 0, insertChange.content);
        }
        return list.join('');
    }
    private slice(pos: number, length: number = 0): [string, string] {
        return [this.content.substring(0, pos), this.content.substring(pos + length)];
    }
}
