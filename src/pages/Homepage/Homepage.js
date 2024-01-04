import React, { useState, useEffect } from 'react';
import './Homepage.scss';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { SetIsNewFile } from '../../slices/editorSlice';
import { SetFileContent } from '../../slices/editorSlice';
import { DialogModal, useModal } from "react-dialog-confirm";
import { init, saveSet } from "../../utils";


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

    const openModal = useModal()?.openModal;
    const closeModal = useModal()?.closeModal;

    const [sawWarning, setSawWarning] = useState(init('sawWarning', false));

    const handleClick = () => {
      openModal(
      <DialogModal
      icon='warning'
      title='Are You Sure?'
      description={'If you proceed your current edit will be discarded. Make sure you download it via the download toolbar icon first to save the changes locally.'}
      onConfirm={() => {setIsNewFile(true); navigate('./edit'); saveSet(setSawWarning, 'sawWarning', true); closeModal()}}
      confirm="Yes & Don't Show Again."
      cancel="Go Back"
      titleStyle={{fontFamily:'Avenir'}}
      descriptionStyle={{fontFamily:'Avenir'}}
      hasCancel={true}
      />)
  }
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
          <label className="button">
            <input onChange={handleFileChange} type="file" style={{display:'none'}}/>
            Open Existing ⇧
            </label>
            <button onClick={
              (sawWarning || localStorage.getItem('currentMD')==="" || localStorage.getItem('currentMD')===null)
             ? (()=>{setIsNewFile(true); navigate('./edit');}) : handleClick} 
             className="button">
              New Edit ➜
            </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
