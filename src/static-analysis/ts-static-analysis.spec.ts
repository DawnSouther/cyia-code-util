import ts from 'typescript';
import * as path from 'path';
import { TsStaticAnalysis } from './ts-static-analysis';
import { createCssSelectorForTs } from '../selector/css-selector-for-ts';
fdescribe('ts-static-analysis-check', () => {
    it('base', () => {
        let fileName = path.resolve(__dirname, './fixture/base/base.ts');
        let program = ts.createProgram({ rootNames: [fileName], options: {} });
        let sf = program.getSourceFile(fileName);

        let instance = new TsStaticAnalysis(program);
        let selector = createCssSelectorForTs(sf);
        let fnNode: ts.FunctionDeclaration;
        //  = selector.queryOne('FunctionDeclaration[name=pureFunction]') as any;
        let result;
        // = instance.checkIfPureFunction(fnNode);
        // expect(result.result).toBe(true);
        fnNode = selector.queryOne('FunctionDeclaration[name=pureFunctionUseExternal]') as any;
        result = instance.checkIfPureFunction(fnNode);
        expect(result.result).toBe(false);
        // let callExpressionNode = selector.queryOne('CallExpression[expression=pureFunction]') as any;
        // instance.checkCallExpression(callExpressionNode);
        // expect(result.result).toBe(false);
    });
});
