import React from 'react';
import { useParams } from 'react-router-dom';

const ProductScreen = () => {
  const params = useParams();
  console.log(params);
  return <div>Product</div>;
};

export default ProductScreen;
