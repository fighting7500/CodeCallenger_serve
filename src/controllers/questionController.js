/**
 * @Author: 17197
 * @Date: 2024/3/31
 * @Description: questionController.js
 * @Version: 1.0
 * @Last Modified time : 2024/3/31
 **/
const questionModule = require('../models/questionModules');

// 获取题目分类
exports.getCategories = async (req, res) => {
	try {
		console.log('获取题目分类');
		const categories = await questionModule.getCategories();
		if (!categories) {
			console.log('获取题目分类失败')
			return res.sendRes(null, 400, '获取题目分类失败');
		}
		if (req.query.admin === '1') {
			console.log('获取题目分类成功');
			return res.sendRes(categories, 200);
		}
		// 根据分类id获取分类下的题目数量
		const category = categories.map(item => item.id).join(',');
		const problemsList = await questionModule.getCategoriesCount(category);
		console.log('problemsList', problemsList);
		// 只返回有题目的分类
		const categoriesWithCount = categories
			.map(category => {
				const countItem = problemsList.find(item => item.category_id === category.id);
				return countItem ? {...category, count: countItem.count} : null;
			})
			.filter(category => category);
		console.log('获取题目分类成功');
		return res.sendRes({Rows: categoriesWithCount, total: categoriesWithCount.length}, 200);
	} catch (error) {
		console.error(error);
		return res.sendRes(null, 500, '服务器错误');
	}
}

// 获取题目列表
exports.getProblemList = async (req, res) => {
	try {
		// 题目名称、题目分类、题目难度
		const {Page, Limit, CategoryId, Difficulty, ProblemName, ID} = req.query;
		const result = await questionModule.getProblems(Page, Limit, CategoryId, Difficulty, ProblemName, ID);
		console.log('获取题目列表成功');
		return res.sendRes(result, 200, 'success');
	} catch (error) {
		console.error(error);
		return res.sendRes(null, 500, '服务器错误');
	}
}

// 通过id获取题目详情
exports.getProblemById = async (req, res) => {
	try {
		const {id} = req.query;
		const result = await questionModule.getProblemById(id);
		console.log('通过id获取题目详情成功');
		return res.sendRes(result, 200, 'success');
	} catch (error) {
		console.error(error);
		return res.sendRes(null, 500, '服务器错误');
	}
}

// 获取来源列表
exports.getSources = async (req, res) => {
	try {
		const sources = await questionModule.getSources();
		console.log('获取来源列表成功');
		return res.sendRes(sources, 200, 'success');
	} catch (error) {
		console.error(error);
		return res.sendRes(null, 500, '服务器错误');
	}
}