import React, { useEffect, useState } from 'react';
import Slider from 'rc-slider';
import { saveSet, init } from '../../utils';
import { TbArrowAutofitWidth } from 'react-icons/tb';
import { RxCross1 } from 'react-icons/rx';

export const WidthSlider = () => {
  const [maxWidth, setMaxWidth] = useState(init('maxWidth', 1000));
  const [showSlider, setShowSlider] = useState(false);

  useEffect(() => {
    const element = document.querySelector('._rootContentEditableWrapper_utjas_1006');

    if (element) {
      element.style.maxWidth = `${maxWidth}px`;
    }
  }, [maxWidth]);

  return (
    <div >
        <div style={{flexDirection:'row', gap:'0.6rem', display: (showSlider)? 'flex':'none'}}>
        <RxCross1
            style={{ cursor: 'pointer', paddingTop:'0.26rem' }}
            onClick={() => setShowSlider(false)}
          />
        <div style={{ position: 'relative', width: '50px' }}>
          <Slider min={400} max={1600} value={maxWidth} defaultValue={maxWidth} onChange={(value) => saveSet(setMaxWidth, 'maxWidth', value)} />
          </div>
        </div>
        <TbArrowAutofitWidth
          style={{ cursor: 'pointer', fontSize:'1.3rem', paddingTop:'0.1rem', display: (showSlider)? 'none':'flex'}}
          onClick={() => setShowSlider(true)}
        />
    </div>
  );
};
