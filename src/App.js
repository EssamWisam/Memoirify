import React, { useEffect } from 'react';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EditorPage from './pages/EditorPage/EditorPage';
import HomePage from './pages/Homepage/Homepage';
import {DialogProvider} from 'react-dialog-confirm';

function App() {
  const initMarkdown = ``
  return (
    <DialogProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/edit" element={<EditorPage initMarkdown={initMarkdown} />} />
      </Routes>
    </BrowserRouter>
    </DialogProvider>
  );
}

export default App;
