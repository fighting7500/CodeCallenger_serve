const redis = require('../config/redisConfig');

redis.initRedis()
	.then(() => {
		// 订阅成功后再进行发布操作
		function publishMessage() {
			redis.publishMessage('judge', 'Hello, World!');
		}

		setTimeout(() => {
			publishMessage()
			setTimeout(() => {
				publishMessage()
			}, 5000)
		}, 3000)

		// 订阅成功后进行订阅测试
		function subscribeToChannel() {
			redis.subscribeToChannel('judge', (channel, message) => {
				console.log(`接收到频道 ${channel} 的消息：${message}`);
			});
		}

		subscribeToChannel()
	})
	.catch((err) => {
		console.error('初始化 Redis 失败：', err);
	});
