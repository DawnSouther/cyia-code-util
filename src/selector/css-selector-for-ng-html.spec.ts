import { createCssSelectorForNgHtml } from './css-selector-for-ng-html';

const mockHtml = `<div class="test" id="mock" *ngIf="xx" [name]="yyy" (output1)="zzz()" #ref1>
<p>123<code></code>  </p>
</div><span></span><ng-template let-variable1></ng-template>`;
describe('用于ng-html的css选择器', () => {
    it('初始化', () => {
        let cssSelector = createCssSelectorForNgHtml(mockHtml);
        expect(cssSelector).toBeTruthy();
    });
    it('标签查询', () => {
        let cssSelector = createCssSelectorForNgHtml(mockHtml);
        let result = cssSelector.queryAll('Element');
        expect(result.length).toBe(4);
    });
    it('input', () => {
        let cssSelector = createCssSelectorForNgHtml(mockHtml);
        let result = cssSelector.queryAll(`[input~=name]`);
        expect(result.length).toBe(1);
    });
    it('output', () => {
        let cssSelector = createCssSelectorForNgHtml(mockHtml);
        let result = cssSelector.queryAll(`[output~=output1]`);
        expect(result.length).toBe(1);
    });
    it('templateAttr', () => {
        let cssSelector = createCssSelectorForNgHtml(mockHtml);
        let result = cssSelector.queryAll(`[templateAttr~=ngIf]`);
        expect(result.length).toBe(1);
    });
    it('variable', () => {
        let cssSelector = createCssSelectorForNgHtml(mockHtml);
        let result = cssSelector.queryAll(`[variable]`);
        expect(result.length).toBe(1);
    });
    it('reference', () => {
        let cssSelector = createCssSelectorForNgHtml(mockHtml);
        let result = cssSelector.queryAll(`[reference]`);
        expect(result.length).toBe(1);
    });
    it('attribute', () => {
        let cssSelector = createCssSelectorForNgHtml(mockHtml);
        let result = cssSelector.queryAll(`[attribute~=class]`);
        expect(result.length).toBe(1);
    });
});
