import React from 'react';

import 'src/brag/brag.css';

const BragBox: React.FC = () => {
  return (
    <div className="brag-modal">
      <p className="brag-text">
        <b>AT Map</b>
      </p>
      <p className="brag-text">by Hayden Woodhead</p>
      <p className="brag-text">
        <a href="https://github.com/haydenwoodhead/at-map" target="_blank" rel="noreferrer">
          Github
        </a>
      </p>
    </div>
  );
};

export default BragBox;
