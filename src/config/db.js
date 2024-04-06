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
		console.error('mysql连接失败，正在尝试重新连接');
		// 连接失败时重新尝试连接
		await initializeDatabase(); // 递归调用自身
	}
}

async function getDatabase() {
	console.log('获取数据库连接池');
	if (!connectionPool) {
		// 调用初始化数据库再获取连接
		await initializeDatabase();
	}
	return connectionPool;
}

module.exports = {
	initializeDatabase,
	getDatabase,
};
