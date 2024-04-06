// 数据库初始化模块
const mysql = require('mysql2/promise');
const dbConfig = require('./mysql_config'); // 导入数据库配置文件

let connectionPool;

async function initializeDatabase() {
	try {
		connectionPool = await mysql.createPool(dbConfig);
		// 测试数据库连接
		const [rows, fields] = await connectionPool.query('SELECT 1+1 AS result');
		console.log(rows[0].result === 2 ? 'mysql连接成功' : 'mysql连接失败');
	} catch (error) {
		console.error('mysql连接失败，正在尝试重新连接...');
		// 连接失败时重新尝试连接
		await initializeDatabase(); // 递归调用自身
	}
}

function getDatabase() {
	if (!connectionPool) {
		throw new Error('数据库未初始化');
	}
	return connectionPool;
}

module.exports = {
	initializeDatabase,
	getDatabase,
};
