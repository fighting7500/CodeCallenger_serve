/**
 * @Author: 17197
 * @Date: 2024/4/4
 * @Description: adminRouter.js
 * @Version: 1.0
 * @Last Modified time : 2024/4/4
 **/

const router = require('express').Router();
const middleware = require('../../utils/checkToken');
const userController = require('../../controllers/admin/userController');


// 获取用户列表
router.get('/GetUserList', middleware, userController.getUserList);
// 新增用户
router.post('/AddUser', middleware, userController.addUser);
// 删除用户
router.delete('/DeleteUser', middleware, userController.deleteUser);
// 修改用户
router.put('/UpdateUser', middleware, userController.updateUser);
// 发布/取消发布题目
router.put('/UpdateProblemStatus', middleware, userController.updateProblemStatus);
// 删除题目
router.delete('/DeleteProblem', middleware, userController.deleteProblem);
// 新增题目
router.post('/AddProblem', middleware, userController.addProblem);


module.exports = router;