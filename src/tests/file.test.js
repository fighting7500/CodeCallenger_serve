/**
 * @Author: 17197
 * @Date: 2024/4/9
 * @Description: file.test.js
 * @Version: 1.0
 * @Last Modified time : 2024/4/9
 **/
// const fs = require('fs');
// const path = require('path');
// const { exec } = require('child_process');
//
// // 保存代码到文件
// function saveCodeToFile(userId, problemId, code) {
// 	const rootDir = path.join(__dirname, '..', 'uploads', 'code');
// 	const userDir = path.join(rootDir, userId.toString());
// 	try {
// 		if (!fs.existsSync(userDir)) {
// 			fs.mkdirSync(userDir);
// 		}
//
// 		const timestamp = Date.now();
// 		const fileName = `${problemId.toString()}_${userId.toString()}_${timestamp}.java`;
// 		const filePath = path.join(userDir, fileName);
//
// 		fs.writeFileSync(filePath, code);
//
// 		return filePath;
// 	} catch (err) {
// 		console.error('保存代码时出现异常:', err);
// 		return null;
// 	}
// }
//
// function compileJavaCode(javaFilePath) {
// 	exec(`javac -encoding UTF-8 ${javaFilePath}`, (error, stdout, stderr) => {
// 		if (error) {
// 			console.error(`编译 Java 代码失败: ${stderr}`);
// 		} else {
// 			console.log('Java 代码编译成功');
// 		}
// 	});
// }
//
// // 使用示例
// const userId = 'user123';
// const problemId = 'problem456';
// const code = `
// public class Solution {
//     public int[] twoSum(int[] nums, int target) {
//         // 在这里实现方法逻辑
//     }
// }
// `;
// const javaFilePath = saveCodeToFile(userId, problemId, code);
//
// if (javaFilePath) {
// 	compileJavaCode(javaFilePath);
// }