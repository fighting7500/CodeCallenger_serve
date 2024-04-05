// api文档

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger 配置选项
const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'codeChallenge API 文档',
			version: '1.0.0',
			// description: '这是一个API 文档。',
		},
		servers: [
			{
				url: 'http://localhost:7500',
				// description: 'Local server',
			},
		],
	},
	apis: [
		'../routes/learn/*.js',
		'../routes/user/*.js',
	], // 指向包含注释的 API 处理文件夹的路径
};

// 初始化 Swagger 并生成文档规范
const spec = swaggerJSDoc(options);

// 导出配置 Swagger 的函数
module.exports = function setupSwagger(app) {
	// 使用 swagger-ui-express 集成 Swagger UI 到 Express 应用中
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
};