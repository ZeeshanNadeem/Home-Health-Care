import React from "react";
import { Button } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";

const Card_ = ({ cardTitle, cardText, btnName, imgSrc }) => {
  const jwt = localStorage.getItem("token");
  let user = "";
  if (jwt) {
    user = jwtDecode(jwt);
  }

  return (
    <article>
      <Card style={{ width: "18rem" }} className="service-card">
        <Card.Img variant="top" src={imgSrc} />
        <Card.Body>
          <Card.Title>{cardTitle}</Card.Title>
          <Card.Text>{cardText}</Card.Text>
          {user &&
            !user.isAppAdmin &&
            user.isOrganizationAdmin === "false" &&
            !user.staffMember && (
              <Link to="user/request">
                <Button variant="primary">Set Up A Meeting</Button>
              </Link>
            )}
        </Card.Body>
      </Card>
    </article>
  );
};

export default Card_;
