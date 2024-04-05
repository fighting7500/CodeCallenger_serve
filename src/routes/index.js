const router = require('express').Router();
const userRoute = require('./user/userRoutes');
const learnRoute = require('./learn/learnRouters');
const questionRoute = require('./question/questionRouter');
const adminRoute = require('./admin/adminRouter');

router.use('/user', userRoute);
router.use('/learn', learnRoute);
router.use('/question', questionRoute);
router.use('/admin', adminRoute);

module.exports = router;