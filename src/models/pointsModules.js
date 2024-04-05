/**
 * @Author: 17197
 * @Date: 2024/3/30
 * @Description: pointsModules.js
 * @Version: 1.0
 * @Last Modified time : 2024/3/30
 **/
const {getDatabase} = require('../config/db');
const pointsRules = require('../config/points');
// 获取用户积分
const getPoints = async (user_id) => {
	try {
		const sql = `SELECT SUM(points) as points FROM user_points WHERE user_id = ?`;
		const connection = getDatabase();
		const [rows] = await connection.execute(sql, [user_id]);
		return rows[0].points;
	} catch (error) {
		console.error(error);
		return error;
	}
}
// 增加积分
const addPoints = async (user_id, type, days = 0) => {
	try {
		let points = pointsRules[type].points;
		// 连续登录，判断只有days为3，7，15，30时才增加积分
		if (type === 'continuousLogin' && [3, 7, 15, 30].includes(days)) {
			switch (days) {
				case 3:
					points = points[0];
					break;
				case 7:
					points = points[1];
					break;
				case 15:
					points = points[2];
					break;
				case 30:
					points = points[3];
					break;
			}
		}
		const description = pointsRules[type].description;
		const sql = `INSERT INTO user_points (user_id, points, source) VALUES (?, ?, ?)`;
		const connection = getDatabase();
		await connection.execute(sql, [user_id, points, description]);
		console.log('增加积分:', points);
		return points;
	} catch (error) {
		console.error(error);
		return error;
	}
}

module.exports = {
	getPoints,
	addPoints
}

