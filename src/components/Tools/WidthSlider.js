import React, { useEffect, useState } from 'react'

import Slider from 'rc-slider';
import {saveSet, init} from '../../utils';


  export const WidthSlider = () => {
    const [maxWidth, setMaxWidth] = useState(init('maxWidth', 1000));
  
    useEffect(() => {
      // Find the element with the specified class
      const element = document.querySelector('._rootContentEditableWrapper_utjas_1006');
  
      // Update the max-width style
      if (element) {
        element.style.maxWidth = `${maxWidth}px`;
      }
    }, [maxWidth]);
  
    return (
      <div style={{ marginLeft: '1rem', width: '50px' }}>
        <Slider min={400} max={1600} value={maxWidth} defaultValue={maxWidth} onChange={(value) => saveSet(setMaxWidth, 'maxWidth', value)} />
      </div>
    );
  };
  