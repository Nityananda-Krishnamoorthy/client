import React from 'react';

const SkeletonFeed = () => {
  return (
    <div className="feed skeleton">
      <div className="feed__header">
        <div className="skeleton-avatar"></div>
        <div className="skeleton-text">
          <div className="line"></div>
          <div className="line short"></div>
        </div>
      </div>
      <div className="feed__body">
        <div className="skeleton-image"></div>
        <div className="skeleton-text">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line half"></div>
        </div>
      </div>
      <div className="feed__footer">
        <div className="skeleton-actions">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-action"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonFeed;