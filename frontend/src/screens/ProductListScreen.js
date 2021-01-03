import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Table, Row, Col } from 'react-bootstrap';
import { productListAction } from '../actions/productActions';
import { PRODUCT_LIST_REMOVE } from '../actions/types';
import axios from 'axios';

const ProductListScreen = ({ history, match }) => {
  const { user } = useSelector(state => state.userInfo);
  const { loading, products, numOfPages, error } = useSelector(
    state => state.productList
  );
  const dispatch = useDispatch();

  const [message, setMessage] = useState('');
  const [loader, setLoader] = useState(false);
  const [err, setErr] = useState('');

  const config = {
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  };
  useEffect(() => {
    if (!user || !user.isAdmin) history.push('/');
    else {
      dispatch(productListAction(match.params.page, 25));
    }
  }, [user, match.params.page, dispatch, history]);

  const deleteProduct = async (id, name) => {
    if (window.confirm(`Delete ${name}??`)) {
      setLoader(true);
      try {
        const { data } = await axios.delete(`/api/products/${id}`, config);
        setMessage(data);
        dispatch({ type: PRODUCT_LIST_REMOVE, id });
      } catch (e) {
        setErr(
          e.response && e.response.data.message
            ? e.response.data.message
            : e.message
        );
      }
      setLoader(false);
    }
  };

  const createProduct = async () => {
    setLoader(true);
    try {
      const { data } = await axios.post(`/api/products/`, {}, config);
      history.push(`/product/edit/${data._id}`);
    } catch (e) {
      setErr(
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message
      );
      setLoader(false);
    }
  };
  return (
    <>
      <Row className="my-4">
        <Col>
          <h1>PRODUCTS</h1>
        </Col>
        <Col className="text-right">
          <Button onClick={createProduct}>Create Product</Button>
        </Col>
      </Row>
      {loading && <Loader />}
      {loader && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      {err && <Message variant="danger">{err}</Message>}
      {message && <Message variant="success">{message}</Message>}
      <Table hover striped bordered className="table-sm">
        <thead>
          <tr>
            <th>NAME</th>
            <th>BRAND</th>
            <th>CATEGORY</th>
            <th>PRICE</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td>
                <Link to={`/product/${product._id}`}>{product.name}</Link>
              </td>
              <td>{product.brand}</td>
              <td>{product.category}</td>
              <td>${product.price}</td>
              <td>
                <Button
                  variant="secondary"
                  onClick={() => history.push(`/product/edit/${product._id}`)}
                >
                  <i className="fas fa-edit"></i>
                </Button>
                <Button
                  variant="danger"
                  onClick={() => deleteProduct(product._id, product.name)}
                >
                  <i className="fas fa-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Paginate
        url="/admin/productlist"
        page={parseInt(match.params.page)}
        numOfPages={numOfPages}
      />
    </>
  );
};

export default ProductListScreen;
