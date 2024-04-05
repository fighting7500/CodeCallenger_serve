/**
 * @Author: 17197
 * @Date: 2024/3/30
 * @Description: points.js
 * @Version: 1.0
 * @Last Modified time : 2024/3/30
 **/
	// 设置积分规则
const pointsRules = {
		register: {
			points: 100,
			description: '注册'
		},
		dailyLogin: {
			points: 10,
			description: '每日登录'
		},
		continuousLogin: {
			points: [20, 30, 50, 100],
			description: '连续登录'
		},
		publishProblem: {
			points: 20,
			description: '发布题目'
		},
		publishSolution: {
			points: 30,
			description: '发布题解'
		},
		publishArticle: {
			points: 40,
			description: '发布文章'
		},
		comment: {
			points: 5,
			description: '评论'
		},
		like: {
			points: 5,
			description: '点赞'
		},
		collect: {
			points: 5,
			description: '收藏'
		}
	}
module.exports = pointsRules;
