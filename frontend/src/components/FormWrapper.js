import React, { Children } from 'react';
import { Row, Col } from 'react-bootstrap';

const FormWrapper = ({ children }) => {
  return (
    <Row className="justify-content-center">
      <Col lg={6}>{children}</Col>
    </Row>
  );
};

export default FormWrapper;
