/**
 * @Author: 17197
 * @Date: 2024/4/14
 * @Description: docker.js
 * @Version: 1.0
 * @Last Modified time : 2024/4/14
 **/

const Docker = require('dockerode');
const docker = new Docker();

// 连接Docker容器，这是个方法
const connectDocker = async () => {
	docker.ping(function (err, data) {
		if (err) {
			console.error('无法连接到Docker守护进程:', err);
			// 尝试重新连接
			console.log('尝试重新连接Docker守护进程')
			setTimeout(connectDocker, 1000);
		} else {
			console.log('已成功连接到Docker守护进程');
			// 在此处继续你的应用程序初始化代码
		}
	});
	return docker;
}

const getDocker = () => {
	return docker;
}
module.exports = {
	connectDocker,
	getDocker
}

