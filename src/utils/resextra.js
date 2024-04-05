// 添加统一的返回结果方法
const sendRes = (res, data, code, message = 'success') => {
	res.json({
		"msg": message,
		"data": data,
		"status": code
	});
};
const authMiddleware = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1]; // 获取token
	if (token == null) {
		return res.sendStatus(401); // 如果没有token，返回401错误
	}
	// 在这里添加你的token验证逻辑
	// 如果token有效，调用next()继续处理请求
	// 如果token无效，返回错误响应
	if (isValidToken(token)) { // 假设你有一个isValidToken函数来验证token
		next(); // token有效，继续处理请求
	} else {
		res.sendStatus(403); // token无效，返回403错误
	}
};
module.exports = {sendRes, authMiddleware};