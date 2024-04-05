const redis = require('../config/redisConfig');

async function testRedis() {
	await redis.initRedis();
	console.log('redis连接成功');
	const key = 'testcaptcha';
	const res = await redis.saveCaptcha(key);
	console.log('保存验证码结果：', res);
}

testRedis().then(() => {
	console.log('测试完成');
	redis.verifyCaptcha('testcaptcha', 123456).then(res => {
		console.log('校验验证码结果：', res);
	});
});