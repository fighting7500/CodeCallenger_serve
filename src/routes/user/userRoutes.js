const router = require('express').Router();
const authController = require('../../controllers/authController');
const middleware = require('../../utils/checkToken');

// 注册
router.post('/register', authController.register);
// 登录
router.post('/login', authController.login);
// 滑块验证
router.post('/verifyCaptcha', authController.verifyCaptcha);
// 发送验证码
router.post('/verifyCode', authController.verifyCode);
// 查询用户名，邮箱，手机号是否存在
router.post('/checkUser', authController.checkUser);
// 获取用户信息
router.get('/getUserInfo', middleware, authController.getUserInfo);
// 刷新token
router.post('/refreshToken', authController.refreshToken);
// 退出登录
router.post('/logout', authController.logout);
// 重置密码
router.post('/resetPassword', authController.resetPassword);

module.exports = router;