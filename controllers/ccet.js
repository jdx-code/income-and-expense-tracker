const { request } = require('express')
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const moment = require("moment")
const Course = require('../models/Course')
const Student = require('../models/Student')
const Fee = require('../models/Fee')
const mongoose = require('mongoose');
const Branch = require('../models/Branch');
const ObjectId = mongoose.Types.ObjectId;

const ITEMS_PER_PAGE = 10; // Number of students per page

module.exports = {
    getIndex: (req, res) => {
        res.render('admin/ccet/index.ejs')
    },
    
    // Get course information
    getAllCourses: async (req, res) => {
        try{

          const perPage = 5;
          const currentPage = parseInt(req.query.page) || 1;

          const totalStudents = await Course.countDocuments();
          const totalPages = Math.ceil(totalStudents / perPage);

          const courses = await Course.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

          res.render('admin/ccet/courses/index', {
              courses,
              currentPage,
              totalPages,
          })

        } catch (err) {
            console.error(err)
            res.render('error/500')
        }
    },

    // Get particular course info by Id
    getCourseById: async (req, res) => {
        try{       
            
            const perPage = 5;
            const currentPage = parseInt(req.query.page) || 1;

            const totalStudents = await Course.countDocuments();
            const totalPages = Math.ceil(totalStudents / perPage);

            const course = await Course.findById({ _id: req.params.id })
            const courses = await Course.find()
              .skip((currentPage - 1) * perPage)
              .limit(perPage);

            res.render('admin/ccet/courses/editCourse', {
                course,
                courses,
                currentPage,
                totalPages,
            })

        } catch(err) {
            console.error(err)
            res.render('error/500')
        }
    },

    // Edit selected course info
    editCourse: async (req, res) => {        
        try{          
               let course = await Course.findById(req.params.id)               

               if(!course){
                    return res.render('error/404')
               } else {
                    course = await Course.findOneAndUpdate({ _id : req.params.id }, req.body, {
                        new : true,
                        runValidators : true,
                    })

                    res.redirect('/ccet/course-management')
               }

        } catch (err) {
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

    // // Delete course
    // deleteCourse: async (req, res) => {
    //     try{
    //         await Course.findOneAndDelete({ courseName: req.body.courseToBeDeleted })
    //         console.log('Deleted course')            
    //         res.redirect('/ccet/course-management/')
    //     } catch (err){
    //         console.error(err)
    //         res.render('error/500')
    //     }
    // },

    // Render add student form
    getStudentForm: async (req, res) => {
        try{
            const courses = await Course.find()
            res.render('admin/ccet/students/addStudent', {
                courses,
            })
        } catch(err) {
            console.error(err)
            res.render('error/404')
        }        
    },

    // Render all students info in paginated view
    getAllStudents: async (req, res) => {
        try{
            const courses = await Course.find();
            const currentPage = parseInt(req.query.page) || 1; // Current page number

            const totalStudents = await Student.countDocuments();
            const totalPages = Math.ceil(totalStudents / ITEMS_PER_PAGE);

            const students = await Student.find()
            .populate('courseEnrolled')
            .sort({ enrollmentDate: 'descending' })
            .skip((currentPage - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);

            const formattedStudents = students.map(student => ({
            ...student.toObject(),
            enrollmentDate: moment(student.enrollmentDate).format('DD-MM-YYYY')
            }));

            let filterApplied

            res.render('admin/ccet/students/viewStudents', {
            courses,
            students: formattedStudents,
            currentPage,
            totalPages,
            filterApplied,
            });

        } catch(err){
            console.error(err)
            res.render('error/500')
        }
    },   
    // Render students by applying filtered search based on course and/or session
    viewFilteredStudents: async (req, res) => {
        try {
          const courses = await Course.find();
          const { courseId, courseSession } = req.body;

          let filterOptions = {};

          if (courseId) {
            filterOptions['courseEnrolled'] = courseId;
          }

          if (courseSession) {
            const sessionYear = parseInt(courseSession);
            const startDate = new Date(sessionYear, 0, 1);
            const endDate = new Date(sessionYear + 1, 0, 1);
            filterOptions.enrollmentDate = { $gte: startDate, $lt: endDate };
          }

          const perPage = 10;
          const page = parseInt(req.query.page) || 1;

          const studentsQuery = Student.find(filterOptions)
            .populate('courseEnrolled')
            .sort({ enrollmentDate: 'descending' });

          const totalStudentsQuery = Student.countDocuments(filterOptions);

          const [studentsArr, totalStudents] = await Promise.all([
            studentsQuery.skip((page - 1) * perPage).limit(perPage).exec(),
            totalStudentsQuery.exec()
          ]);

          const totalPages = Math.ceil(totalStudents / perPage);

          const students = studentsArr.map(student => ({
            ...student.toObject(),
            enrollmentDate: moment(student.enrollmentDate).format('DD-MM-YYYY'),
          }));

          res.render('admin/ccet/students/viewStudents', {
            courses,
            students,
            currentPage: page,
            totalPages,
            courseId: courseId, // Pass courseName to pre-select the filter in the view
            courseSession: courseSession, // Pass session to pre-select the filter in the view            
          }); 
        } catch (err) {
          console.error(err);
          res.render('error/500');
        }
      },
      

    // Get student information
    // getStudentMng: async (req, res) => {
    //     try{
    //         const courses = await Course.find()
    //         const studentsArr = await Student.find()
    //             .populate('courseEnrolled')

    //         const students = studentsArr.map(student => ({
    //             ...student.toObject(),
    //             enrollmentDate: moment(student.enrollmentDate).format("DD-MM-YYYY")
    //         }));            

    //         res.render('admin/ccet/students/index', {
    //             courses,
    //             students,                
    //         })

    //     } catch (err){
    //         console.error(err)
    //         res.render('error/500')
    //     }
    // },

    getStudentById: async (req, res) => {
        try{
            const studentInfo = await Student.findById({ _id: req.params.id })
                .populate('courseEnrolled')

            res.render('admin/ccet/students/studentInfo', {
                studentInfo,
            })
        } catch(err){
            console.error(err)
            res.render('error/500')
        }
    },

    // // Get students data by filtered data (for ex: filter by `course`)
    // getStudentMngFiltered: async (req, res) => {              
    //     try{  
    //         const courses = await Course.find()          
    //         const studentsArr = await Student.find({ courseEnrolled : req.body.courseName })
    //             .populate('courseEnrolled')
                
    //         const students = studentsArr.map(student => ({
    //             ...student.toObject(),
    //             enrollmentDate: moment(student.enrollmentDate).format("DD-MM-YYYY")
    //         }));
            
    //         res.render('admin/ccet/students/index', {  
    //             courses,              
    //             students
    //         })
    //     } catch (err)         {
    //         console.error(err)
    //         res.render('error/500')
    //     }
    // },

    // // Add student data 
    // // addStudent: async (req, res) => {        
    // //     try{
    // //         const studentName = req.body.studentName
    // //         const lastExamPassed = req.body.lastExamPassed
    // //         const courseEnrolled = req.body.courseEnrolled
    // //         const status = 1

    // //         const newStudent = await Student.create({
    // //         studentName,
    // //         lastExamPassed,
    // //         courseEnrolled,
    // //         status,
    // //         })

    // //         const newStudentId = newStudent._id

    // //         const newFee = await Fee.create({
    // //         studentInfo: newStudentId,
    // //         courseInfo: courseEnrolled,
    // //         admissionFeesAmount: 1000,
    // //         totalFeesPaid: [0],
    // //         examFeesAmount: 0,
    // //         })

    // //         const updatedStudent = await Student.findByIdAndUpdate(
    // //         newStudentId,
    // //         { fee: newFee._id },
    // //         { new: true }
    // //         ).populate('fee')

    // //         console.log('Student data added')
    // //         res.redirect('/ccet/student-management')
    // //     } catch(err) {
    // //         console.error(err)
    // //         res.render('error/500')
    // //     }
    // // },      

    // Insert new student
    addStudentProcess: async (req, res) => {
        try {
          upload.single('image')(req, res, async (err) => {
            if (err) {
              console.error(err);
              res.render('error/500');
            } else {
              try {
                const studentName = req.body.studentName;
                const lastExamPassed = req.body.lastExamPassed;
                const courseEnrolled = req.body.courseEnrolled;
                const status = 1;      
                
                // Upload the file to Cloudinary
                const result = await cloudinary.uploader.upload(req.file.path);
                const imageUrl = result.secure_url;
      
                const newStudent = await Student.create({
                  studentName,
                  lastExamPassed,
                  courseEnrolled,                  
                  status,
                  admission_form_img: imageUrl, // Save the Cloudinary image URL in the student document
                });
      
                const newStudentId = newStudent._id;
      
                const newFee = await Fee.create({
                  studentInfo: newStudentId,
                  courseInfo: courseEnrolled,
                  admissionFeesAmount: 1000,
                  totalFeesPaid: [0],
                  examFeesAmount: 0,                  
                });

                console.log(newFee)
      
                const updatedStudent = await Student.findByIdAndUpdate(
                  newStudentId,
                  { fee: newFee._id,  },
                  { new: true }
                ).populate('fee');
      
                console.log('Student data added');
                res.redirect('/ccet/student-management');
              } catch (err) {
                console.error(err);
                res.render('error/500');
              }
            }
          });
        } catch (err) {
          console.error(err);
          res.render('error/500');
        }
      },

    // Get fees data
    getAllFeesInfo: async (req, res) => {
        try{
            const courses = await Course.find()

            const currentPage = parseInt(req.query.page) || 1; // Current page number

            const totalStudents = await Student.countDocuments();
            const totalPages = Math.ceil(totalStudents / ITEMS_PER_PAGE);

            const students = await Student.find()                
                .populate('courseEnrolled')
                .populate('fee')    
                .sort({ enrollmentDate: 'descending' })
                .skip((currentPage - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);

            console.log(students)                

            res.render('admin/ccet/fees/index', {
                courses,
                students,      
                currentPage,
                totalPages,
            })
        } catch(err){
            console.error(err)
            res.render('error/500')
        }        
    },

    getFeesForm: async (req, res) => {
        try{
            const courses = await Course.find()
            const students = await Student.find()
                .populate('courseEnrolled')

            console.log(students)                

            res.render('admin/ccet/fees/addFees', {
                courses,
                students,            
            })
        } catch(err){
            console.error(err)
            res.render('error/500')
        }
    },

    // Get fees data by filtered data (for ex: filter by `course`)
    // getFeesMngFiltered: async (req, res) => {
    //     try {
    //         const courses = await Course.find();
    //         const { courseName, session } = req.body;

    //         let filterOptions = {};
    //         if (courseName) {
    //             filterOptions.courseEnrolled = courseName;
    //         }

    //         const perPage = 10;
    //         const page = parseInt(req.query.page) || 1;

    //         const students = await Student.find(filterOptions)
    //             .populate('courseEnrolled')
    //             .populate('fee')
    //             .sort({ enrollmentDate: 'descending' })
    //             .skip((page - 1) * perPage)
    //             .limit(perPage);
                    
    //         const totalStudents = await Student.countDocuments(filterOptions);
    //         const totalPages = Math.ceil(totalStudents / perPage);

    //         res.render('admin/ccet/fees/index', {
    //             courses,
    //             students,
    //             currentPage: page,
    //             totalPages,
    //         });
    //     } catch (err) {
    //         console.error(err);
    //         res.render('error/500');
    //     }
    // },    

    viewFilteredFeesInfo: async (req, res) => {
      try {
          const courses = await Course.find();
          const { courseId, courseSession } = req.body;

          let filterOptions = {};

          if (courseId) {
            filterOptions['courseEnrolled'] = courseId;
          }

          if (courseSession) {
            const sessionYear = parseInt(courseSession);
            const startDate = new Date(sessionYear, 0, 1);
            const endDate = new Date(sessionYear + 1, 0, 1);
            filterOptions.enrollmentDate = { $gte: startDate, $lt: endDate };
          }


          const perPage = 10;
          const page = parseInt(req.query.page) || 1;

          const studentsQuery = Student.find(filterOptions)
            .populate('courseEnrolled')
            .populate('fee')
            .sort({ enrollmentDate: 'descending' });

          const totalStudentsQuery = Student.countDocuments(filterOptions);

          const [studentsArr, totalStudents] = await Promise.all([
            studentsQuery.skip((page - 1) * perPage).limit(perPage).exec(),
            totalStudentsQuery.exec()
          ]);

          const totalPages = Math.ceil(totalStudents / perPage);

          const students = studentsArr.map(student => ({
            ...student.toObject(),
            enrollmentDate: moment(student.enrollmentDate).format('DD-MM-YYYY'),
          }));

          res.render('admin/ccet/fees/index', {
            courses,
            students,
            currentPage: page,
            totalPages,
            courseId: courseId, // Pass courseName to pre-select the filter in the view
            courseSession: courseSession, // Pass session to pre-select the filter in the view            
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

            const formattedStudents = students.map(student => {
              const formattedPaymentDates = student.fee.paymentDates.map(date => 
                moment(date).format('DD-MM-YYYY')
              )
              return {
                ...student.toObject(),
                fee: {
                  ...student.fee.toObject(),
                  paymentDates: formattedPaymentDates,
                }
              }
            })              

            res.render('admin/ccet/fees/viewFeesHistory', {                
                students: formattedStudents,            
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
          const currentDate = new Date();
          const updatedFees = await Fee.findByIdAndUpdate(
            fee._id,
            { $push: { totalFeesPaid: Number(req.body.amountReceived), paymentDates: currentDate } }
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
          res.render('error/500')
        }        
    },
    
    // Branch functions
    getBranch: async(req, res) => {
      try{
        const branches = await Branch.find()
        res.render('admin/ccet/branches/index', {
          branches,
        })
      } catch(err){
        console.error(err)
        res.render('error/500')
      }
    },

    addBranch: async(req, res) => {
      try{  
        const startDate = new Date()  
        await Branch.create({
            branchName: req.body.branch_name,             
            centerInCharge: req.body.center_in_charge,
            contactNumber: req.body.contact_number, 
            email: req.body.email,
            startDate,
        })
          console.log('New Branch Added')
          res.redirect('/ccet/branch-management/')
      } catch(err) {
        console.error(err)
        res.render('error/500')
      }
    },

    getBranchById: async(req, res) => {
        try{       
              
          const perPage = 5;
          const currentPage = parseInt(req.query.page) || 1;

          const totalStudents = await Course.countDocuments();
          const totalPages = Math.ceil(totalStudents / perPage);

          const branch = await Branch.findById({ _id: req.params.id })
          const branches = await Branch.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

          res.render('admin/ccet/branches/editBranch', {
              branch,
              branches,
              currentPage,
              totalPages,
          })

      } catch(err) {
          console.error(err)
          res.render('error/500')
      }
    },

    editBranch: async(req, res) => {
      try{          
          let branch = await Branch.findById(req.params.id)               

          if(!branch){
              return res.render('error/404')
          } else {
              branch = await Branch.findOneAndUpdate({ _id : req.params.id }, req.body, {
                  new : true,
                  runValidators : true,
              })

              res.redirect('/ccet/branch-management')
          }
      } catch (err) {
          console.error(err)
          res.render('error/500')
      }
    },
   
}