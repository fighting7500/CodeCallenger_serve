/**
 * @Author: 17197
 * @Date: 2024-04-14 23:01:59
 * @Description: codeSandBox.test.js
 * @Version: 1.0
 * @Last Modified time : 2024-04-14 23:01:59
 **/
const {ExampleCodeSandbox} = require('../judge/impl/exampleCodeSandbox');

async function runCode(reqData) {
	const sandboxInstance = new ExampleCodeSandbox();
	const result = await sandboxInstance.execute(reqData);
	console.log(result);
}

runCode({
	userId: 1,
	problemId: 1,
	code: 'console.log("Hello World!")',
	language: 'JavaScript'
}).then(r => {
	console.log(r);
}).catch(e => {
	console.log(e);
})