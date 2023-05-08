const Course = require('../models/Course')

module.exports = {
    getIndex: async (req, res) => {
        try{
            const course = await Course.find()
            res.render('course/course', {
                course,
            })
        } catch (err) {
            console.error(err)
            res.render('error/404')
        }        
    },
    addCourse: async (req, res) => {        
        try{
            await Course.create({ 
                courseName: req.body.course, 
                courseDuration: req.body.duration 
            })
            console.log('Course added successfully!')
            res.render('course/course')
        } catch (err){
            console.error(err)
            res.render('error/500')
        }
    }
}