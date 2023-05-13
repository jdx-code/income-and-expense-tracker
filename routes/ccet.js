const express = require('express')
const router = express.Router()
const ccetController = require('../controllers/ccet')

router.get('/', ccetController.getIndex)

router.get('/course-management', ccetController.getCourseMng)
router.post('/add-course', ccetController.addCourse)
router.delete('/delete-course', ccetController.deleteCourse)

router.get('/student-management', ccetController.getStudentMng)
router.post('/student-management', ccetController.getStudentMngFiltered)
router.post('/add-student', ccetController.addStudent)

router.get('/fees-management', ccetController.getFeesMng)
router.post('/fees-management', ccetController.getFeesMngFiltered)



module.exports = router