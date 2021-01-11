import { CssSelectorBase } from './css-selector-base';
import { AttributeSelector } from 'css-what';
interface MockNode {
    attrs?: { [name: string]: { value: string } };
    tag: string;
    children?: MockNode[];
}
class MockCssSelector extends CssSelectorBase<MockNode> {
    constructor(protected rootNode: MockNode) {
        super();
    }
    findTag(name, node: MockNode) {
        return name === node.tag;
    }
    getChildren(node: MockNode) {
        return node.children || [];
    }

    getTagAttribute(selector: AttributeSelector, node: MockNode) {
        return node.attrs && node.attrs[selector.name];
    }
}

const mockNode: MockNode = {
    tag: '__root',
    children: [
        { tag: 'div', attrs: { class: { value: 'test' }, id: { value: 'mock' } }, children: [{ tag: 'p', children: [{ tag: 'code' }] }] },
        { tag: 'span' },
    ],
};
describe('选择器基类', () => {
    let selector: MockCssSelector = new MockCssSelector(mockNode);
    // beforeEach(() => {})
    it('初始化', () => {
        expect(selector).toBeTruthy();
    });
    it('标签查询', () => {
        let result = selector.queryAll('div');
        // console.log(result)
        expect(result.length).toBe(1);
    });
    it('~', () => {
        let result = selector.queryAll('div~span');

        expect(result.length).toBe(1);
        expect(result[0].tag === 'span').toBeTrue();
    });
    it('>', () => {
        let result = selector.queryAll('div>p');

        expect(result.length).toBe(1);
        expect(result[0].tag === 'p').toBeTrue();
    });
    it(',', () => {
        let result = selector.queryAll('div,span');

        expect(result.length).toBe(2);
    });
    it('attribute equal', () => {
        let result = selector.queryAll('div[id=mock]');

        expect(result.length).toBe(1);
        expect(result[0].tag === 'div').toBeTruthy();
        expect(result[0].attrs['id']).toBeTruthy();
        expect(result[0].attrs['id'].value == 'mock').toBeTruthy();
    });
    it('attribute exist', () => {
        let result = selector.queryAll('div[id]');

        expect(result.length).toBe(1);
        expect(result[0].tag === 'div').toBeTruthy();
        expect(result[0].attrs['id']).toBeTruthy();
    });
    it('attribute any', () => {
        let result = selector.queryAll('div[id*=mo]');

        expect(result.length).toBe(1);
        expect(result[0].tag === 'div').toBeTruthy();
        expect(result[0].attrs['id']).toBeTruthy();
        expect(result[0].attrs['id'].value == 'mock').toBeTruthy();
    });
    it('.class', () => {
        let result = selector.queryAll('div.test');
        expect(result.length).toBe(1);
        expect(result[0].tag === 'div').toBeTruthy();
        expect(result[0].attrs['class']).toBeTruthy();
        expect(result[0].attrs['class'].value === 'test').toBeTruthy();
    });
    it('#id', () => {
        let result = selector.queryAll('#mock');
        expect(result.length).toBe(1);
        expect(result[0].tag === 'div').toBeTruthy();
        expect(result[0].attrs['id']).toBeTruthy();
        expect(result[0].attrs['id'].value === 'mock').toBeTruthy();
    });
    it('通过返回的element进行查询', () => {
        let result = selector.queryAll('div.test');
        expect(result.length).toBe(1);
        result = selector.queryAll(result[0], 'p');
        expect(result.length).toBe(1);
        expect(result[0].tag).toBe('p');
    });
    it('a b c', () => {
        let result = selector.queryAll('div  p code');
        expect(result.length).toBe(1);
        expect(result[0].tag === 'code').toBeTruthy();
    });
    it('复杂选择', () => {
        let result = selector.queryAll('div#mock.test[class=test][id=mock] p');
        expect(result.length).toBe(1);
        expect(result[0].tag === 'p').toBeTruthy();
    });
    it('不应该选中', () => {
        expect(selector.queryAll('div .test').length).toBe(0);
        expect(selector.queryAll('div [class=test]').length).toBe(0);
        expect(selector.queryAll('div #mock').length).toBe(0);
        expect(selector.queryAll('div>#mock').length).toBe(0);
        expect(selector.queryAll('div+#mock').length).toBe(0);
        expect(selector.queryAll('div~#mock').length).toBe(0);
        let result = selector.queryAll('div');
        expect(result[0]).toBeTruthy();
        expect(selector.queryAll(result[0], '.test').length).toBe(0);
        expect(selector.queryAll(result[0], 'p').length).toBe(1);
    });
});
