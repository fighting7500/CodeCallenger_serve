const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const db = require('./config/db');
const port = process.env.PORT || 7500;
const {sendRes} = require('./utils/resextra');
const router = require('./routes');
// 导入redis连接
const redis = require('./config/redisConfig');
const swagger = require('./utils/swagger');
const cookieParser = require('cookie-parser');
const path = require('path');

// 初始化数据库
db.initializeDatabase();
redis.initRedis();

// 初始化Swagger
swagger(app);
app.use(cors({
	// exposeHeaders: ['X-Auth-Token'],
	origin: 'http://localhost:3468',
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


app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
