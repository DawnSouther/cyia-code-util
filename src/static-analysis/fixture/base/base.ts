import { beImportFn } from './be-import';

function pureFunction(b) {
    let a = 1;
    return a + b;
}
pureFunction(789);
const a = 1;
function unPureFunction(b) {
    return a + b;
}
unPureFunction(789);

function pureFunctionUseArray(b) {
    let a = new Array();
    return a + b;
}
function pureFunctionUseExternal(b) {
    let a = beImportFn();
    return a + b;
}
