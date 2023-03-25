const router = require('express').Router();
const usersController = require('../controllers/users.controller');
const authController = require('../controllers/auth.controller');
const { isAuthenticaded } = require('../middlewares/auth.middleware');

/* Auth */

router.post('/login', authController.login);

/* Users */

router.post('/users', usersController.create);
router.get('/users', isAuthenticaded, usersController.list);

module.exports = router;