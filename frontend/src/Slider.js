import React from 'react';
import './Slider.css';

const Slider = ({ value1, value2 }) => {
  let position1;
  let position2;

  if (value1 <= 25) {
    position1 = `${value1 * 1.25}%`;
    position2 = `${value2 * 1.25}%`;
  } else if (value1 <= 45) {
    position1 = `${value1 * 1.25}%`;
    position2 = `${value2 * 1.25}%`
  } else {
    position1 = `${value1 * 1.25}%`;
    position2 = `${value2 * 1.25}%`
  }

  return (
    <div className="slider-container">
      <div className="slider-track">
        <div className="slider-section slider-section-0-25" />
        <div className="slider-section slider-section-25-45" />
        <div className="slider-section slider-section-gt-45" />
          <div className="slider-thumb" style={{ left: position1 }} title={value1}>
              <span className="slider-tooltip">Yours: {value1}</span>
          </div>
           <div className="slider-thumb" style={{ left: position2 }} title={value2}>
               <span className='slider-tooltip'>Recommend: {value2}</span>
           </div>
      </div>
      <div className="slider-labels">
        <span>0 - 25</span>
        <span>25 - 50</span>
        <span>&gt; 50</span>
      </div>
    </div>
  );
};

export default Slider;
