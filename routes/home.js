const express = require('express')
const router = express.Router()
const homeController = require('../controllers/home')
const authController = require('../controllers/auth')
const { ensureAuth, ensureGuest } = require('../middleware/auth')


router.get('/', authController.getLogin)
router.get('/login', authController.getLogin)
router.post('/login', authController.postLogin)
router.get('/admin-panel', authController.getAdminPanel)
router.get('/logout', authController.logout)
router.get('/signup', authController.getSignup)
router.post('/signup', authController.postSignup)

module.exports = router 