const express = require('express')
const router = express.Router()
const homeController = require('../controllers/home')
const authController = require('../controllers/auth')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', authController.getLogin)
router.get('/login', ensureAuth, authController.getLogin)
router.post('/login', authController.postLogin)
router.get('/admin-panel', ensureAuth, authController.getAdminPanel)
router.get('/logout', ensureAuth, authController.logout)
router.get('/signup', ensureAuth, authController.getSignup)
router.post('/signup', authController.postSignup)

module.exports = router 