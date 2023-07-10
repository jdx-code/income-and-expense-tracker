const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')
const ccetController = require('../controllers/ccet')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

// Route for ccet dashboard
router.get('/', ensureAuth, ccetController.getIndex)

// Routes for student management
router.get('/student-management', ensureAuth, ccetController.getAllStudents)
router.post('/student-management/filter-view', ccetController.viewFilteredStudents)
router.get('/student-management/filter-view', ccetController.viewFilteredStudents)
router.get('/student-management/add', ensureAuth, ccetController.getStudentForm)
router.post('/add-student', upload.single("file"), ccetController.addStudentProcess)
router.get('/student-management/:id', ensureAuth, ccetController.getStudentById)
router.delete('delete-student/:id', ccetController.deleteStudent)
// router.get('/student-management', ccetController.getStudentMng)
// router.post('/student-management', ccetController.getStudentMngFiltered)


// Routes for fees management
router.get('/fees-management', ensureAuth, ccetController.getAllFeesInfo)
router.get('/fees-management/filter-view', ccetController.viewFilteredFeesInfo)
router.get('/fees-management/add', ensureAuth, ccetController.getFeesForm)
router.get('/fees-management/record-fees/:id', ensureAuth, ccetController.getFeesMngById)
router.get('/fees-management/fees-history/:id', ensureAuth, ccetController.getFeesHistory)
router.post('/add-fees', ccetController.addFees)


// Routes for course management
router.get('/course-management', ensureAuth, ccetController.getAllCourses)
router.post('/add-course', ccetController.addCourse)
router.post('/course-management/:id', ensureAuth, ccetController.courseInfoById)
router.put('/update-course/:id', ccetController.updateCourse)
router.delete('/delete-course/:id', ccetController.deleteCourse)


// Routes for branch management
router.get('/branch-management', ensureAuth, ccetController.getBranch)
router.post('/add-branch', ccetController.addBranch)
router.post('/branch-management/:id', ensureAuth, ccetController.branchInfoById)
router.put('/update-branch/:id', ccetController.updateBranch)
router.delete('/delete-branch/:id', ccetController.deleteBranch)

module.exports = router