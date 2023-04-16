import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Table, Container, Row, Col } from "react-bootstrap";
import Items from "./components/items";
import axios from "axios";
import "./App.css";

const URL = "/api";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editMode, setMode] = useState({ mode: false, key: -1 });
  const addKey = useRef(null);
  // Fetch all users on component mount
  useEffect(() => {
    axios
      .get(`${URL}/users`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Handle form submission for creating a new user
  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post(`${URL}/users`, { name, email })
      .then((response) => {
        setUsers([...users, response.data]);
        setName("");
        setEmail("");
      })
      .catch((error) => {
        console.error(error);
      });
  };
  // Handle form submission for updating an existing user
  const handleUpdate = (user) => {
    if (editMode.mode === false) {
      setMode({ mode: true, key: user.id });
      setName(user.name);
      setEmail(user.email);
      addKey.current.setAttribute("disabled", true);
    } else {
      setMode({ mode: false, key: -1 });
      addKey.current.removeAttribute("disabled");
      axios
        .put(`${URL}/users/${user.id}`, { name, email })
        .then((response) => {
          setUsers(
            users.map((u) => {
              if (u.id === user.id) {
                u.name = name;
                u.email = email;
                return u;
              } else {
                return u;
              }
            })
          );
          setName("");
          setEmail("");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  // Handle deletion of a user
  const handleDelete = (user) => {
    axios
      .delete(`${URL}/users/${user.id}`)
      .then((response) => {
        if (response.status === 200) {
          setUsers(users.filter((u) => u.id !== user.id));
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="App">
      <Container>
        <Row>
          <Col>
            <h1 style={{ textAlign: "center" }}>User Management</h1>
          </Col>
        </Row>
      </Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter name"
            readOnly={editMode.mode ? true : false}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            required
            type="email"
            placeholder="Enter email"
            value={email}
            readOnly={editMode.mode ? true : false}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" ref={addKey}>
          Add User
        </Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <Items
              key={user.id}
              user={user}
              editmode={editMode}
              name={name}
              email={email}
              setemail={setEmail}
              setname={setName}
              handledelete={handleDelete}
              handleupdate={handleUpdate}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default App;
