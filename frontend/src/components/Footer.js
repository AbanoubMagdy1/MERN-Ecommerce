import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer>
      <Container className="text-center">
        <Row>
          <Col>
            <p>Proshop &copy; 2020</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
