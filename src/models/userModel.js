// 用户数据模型
// getDatabase
const {getDatabase} = require('../config/db');
// 查找用户信息
const query = async (type, data) => {
	// type有1,2,3,4
	console.log('查询用户信息:', type, data);
	let field = '';
	switch (type) {
		case '1':
			field = 'username';
			break;
		case '2':
			field = 'phone';
			break;
		case '3':
			field = 'email';
			break;
		case '4':
			field = 'id';
			break;
	}
	console.log('field:', field)
	try {
		const sql = `SELECT * FROM users WHERE ${field} = ?`;
		console.log(sql, data);
		const connection = getDatabase();
		const [rows] = await connection.execute(sql, [data]);
		return rows[0];
	} catch (error) {
		console.error(error);
		return null;
	}
}

// 创建用户
const createUser = async (data) => {
	try {
		if (!data.avatar) {
			data.avatar = '/uploads/avatar/defaultAvatar.svg';
		}
		let sql = `INSERT INTO users (phone, password`;
		let params = [data.UserMobile, data.Password];

		// 可选参数
		data.UserName && (sql += ', username') && params.push(data.UserName);
		data.Email && (sql += ', email') && params.push(data.Email);
		data.location && (sql += ', location') && params.push(data.location);
		data.school && (sql += ', school') && params.push(data.school);
		data.skills_tags && (sql += ', skills_tags') && params.push(data.skills_tags);
		data.avatar && (sql += ', avatar') && params.push(data.avatar);

		sql += ') VALUES (?, ?';
		sql += data.UserName ? ', ?' : '';
		sql += data.Email ? ', ?' : '';
		sql += data.location ? ', ?' : '';
		sql += data.school ? ', ?' : '';
		sql += data.skills_tags ? ', ?' : '';
		sql += data.avatar ? ', ?' : '';
		sql += ')';

		const connection = getDatabase();
		await connection.execute(sql, params);
		console.log('注册成功');
	} catch (error) {
		console.error(error);
		return error;
	}
}

// 查询今日登录信息
const queryTodayLogin = async (user_id) => {
	try {
		const sql = `SELECT * FROM login_records WHERE user_id = ? AND DATE(login_date) = CURDATE()`;
		const connection = getDatabase();
		const [rows] = await connection.execute(sql, [user_id]);
		return rows[0];
	} catch (error) {
		console.error(error);
		return error;
	}
}

// 查询昨天是否登录
const queryYesterdayLogin = async (user_id) => {
	try {
		const sql = `SELECT * FROM login_records WHERE user_id = ? AND DATE(login_date) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)`;
		const connection = getDatabase();
		const [rows] = await connection.execute(sql, [user_id]);
		return rows[0];
	} catch (error) {
		console.error(error);
		return error;
	}
}

// 创建登录记录
const insertLoginRecord = async (user_id, days) => {
	try {
		const sql = `INSERT INTO login_records (user_id, consecutive_days) VALUES (?, ?)`;
		const connection = getDatabase();
		console.log('插入登录记录:', user_id, days)
		await connection.execute(sql, [user_id, days]);
	} catch (error) {
		console.error(error);
		return error;
	}
}

// 重置密码
const resetPassword = async (id, password) => {
	try {
		const sql = `UPDATE users SET password = ? WHERE id = ?`;
		const connection = getDatabase();
		await connection.execute(sql, [password, id]);
		console.log('重置密码成功');
	} catch (error) {
		console.error(error);
		return error;
	}
}

module.exports = {
	query,
	createUser,
	queryTodayLogin,
	queryYesterdayLogin,
	insertLoginRecord,
	resetPassword
};
