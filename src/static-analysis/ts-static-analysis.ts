import ts from 'typescript';
export class Context {
    symbolTable: Set<ts.Symbol> = new Set();
    unDeclarationList: ts.Node[] = [];
    children: Context[] = [];
    constructor(public parent: Context) {
        this.parent && this.parent.children.push(this);
    }
    hasSymbol(symbol: ts.Symbol) {
        return this.symbolTable.has(symbol) || (this.parent && this.parent.hasSymbol(symbol));
    }
    hasUnDeclarationList() {
        return !!this.unDeclarationList.length && this.children.every((child) => child.hasUnDeclarationList());
    }
    getUnDeclarationList(): ts.Node[] {
        return [
            ...this.unDeclarationList,
            ...this.children
                .map((item) => item.getUnDeclarationList())
                .reduce((pre, cur) => {
                    pre.push(...cur);
                    return pre;
                }, []),
        ];
    }
}
export class TsStaticAnalysis {
    private typeChecker: ts.TypeChecker;
    constructor(private program: ts.Program) {
        this.typeChecker = this.program.getTypeChecker();
    }
    checkCallExpression(node: ts.CallExpression) {
        let symbol = this.typeChecker.getSymbolAtLocation(node.expression);
        return this.checkIfPureFunction(symbol.valueDeclaration as ts.FunctionDeclaration);
    }
    /**
     * 检查是否为纯函数
     * 1. 参数为一个声明
     * 2. 内部为一个声明,但是仅限一级
     * 3. 如果内部有函数调用,查这个函数是否是纯函数
     * todo
     * 简化判断,只要在调用函数内,出现标识符为外部的,并且不是d.ts中的,就认为是非纯函数
     */
    checkIfPureFunction(functionDeclarationNode: ts.FunctionDeclaration, parentContext?: Context) {
        // let context = new Context(parentContext);
        // context.symbolTable.add(this.typeChecker.getSymbolAtLocation(node.name));
        // node.parameters.forEach((node) => {
        //     if (this.checkFunctionParament(node, context)) {
        //         let symbol = this.findDeclarationSymbol(node);
        //         if (symbol && !context.symbolTable.has(symbol)) {
        //             context.symbolTable.add(symbol);
        //         }
        //     } else {
        //         context.unDeclarationList.push(node);
        //     }
        // });
        // /**
        //  * todo 应该先看当前函数的声明(排除函数内部的)
        //  */
        // ts.forEachChild(node.body, (node) => {
        //     let symbol = this.findDeclarationSymbol(node);
        //     if (symbol && !context.symbolTable.has(symbol)) {
        //         context.symbolTable.add(symbol);
        //     }
        //     if (ts.isFunctionDeclaration(node)) {
        //         this.checkIfPureFunction(node, context);
        //     }
        // });
        // ts.forEachChild(node.body, (node) => {
        //     if (ts.isIdentifier(node)) {
        //         if (!context.hasSymbol(this.typeChecker.getSymbolAtLocation(node))) {
        //             context.unDeclarationList.push(node);
        //         }
        //     }
        // });

        // return {
        //     result: !context.hasUnDeclarationList(),
        //     unDeclarationList: context.getUnDeclarationList(),
        // };
        console.log(functionDeclarationNode.pos, functionDeclarationNode.end);
        let list = [];
        visitNode(functionDeclarationNode, (node) => {
            if (ts.isIdentifier(node)) {
                let symbol = this.typeChecker.getSymbolAtLocation(node);

                // console.log(ts.isNamespaceImport(symbol.declarations[0]), ts.SyntaxKind[symbol.declarations[0].kind]);
                let declaration = symbol.declarations[0];
                if (!declaration) {
                    return list.push(node);
                }
                if (declaration.getSourceFile() === functionDeclarationNode.getSourceFile()) {
                    if (!this.isDeclarationInFunction(declaration, functionDeclarationNode)) {
                        if (ts.isImportSpecifier(declaration)) {
                            let importDeclaration = declaration.parent.parent.parent;
                            let sf = importDeclaration.getSourceFile();
                            sf.referencedFiles;
                            sf;
                            importDeclaration.moduleSpecifier.getText();
                            this.program.getProjectReferences();
                            // this.program.getSourceFileByPath()
                            //    this.typeChecker.exte
                        }
                    }
                } else {
                    if (!declaration.getSourceFile().fileName.endsWith('.d.ts')) {
                        list.push(node);
                    }
                }
            }
        });
        return { result: !list.length };
    }
    private findDeclarationSymbol(node) {
        if (ts.isVariableDeclaration(node) || ts.isParameter(node)) {
            let symbol = this.typeChecker.getSymbolAtLocation(node.name);
            return symbol;
        }
    }
    private findIdentifierSymbol(node: ts.Node, table: Set<ts.Symbol>) {
        let symbol = this.typeChecker.getSymbolAtLocation(node);

        return symbol && table.has(symbol);
    }
    private checkFunctionParament(node: ts.ParameterDeclaration, context: Context) {
        if (node.initializer) {
            let symbol = this.typeChecker.getSymbolAtLocation(node.initializer);
            if (context.symbolTable.has(symbol)) {
                return true;
            }
            return false;
        }
        return true;
    }
    private getFunctionStatements(node: ts.FunctionDeclaration) {
        node.body.statements.forEach((node) => {});
    }
    private isDeclarationInFunction(node: ts.Node, functionDeclarationNode: ts.FunctionDeclaration) {
        return node.pos >= functionDeclarationNode.pos && node.end <= functionDeclarationNode.end;
    }
}
function visitNode(node: ts.Node, callback: (node: ts.Node) => any) {
    ts.forEachChild(node, (node) => {
        callback(node);
        visitNode(node, callback);
    });
}
