import React from "react";
import { Button } from "react-bootstrap";
import { Card } from "react-bootstrap";

const Card_ = ({ cardTitle, cardText, btnName, imgSrc }) => {
  return (
    <article>
      <Card style={{ width: "18rem" }}>
        <Card.Img variant="top" src={imgSrc} />
        <Card.Body>
          <Card.Title>{cardTitle}</Card.Title>
          <Card.Text>{cardText}</Card.Text>
          <Button variant="primary">Book Now</Button>
        </Card.Body>
      </Card>
    </article>
  );
};

export default Card_;
