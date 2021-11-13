import React from "react";
import { Button } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Card_ = ({ cardTitle, cardText, btnName, imgSrc }) => {
  return (
    <article>
      <Card style={{ width: "18rem" }} className="service-card">
        <Card.Img variant="top" src={imgSrc} />
        <Card.Body>
          <Card.Title>{cardTitle}</Card.Title>
          <Card.Text>{cardText}</Card.Text>
          <Link to="user/request">
            <Button variant="primary">Book Now</Button>
          </Link>
        </Card.Body>
      </Card>
    </article>
  );
};

export default Card_;
