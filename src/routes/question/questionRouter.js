/**
 * @Author: 17197
 * @Date: 2024/3/31
 * @Description: questionRouter.js
 * @Version: 1.0
 * @Last Modified time : 2024/3/31
 **/
const router = require('express').Router();
const middleware = require('../../utils/checkToken');
const questionController = require('../../controllers/questionController');

// 获取题目分类
router.get('/categories', questionController.getCategories);
// 获取题目列表
router.get('/GetProblemList', questionController.getProblemList);
// 通过id获取题目详情
router.get('/GetProblemById', questionController.getProblemById);
// 获取来源列表
router.get('/GetSources', questionController.getSources);

module.exports = router;