const express = require('express')
const router = express.Router()
const ccetController = require('../controllers/ccet')

router.get('/', ccetController.getIndex)

// router.get('/student-management', ccetController.getStudentMng)
router.get('/student-management/add', ccetController.getStudentAddForm)
// router.get('/student-management/:id', ccetController.getStudentMngById)
// router.post('/student-management', ccetController.getStudentMngFiltered)
router.post('/add-student', ccetController.addStudent)
router.get('/student-management/view', ccetController.getStudentViewStudents)
router.post('/student-management/filter-view', ccetController.getStudentFilterView)


router.get('/fees-management', ccetController.getFeesMng)
router.get('/fees-management/add', ccetController.getFeesAddForm)
router.post('/fees-management', ccetController.getFeesMngFiltered)
router.get('/fees-management/:id', ccetController.getFeesMngById)
router.get('/fees-management/fees-history/:id', ccetController.getFeesHistory)
// router.post('/add-fees', ccetController.addFees)

router.get('/course-management', ccetController.getCourseMng)
// router.get('/course-management/:id', ccetController.getCourseById)
router.post('/add-course', ccetController.addCourse)
// router.put('/edit-course/:id', ccetController.editCourse)
// router.delete('/delete-course', ccetController.deleteCourse)

module.exports = router