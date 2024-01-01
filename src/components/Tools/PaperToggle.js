import React from 'react'
import { RiFilePaper2Line } from "react-icons/ri";
import { RiFilePaper2Fill } from "react-icons/ri";
import { IconContext } from 'react-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectShowPage, setShowPage } from '../../slices/editorSlice';

  export const PaperToggle = () => {
  
    const dispatch = useDispatch();
  
    const [showPage, SetShowPage] = [useSelector(selectShowPage), (s) => dispatch(setShowPage(s))];
  
    return (
      <>
          <IconContext.Provider value={{ size: '1.5em', style: { verticalAlign: 'middle' } }}>
          {!showPage && <RiFilePaper2Line
            onClick={() => {SetShowPage(true); console.log(showPage)}}
            style={{ cursor: 'pointer', color:  'inherit' }}
          />}
           {showPage && <RiFilePaper2Fill
            onClick={() => SetShowPage(false)}
            style={{ cursor: 'pointer', color: 'inherit' }}
          />}
        </IconContext.Provider>
      </>
    );
  };
  
  
  