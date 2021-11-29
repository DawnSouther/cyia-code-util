import { createCssSelectorForHtml } from './css-selector-for-html';

const mockHtml = `<div class="test" id="mock">
<p>123<code></code>  </p>
</div><span></span>`;
describe('用于ts node的css选择器', () => {
    it('初始化', () => {
        let cssSelector = createCssSelectorForHtml(mockHtml);
        expect(cssSelector).toBeTruthy();
    });
    it('标签查询', () => {
        let cssSelector = createCssSelectorForHtml(mockHtml);

        let result = cssSelector.queryAll('div');
        // console.log(result)
        expect(result.length).toBe(1);
    });
    it('~', () => {
        let cssSelector = createCssSelectorForHtml(mockHtml);
        let result = cssSelector.queryAll('div~span');

        expect(result.length).toBe(1);
        expect(result[0].name === 'span').toBeTrue();
    });
    it('>', () => {
        let cssSelector = createCssSelectorForHtml(mockHtml);
        let result = cssSelector.queryAll('div>p');

        expect(result.length).toBe(1);
        expect(result[0].name === 'p').toBeTrue();
    });
    it(',', () => {
        let cssSelector = createCssSelectorForHtml(mockHtml);
        let result = cssSelector.queryAll('div,span');

        expect(result.length).toBe(2);
    });
    it('attribute equal', () => {
        let cssSelctor = createCssSelectorForHtml(mockHtml);
        let result = cssSelctor.queryAll('div[id=mock]');

        expect(result.length).toBe(1);
        expect(result[0].name === 'div').toBeTruthy();
        expect(result[0].attrs.find((item) => item.name == 'id' && item.value == 'mock')).toBeTruthy();
    });
    it('attribute exist', () => {
        let cssSelector = createCssSelectorForHtml(mockHtml);
        let result = cssSelector.queryAll('div[id]');

        expect(result.length).toBe(1);
        expect(result[0].name === 'div').toBeTruthy();
        expect(result[0].attrs.find((item) => item.name == 'id')).toBeTruthy();
    });
    it('attribute any', () => {
        let cssSelector = createCssSelectorForHtml(mockHtml);
        let result = cssSelector.queryAll('div[id*=mo]');

        expect(result.length).toBe(1);
        expect(result[0].name === 'div').toBeTruthy();
        expect(result[0].attrs.find((item) => item.name == 'id' && item.value == 'mock')).toBeTruthy();
    });
    it('.class', () => {
        let cssSelector = createCssSelectorForHtml(mockHtml);
        let result = cssSelector.queryAll('div.test');
        expect(result.length).toBe(1);
        expect(result[0].name === 'div').toBeTruthy();
        expect(result[0].attrs.find((item) => item.value == 'test')).toBeTruthy();
    });
    it('#id', () => {
        let cssSelector = createCssSelectorForHtml(mockHtml);
        let result = cssSelector.queryAll('#mock');
        expect(result.length).toBe(1);
        expect(result[0].name === 'div').toBeTruthy();
        expect(result[0].attrs.find((item) => item.value == 'test')).toBeTruthy();
    });
    it('通过返回的element进行查询', () => {
        let cssSelector = createCssSelectorForHtml(mockHtml);
        let result = cssSelector.queryAll('div.test');
        expect(result.length).toBe(1);
        result = cssSelector.queryAll(result[0], 'p');
        expect(result.length).toBe(1);
        expect(result[0].name).toBe('p');
    });
    it('a b c', () => {
        let cssSelector = createCssSelectorForHtml(mockHtml);
        let result = cssSelector.queryAll('div  p code');
        expect(result.length).toBe(1);
        expect(result[0].name === 'code').toBeTruthy();
    });
    it('复杂选择', () => {
        let cssSelector = createCssSelectorForHtml(mockHtml);
        let result = cssSelector.queryAll('div#mock.test[class=test][id=mock] p');
        expect(result.length).toBe(1);
        expect(result[0].name === 'p').toBeTruthy();
    });
    it('不应该选中', () => {
        let cssSelector = createCssSelectorForHtml(mockHtml);

        expect(cssSelector.queryAll('div .test').length).toBe(0);
        expect(cssSelector.queryAll('div [class=test]').length).toBe(0);
        expect(cssSelector.queryAll('div #mock').length).toBe(0);
        expect(cssSelector.queryAll('div>#mock').length).toBe(0);
        expect(cssSelector.queryAll('div+#mock').length).toBe(0);
        expect(cssSelector.queryAll('div~#mock').length).toBe(0);
    });
    it('*', () => {
        let cssSelector = createCssSelectorForHtml(mockHtml);
        expect(cssSelector.queryAll('*').length).toBe(4);
        expect(cssSelector.queryAll('div *').length).toBe(2);
    });
    it('解析失败抛出异常', () => {
        try {
            createCssSelectorForHtml(`<div <div>`);
        } catch (error) {
            return expect(error).toBeTruthy();
        }
        throw new Error('');
    });
});
