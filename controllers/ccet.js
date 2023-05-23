const { request } = require('express')
const Course = require('../models/Course')
const Student = require('../models/Student')
const Fee = require('../models/Fee')

module.exports = {
    getIndex: (req, res) => {
        res.render('admin/ccet/index.ejs')
    },

    // Get course information
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

    getCourseById: (req, res) => {
        try{
            console.log('Working on update by course id ')
        } catch(err) {
            console.error(err)
            res.render('error/500')
        }
    },

    // Add course 
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

    // Delete course
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

    // Get student information
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

    // Get students data by filtered data (for ex: filter by `course`)
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

    // Add student data 
    addStudent: async (req, res) => {        
        try{
            const studentName = req.body.studentName
            const lastExamPassed = req.body.lastExamPassed
            const courseEnrolled = req.body.courseEnrolled
            const status = 1

            const newStudent = await Student.create({
            studentName,
            lastExamPassed,
            courseEnrolled,
            status,
            })

            const newStudentId = newStudent._id

            const newFee = await Fee.create({
            studentInfo: newStudentId,
            courseInfo: courseEnrolled,
            admissionFeesAmount: 1000,
            totalFeesPaid: [0],
            examFeesAmount: 0,
            })

            const updatedStudent = await Student.findByIdAndUpdate(
            newStudentId,
            { fee: newFee._id },
            { new: true }
            ).populate('fee')

            console.log('Student data added')
            res.redirect('/ccet/student-management')
        } catch(err) {
            console.error(err)
            res.render('error/500')
        }
    },      

    // Get fees data
    getFeesMng: async (req, res) => {
        try{
            const courses = await Course.find()
            const students = await Student.find({ courseEnrolled : req.body.courseName })
                .populate('courseEnrolled')

            console.log(students)                

            res.render('admin/ccet/fees/index', {
                courses,
                students,            
            })
        } catch(err){
            console.error(err)
            res.render('error/500')
        }
        res.render('admin/ccet/fees/index')
    }, 

    // Get fees data by filtered data (for ex: filter by `course`)
    getFeesMngFiltered: async (req, res) => {
        try {
            const courses = await Course.find();
            const students = await Student.find({ courseEnrolled: req.body.courseId })
                .populate('courseEnrolled')
                .populate('fee');

            // for (let i = 0; i < students.length; i++) {
            //     const studentId = students[i]._id;
            //     const fee = await Fee.findOne({ studentInfo: studentId });
            //     students[i].fee = fee;
            // }            
    
            res.render('admin/ccet/fees/index', {
                courses,
                students
            });
        } catch (err) {
            console.error(err);
            res.render('error/500');
        }
    },    

    // Get fees information of a particular student by student_id
    getFeesMngById: async (req, res) => {
        // console.log(req.params.id)
        try{            
            const students = await Student.find({ _id: req.params.id })
                .populate('courseEnrolled')
                .populate('fee')
            
            res.render('admin/ccet/fees/recordPayment', {                
                students,            
            })
        } catch(err){
            console.error(err)
            res.render('error/500')
        }        
    },    

    // Get fees details of a student
    getFeesHistory: async (req, res) => {
        try{            
            const students = await Student.find({ _id: req.params.id })
                .populate('courseEnrolled')
                .populate('fee')
            
            res.render('admin/ccet/fees/viewFeesHistory', {                
                students,            
            })
        } catch (err) {
          console.error(err);
          res.render('error/500');
        }        
      },      

    // Add fees 
    addFees: async (req, res) => {
        try {
          const fees = await Fee.find({ studentInfo: req.body.studentId }).populate('studentInfo');
          const fee = fees[0];
          const updatedFees = await Fee.findByIdAndUpdate(
            fee._id,
            { $push: { totalFeesPaid: Number(req.body.amountReceived) } }
          );

          const courses = await Course.find();
          const students = await Student.find({ _id: fee.studentInfo })
            .populate('courseEnrolled')            
            .populate('fee')            

            res.render('admin/ccet/fees/recordPayment', {                                
                students,                                          
            })
         
        } catch (err) {
          console.error(err);
          res.render('error/500');
        }        
    }          
}

