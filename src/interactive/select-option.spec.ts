import { selectOption } from './select-option';
// import * as readline from "readline";
xdescribe('[手动]选择选项', () => {
    // todo 封装之前是可以result.ui.rl 拿到实例模拟传入的,但是封装后丢失
    it('执行', (done) => {
        let result = selectOption(
            [
                { label: 't1', value: 'an1' },
                { label: 't2', value: 'an2' },
            ],
            '请选择选项'
        );
        result.then((res) => {
            expect(res).toBe('an1');
            done();
        });
    });
    // let re=readline.createInterface(process.stdin,process.stdout)
    // re.emit('line')
});
