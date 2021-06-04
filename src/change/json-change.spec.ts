import { Node } from 'jsonc-parser';
import { UpdaterTest } from '../../test/updater/updater.test';
import { createCssSelectorForJson } from '../selector/css-selector-for-json';
import { JsonChange } from './json-change';

describe('json-change', () => {
    let content = `{"key1":"value1"}`;
    let change: JsonChange;
    let node: Node;
    beforeEach(() => {
        let selector = createCssSelectorForJson(content);
        node = selector.queryOne('key1');
        change = new JsonChange();
    });
    it('替换key', () => {
        let replaceChange = change.replaceKey(node, '"key2"');
        let result = UpdaterTest.update(content, replaceChange);
        expect(result).toBe(`{"key2":"value1"}`);
    });
    it('替换value', () => {
        let replaceChange = change.replaceValue(node, '"value2"');
        let result = UpdaterTest.update(content, replaceChange);
        expect(result).toBe(`{"key1":"value2"}`);
    });
    it('删除节点(2)', () => {
        let content = `{"key1":"value1",
    "key2":"value2"}`;
        let selector = createCssSelectorForJson(content);
        node = selector.queryOne('key2');
        change = new JsonChange();
        let replaceChange = change.deleteNode(node);
        let result = UpdaterTest.update(content, replaceChange);
        expect(result).toBe(`{"key1":"value1"}`);
    });
    it('删除节点(1)', () => {
        let content = `{"key1":"value1"}`;
        let selector = createCssSelectorForJson(content);
        node = selector.queryOne('key1');
        change = new JsonChange();
        let replaceChange = change.deleteNode(node);
        let result = UpdaterTest.update(content, replaceChange);
        expect(result).toBe(`{}`);
    });
    it('插入节点(before)', () => {
        let replaceChange = change.insertNode(node, '"a":"b"');
        let result = UpdaterTest.update(content, replaceChange);
        expect(result).toBe(`{"a":"b","key1":"value1"}`);
    });
    it('插入节点(after)', () => {
        let replaceChange = change.insertNode(node, '"a":"b"', 'after');
        let result = UpdaterTest.update(content, replaceChange);
        expect(result).toBe(`{"key1":"value1","a":"b"}`);
    });
    it('插入子节点(0)', () => {
        let content = `{"key1":{}}`;
        let selector = createCssSelectorForJson(content);
        node = selector.queryOne('key1');
        change = new JsonChange();
        let replaceChange = change.insertChildNode(node, '"sub1":""');
        let result = UpdaterTest.update(content, replaceChange);
        expect(result).toBe(`{"key1":{"sub1":""}}`);
    });
    it('插入子节点(1)', () => {
        let content = `{"key1":{"sub1":""}}`;
        let selector = createCssSelectorForJson(content);
        node = selector.queryOne('key1');
        change = new JsonChange();
        let replaceChange = change.insertChildNode(node, '"sub2":""');
        let result = UpdaterTest.update(content, replaceChange);
        expect(result).toBe(`{"key1":{"sub1":"","sub2":""}}`);
    });
});
