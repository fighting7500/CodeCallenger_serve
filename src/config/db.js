// 数据库初始化模块
const mysql = require('mysql2/promise');
const dbConfig = require('./mysql_config'); // 导入数据库配置文件

let connectionPool;

async function initializeDatabase() {
	try {
		connectionPool = await mysql.createPool(dbConfig);
		console.log('连接池已创建');
		// 测试数据库连接
		const [rows, fields] = await connectionPool.query('SELECT 1+1 AS result');
		console.log('测试查询结果:', rows);
		console.log('数据库初始化完成并成功连接');
	} catch (error) {
		console.error('数据库初始化或连接失败:', error);
	}
}

function getDatabase() {
	console.log('获取数据库连接池');
	if (!connectionPool) {
		throw new Error('数据库初始化失败');
	}
	return connectionPool;
}

module.exports = {
	initializeDatabase,
	getDatabase,
};
