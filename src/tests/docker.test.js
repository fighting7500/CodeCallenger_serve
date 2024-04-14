const Docker = require('dockerode');
const docker = new Docker();


// 尝试列出所有容器来测试连接
docker.listContainers({all: true}, function (err, containers) {
	if (err) {
		console.error('无法连接到Docker守护进程:', err);
	} else {
		console.log('成功连接到Docker守护进程！');
		console.log('容器列表:', containers);
		containers.forEach(containerInfo => {
			console.log('容器ID:', containerInfo.Id);
			console.log('容器名称:', containerInfo.Names);
		});
	}
});
