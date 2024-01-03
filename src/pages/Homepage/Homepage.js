import React, { useState, useEffect } from 'react';
import './Homepage.scss';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { SetIsNewFile } from '../../slices/editorSlice';
import { SetFileContent } from '../../slices/editorSlice';

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const  setFileContent = (s) => dispatch(SetFileContent(s))
  const setIsNewFile = (s) => dispatch(SetIsNewFile(s))

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      setFileContent(event.target.result);
      navigate("./edit")
    };

    reader.readAsText(file);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <div className="gradient">
        <h1 className="text">Memoirify</h1>
        <p style={{ color: 'white', fontFamily: 'Avenir', textAlign: 'center', fontSize: '1.1rem' }}>
          Let's Elevate Your Note Taking Skills to the Next Level
        </p>
        <div>
          <Link to="./edit">
            <button className="button" style={{ padding: '0.9rem' }}>
              Continue Working <span style={{ fontSize: '1.25rem' }}>↻</span>
            </button>
          </Link>
          <label class="button">
            <input onChange={handleFileChange} type="file" style={{display:'none'}}/>
            Open Existing ⇧
            </label>
          <Link to="./edit">
            <button onClick={()=>setIsNewFile(true)} className="button">
              New Edit ➜
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
