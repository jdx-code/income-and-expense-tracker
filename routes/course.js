const express = require('express')
const router = express.Router()
const courseController = require('../controllers/course')

router.get('/', courseController.getIndex)

module.exports = router
