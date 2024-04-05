// token校验
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
	// console.log(req.headers)
	const token = req.signedCookies.access_token;
	if (!token) {
		// 没有token，返回401错误
		return res.sendRes(null, 405, 'Token不存在');
	}
	jwt.verify(token, 'secret', (err, decoded) => {
		if (err) {
			return res.sendRes(null, 401, 'Token已过期，请重新登陆');
		}
		req.user = decoded; // 将解析出来的用户信息赋值给req.user
		next();
	});
}

module.exports = authMiddleware;
