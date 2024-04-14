/**
 * @Author: 17197
 * @Date: 2024/4/14
 * @Description: docker.js
 * @Version: 1.0
 * @Last Modified time : 2024/4/14
 **/
const docker = require('../config/docker');
// 创建Docker容器
exports.createDockerContainer = async (name, language) => {
	const docker = docker.getDocker();
	// 通过language判断镜像
	let image = '';
	switch (language) {
		case 'Java':
			image = 'java';
			break;
		case 'JavaScript':
		case 'TypeScript':
			image = 'node';
			break;
	}
	const container = await docker.createContainer({
		Image: image,
		name,
		AttachStdin: true,  // 附加标准输入
		AttachStdout: true, // 附加标准输出
		AttachStderr: true, // 附加标准错误
		Tty: true, // 分配一个伪终端
		OpenStdin: true, // 打开标准输入
		StdinOnce: false, // 仅一次标准输入
		Cmd: ['bash'], // 命令
		HostConfig: {
			AutoRemove: true, // 容器退出时自动删除
			NetworkMode: 'none', // 不使用网络
			Memory: 1024 * 1024 * 1024, // 1GB内存
		}
	});
	return container;
}