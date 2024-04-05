/**
 * @Author: 17197
 * @Date: 2024/4/4
 * @Description: userModules.js
 * @Version: 1.0
 * @Last Modified time : 2024/4/4
 **/
const {getDatabase} = require('../../config/db');


// 查询用户列表
const queryUserList = async (page, limit, id, phone, role) => {
	try {
		let sql = `SELECT * FROM users WHERE 1 = 1`;
		let countSql = `SELECT COUNT(*) as total FROM users WHERE 1 = 1`;
		let params = [];
		let countParams = [];
		if (id) {
			sql += ' AND id = ?';
			countSql += ' AND id = ?';
			params.push(id);
			countParams.push(id);
		}
		if (phone) {
			sql += ' AND phone = ?';
			countSql += ' AND phone = ?';
			params.push(phone);
			countParams.push(phone);
		}
		if (role) {
			sql += ' AND role = ?';
			countSql += ' AND role = ?';
			params.push(role);
			countParams.push(role);
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

// 新增用户
const addUser = async (username, password, mobile, role, email) => {
	try {
		// 邮箱是可选参数
		let avatar = '/uploads/avatar/defaultAvatar.svg';
		let sql = `INSERT INTO users (username, password, phone, role, avatar`;
		let params = [username, password, mobile, role, avatar];
		sql += email ? ', email' : '';
		email && params.push(email);
		sql += ') VALUES (?, ?, ?, ?, ?';
		sql += email ? ', ?' : '';
		sql += ')';
		const connection = getDatabase();
		const [rows] = await connection.execute(sql, params);
		return rows;
	} catch (error) {
		console.error(error);
		return error;
	}
}

// 删除用户
const deleteUser = async (id) => {
	try {
		const sql = `DELETE FROM users WHERE id = ?`;
		const connection = getDatabase();
		const [rows] = await connection.execute(sql, [id]);
		return rows;
	} catch (error) {
		console.error(error);
		return error;
	}
}

// 修改用户
const updateUser = async (id, rest) => {
	try {
		// email是可选值
		let sql = `UPDATE users SET`;
		let params = [];
		for (const key in rest) {
			sql += ` ${key} = ?,`;
			params.push(rest[key]);
		}
		sql = sql.slice(0, -1);
		sql += ` WHERE id = ?`;
		params.push(id);
		const connection = getDatabase();
		const [rows] = await connection.execute(sql, params);
		return rows;
	} catch (error) {
		console.error(error);
		return error;
	}
}

// 发布/取消发布题目
const updateProblemStatus = async (id, status) => {
	try {
		const sql = `UPDATE problems SET isUse = ? WHERE id = ?`;
		const connection = getDatabase();
		const [rows] = await connection.execute(sql, [status, id]);
		return rows;
	} catch (error) {
		console.error(error);
		return error;
	}
}

// 删除题目
const deleteProblem = async (id) => {
	try {
		const sql = `DELETE FROM problems WHERE id = ?`;
		const connection = getDatabase();
		const [rows] = await connection.execute(sql, [id]);
		return rows;
	} catch (error) {
		console.error(error);
		return error;
	}
}

// 新增题目
const addProblem = async (Form, SampleInputs, SampleOutputs, SampleRemarks, TestInputs, TestExpectedOutputs) => {
	try {
		const connection = getDatabase();
		// 插入problems表
		const sql = `INSERT INTO problems (name, category_id, difficulty, source_id, author) VALUES (?, ?, ?, ?, ?)`;
		const [rows] = await connection.execute(sql, [Form.name, Form.category, Form.difficulty, Form.source, Form.author]);
		// 插入problem_details表
		const sql2 = `INSERT INTO problem_details (problem_id, content, sample_input, sample_output, sample_remark, input,expected_output) VALUES (?, ?, ?, ?, ?, ?, ?)`;
		const [rows2] = await connection.execute(sql2, [rows.insertId, Form.content, SampleInputs, SampleOutputs, SampleRemarks, TestInputs, TestExpectedOutputs]);
		return rows2;
	} catch (error) {
		console.error(error);
		return error;
	}
}

module.exports = {
	queryUserList,
	addUser,
	deleteUser,
	updateUser,
	updateProblemStatus,
	deleteProblem,
	addProblem
}