/**
 * @Author: 17197
 * @Date: 2024-05-01 14:28:20
 * @Description: articleRouter.js
 * @Version: 1.0
 * @Last Modified time : 2024-05-01 14:28:20
 **/

const router = require('express').Router();
const middleware = require('../../utils/checkToken');
const articleController = require('../../controllers/article/articleController');


// 获取文章列表
router.get('/GetArticleList', articleController.getArticleList);
// 获取文章详情
router.get('/GetArticleDetail', articleController.getArticleDetail);
// 发布文章
router.post('/PublishArticle', middleware, articleController.publishArticle);
// 删除文章
router.delete('/DeleteArticle', middleware, articleController.deleteArticle);
// 获取必读榜单（点赞量前十）
router.get('/GetReadList', articleController.getReadList);


module.exports = router;
