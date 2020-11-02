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
    console.log("hitting /CollegesByCourse");
    try {
        let i=0
        
        let courses = await College.find().distinct('courses')
        //console.log("Distinct courses are ",courses,"courses length is: ",courses.length);
        let courseCount=[]
        for (i = 0; i < courses.length; i++) {
            
            //console.log("iteration no: ",i,"checking count of ",courses[i]," now.");
            let count = await College.countDocuments({ courses: courses[i] })
            //console.log("Count for ",courses[i]," is ",count);
            courseCount[i]=count
            //console.log('---------------')
        }
        data={
            courses,
            courseCount
        }
        console.log("byCourse returning data: ",data)

        return res.json(data)

    }
    catch (err) {
        console.error("Error: ", err);
    }
})

app.get('/CollegesByState', async (req, res) => {
    console.log("hitting /CollegesByState");
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
        console.log("byState returning: ",data)


        return res.json(data)

    }
    catch (err) {
        console.error("Error: ", err);
    }
})

app.post('/clg', async (req, res) => {
    console.log("hitting /clg");
    try {
        let cid = req.body.cid
        console.log(cid);
        let clg = await College.findById(cid)
        console.log("College: ", clg);
        let students = await Student.find({ collegeID: cid })
        console.log("students:", students);
        let similar = await College.find({ courses: { $all: ["CSE", "EEE", "ECE", "BME"] } }, { city: clg.city, courses: 1, name: 1, founded: 1, state: 1, country: 1, studentCount: 1 }).where('studentCount').gte(clg.studentCount - 100).lte(clg.studentCount + 100)
        similar = similar.filter((college) => {
            return college._id != cid
        })


        console.log("Similar colleges: ", similar);
        let data = {
            college: clg,
            students: students,
            similarColleges: similar
        }

        console.log("returning data", data);
        return res.json({ data: data })
    }
    catch (err) {
        console.error(err);
    }

})

app.post('/clglist', async (req, res) => {
    console.log("hitting /clglist");
    // console.log("course",req.body.course);
    let colleges
    try {
        let course = req.body.course
        let state = req.body.state
        
        if (course == "" && state == "") {
            
            colleges = await College.find()
            // console.log("No params",colleges)

        }
        else {
            if (course == "") {
                colleges = await College.find({ state: state })
                // console.log("state specified: ",colleges)
            }
            else {
                colleges = await College.find({ courses: course })
                // console.log("course specified: ",colleges)
            }

        }
    }
    catch (err) {
        console.error("Error: ", err);
    }
    console.log("returning college list: ",colleges);
    return res.json({ colleges: colleges })
})

app.post('/add', async (req, res) => {
    try {

        console.log("new College being added")
        console.log(req.body);
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

        console.log("new Student being added")
        // console.log(req.body);
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

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} `)
})