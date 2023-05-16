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

    // addStudent: async (req, res) => {        
    //     try{
    //         const studentName = req.body.studentName
    //         const lastExamPassed = req.body.lastExamPassed
    //         const courseEnrolled = req.body.courseEnrolled
    //         const status = 1

    //         const newStudent = await Student.create({
    //             studentName,
    //             lastExamPassed,
    //             courseEnrolled,
    //             status,
    //         })            

    //         const newStudentId = newStudent._id

    //         await Fee.create({
    //             studentInfo: newStudentId,
    //             courseInfo: courseEnrolled,
    //             admissionFeesAmount: 1000,
    //             monthlyFeesAmount: 0,
    //             examFeesAmount: 0,
    //         })

    //         console.log('Student data added')
    //         res.redirect('/ccet/student-management')
    //     } catch(err) {
    //         console.error(err)
    //         res.render('error/500')
    //     }
    // },

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

    getFeesMngById: async (req, res) => {
        // console.log(req.params.id)
        try{            
            const students = await Student.find({ _id: req.params.id })
                .populate('courseEnrolled')
            
            res.render('admin/ccet/fees/recordPayment', {                
                students,            
            })
        } catch(err){
            console.error(err)
            res.render('error/500')
        }        
    }, 

    // addFees: async (req, res) => {
    //     // console.log(req.body.amountReceived)
    //     try{            
    //         const fees = await Fee.find({ studentInfo: req.body.studentId })
    //             .populate('studentInfo')     
            
    //         const feesId = fees[0]._id                

    //         await Fee.findByIdAndUpdate(
    //             feesId, 
    //             { fees: [...fees.totalFeesPaid, Number(req.body.amountReceived)] }
    //         )
            
    //         res.redirect('/')

    //     } catch(err){
    //         console.error(err)
    //         res.render('error/500')
    //     }        
    // }, 

    addFees: async (req, res) => {
        try {
          const fees = await Fee.find({ studentInfo: req.body.studentId }).populate('studentInfo');
          const fee = fees[0];
          const updatedFees = await Fee.findByIdAndUpdate(
            fee._id,
            { $push: { totalFeesPaid: Number(req.body.amountReceived) } }
          );

          const courses = await Course.find();
          const students = await Student.find({ courseEnrolled: fee.courseInfo })
            .populate('courseEnrolled')            
            .populate('fee');

            res.render('admin/ccet/fees/index', {
                courses,
                students,            
            })
         
        } catch (err) {
          console.error(err);
          res.render('error/500');
        }        
      }
      
    
}

