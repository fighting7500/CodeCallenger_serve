/* module.exports = {
    host: '123.60.24.192', // 数据库主机地址
    port: 3306, // 数据库端口号
    user: 'db_mysql', // 数据库用户名
    password: '15402517',  // 数据库密码
    database: 'db_mysql'   // 数据库名称
}; */
module.exports = {
	host: process.env.MYSQL_HOST, // 数据库主机地址
	port: process.env.MYSQL_PORT, // 数据库端口号
	user: process.env.MYSQL_USER, // 数据库用户名
	password: process.env.MYSQL_PSD,  // 数据库密码
	database: process.env.MYSQL_DB   // 数据库名称
};