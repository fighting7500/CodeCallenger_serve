/**
 * @Author: 17197
 * @Date: 2024-04-14 22:51:56
 * @Description: exampleCodeSandbox.ts
 * @Version: 1.0
 * @Last Modified time : 2024-04-14 22:51:56
 **/
import {codeSandBox} from '../codeSandBox';

export default class ExampleCodeSandbox implements codeSandBox {
    /**
     * @param {Object} input
     * @return {Promise<any>}
     */
    execute(input: Object): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log('execute code in example code sandbox');
            resolve('example code sandbox result');
        });
    }
}
