/**
 * @Author: 17197
 * @Date: 2024-05-01 14:32:40
 * @Description: articleModel.js
 * @Version: 1.0
 * @Last Modified time : 2024-05-01 14:32:40
 **/
const {getDatabase} = require('../../config/db');

// 获取文章列表
const getArticleList = async (page, limit, title, admin) => {
	try {
		let sql = `SELECT
                a.*,
                u.username,
                u.avatar
            FROM
                articles a
            JOIN
                users u ON a.user_id = u.id
            WHERE
                1 = 1
        `;
		let countSql = `
            SELECT
				COUNT(DISTINCT a.id) as total
            FROM
                articles a
            JOIN
                users u ON a.user_id = u.id
            WHERE
                1 = 1
        `;
		let params = [];
		let countParams = [];
		if (title) {
			sql += ` AND a.title LIKE ?`;
			countSql += ` AND a.title LIKE ?`;
			params.push(`%${title}%`);
			countParams.push(`%${title}%`);
		}
		if (!admin) {
			sql += ' AND status = 2';
			countSql += ' AND status = 2';
		}
		sql += ' ORDER BY a.create_time DESC';
		sql += ` LIMIT ${(page - 1) * limit}, ${limit}`;

		const connection = getDatabase();
		const [rows] = await connection.execute(sql, params);
		const [count] = await connection.execute(countSql, countParams);
		return {
			Rows: rows,
			total: count[0].total
		};
	} catch (error) {
		console.error(error);
		return null;
	}
}

// 获取文章详情
const getArticleDetail = async (id) => {
	try {
		const sql = `
			SELECT
				a.*,
				u.username,
				u.avatar
			FROM
				articles a
			JOIN
				users u ON a.user_id = u.id
			WHERE
				a.id = ?
		`;
		const connection = getDatabase();
		const [rows] = await connection.execute(sql, [id]);
		return rows[0];
	} catch (error) {
		console.error(error);
		return null;
	}
}

// 发布文章
const publishArticle = async (data) => {
	try {
		const sql = `INSERT INTO articles (user_id, title, content, category, create_time) VALUES (?, ?, ?)`;
		const connection = getDatabase();
		const [rows] = await connection.execute(sql, [data.user_id, data.title, data.content, data.category, new Date()]);
		return rows.affectedRows === 1;
	} catch (error) {
		console.error(error);
		return false;
	}
}

// 删除文章
const deleteArticle = async (id) => {
	try {
		const sql = `DELETE FROM articles WHERE id = ?`;
		const connection = getDatabase();
		const [rows] = await connection.execute(sql, [id]);
		return rows.affectedRows === 1;
	} catch (error) {
		console.error(error);
		return false;
	}
}

// 获取必读榜（点赞量最多的前10篇文章）
const getReadList = async () => {
	try {
		const sql = `
		SELECT
                a.*,
                u.username,
                u.avatar
            FROM
                articles a
            JOIN
                users u ON a.user_id = u.id
            WHERE
                1 = 1
 				ORDER BY likes DESC LIMIT 10`;
		const connection = getDatabase();
		const [rows] = await connection.execute(sql);
		return rows;
	} catch (error) {
		console.error(error);
		return null;
	}
}

// 导出模块
module.exports = {
	getArticleList,
	getArticleDetail,
	publishArticle,
	deleteArticle,
	getReadList
}
