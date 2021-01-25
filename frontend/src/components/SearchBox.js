import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const SearchBox = () => {
  const history = useHistory();
  const [keyword, setKeyword] = useState('');

  const submitHandler = e => {
    e.preventDefault();
    if (keyword) {
      history.push(`/search/${keyword}`);
    } else {
      history.push('/');
    }
  };

  return (
    <Form inline onSubmit={submitHandler}>
      <Form.Control
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        placeholder="Search Products..."
        className="mr-lg-4 mr-sm-2"
      />
      <Button type="submit" variant="outline-success">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
