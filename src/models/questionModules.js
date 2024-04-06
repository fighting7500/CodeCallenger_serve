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
const getProblems = async (page, limit, categoryId, difficulty, name, id) => {
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
		if (id) {
			sql += ' AND id = ?';
			countSql += ' AND id = ?';
			params.push(id);
			countParams.push(id);
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

module.exports = {
	getCategories,
	getCategoriesCount,
	getProblems,
	getProblemById,
	getSources
}