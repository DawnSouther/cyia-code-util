import ts from 'typescript';
import { UpdaterTest } from '../../test/updater/updater.test';
import { createCssSelectorForTs } from '../selector';
import { InsertChange, DeleteChange } from './content-change';
import { TsChange } from './ts-change';

describe('ts-change', () => {
    let content = `let a=/**number*/2`;
    let file = ts.createSourceFile('', content, ts.ScriptTarget.Latest, true);
    it('替换内容', () => {
        let selector = createCssSelectorForTs(file);
        let node = selector.queryOne('NumericLiteral');
        let change = new TsChange(file);
        let result = change.replaceNode(node, '233');
        let newContent = UpdaterTest.update(content, result);
        expect(newContent).toBe(`let a=/**number*/233`);
    });
    it('替换内容(包括注释)', () => {
        let selector = createCssSelectorForTs(file);
        let node = selector.queryOne('NumericLiteral');
        let change = new TsChange(file);
        let result = change.replaceNode(node, '233', { full: true });
        let newContent = UpdaterTest.update(content, result);
        expect(newContent).toBe(`let a=233`);
    });
    it('删除内容', () => {
        let selector = createCssSelectorForTs(file);
        let node = selector.queryOne('NumericLiteral');
        let change = new TsChange(file);
        let result = change.deleteNode(node);
        let newContent = UpdaterTest.update(content, result);
        expect(newContent).toBe(`let a=/**number*/`);
    });
    it('删除内容(包括注释)', () => {
        let selector = createCssSelectorForTs(file);
        let node = selector.queryOne('NumericLiteral');
        let change = new TsChange(file);
        let result = change.deleteNode(node, { full: true });
        let newContent = UpdaterTest.update(content, result);
        expect(newContent).toBe(`let a=`);
    });
    it('增加内容(前)', () => {
        let selector = createCssSelectorForTs(file);
        let node = selector.queryOne('NumericLiteral');
        let change = new TsChange(file);
        let result = change.insertNode(node, 'abc', 'start');
        let newContent = UpdaterTest.update(content, result);
        expect(newContent).toBe(`let a=/**number*/abc2`);
    });
    it('增加内容(后)', () => {
        let selector = createCssSelectorForTs(file);
        let node = selector.queryOne('NumericLiteral');
        let change = new TsChange(file);
        let result = change.insertNode(node, 'abc', 'end');
        let newContent = UpdaterTest.update(content, result);
        expect(newContent).toBe(content + 'abc');
    });
    it('增加内容(包括注释)', () => {
        let selector = createCssSelectorForTs(file);
        let node = selector.queryOne('NumericLiteral');
        let change = new TsChange(file);
        let result = change.insertNode(node, 'abc', 'start', { full: true });
        let newContent = UpdaterTest.update(content, result);
        expect(newContent).toBe(`let a=abc/**number*/2`);
    });
    it('插入子节点内容(对象)', () => {
        let file = ts.createSourceFile('', `let a={b:1}`, ts.ScriptTarget.Latest, true);
        let selector = createCssSelectorForTs(file);
        let node = selector.queryOne('ObjectLiteralExpression') as ts.ObjectLiteralExpression;
        let change = new TsChange(file);
        let result = change.insertChildNode(node, 'abc:2');
        let newContent = UpdaterTest.update(file.text, result);
        expect(newContent).toBe(`let a={b:1,abc:2}`);
    });
    it('插入子节点内容(对象,尾逗号)', () => {
        let file = ts.createSourceFile('', `let a={b:1/**注释*/,}`, ts.ScriptTarget.Latest, true);
        let selector = createCssSelectorForTs(file);
        let node = selector.queryOne('ObjectLiteralExpression') as ts.ObjectLiteralExpression;
        let change = new TsChange(file);
        let result = change.insertChildNode(node, 'abc:2');
        let newContent = UpdaterTest.update(file.text, result);
        expect(newContent).toBe(`let a={b:1/**注释*/,abc:2,}`);
    });
    it('插入子节点内容(对象,尾逗号,位置)', () => {
        let file = ts.createSourceFile('', `let a={b:1/**注释*/,}`, ts.ScriptTarget.Latest, true);
        let selector = createCssSelectorForTs(file);
        let node = selector.queryOne('ObjectLiteralExpression') as ts.ObjectLiteralExpression;
        let change = new TsChange(file);
        let result = change.insertChildNode(node, 'abc:2', 0);
        let newContent = UpdaterTest.update(file.text, result);
        expect(newContent).toBe(`let a={abc:2,b:1/**注释*/,}`);
    });
    it('插入子节点内容(空对象)', () => {
        let file = ts.createSourceFile('', `let a={}`, ts.ScriptTarget.Latest, true);
        let selector = createCssSelectorForTs(file);
        let node = selector.queryOne('ObjectLiteralExpression') as ts.ObjectLiteralExpression;
        let change = new TsChange(file);
        let result = change.insertChildNode(node, 'abc:2');
        let newContent = UpdaterTest.update(file.text, result);
        expect(newContent).toBe(`let a={abc:2}`);
    });
    it('插入子节点内容(空数组)', () => {
        let file = ts.createSourceFile('', `let a=[]`, ts.ScriptTarget.Latest, true);
        let selector = createCssSelectorForTs(file);
        let node = selector.queryOne('ArrayLiteralExpression') as ts.ArrayLiteralExpression;
        let change = new TsChange(file);
        let result = change.insertChildNode(node, '1');
        let newContent = UpdaterTest.update(file.text, result);
        expect(newContent).toBe(`let a=[1]`);
    });
    it('插入子节点内容(数组)', () => {
        let file = ts.createSourceFile('', `let a=[2]`, ts.ScriptTarget.Latest, true);
        let selector = createCssSelectorForTs(file);
        let node = selector.queryOne('ArrayLiteralExpression') as ts.ArrayLiteralExpression;
        let change = new TsChange(file);
        let result = change.insertChildNode(node, '1');
        let newContent = UpdaterTest.update(file.text, result);
        expect(newContent).toBe(`let a=[2,1]`);
    });
    it('插入子节点内容(数组,位置)', () => {
        let file = ts.createSourceFile('', `let a=[2]`, ts.ScriptTarget.Latest, true);
        let selector = createCssSelectorForTs(file);
        let node = selector.queryOne('ArrayLiteralExpression') as ts.ArrayLiteralExpression;
        let change = new TsChange(file);
        let result = change.insertChildNode(node, '1', 0);
        let newContent = UpdaterTest.update(file.text, result);
        expect(newContent).toBe(`let a=[1,2]`);
    });
    it('删除子节点内容(对象)', () => {
        let file = ts.createSourceFile('', `let a={a:1/**abc*/,b:2,c:3}`, ts.ScriptTarget.Latest, true);
        let selector = createCssSelectorForTs(file);
        let node = selector.queryOne('ObjectLiteralExpression') as ts.ObjectLiteralExpression;
        let change = new TsChange(file);
        let result = change
            .deleteChildNode(node, (node) => {
                return node.getText().includes('a');
            })
            .sort((a, b) => b.start - a.start);
        let newContent = file.text;
        result.forEach((change) => {
            newContent = UpdaterTest.update(newContent, change);
        });
        expect(newContent).toBe(`let a={b:2,c:3}`);
        result = change
            .deleteChildNode(node, (node) => {
                return node.getText().includes('b');
            })
            .sort((a, b) => b.start - a.start);
        newContent = file.text;
        result.forEach((change) => {
            newContent = UpdaterTest.update(newContent, change);
        });
        expect(newContent).toBe(`let a={a:1/**abc*/,c:3}`);
    });
    it('删除子节点内容(数组)', () => {
        let file = ts.createSourceFile('', `let a=[1/**abc*/,2,3]`, ts.ScriptTarget.Latest, true);
        let selector = createCssSelectorForTs(file);
        let node = selector.queryOne('ArrayLiteralExpression') as ts.ArrayLiteralExpression;
        let change = new TsChange(file);
        let result = change
            .deleteChildNode(node, (node) => {
                return node.getText().includes('1');
            })
            .sort((a, b) => b.start - a.start);
        let newContent = file.text;
        result.forEach((change) => {
            newContent = UpdaterTest.update(newContent, change);
        });
        expect(newContent).toBe(`let a=[2,3]`);
        result = change
            .deleteChildNode(node, (node) => {
                return node.getText().includes('2');
            })
            .sort((a, b) => b.start - a.start);
        newContent = file.text;
        result.forEach((change) => {
            newContent = UpdaterTest.update(newContent, change);
        });
        expect(newContent).toBe(`let a=[1/**abc*/,3]`);
    });
    it('替换子节点内容(对象,尾逗号,中间)', () => {
        let file = ts.createSourceFile('', `let a={a: '1',b: '2',c: ['3']// d:[4]}`, ts.ScriptTarget.Latest, true);
        let selector = createCssSelectorForTs(file);
        let node = selector.queryOne('ObjectLiteralExpression') as ts.ObjectLiteralExpression;
        let change = new TsChange(file);
        let changeList: (InsertChange | DeleteChange)[] = change.deleteChildNode(node, (node, index) => index === 1 || index === 2);

        changeList.push(change.insertChildNode(node, 'ab:2'));
        let newContent = file.text;
        changeList
            .sort((a, b) => b.start - a.start)
            .forEach((change) => {
                newContent = UpdaterTest.update(newContent, change);
            });
        expect(newContent).toBe(`let a={a: '1',ab:2// d:[4]}`);
    });
    it('对象中间插入字段', () => {
        let file = ts.createSourceFile('', `let a={a: '1',b: '2',c: ['3']}`, ts.ScriptTarget.Latest, true);
        let selector = createCssSelectorForTs(file);
        let node = selector.queryOne('ObjectLiteralExpression') as ts.ObjectLiteralExpression;
        let change = new TsChange(file);
        let insertChange = change.insertChildNode(node, `insert:'a'`, 1);
        let newContent = UpdaterTest.update(file.text, insertChange);
        expect(newContent).toBe(`let a={a: '1',insert:'a',b: '2',c: ['3']}`);
    });
    it('对象中间删除节点', () => {
        let file = ts.createSourceFile('', `let a={a: '1',b: '2',c: ['3']}`, ts.ScriptTarget.Latest, true);
        let selector = createCssSelectorForTs(file);
        let node = selector.queryOne('ObjectLiteralExpression') as ts.ObjectLiteralExpression;
        let change = new TsChange(file);
        let changeList = change.deleteChildNode(node, (item, index) => {
            if (index === 2 || index === 0) {
                return true;
            }
            return false;
        });
        let newContent = file.text;
        changeList
            .sort((a, b) => b.start - a.start)
            .forEach((item) => {
                newContent = UpdaterTest.update(newContent, item);
            });
        expect(newContent).toBe(`let a={b: '2'}`);
    });
});
