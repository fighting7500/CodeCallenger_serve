const {getDatabase} = require('../../config/db');

// 将代码保存到数据库
// CREATE TABLE IF NOT EXISTS submissions (
// 	id INT PRIMARY KEY AUTO_INCREMENT, -- 记录ID
// user_id INT NOT NULL, -- 用户ID (外键，关联 users 表)
// problem_id INT NOT NULL, -- 题目ID (外键，关联 problems 表)
// status VARCHAR(255) NOT NULL COMMENT '提交状态', -- 提交状态
// language VARCHAR(255) NOT NULL COMMENT '编程语言', -- 编程语言
// code TEXT COMMENT '提交内容', -- 提交内容
// exec_time INT COMMENT '执行时间', -- 执行时间
// memory_usage INT COMMENT '内存使用', -- 内存使用
// remark TEXT COMMENT '备注', -- 备注
// created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '提交时间', -- 提交时间
// FOREIGN KEY (user_id) REFERENCES users(id),
// 	FOREIGN KEY (problem_id) REFERENCES problems(id)
// );
const saveCodeToDatabase = async (userId, problemId, code, language) => {
	const db = getDatabase();
	const sql = 'INSERT INTO submissions (user_id, problem_id, status, language, code) VALUES (?, ?, ?, ?, ?)';
	const values = [userId, problemId, 'PENDING', language, code];
	const [result] = await db.query(sql, values);
	return result.insertId;
};

module.exports = {
	saveCodeToDatabase,
}