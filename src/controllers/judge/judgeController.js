const judgeModel = require('../../models/judge/judgeModel');
const redisClient = require('../../config/redisConfig');
const judge = require('../../judge/judge');

// 接收代码
exports.runCode = async (req, res) => {
	const {userId, problemId, code, language} = req.body;
	try {
		const resultID = await judgeModel.saveCodeToDatabase(userId, problemId, code, language);
		// 将ID通过Redis发布到消息队列
		// await redisClient.publishMessage('judge', JSON.stringify({resultID, userId, problemId, code, language}));
		// 调用判题模块
		const result = await judge.receiveSubscribe(JSON.stringify({resultID, userId, problemId, code, language}));
		console.log('接收到的结果是：', result);
	} catch (error) {
		console.log(error);
		res.sendRes(null, 500, '服务器错误');
	}
}

