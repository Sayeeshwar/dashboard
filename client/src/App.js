import "./App.css";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Accordion from "react-bootstrap/Accordion";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
function App() {
  const [courseData, setCourseData] = useState();

  const [stateData, setStateData] = useState();

  const [colleges, setColleges] = useState();
  const [collegeId, setCollegeId] = useState();
  const [college, setCollege] = useState();

  async function getClgDetails() {
    if (collegeId) {
      let response = await axios.post("/clg", { cid: collegeId });
      let data = response.data;
      setCollege(data.data);
    }
  }

  function handleClick(e) {
    setCollegeId(e.target.getAttribute("id"));
    let elements = document.getElementsByClassName("collegeList");
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.backgroundColor = "white";
    }
    e.target.style.backgroundColor = "#5EADD6";
  }

  async function getColleges(crs = "", st = "") {
    let response = await axios.post("/clglist", { course: crs, state: st });
    let data = response.data;
    setColleges(data.colleges);
    setCollegeId(data.colleges[0]._id);
  }

  async function byCourse() {
    let response = await axios.get("/CollegesByCourse");
    let data = response.data;
    setCourseData({
      labels: data.courses,
      datasets: [
        {
          label: "Course distribution",
          data: data.courseCount,
          backgroundColor: [
            "#BED9F4",
            "#5EADD6",
            "#F0E0ED",
            "#F3DB9A",
            "#C0CF8B",
            "#F69163",
          ],
        },
      ],
    });
  }

  async function byState() {
    let response = await axios.get("/CollegesByState");
    let data = response.data;
    setStateData({
      labels: data.states,
      datasets: [
        {
          label: "State distribution",
          data: data.stateCount,
          backgroundColor: ["#BED9F4", "#5EADD6", "#F0E0ED"],
        },
      ],
    });
  }

  useEffect(() => {
    byCourse();
    byState();
  }, []);

  useEffect(() => {
    getColleges();
  }, []);

  useEffect(() => {
    getClgDetails();
  }, [collegeId]);

  return (
    <div className="App">
      <Container style={{ margin: 0 }} fluid>
        <Navbar
          collapseOnSelect
          expand="lg"
          style={{ borderRadius: "5px 5px 0px 0px", marginTop: 5 }}
          bg="light"
          variant="light"
        >
          <Navbar.Brand
            style={{ marginLeft: "1vh" }}
            href="https://www.oneshot.ai/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              alt=""
              height="35"
              src="https://static.wixstatic.com/media/49f65e_70274cd34114455598ce1a2c26329b6c~mv2.png/v1/fill/w_154,h_55,al_c,q_85,usm_0.66_1.00_0.01/OneShotai_logowhite_edited.webp"
              className="d-inline-block align-top"
            />{" "}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />

          <Nav>
            {/* <Navbar.Text style={{ marginLeft: "1vh" }}> */}
            <h5>College Dashboard</h5>
            {/* </Navbar.Text> */}
          </Nav>
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="justify-content-end"
          >
            <Nav>
              <Navbar.Text>
                <h6>Developed by : </h6>
                <a href="http://www.github.com/Sayeeshwar" target="_blank" rel="noreferrer">
                  Sayeeshwar Girish
                </a>
              </Navbar.Text>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Navbar
          style={{
            borderRadius: "0px 0px 5px 5px",
            borderTop: "1px solid black",
          }}
          bg="light"
          variant="light"
        >
          <Navbar.Text>
            <h5>Explore all the colleges in the country.</h5>
          </Navbar.Text>
        </Navbar>
        <Row>
          <Col xs={12} lg={5}>
            <br></br>

            <Card style={{ borderRadius: 10 }}>
              <Card.Body>
                <Tabs
                  style={{ padding: "0px 15px 15px 15px" }}
                  justify
                  defaultActiveKey="course"
                  id="uncontrolled-tab-example"
                >
                  <Tab eventKey="course" title="by Course">
                    {/* Shows the course distribution chart */}
                    <Card style={{ borderRadius: 15 }}>
                      <Card.Body>
                        <Card.Subtitle className="mb-2 text-muted">
                          College distribution by course
                        </Card.Subtitle>
                        <hr></hr>
                        <div style={{ height: "20vh" }}>
                          {courseData ? (
                            <Pie
                              data={courseData}
                              options={{
                                responsive: true,
                                legend: {
                                  display: false,
                                },

                                maintainAspectRatio: false,
                                onClick: function (e, element) {
                                  if (element.length > 0) {
                                    let ind = element[0];

                                    // console.log(courseData.labels[ind._index]);
                                    getColleges(courseData.labels[ind._index]);
                                  }
                                },
                              }}
                            ></Pie>
                          ) : null}
                        </div>
                      </Card.Body>
                    </Card>
                  </Tab>
                  <Tab eventKey="state" title="by State">
                    {/* Shows the state distribution chart */}
                    <Card style={{ borderRadius: 15 }}>
                      <Card.Body>
                        <Card.Subtitle className="mb-2 text-muted">
                          College distribution by state
                        </Card.Subtitle>
                        <hr></hr>

                        <div style={{ height: "20vh" }}>
                          {stateData ? (
                            <Pie
                              data={stateData}
                              options={{
                                onClick: function (e, element) {
                                  if (element.length > 0) {
                                    let ind = element[0];
                                    // console.log(stateData.labels[ind._index]);
                                    getColleges(
                                      "",
                                      stateData.labels[ind._index]
                                    );
                                  }
                                },
                                responsive: true,
                                maintainAspectRatio: false,
                                legend: {
                                  display: false,
                                },
                              }}
                            ></Pie>
                          ) : null}
                        </div>
                      </Card.Body>
                    </Card>
                  </Tab>
                </Tabs>
                <i>
                  (Click on a slice to filter the colleges list below | Refresh
                  page to reset filters)
                </i>
              </Card.Body>
            </Card>

            {/* Shows list of colleges */}
            <Card
              className="clgList"
              style={{ height: "31vh", marginTop: "5px", borderRadius: 5 }}
            >
              <Card.Header>
                <h5>Colleges</h5>
                <p>(Pick a college to see its details)</p>
              </Card.Header>
              <ListGroup variant="flush" style={{ overflowY: "auto" }}>
                {colleges
                  ? colleges.map((clg, ind) => {
                      if (!ind) {
                        return (
                          <ListGroup.Item
                            className="collegeList"
                            onClick={(e) => handleClick(e)}
                            key={ind}
                            id={clg._id}
                            style={{ backgroundColor: "#5EADD6" }}
                          >
                            {clg.name}
                          </ListGroup.Item>
                        );
                      } else {
                        return (
                          <ListGroup.Item
                            key={ind}
                            className="collegeList"
                            onClick={(e) => handleClick(e)}
                            id={clg._id}
                          >
                            {clg.name}
                          </ListGroup.Item>
                        );
                      }
                    })
                  : null}
              </ListGroup>
            </Card>
          </Col>
          <Col xs={12} lg={7}>
            <br></br>

            {/* Shows individual college details */}
            <Card
              style={{
                height: "75vh",
                width: "100%",
                borderRadius: 5,
                textAlign: "left",
              }}
            >
              <Card.Header style={{ textAlign: "center" }}>
                <h3>College details</h3>
              </Card.Header>
              <Card.Body style={{ overflowY: "auto" }}>
                {college ? (
                  <div style={{ padding: "1% 4% 4% 4%" }}>
                    <h1
                      style={{
                        textAlign: "center",
                        textDecoration: "underline",
                      }}
                    >
                      <i>{college.college.name}</i>
                    </h1>
                    <ul>
                      <li>
                        was founded in {college.college.founded} in{" "}
                        {college.college.city}, {college.college.state}.
                      </li>
                      <li>has {college.college.studentCount} students </li>
                    </ul>
                    <ul>
                      <li>offers :</li>
                      <ul>
                        {college.college.courses.map((crs, ind) => (
                          <li key={ind}>{crs} </li>
                        ))}
                      </ul>
                    </ul>

                    <hr />
                    {college.similarColleges.length ? (
                      <div>
                        <h6>
                          Colleges in the same city of similar size and offered
                          courses, are:
                        </h6>
                        <br />
                        <ListGroup horizontal>
                          {college.similarColleges.map((clg, ind) => (
                            <ListGroup.Item key={ind}>
                              {clg.name}{" "}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </div>
                    ) : (
                      <p>There are no similar colleges</p>
                    )}
                    <hr />
                    <h4 style={{ textAlign: "center" }}>
                      The students of this college are :{" "}
                    </h4>

                    <br></br>
                    <Accordion
                      style={{ width: "80%", marginLeft: "10%" }}
                      defaultActiveKey="0"
                    >
                      {college.students.map((stud) => (
                        <Card key={stud._id}>
                          <Accordion.Toggle
                            as={Card.Header}
                            eventKey={stud._id}
                          >
                            {stud.name}
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey={stud._id}>
                            <Card.Body>
                              <p>Batch: {stud.batch}</p>
                              <p>Skills: </p>
                              {stud.skills.map((skill, ind) => (
                                <p key={ind}>{skill}</p>
                              ))}
                            </Card.Body>
                          </Accordion.Collapse>
                        </Card>
                      ))}
                    </Accordion>
                  </div>
                ) : null}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
