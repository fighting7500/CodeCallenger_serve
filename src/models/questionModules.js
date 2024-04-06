/**
 * @Author: 17197
 * @Date: 2024/3/31
 * @Description: questionModules.js
 * @Version: 1.0
 * @Last Modified time : 2024/3/31
 **/
const {getDatabase} = require('../config/db');
// 获取题目分类
const getCategories = async () => {
	try {
		const sql = `SELECT * FROM categories`;
		const connection = getDatabase();
		const [rows] = await connection.execute(sql);
		return rows;
	} catch (error) {
		console.error(error);
		return error;
	}
}
// 根据分类id获取分类下的题目数量
const getCategoriesCount = async (categoryList) => {
	try {
		const sql = `SELECT category_id, COUNT(*) as count FROM problems WHERE category_id IN (${categoryList}) GROUP BY category_id`;
		const connection = getDatabase();
		const [rows] = await connection.execute(sql);
		return rows;
	} catch (error) {
		console.error(error);
		return error;
	}
}

// 查询题目列表
const getProblems = async (page, limit, categoryId, difficulty, name, id, sourceId, isIncludes = true) => {
	try {
		let sql = `SELECT * FROM problems WHERE 1 = 1`;
		let countSql = `SELECT COUNT(*) as total FROM problems WHERE 1 = 1`;
		let params = [];
		let countParams = [];
		if (categoryId) {
			sql += ' AND category_id = ?';
			countSql += ' AND category_id = ?';
			params.push(categoryId);
			countParams.push(categoryId);
		}
		if (difficulty) {
			sql += ' AND difficulty = ?';
			countSql += ' AND difficulty = ?';
			params.push(difficulty);
			countParams.push(difficulty);
		}
		if (name) {
			sql += ` AND name LIKE '%${name}%'`;
			countSql += ` AND name LIKE '%${name}%'`;
		}
		// id是一个数组
		if (id.length) {
			// isIncludes为true时，查询包含id的题目，为false时查询不包含id的题目
			if (isIncludes) {
				sql += ` AND id IN (${id.join(',')})`;
				countSql += ` AND id IN (${id.join(',')})`;
			} else {
				sql += ` AND id NOT IN (${id.join(',')})`;
				countSql += ` AND id NOT IN (${id.join(',')})`;
			}
		}
		if (sourceId) {
			sql += ' AND source_id = ?';
			countSql += ' AND source_id = ?';
			params.push(sourceId);
			countParams.push(sourceId);
		}
		sql += ` LIMIT ${(page - 1) * limit}, ${limit}`;
		const connection = getDatabase();
		const [rows] = await connection.execute(sql, params);
		const [countRows] = await connection.execute(countSql, countParams);
		const total = countRows[0].total;
		return {Rows: rows, total};
	} catch (error) {
		console.error(error);
		return error;
	}
}

// 通过id获取题目详情,分别从problems表和problem_details表中获取数据
const getProblemById = async (id) => {
	try {
		const sql = `SELECT * FROM problems WHERE id = ?`;
		const connection = getDatabase();
		const [rows] = await connection.execute(sql, [id]);
		const sql2 = `SELECT * FROM problem_details WHERE problem_id = ?`;
		const [rows2] = await connection.execute(sql2, [id]);
		return {...rows[0], ...rows2[0]};
	} catch (error) {
		console.error(error);
		return error;
	}
}

// 获取来源列表
const getSources = async () => {
	try {
		const sql = `SELECT * FROM sources`;
		const connection = getDatabase();
		const [rows] = await connection.execute(sql);
		return rows;
	} catch (error) {
		console.error(error);
		return error;
	}
}

// 根据状态和用户ID获取题目id
const getUserProblem = async (userId, status) => {
	try {
		const sql = `SELECT problem_id FROM submissions WHERE user_id = ? AND status = 1`;
		const connection = getDatabase();
		const [rows] = await connection.execute(sql, [userId]);
		return rows;
	} catch (error) {
		console.error(error);
		return error;
	}
}

// 获取统计数据
const getStatistics = async (userId) => {
	try {
		// 查询全部数据，对拿到的problem_id去重
		const sql = `SELECT * FROM submissions WHERE user_id = ?`;
		const connection = getDatabase();
		const [rows] = await connection.execute(sql, [userId]);
		return rows;
	} catch (error) {
		console.error(error);
		return error;
	}
}

// 获取排行榜
const getRankList = async () => {
	try {
		const sql = `SELECT user_id, COUNT(*) AS count FROM submissions WHERE status = '2' GROUP BY user_id ORDER BY count DESC LIMIT 10;`;
		const connection = getDatabase();
		// 获取到所有符合条件的用户id,返回的是一个数组，元素是user_id和count
		const [rows] = await connection.execute(sql);
		// 如果没有数据，直接返回空数组
		if (!rows.length) {
			return [];
		}
		// 通过数组的用户id拼成一个字符串
		const userIds = rows.map(item => item.user_id).join(',');
		// 通过用户id查询用户username和avatar
		const sql2 = `SELECT id, username, avatar FROM users WHERE id IN (${userIds})`;
		const [rows2] = await connection.execute(sql2);
		// 将两个数组通过user_id进行合并
		return rows.map(item => {
			const user = rows2.find(user => user.id === item.user_id);
			return {...item, ...user};
		});
	} catch (error) {
		console.error(error);
		return error;
	}
}

// 获取题目详情
const getProblemDetail = async (id) => {
	try {
		const sql = `SELECT * FROM problems WHERE id = ?`;
		// problem_details,solutions, comments, submissions都要查询
		const sql2 = `SELECT * FROM problem_details WHERE problem_id = ?`;
		const sql3 = `SELECT * FROM solutions WHERE problem_id = ?`;
		const sql4 = `SELECT * FROM comments WHERE problem_id = ?`;
		const connection = getDatabase();
		const [rows] = await connection.execute(sql, [id]);
		const [rows2] = await connection.execute(sql2, [id]);
		const [rows3] = await connection.execute(sql3, [id]);
		const [rows4] = await connection.execute(sql4, [id]);
		let sample_input = JSON.parse(rows2[0].sample_input);
		let sample_output = JSON.parse(rows2[0].sample_output);
		let sample_remark = JSON.parse(rows2[0].sample_remark);
		// 将这三个数组对应的数据拼接为一个字符串
		let str = '';
		sample_input.forEach((item, index) => {
			str += `#### 示例${index + 1}: \n > **输入**：${item}\n`;
			str += ` > **输出**：${sample_output[index]}\n`;
			if (sample_remark[index]) {
				str += ` > **解释**：${sample_remark[index]}\n\n`;
			}
		})
		rows2[0].content += '\n\n' + str;
		return {problem: rows[0], problem_details: rows2[0], solutions: rows3, comments: rows4};
	} catch (error) {
		console.error(error);
		return error;
	}
}

module.exports = {
	getCategories,
	getCategoriesCount,
	getProblems,
	getProblemById,
	getSources,
	getUserProblem,
	getStatistics,
	getRankList,
	getProblemDetail
}