import React from 'react';
import propTypes from 'prop-types';

const Rating = ({ rating, reviews, color }) => {
  const stars = Array.from({ length: 5 }).map((s, i) => {
    let c =
      i + 1 <= rating + 0.25
        ? 'fas fa-star'
        : i + 1 <= rating + 0.75
        ? 'fas fa-star-half-alt'
        : 'far fa-star';
    return (
      <span key={i}>
        <i className={c} style={{ color }}></i>
      </span>
    );
  });

  return (
    <div className="my-2" style={{ display: 'inline-block' }}>
      {stars} ({reviews})
    </div>
  );
};

Rating.defaultProps = {
  color: '#f8b620',
};

Rating.propTypes = {
  rating: propTypes.number.isRequired,
  reviews: propTypes.number.isRequired,
  color: propTypes.string.isRequired,
};

export default Rating;
// half<i class="fas fa-star-half-alt"></i>
//full <i class="fas fa-star"></i>
// empty <i class="far fa-star"></i>
