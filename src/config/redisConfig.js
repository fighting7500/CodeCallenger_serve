const {createClient} = require('redis');

const client = createClient({
	socket: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT
	},
	password: process.env.REDIS_PASSWORD,
	database: process.env.REDIS_DB
});

const redis = {
	async initRedis() {
		console.log('正在连接redis...')
		client.on('error', () => console.log('redis连接失败, 正在尝试重新连接...'))
		client.on('ready', () => console.log('redis连接成功'))
		await client.connect();
	},

	// 保存验证码
	async saveCaptcha(key, value) {
		console.log('验证码：', value);
		return await client.set(key, value, {
			EX: 300 // 设置过期时间为5分钟
		});
	},

	// 校验验证码
	async verifyCaptcha(key, value) {
		const captcha = await client.get(key);
		console.log('验证码：', captcha, '用户输入：', value);
		return captcha === value;
	},

	// 发布消息到指定频道
	async publishMessage(channel, message) {
		try {
			const result = await client.publish(channel, message);
			console.log(`消息已发布到频道 ${channel}：${message}`);
			return result;
		} catch (error) {
			console.error('发布消息时出错：', error);
			throw error;
		}
	},


	// 订阅频道并处理接收到的消息
	async subscribeToChannel(channel, messageHandler) {
		const subscriber = client.duplicate();
		await subscriber.connect()
		await subscriber.subscribe(channel, (msg) => {
			messageHandler(channel, msg);
		}).then(async () => {
			console.log('订阅成功');
		}).catch((error) => {
			console.error('订阅失败：', error);
		});
		// 返回subscriber客户端实例以便后续操作，如取消订阅等
		return subscriber;
	}
};
module.exports = redis;