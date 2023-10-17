const router = require('express').Router();

const { validationUpdateUser } = require('../middlewares/validation');

const { getUser, updateUser } = require('../controllers/users');

router.get('/me', getUser);
router.patch('/me', validationUpdateUser, updateUser);

module.exports = router;
