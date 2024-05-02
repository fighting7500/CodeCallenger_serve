/**
 * @Author: 17197
 * @Date: 2024-04-14 22:51:56
 * @Description: exampleCodeSandbox.ts
 * @Version: 1.0
 * @Last Modified time : 2024-04-14 22:51:56
 **/
import {codeSandBox} from '../codeSandBox';
// import Docker from 'dockerode';
//
// const docker = new Docker();

export default class ExampleCodeSandbox implements codeSandBox {
    /**
     * @param {Object} input
     * @return {Promise<any>}
     */
    async execute(input: {
        language: string,
        code: string,
        testCases: string[],
        memoryLimit: number,
        timeLimit: number
    }): Promise<any> {
        // const { language, code, testCases, memoryLimit, timeLimit } = input;
        //
        // // 根据语言选择 Docker 镜像
        // const image = this.getImageByLanguage(language);
        //
        // // 创建 Docker 容器
        // const container = await docker.createContainer({
        //     Image: image,
        //     Cmd: [language, '-c', code], // 执行的命令
        //     AttachStdout: true,
        //     AttachStderr: true,
        //     HostConfig: {
        //         Memory: memoryLimit * 1024 * 1024, // 限制内存使用量
        //         CpuShares: 1024, // 限制CPU使用量, 1024 表示 100%
        //     }
        // });
        //
        // // 启动 Docker 容器
        // await container.start();
        //
        // // 设置执行时间限制
        // setTimeout(async () => {
        //     await container.stop();
        //     await container.remove();
        // }, timeLimit * 1000);
        //
        // // 监听 Docker 容器的日志
        // const stream = await container.logs({ follow: true, stdout: true, stderr: true });

        return new Promise((resolve, reject) => {
            let output = '';

            // stream.on('data', (chunk) => output += chunk.toString());
            // stream.on('end', () => resolve(output));
            // stream.on('error', reject);
        });
    }


    /**
     * 根据语言选择 Docker 镜像
     * @param {string} language
     * @return {string}
     */
    getImageByLanguage(language: string): string {
        switch (language) {
            case 'python':
                return 'python';
            case 'javascript':
            case 'typescript':
                return 'node';
            case 'java':
                return 'openjdk';
            case 'c++':
                return 'gcc';
            default:
                throw new Error(`Unsupported language: ${language}`);
        }
    }
}
