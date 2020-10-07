import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <Spinner
      animation="border"
      variant="secondary"
      role="status"
      style={{
        width: '150px',
        height: '150px',
        margin: '150px auto',
        display: 'block',
      }}
    />
  );
};

export default Loader;
