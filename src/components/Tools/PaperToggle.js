import React from 'react'
import { RiFilePaper2Line } from "react-icons/ri";
import { RiFilePaper2Fill } from "react-icons/ri";
import { IconContext } from 'react-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectShowPage, SetShowPage } from '../../slices/editorSlice';
import { BsBook } from "react-icons/bs";
import { BsFillBookFill } from "react-icons/bs";

  export const PaperToggle = () => {
  
    const dispatch = useDispatch();
  
    const [showPage, setShowPage] = [useSelector(selectShowPage), (s) => dispatch(SetShowPage(s))];
    
    return (
      <div>
          <IconContext.Provider value={{ size: '1.2em', style: { verticalAlign: 'middle' } }}>
          {!showPage && <BsBook
            onClick={() => {setShowPage(true); console.log(showPage)}}
            style={{ cursor: 'pointer', color:  'inherit' }}
          />}
           {showPage && <BsFillBookFill
            onClick={() => setShowPage(false)}
            style={{ cursor: 'pointer', color: 'inherit' }}
          />}
        </IconContext.Provider>
      </div>
    );
  };
  
  
  