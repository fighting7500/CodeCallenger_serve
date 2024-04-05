const Docker = require('dockerode');
const {Readable} = require('stream');
const docker = new Docker();

// 检查Node.js镜像是否存在，如果不存在则拉取
async function checkAndPullImage() {
	try {
		const images = await docker.listImages({matchName: 'node'});
		for (const image of images) {
			if (image.RepoTags && image.RepoTags.includes('node:latest')) {
				console.log('Node.js镜像已存在');
				return;
			}
		}
		console.log('正在拉取Node.js镜像...');
		await new Promise((resolve, reject) => {
			docker.pull('node:latest', (err, stream) => {
				if (err) {
					reject(err);
					return;
				}
				docker.modem.followProgress(stream, (err, output) => {
					if (err) {
						reject(err);
						return;
					}
					resolve();
				});
			});
		});
		console.log('Node.js镜像拉取完成');
	} catch (error) {
		throw new Error('检查或拉取Node.js镜像时出错：' + error.message);
	}
}

// 创建并启动Node.js容器
async function createAndRunContainer() {
	try {
		const containerConfig = {
			Image: 'node:latest',
			Cmd: ['node', '-e', 'console.log("Hello from Node.js container!")'],
			AttachStdin: false,
			AttachStdout: true,
			AttachStderr: true,
			Tty: false,
			OpenStdin: false,
			StdinOnce: false,
		};

		const container = await docker.createContainer(containerConfig);
		console.log('容器创建成功，ID：', container.id);

		await container.start();
		console.log('容器已启动');

		container.logs({stdout: true, stderr: true, follow: true}).then((logs) => {
			if (logs instanceof Readable) {
				// 如果 logs 是一个可读流
				logs.on('data', (chunk) => {
					console.log(chunk.toString());
				});
			} else {
				// 如果 logs 不是流，而是其他类型的数据（例如字符串或 Buffer）
				console.log(logs.toString()); // 假设它是 Buffer 或类似的可转换为字符串的东西
			}
		}).catch((error) => {
			console.error('获取容器日志时出错：', error);
		});
	} catch (error) {
		throw new Error('创建或运行Node.js容器时出错：' + error.message);
	}
}
