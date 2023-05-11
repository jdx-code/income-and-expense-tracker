const Course = require('../models/Course')
const Student = require('../models/Student')

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
                courseDuration: req.body.duration 
            })
            console.log('Course Added')
            res.redirect('/ccet/course-management')
        } catch (err) {
            console.error(err)
            res.render('error/500')
        }
    },

    deleteCourse: async (req, res) => {
        try{
            await Course.findOneAndDelete({ courseName: req.body.courseToBeDeleted })
            console.log('Deleted course')            
            res.redirect('/ccet/course-management')
        } catch (err){
            console.error(err)
            res.render('error/500')
        }
    },

    getStudentMng: async (req, res) => {
        try{
            const courses = await Course.find()
            res.render('admin/ccet/students/index', {
                courses
            })
        } catch (err)         {
            console.error(err)
            res.render('error/500')
        }
    },

    addStudent: async (req, res) => {        
        try{
            await Student.create(req.body)
            console.log('Student data added')
            res.redirect('/ccet/student-management')
        } catch(err) {
            console.error(err)
        }
    },

    getFeesMng: (req, res) => {
        res.render('admin/ccet/fees/index')
    }
}