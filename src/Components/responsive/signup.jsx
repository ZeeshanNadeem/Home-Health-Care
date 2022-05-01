import React, { Component } from 'react';
import { Card,Col,Row,Container } from 'react-bootstrap';
class Res extends Component {
    state = {  } 
    render() { 
        return ( 
          
            <div style={{display:"flex",alignItems:"center",height:"100vh"}}>

           
        <Container>
        <Card >
            <Row className="justify-content-md-center">
                <Col md={5} xs={11} lg={4}>
            <label>Name</label>
            <input type="text" style={{width:"100%"}}/>
            
            </Col>
            </Row> 

            <Row  className="justify-content-md-center">
            <Col md={5} xs={11} lg={4}>
            <label>Email</label>
            <input type="text"  style={{width:"100%"}}/>
            </Col>
            </Row>

            <Row  className="justify-content-md-center">
            <Col md={5} xs={11} lg={4}>
            <label>password</label>
            <input type="password"  style={{width:"100%"}}/>
            </Col>
            </Row>
           
            </Card>
    </Container>
  
    </div>
    );
    }
}
 
export default Res;