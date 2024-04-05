const router = require('express').Router();
const learnController = require('../../controllers/learnController');

// 获取背景图
router.post('/getBackground', learnController.getBackground);


module.exports = router;