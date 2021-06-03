import ts from 'typescript';
import { UpdaterTest } from '../../test/updater/updater.test';
import { createCssSelectorForTs } from '../selector';
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
});
