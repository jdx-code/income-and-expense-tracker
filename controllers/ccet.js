const { request } = require('express')
const Course = require('../models/Course')
const Student = require('../models/Student')
const Fee = require('../models/Fee')

module.exports = {
    getIndex: (req, res) => {
        res.render('admin/ccet/index.ejs')
    },

    getCourseMng: async (req, res) => {
        try{
            const courses = await Course.find()
            res.render('admin/ccet/courses/index', {
                courses
            })

        } catch (err) {
            console.error(err)
            res.render('error/500')
        }
    },

    addCourse: async(req, res) => {
        console.log(req.body.course)
        try{
            await Course.create({
                courseName: req.body.course, 
                courseDuration: req.body.duration, 
                courseFees: req.body.fees
            })
            console.log('Course Added')
            res.redirect('/ccet/course-management/')
        } catch (err) {
            console.error(err)
            res.render('error/500')
        }
    },

    deleteCourse: async (req, res) => {
        try{
            await Course.findOneAndDelete({ courseName: req.body.courseToBeDeleted })
            console.log('Deleted course')            
            res.redirect('/ccet/course-management/')
        } catch (err){
            console.error(err)
            res.render('error/500')
        }
    },

    getStudentMng: async (req, res) => {
        try{
            const courses = await Course.find()
            const students = await Student.find()
                .populate('courseEnrolled')

            res.render('admin/ccet/students/index', {
                courses,
                students
            })
        } catch (err)         {
            console.error(err)
            res.render('error/500')
        }
    },

    getStudentMngFiltered: async (req, res) => {              
        try{  
            const courses = await Course.find()          
            const students = await Student.find({ courseEnrolled : req.body.courseName })
                .populate('courseEnrolled')
                
            res.render('admin/ccet/students/index', {  
                courses,              
                students
            })
        } catch (err)         {
            console.error(err)
            res.render('error/500')
        }
    },

    addStudent: async (req, res) => {        
        try{
            const studentName = req.body.studentName
            const lastExamPassed = req.body.lastExamPassed
            const courseEnrolled = req.body.courseEnrolled
            const status = 1

            await Student.create({
                studentName,
                lastExamPassed,
                courseEnrolled,
                status,
            })

            const student = await Student.find({ studentName: studentName })      
            
            // console.log(student)
            const studentId = student[0]._id

            await Fee.create({
                studentInfo: studentId,
                courseInfo: courseEnrolled,
                admissionFeesAmount: 1000,
                monthlyFeesAmount: 0,
                examFeesAmount: 0,
            })

            console.log('Student data added')
            res.redirect('/ccet/student-management')
        } catch(err) {
            console.error(err)
            res.render('error/500')
        }
    },

    getFeesMng: async (req, res) => {
        try{
            const courses = await Course.find()
            const students = await Student.find({ courseEnrolled : req.body.courseName })
                .populate('courseEnrolled')
            res.render('admin/ccet/fees/index', {
                courses,
                students
            })
        } catch(err){
            console.error(err)
            res.render('error/500')
        }
        res.render('admin/ccet/fees/index')
    },

    getFeesMngFiltered: async (req, res) => {
        try{
            const courses = await Course.find()
            const students = await Student.find({ courseEnrolled : req.body.courseName })
                .populate('courseEnrolled')
            res.render('admin/ccet/fees/index', {
                courses,
                students
            })
        } catch(err){
            console.error(err)
            res.render('error/500')
        }
        res.render('admin/ccet/fees/index')
    }
}

