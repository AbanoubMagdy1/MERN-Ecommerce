import React, { useState } from 'react';

const Stars = ({ rating, setRating }) => {
  const [temp, setTemp] = useState(rating);

  const opinions = ['Very bad', 'Bad', 'Moderate', 'Good', 'Excellent'];
  const colors = ['#ec4646', '#eb596e', '#f3722c', '#ffb703', '#ffe227'];
  function handleEnter({ target }) {
    setTemp(+target.getAttribute('value'));
  }

  function handleLeave() {
    setTemp(rating);
  }

  const stars = Array.from({ length: 5 }).map((star, i) => (
    <i
      className={`${i + 1 <= temp ? 'fas' : 'far'} fa-star`}
      key={i}
      value={i + 1}
      onClick={() => setRating(i + 1)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ fontSize: '40px', color: colors[temp - 1], cursor: 'pointer' }}
    ></i>
  ));

  return (
    <div className="text-center">
      {stars}
      <p className="my-3">{opinions[temp - 1]}</p>
    </div>
  );
};

export default Stars;
