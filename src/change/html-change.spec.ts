import { UpdaterTest } from '../../test/updater/updater.test';
import { createCssSelectorForHtml } from '../selector';
import { HtmlChange } from './html-change';

describe('html-change', () => {
    let content = `<div id="abc"></div>`;
    it('替换标签名', () => {
        let selector = createCssSelectorForHtml(content);
        let element = selector.queryOne('div');
        let change = new HtmlChange();
        let result = change.replaceTagName(element, 'span');
        let newResult = UpdaterTest.update(content, result[1]);
        newResult = UpdaterTest.update(newResult, result[0]);
        expect(newResult).toBe(`<span id="abc"></span>`);
    });
    it('替换标签', () => {
        let selector = createCssSelectorForHtml(content);
        let element = selector.queryOne('div');
        let change = new HtmlChange();

        let result = change.replaceTag(element, '<span></span>');
        let newResult = UpdaterTest.update(content, result);
        expect(newResult).toBe(`<span></span>`);
    });
    it('删除标签', () => {
        let selector = createCssSelectorForHtml(content);
        let element = selector.queryOne('div');
        let change = new HtmlChange();
        let result = change.deleteTag(element);
        let newResult = UpdaterTest.update(content, result);
        expect(newResult).toBe('');
    });
    it('插入标签(beforebegin)', () => {
        let selector = createCssSelectorForHtml(content);
        let element = selector.queryOne('div');
        let change = new HtmlChange();
        let insertChange = change.insertTag(element, 'insertContent');
        let result = UpdaterTest.update(content, insertChange);
        expect(result).toBe('insertContent' + content);
    });
    it('插入标签(afterbegin)', () => {
        let selector = createCssSelectorForHtml(content);
        let element = selector.queryOne('div');
        let change = new HtmlChange();
        let insertChange = change.insertTag(element, 'insertContent', 'afterbegin');
        let result = UpdaterTest.update(content, insertChange);
        expect(result).toBe(`<div id="abc">insertContent</div>`);
    });
    it('插入标签(beforeend)', () => {
        let selector = createCssSelectorForHtml(content);
        let element = selector.queryOne('div');
        let change = new HtmlChange();
        let insertChange = change.insertTag(element, 'insertContent', 'beforeend');
        let result = UpdaterTest.update(content, insertChange);
        expect(result).toBe(`<div id="abc">insertContent</div>`);
    });
    it('插入标签(afterend)', () => {
        let selector = createCssSelectorForHtml(content);
        let element = selector.queryOne('div');
        let change = new HtmlChange();
        let insertChange = change.insertTag(element, 'insertContent', 'afterend');
        let result = UpdaterTest.update(content, insertChange);
        expect(result).toBe(content + 'insertContent');
    });
    it('插入标签属性', () => {
        let selector = createCssSelectorForHtml(content);
        let element = selector.queryOne('div');
        let change = new HtmlChange();
        let insertChange = change.insertTagAttribute(element, `name="test"`);
        let result = UpdaterTest.update(content, insertChange);
        expect(result).toBe(`<div id="abc" name="test"></div>`);
    });
    it('删除标签属性', () => {
        let selector = createCssSelectorForHtml(content);
        let element = selector.queryOne('div');
        let change = new HtmlChange();
        let insertChange = change.deleteTagAttribute(element, `id`);
        let result = UpdaterTest.update(content, insertChange);
        expect(result).toBe(`<div ></div>`);
    });
    it('设置标签属性', () => {
        let selector = createCssSelectorForHtml(content);
        let element = selector.queryOne('div');
        let change = new HtmlChange();
        let insertChange = change.setTagAttribute(element, `name="test" value="test"`);
        let result = UpdaterTest.update(content, insertChange);
        expect(result).toBe(`<div name="test" value="test"></div>`);
    });
    it('替换属性标签', () => {
        let selector = createCssSelectorForHtml(content);
        let element = selector.queryOne('div');
        let change = new HtmlChange();
        let insertChange = change.replaceTagAttribute(element.attrs[0], `id="mytest"`);
        let result = UpdaterTest.update(content, insertChange);
        expect(result).toBe(`<div id="mytest"></div>`);
    });
});
