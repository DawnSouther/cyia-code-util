import { createCssSelectorForJson } from './css-selector-for-json';
let mockJsonString = `{"p1":1,"p2":"2","p3":{"p31":{"p32":"value32","p31":"strp32"}}}`;
function createSelector(str: string = mockJsonString) {
    return createCssSelectorForJson(str);
}

describe('用于json的css选择器', () => {
    it('初始化', () => {
        let jsonSelector = createCssSelectorForJson('{"name":1}');
        expect(jsonSelector).toBeTruthy();
    });
    it('默认', () => {
        let selector = createSelector(`{"name":1}`);
        let result = selector.queryOne('name');
        expect(result.children[0].value).toBe('name');
        expect(result.children[1].value).toBe(1);
    });
    it('~', () => {
        let cssSelctor = createSelector();
        let result = cssSelctor.queryAll('p1~p3');

        expect(result.length).toBe(1);
        expect(result[0].children[0].value).toBe('p3');
        expect(result[0].children[1].type).toBe('object');
    });
    it('>', () => {
        let cssSelctor = createSelector();
        let result = cssSelctor.queryAll('p3>p31');

        expect(result.length).toBe(1);
        expect(result[0].children[0].value).toBe('p31');
        expect(result[0].children[1].type).toBe('object');
        expect(result[0].children[1].value).not.toBe('strp32');
        // expect(result[0].name === 'p').toBeTrue();
    });
    it(',', () => {
        let cssSelctor = createSelector();
        let result = cssSelctor.queryAll('p1,p3');

        expect(result.length).toBe(2);
    });
    it('attribute equal', () => {
        let selector = createSelector(`{"name":1}`);
        let result = selector.queryOne('name[value=1][type=number]');
        expect(result.children[0].value).toBe('name');
        expect(result.children[1].value).toBe(1);
    });
    it('attribute any', () => {
        let selector = createSelector();
        let result = selector.queryAll('[value*=32]');
        expect(result.length).toBe(2);
    });
    it('a b c', () => {
        let selector = createSelector();
        let result = selector.queryAll('p3 p31 p32');
        expect(result.length).toBe(1);
    });
    it('通过返回的node进行查询', () => {
        let selector = createSelector();
        let result = selector.queryOne('p3');
        result = selector.queryOne(result, 'p31 p32');
        expect(result).toBeTruthy();
    });
    it('解析失败抛出异常', () => {
        try {
            createCssSelectorForJson(`{a:1}`);
        } catch (error) {
            return expect(error).toBeTruthy();
        }
        throw new Error('');
    });
});
