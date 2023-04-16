import React from "react";
import { Form, Button, Table, Container, Row, Col } from "react-bootstrap";

const Items = ({
  user,
  name,
  email,
  handledelete,
  handleupdate,
  setemail,
  setname,
  editmode,
}) => {
  return (
    <>
      <tr>
        <td>{user.id}</td>
        <td>
          {editmode.mode ? (
            <Form.Control
              type="text"
              value={name}
              onChange={(event) => setname(event.target.value)}
            />
          ) : (
            user.name
          )}
        </td>
        <td>
          {editmode.mode ? (
            <Form.Control
              type="text"
              value={email}
              onChange={(event) => setemail(event.target.value)}
            />
          ) : (
            user.email
          )}
        </td>

        <td>
          <Button variant="primary" onClick={() => handleupdate(user)}>
            {editmode.key === user.id ? <>OK</> : <>Edit</>}
          </Button>{" "}
          <Button variant="danger" onClick={() => handledelete(user)}>
            Delete
          </Button>
        </td>
      </tr>
    </>
  );
};

export default Items;
