const judgeModel = require('../../models/judge/judgeModel');
const redisClient = require('../../config/redisConfig');
const judge = require('../../judge/judge');

// 提交并运行
exports.runCode = async (req, res) => {
	const {userId, problemId, code, language, isSubmit} = req.body;
	try {
		// 判断是否为提交
		if (isSubmit) {
			// 保存代码到数据库
			const resultID = await judgeModel.saveCodeToDatabase(userId, problemId, code, language);
			// 将ID通过Redis发布到消息队列
			await redisClient.publishMessage('judge', JSON.stringify({resultID, userId, problemId, code, language}));
			res.sendRes(null, 200, '提交成功');
		} else {
			// 调用判题模块
			const result = await judge.receiveSubscribe(JSON.stringify({
				resultID: null,
				userId,
				problemId,
				code,
				language
			}));
			res.sendRes(result, 200, '提交成功');
		}
		// 将ID通过Redis发布到消息队列
		// await redisClient.publishMessage('judge', JSON.stringify({resultID, userId, problemId, code, language}));
	} catch (error) {
		console.log(error);
		res.sendRes(null, 500, '服务器错误');
	}
}


// 运行
exports.runCodeById = async (req, res) => {
	const {userId, problemId, code, language} = req.body;
	try {
		// 调用判题模块
		const result = await judge.receiveSubscribe(JSON.stringify({
			resultID: null,
			userId,
			problemId,
			code,
			language
		}));
		res.sendRes(result, 200, '提交成功');
	} catch (error) {
		console.log(error);
		res.sendRes(null, 500, '服务器错误');
	}
}
