import * as ts from 'typescript';
import { createCssSelectorForTs } from './css-selector-for-ts';

function createSourceFile(content: string, name = '') {
    return ts.createSourceFile(name, content, ts.ScriptTarget.Latest, false, ts.ScriptKind.TSX);
}
function mockSourceFile() {
    return createSourceFile('');
}
describe('用于ts node的css选择器', () => {
    it('初始化', () => {
        let sourceFile = mockSourceFile();
        let cssSelector = createCssSelectorForTs(sourceFile);
        expect(cssSelector).toBeTruthy();
    });
    it('默认', () => {
        let cssSelctor = createCssSelectorForTs(createSourceFile('let a=6'));
        let result = cssSelctor.queryAll('VariableDeclaration Identifier');
        expect(result.length).toBe(1);
    });
    it('~', () => {
        let cssSelctor = createCssSelectorForTs(createSourceFile('let a=6'));
        let result = cssSelctor.queryAll('Identifier~NumericLiteral');

        expect(result.length).toBe(1);
        expect(result[0].kind === ts.SyntaxKind.NumericLiteral).toBeTrue();
    });
    it('>', () => {
        let cssSelctor = createCssSelectorForTs(createSourceFile('let a=6'));
        let result = cssSelctor.queryAll('VariableDeclaration>Identifier');

        expect(result.length).toBe(1);
        expect(result[0].kind === ts.SyntaxKind.Identifier).toBeTrue();
    });
    it(',', () => {
        let cssSelctor = createCssSelectorForTs(createSourceFile('let a=6'));
        let result = cssSelctor.queryAll('VariableDeclaration,Identifier');

        expect(result.length).toBe(2);
    });
    it('attribute equal', () => {
        let cssSelctor = createCssSelectorForTs(createSourceFile('let a=6'));
        let result = cssSelctor.queryAll('VariableDeclaration[name=a]');

        expect(result.length).toBe(1);
        expect(result[0].kind).toBe(ts.SyntaxKind.VariableDeclaration);
    });
    it('attribute exist', () => {
        let cssSelctor = createCssSelectorForTs(createSourceFile('let a=6'));
        let result = cssSelctor.queryAll('VariableDeclaration[name]');

        expect(result.length).toBe(1);
        expect(result[0].kind).toBe(ts.SyntaxKind.VariableDeclaration);
    });
    it('attribute any', () => {
        let cssSelctor = createCssSelectorForTs(createSourceFile('let a=689'));
        let result = cssSelctor.queryAll('VariableDeclaration[initializer*=8]');

        expect(result.length).toBe(1);
        expect(result[0].kind).toBe(ts.SyntaxKind.VariableDeclaration);
    });
    it('传入字符串', () => {
        let cssSelctor = createCssSelectorForTs('let a=689');
        let result = cssSelctor.queryAll('VariableDeclaration');

        expect(result.length).toBe(1);
        expect(result[0].kind).toBe(ts.SyntaxKind.VariableDeclaration);
    });
    it('普通 node 做根节点', () => {
        let sourceFile = ts.createSourceFile('', `let a=[1,2]`, ts.ScriptTarget.Latest, true);
        let cssSelctor = createCssSelectorForTs(sourceFile);
        let nodeSelector = createCssSelectorForTs(cssSelctor.queryOne('ArrayLiteralExpression'));
        let result = nodeSelector.queryAll('NumericLiteral');
        expect(result.length).toBe(2);
        expect(result[0].kind).toBe(ts.SyntaxKind.NumericLiteral);
    });
    it('普通 node 做根节点(属性查询)', () => {
        let sourceFile = ts.createSourceFile('', `let a={b:1}`, ts.ScriptTarget.Latest);
        let cssSelctor = createCssSelectorForTs(sourceFile);
        let nodeSelector = createCssSelectorForTs(cssSelctor.queryOne('ObjectLiteralExpression'));
        let result = nodeSelector.queryAll('PropertyAssignment[name=b]');
        expect(result.length).toBe(0);
        nodeSelector.setSourceFile(sourceFile);
        result = nodeSelector.queryAll('PropertyAssignment[name=b]');
        expect(result.length).toBe(1);
        expect(result[0].kind).toBe(ts.SyntaxKind.PropertyAssignment);
    });
});
