import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useSelector } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import FormWrapper from '../components/FormWrapper';
import axios from 'axios';

const ProductEditScreen = ({ history, match }) => {
  const { user } = useSelector(state => state.userInfo);
  const { page } = useSelector(state => state.productList);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [countInStock, setCountInStock] = useState(0);

  useEffect(() => {
    if (!user && !user.isAdmin) {
      history.push('/');
    } else {
      fetchProduct(match.params.id);
    }
    // eslint-disable-next-line
  }, [user, history]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/products/${match.params.id}`);
      setName(data.name);
      setBrand(data.brand);
      setCategory(data.category);
      setDescription(data.description);
      setPrice(data.price);
      setCountInStock(data.countInStock);
      setImage(data.image);
    } catch (e) {
      setMsg(
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message
      );
    }
    setLoading(false);
  };

  const handleSubmit = async e => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    };
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `/api/products/${match.params.id}`,
        { name, category, brand, description, image, price, countInStock },
        config
      );
      history.push(`/admin/productlist/${page}`);
    } catch (e) {
      setMsg(
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message
      );
      setLoading(false);
    }
  };

  const uploadImage = async e => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    setUploading(true);
    const f = new FormData();
    const file = e.target.files[0];
    f.append('image', file);
    try {
      const { data } = await axios.post(`/api/upload`, f, config);
      setImage(data);
    } catch (e) {
      setMsg(
        e.response && e.response.data.message
          ? e.response.data.message
          : e.message
      );
    }
    setUploading(false);
  };
  return (
    <FormWrapper>
      {loading ? (
        <Loader />
      ) : msg ? (
        <Message variant="warning">{msg}</Message>
      ) : (
        ''
      )}
      <>
        <h1 className="my-3">EDIT {name}</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type="text"
              placeholder="Brand"
              value={brand}
              onChange={e => setBrand(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="Category"
              value={category}
              onChange={e => setCategory(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Price"
              name="price"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="text"
              placeholder="Image"
              value={image}
              onChange={e => setImage(e.target.value)}
            />
            <Form.File
              name="image"
              custom
              label="Choose file"
              onChange={uploadImage}
            />
            {uploading && <Loader />}
          </Form.Group>
          <Form.Group>
            <Form.Label>CountInStock</Form.Label>
            <Form.Control
              type="number"
              placeholder="CountInStock"
              value={countInStock}
              onChange={e => setCountInStock(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="py-2 px-4 my-2">
            Update Product
          </Button>
        </Form>
      </>
    </FormWrapper>
  );
};

export default ProductEditScreen;
