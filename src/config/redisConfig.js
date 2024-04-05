const {createClient} = require('redis');

const client = createClient({
	socket: {
		host: '123.60.24.192',
		port: 6379
	},
	password: '15402517',
	database: 0
});

const redis = {
	async initRedis() {
		client.on('error', () => console.log('redis连接失败, 正在尝试重新连接...'));
		client.on('ready', () => console.log('redis连接成功'));
		await client.connect();
	},

	// 保存验证码
	async saveCaptcha(key, value) {
		console.log('验证码：', value);
		const res = await client.set(key, value, {
			EX: 300 // 设置过期时间为5分钟
		});
		return res;
	},

	// 校验验证码
	async verifyCaptcha(key, value) {
		const captcha = await client.get(key);
		console.log('验证码：', captcha, '用户输入：', value);
		return captcha === value;
	},
};
module.exports = redis;