const express = require("express")
const app = express()
const mongoose = require("mongoose")
const PORT = process.env.PORT || 5000
const http = require('http')
const Student = require('./Student')
const College = require('./College')
const bodyParser = require('body-parser')
const server = http.createServer(app)
// const cors=require('cors')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(cors())

mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://sai:sai1234@cluster0.fe5zb.mongodb.net/<dbname>?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection
db.once("open", () => {
    console.log("DB Connected!")
})
db.on("error", console.error.bind(console, "connection error: "))

app.get('/CollegesByCourse', async (req, res) => {
    
    try {
        let i=0
        
        let courses = await College.find().distinct('courses')
        
        let courseCount=[]
        for (i = 0; i < courses.length; i++) {
            
            
            let count = await College.countDocuments({ courses: courses[i] })
            
            courseCount[i]=count
            
        }
        data={
            courses,
            courseCount
        }


        return res.json(data)

    }
    catch (err) {
        console.error("Error: ", err);
    }
})

app.get('/CollegesByState', async (req, res) => {
    
    try {
        let stateCount = []
        let i =0
        let states = await College.find().distinct('state')
        for (i = 0; i < states.length; i++) {
            stateCount[i] = await College.count({ state: states[i] })
        }
        data={
            states,
            stateCount
        }
        return res.json(data)

    }
    catch (err) {
        console.error("Error: ", err);
    }
})

app.post('/clg', async (req, res) => {
    try {
        let cid = req.body.cid
        let clg = await College.findById(cid)
        let students = await Student.find({ collegeID: cid })
        let similar = await College.find({ courses: { $all: ["CSE", "EEE", "ECE", "BME"] } }, { city: clg.city, courses: 1, name: 1, founded: 1, state: 1, country: 1, studentCount: 1 }).where('studentCount').gte(clg.studentCount - 100).lte(clg.studentCount + 100)
        similar = similar.filter((college) => {
            return college._id != cid
        })

        let data = {
            college: clg,
            students: students,
            similarColleges: similar
        }
        return res.json({ data: data })
    }
    catch (err) {
        console.error(err);
    }

})

app.post('/clglist', async (req, res) => {
    let colleges
    try {
        let course = req.body.course
        let state = req.body.state
        if (course == "" && state == "") {
            colleges = await College.find()
        }
        else {
            if (course == "") {
                colleges = await College.find({ state: state })
            }
            else {
                colleges = await College.find({ courses: course })
            }

        }
    }
    catch (err) {
        console.error("Error: ", err);
    }
    return res.json({ colleges: colleges })
})

app.post('/add', async (req, res) => {
    try {
        college = new College({
            name: req.body.name,
            founded: req.body.founded,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            studentCount: parseInt(req.body.studentCount),
            courses: req.body.courses,
        })
        const savedClg = await college.save()
        console.log("saved college is: ", savedClg);
    }
    catch (err) {
        console.error("error saving college: ", err);
    }

})

app.post('/addStudent', async (req, res) => {
    try {
        student = new Student({
            name: req.body.name,
            batch: req.body.batch,
            collegeID: req.body.collegeID,
            skills: req.body.skills,
        })
        const savedStud = await student.save()
        console.log("saved college is: ", savedStud);
    }
    catch (err) {
        console.error("error saving college: ", err);
    }

})

if(process.env.NODE_ENV==="production")
{
    app.use(express.static('client/build'))
}

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} `)
})