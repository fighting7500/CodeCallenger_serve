const judgeModel = require('../../models/judge/judgeModel');
const {spawn} = require('child_process');
const path = require('path');
const fs = require('fs');

// 接收代码保存到数据库
exports.runCode = async (req, res) => {
	const {userId, problemId, code, language} = req.body;
	try {
		const result = await judgeModel.saveCodeToDatabase(userId, problemId, code, language);
		if (result) {
			console.log('保存代码成功');
			res.sendRes(null, 200, '保存代码成功');
		} else {
			console.log('保存代码失败');
			res.sendRes(null, 400, '保存代码失败');
		}
	} catch (error) {
		console.log(error);
		res.sendRes(null, 500, '服务器错误');
	}
}

