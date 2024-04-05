const db = require('../config/db');
const {query} = require('../models/userModel');
const bcryptUtils = require('../utils/bcryptUtils');
const jwt = require('jsonwebtoken');// 引入jsonwebtoken, 用于生成token


let connection;
// 创建数据库连接
db.initializeDatabase().then(() => {
	connection = db.getDatabase();

	query(2, '15000002222').then((result) => {
		console.log(result);
		jwt.sign({user_id: result.user_id}, 'secret', {expiresIn: '1h'}, (err, token) => {
			if (err) {
				console.log(err);
				return;
			}
			console.log(token);
			bcryptUtils.hashPassword(token).then((hashedToken) => {
				console.log(hashedToken);
			});
			// 关闭数据库连接
			connection.end();
		});
	})
})