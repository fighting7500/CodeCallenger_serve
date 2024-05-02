const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const db = require('./config/db');
const port = process.env.PORT || 7500;
const host = process.env.HOST || 'localhost';
const {sendRes} = require('./utils/resextra');
const router = require('./routes');
// 导入redis连接
const redis = require('./config/redisConfig');
const swagger = require('./utils/swagger');
const cookieParser = require('cookie-parser');
const path = require('path');
const {receiveSubscribe} = require("./judge/judge");
const docker = require('./config/docker');
const {getIPLocation} = require('./utils/getIPLocation');

// 初始化数据库
async function init() {
	await db.initializeDatabase();
	await redis.initRedis();
	await docker.connectDocker();
}

// redis.subscribeToChannel('judge', (channel, message) => {
// 	console.log(`接收到频道 ${channel} 的消息：${message}`);
// 	receiveSubscribe(message);
// })


app.use(cors({
	// exposeHeaders: ['X-Auth-Token'],
	// origin: 'http://192.168.237.195:3468',
	origin: 'http://localhost:3468', // 允许跨域的地址，全部：*
	credentials: true
}));

app.use(cookieParser('secret'));
app.use(express.urlencoded({extended: false}))
app.use(express.json());

// 添加统一的返回结果方法
// 使用中间件处理统一返回结果
app.use((req, res, next) => {
	res.sendRes = (data, code = 200, message = 'Success') => {
		sendRes(res, data, code, message);
	};
	res.setHeader('Access-Control-Expose-Headers', 'X-Auth-Token');
	next();
});
app.use('/uploads', express.static('src/uploads'));

app.use(router);

init().then(() => {
	app.listen(port, host, () => {
		console.log(`Server is running at http://${host}:${port}`);
	});
}).catch((err) => {
	console.error('Server start failed:', err);
	process.exit(1);
})
