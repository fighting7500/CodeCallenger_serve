const fs = require('fs');
const path = require('path');
const learnModel = require('../models/learnModel');

// 获取背景图
exports.getBackground = async (req, res) => {
	const {imageName} = req.body;
	// 将source目录下的背景图返回给前端
	const filePath = path.resolve(__dirname, `../source/${imageName}`);
	const file = fs.readFileSync(filePath);
	if (fs.existsSync(filePath)) {
		fs.readFile(filePath, (err, data) => {
			if (err) {
				console.error(err);
				return res.sendRes(null, 500, '服务器错误');
			}
			res.setHeader('Content-Type', 'image/png');
			res.sendRes(data, 200, 'success');
		});
	} else {
		res.sendRes(null, 400, '文件不存在');
	}
}
