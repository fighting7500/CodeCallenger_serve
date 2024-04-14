/**
 * @Author: 17197
 * @Date: 2024/4/14
 * @Description: judge.js
 * @Version: 1.0
 * @Last Modified time : 2024/4/14
 **/
const questionModules = require('../models/questionModules');
const ExampleCodeSandbox = require('../judge/impl/ExampleCodeSandbox').default;

// 接收judge的订阅信息
const receiveSubscribe = async (strData) => {
	if (!strData) {
		return;
	}
	const data = JSON.parse(strData);
	// 通过problems_id查询题目信息
	const problem = await questionModules.getProblemById(data.problemId);
	const reqData = {...data, problem};
	try {
		const sandboxInstance = new ExampleCodeSandbox();
		return await sandboxInstance.execute(reqData);
	} catch (error) {
		console.log(error);
	}
}


module.exports = {
	receiveSubscribe
}