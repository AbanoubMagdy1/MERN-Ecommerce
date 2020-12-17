import React from 'react';
import { Pagination, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Paginate = ({ url, page, numOfPages }) => {
  return (
    <Pagination className="d-flex justify-content-center">
      {page > 3 && (
        <>
          <LinkContainer to={`${url}/1`}>
            <Pagination.First />
          </LinkContainer>
          <Pagination.Ellipsis />
        </>
      )}
      {page - 2 > 0 && (
        <LinkContainer to={`${url}/${page - 2}`}>
          <Pagination.Item>{page - 2}</Pagination.Item>
        </LinkContainer>
      )}
      {page - 1 > 0 && (
        <LinkContainer to={`${url}/${page - 1}`}>
          <Pagination.Item>{page - 1}</Pagination.Item>
        </LinkContainer>
      )}
      <Pagination.Item active>{page}</Pagination.Item>
      {numOfPages - page > 0 && (
        <LinkContainer to={`${url}/${page + 1}`}>
          <Pagination.Item>{page + 1}</Pagination.Item>
        </LinkContainer>
      )}
      {numOfPages - page > 1 && (
        <LinkContainer to={`${url}/${page + 2}`}>
          <Pagination.Item>{page + 2}</Pagination.Item>
        </LinkContainer>
      )}
      {numOfPages - page > 2 && (
        <>
          <Pagination.Ellipsis />
          <LinkContainer to={`${url}/${numOfPages}`}>
            <Pagination.Last />
          </LinkContainer>
        </>
      )}
    </Pagination>
  );
};

export default Paginate;
