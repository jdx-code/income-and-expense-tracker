const express = require('express')
const router = express.Router()
const ccetController = require('../controllers/ccet')

router.get('/', ccetController.getIndex)

// Routes for student management
router.get('/student-management', ccetController.getAllStudents)
router.post('/student-management/filter-view', ccetController.viewFilteredStudents)
router.get('/student-management/add', ccetController.getStudentForm)
router.post('/add-student', ccetController.addStudentProcess)
// router.get('/student-management', ccetController.getStudentMng)
// router.get('/student-management/:id', ccetController.getStudentMngById)
// router.post('/student-management', ccetController.getStudentMngFiltered)

// Routes for fees management
router.get('/fees-management', ccetController.getAllFeesInfo)
router.post('/fees-management/filter-view', ccetController.viewFilteredFeesInfo)
router.get('/fees-management/add', ccetController.getFeesForm)
router.get('/fees-management/fees-history/:id', ccetController.getFeesHistory)
// router.get('/fees-management/:id', ccetController.getFeesMngById)
// router.post('/add-fees', ccetController.addFees)

// Routes for course management
router.get('/course-management', ccetController.getAllCourses)
router.post('/add-course', ccetController.addCourse)
// router.get('/course-management/:id', ccetController.getCourseById)
// router.put('/edit-course/:id', ccetController.editCourse)
// router.delete('/delete-course', ccetController.deleteCourse)

module.exports = router