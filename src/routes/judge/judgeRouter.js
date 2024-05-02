/**
 * @Author: 17197
 * @Date: 2024/4/8
 * @Description: judgeRouter.js
 * @Version: 1.0
 * @Last Modified time : 2024/4/8
 **/

const router = require('express').Router();
const middleware = require('../../utils/checkToken');
const judgeController = require('../../controllers/judge/judgeController');

// 运行代码-提交并运行
router.post('/run', judgeController.runCode);


module.exports = router;
