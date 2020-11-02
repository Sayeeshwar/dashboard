import './App.css';
import { useEffect, useState } from 'react'
import { Pie } from "react-chartjs-2"
import axios from 'axios'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Accordion from 'react-bootstrap/Accordion'
function App() {

  const [courseData, setCourseData] = useState()

  const [stateData, setStateData] = useState()

  const [colleges, setColleges] = useState()
  const [collegeId, setCollegeId] = useState()
  const [college, setCollege] = useState()

  async function getClgDetails() {
    if (collegeId) {
      console.log("gonna call /clg using", collegeId);
      let response = await axios.post('/clg', { cid: collegeId })
      let data = response.data
      console.log("ind clg data: ", data.data);
      setCollege(data.data)
    }
  }

  function handleClick(e) {
    setCollegeId(e.target.getAttribute('id'))
    let elements = document.getElementsByClassName("collegeList");
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.backgroundColor = "white";
    }
    e.target.style.backgroundColor = "gray"
  }

  async function getColleges(crs = "", st = "") {
    let response = await axios.post('/clglist', { course: crs, state: st })
    let data = response.data
    console.log(data.colleges);
    setColleges(data.colleges)
    setCollegeId(data.colleges[0]._id)
  }

  async function byCourse() {
    let response = await axios.get('/CollegesByCourse')
    let data = response.data
    setCourseData({
      labels: data.courses,
      datasets: [
        {
          label: "Course distribution",
          data: data.courseCount,
          backgroundColor: [
            "#000000", "#FF1000", "#00FF00", "#C0C0C0", "#FF0000", "#00FFFF"
          ]
        }
      ]
    })
  }

  async function byState() {
    let response = await axios.get('/CollegesByState')
    let data = response.data
    setStateData({
      labels: data.states,
      datasets: [
        {
          label: "State distribution",
          data: data.stateCount,
          backgroundColor: [
            "#000000", "#FF0000", "#00FF00", "#C0C0C0", "#FF0000", "#00FFFF"
          ]
        }
      ]
    })
  }

  useEffect(() => {
    byCourse()
    byState()
  }, [])

  useEffect(() => {
    getColleges()

  }, [])

  useEffect(() => {
    getClgDetails()
  }, [collegeId])

  return (
    <div className="App">
      <Row>
        <Col xs={4}>
          {/* Shows the course distribution chart */}
          <Card style={{ width: '30vw' }}>
            <Card.Body>
              <Card.Title>Colleges by Course</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Shows the distribution by course</Card.Subtitle>
              <div style={{ height: 300, width: 300 }}>
                {courseData ?
                  <Pie
                    data={courseData}

                    options={{
             
                      maintainAspectRatio: false,
         onClick: function (e, element) {

                        if (element.length > 0) {
                          let ind = element[0];

                          console.log(courseData.labels[ind._index])
                          getColleges(courseData.labels[ind._index])
                        }
                      }
                    }}>
                  </Pie> : null}
              </div>
            </Card.Body>
          </Card>
          {/* Shows the state distribution chart */}
          <Card style={{ width: '30vw' }}>
            <Card.Body>
              <Card.Title>Colleges by state</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Shows the distribution by state</Card.Subtitle>

              <div style={{ height: 300, width: 300 }}>
                {stateData ? <Pie data={stateData} options={{
                  onClick: function (e, element) {
                    if (element.length > 0) {
                      let ind = element[0];                      
                      console.log(stateData.labels[ind._index])
                      getColleges("", stateData.labels[ind._index])
                    }
                  }, responsive: true, maintainAspectRatio: false
                }}></Pie> : null}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={8}>
          <Row>
            <Col xs={4}>
              {/* Shows list of colleges */}
              <Card style={{ width: '18rem'}}>
                <Card.Header><h3>Colleges</h3></Card.Header>
                <ListGroup variant="flush">
                  {colleges ? colleges.map(clg => <ListGroup.Item className="collegeList" onClick={(e) => handleClick(e)} id={clg._id}>{clg.name}</ListGroup.Item>) : null}
                </ListGroup>
              </Card>
            </Col>
            <Col xs={8}>
              {/* Shows individual college details */}
              <h3>College details</h3>

              {college ?
                <div>
                  <p>{college.college.name} was founded in {college.college.founded} in {college.college.city}, {college.college.state}. It has {college.college.studentCount} students and offers {college.college.courses.map(crs => <span>{crs} </span>)}</p>

                  {college.similarColleges.length ? <p>Similar colleges in the same city with similar student count and  offered courses, are {college.similarColleges.map(clg => (<span>{clg.name}, </span>))} </p> : <p>There are no similar colleges</p>}

                  <h6>The students of this college are : </h6>
                  <br></br>
                  <Accordion defaultActiveKey="0">
                    {college.students.map(stud => (
                      <Card>
                        <Accordion.Toggle as={Card.Header} eventKey={stud._id}>
                          {stud.name}
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={stud._id}>
                          <Card.Body>
                            <p>Batch: {stud.batch}</p>
                            <p>Skills: </p>{stud.skills.map(skill => (<p>{skill}</p>))}
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    ))}
                  </Accordion>
                </div>
                :
                null
              }
            </Col>
            <br></br>
            <br></br>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default App;
