/**
 * @Author: 17197
 * @Date: 2024-05-01 14:31:32
 * @Description: articleController.js
 * @Version: 1.0
 * @Last Modified time : 2024-05-01 14:31:32
 **/
const articleModule = require('../../models/article/articleModel');

// 获取文章列表
exports.getArticleList = async (req, res) => {
	try {
		const {Page, Limit, Title, Admin} = req.query;
		const result = await articleModule.getArticleList(Page, Limit, Title, Admin);
		if (!result) {
			console.log('获取文章列表失败');
			return res.sendRes(null, 400, '获取文章列表失败');
		}
		result.Rows.forEach(item => {
			item.avatar = process.env.BASE_URL + item.avatar;
		})
		console.log('获取文章列表成功');
		return res.sendRes(result, 200, 'success');
	} catch (error) {
		console.error(error);
		return res.sendRes(null, 500, '服务器错误');
	}
}

// 获取文章详情
exports.getArticleDetail = async (req, res) => {
	try {
		const {Id} = req.query;
		const result = await articleModule.getArticleDetail(Id);
		if (!result) {
			console.log('获取文章详情失败');
			return res.sendRes(null, 400, '获取文章详情失败');
		}
		console.log('获取文章详情成功');
		result.avatar = process.env.BASE_URL + result.avatar;
		return res.sendRes(result, 200, 'success');
	} catch (error) {
		console.error(error);
		return res.sendRes(null, 500, '服务器错误');
	}
}

// 发布文章
exports.publishArticle = async (req, res) => {
	try {
		const data = req.body;
		const result = await articleModule.publishArticle(data);
		if (!result) {
			console.log('发布文章失败');
			return res.sendRes(null, 400, '发布文章失败');
		}
		console.log('发布文章成功');
		return res.sendRes(null, 200, 'success');
	} catch (error) {
		console.error(error);
		return res.sendRes(null, 500, '服务器错误');
	}
}

// 删除文章
exports.deleteArticle = async (req, res) => {
	try {
		const {Id, UserID} = req.query;
		const result = await articleModule.deleteArticle(Id);
		if (!result) {
			console.log('删除文章失败');
			return res.sendRes(null, 400, '删除文章失败');
		}
		console.log('删除文章成功');
		return res.sendRes(null, 200, 'success');
	} catch (error) {
		console.error(error);
		return res.sendRes(null, 500, '服务器错误');
	}
}

// 获取必读榜
exports.getReadList = async (req, res) => {
	try {
		const result = await articleModule.getReadList();
		if (!result) {
			console.log('获取必读榜失败');
			return res.sendRes(null, 400, '获取必读榜失败');
		}
		result.forEach(item => {
			item.avatar = process.env.BASE_URL + item.avatar;
		})
		console.log('获取必读榜成功');
		return res.sendRes(result, 200, 'success');
	} catch (error) {
		console.error(error);
		return res.sendRes(null, 500, '服务器错误');
	}
}
