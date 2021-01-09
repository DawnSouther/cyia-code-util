import { selectOption } from './select-option';
import * as inquirer from 'inquirer';
import * as readline from 'readline';
function hookPrompt() {
    let ui = inquirer.ui;
    let Prompt = ui.Prompt;
    let currentRl: readline.Interface;
    ui.Prompt = class Hook extends Prompt {
        constructor(...args) {
            super(args[0], args[1]);
            currentRl = this.rl;
        }
    } as any;
    return {
        getCurrentRl: () => {
            return currentRl;
        },
        reset: () => {
            ui.Prompt = Prompt;
        },
    };
}

describe('[手动]选择选项', () => {
    let hookGroup = hookPrompt();
    let rl: readline.Interface;

    it('执行', (done) => {
        hookPrompt();
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
        rl = hookGroup.getCurrentRl();
        rl.emit('line');
        rl.close();
    });

    afterAll(() => {
        hookGroup.reset();
    });
});
