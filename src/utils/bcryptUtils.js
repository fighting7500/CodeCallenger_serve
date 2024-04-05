const bcrypt = require('bcrypt');
const crypto = require('crypto');

const bcryptUtils = {
	async hashPassword(password) {
		const saltRounds = 10; // 加密强度
		return bcrypt.hash(password, saltRounds);
	},
	// 比较密码
	async comparePassword(password, hashedPassword) {
		return bcrypt.compare(password, hashedPassword);
	},
};

module.exports = bcryptUtils;