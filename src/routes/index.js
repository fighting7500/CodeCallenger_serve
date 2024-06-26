const router = require('express').Router();
const userRoute = require('./user/userRoutes');
const learnRoute = require('./learn/learnRouters');
const questionRoute = require('./question/questionRouter');
const adminRoute = require('./admin/adminRouter');
const judgeRoute = require('./judge/judgeRouter');
const articleRoute = require('./article/articleRouter');

router.use('/user', userRoute);
router.use('/learn', learnRoute);
router.use('/question', questionRoute);
router.use('/admin', adminRoute);
router.use('/judge', judgeRoute);
router.use('/article', articleRoute);

module.exports = router;
