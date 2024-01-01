import React from 'react'

import '@mdxeditor/editor/style.css'
import { MDXEditor } from '@mdxeditor/editor/MDXEditor'
import './editor.css'
import { FaMagic } from "react-icons/fa";
import {  processText } from './api';
import { getSelectedText, findAndTransform } from './logic';

import 'rc-slider/assets/index.css';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

import { Button } from '@mdxeditor/editor';
import { useSelector } from 'react-redux';
import { selectShowPage } from '../../slices/editorSlice';

import { allPlugins } from '../Tools/Toolbar';

export const MDEditor = ({ markdown }) => {

  const editorRef = React.createRef();
  const showPage = useSelector(selectShowPage);


  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>
       <SplitterLayout secondaryInitialSize={600} primaryInitialSize={800}>
    <div id="editableDiv" style={{ fontFamily: 'Avenir', flexBasis: '80%'}} >
      <MDXEditor
        markdown={markdown}
        onChange={(md) => { console.log(md) }}
        placeholder="Type some content here"
        autoFocus={true}
        className="dark-theme dark-editor"
        ref={editorRef}
        contentEditableClassName="prose max-w-full font-sans" plugins={allPlugins("# Initial Boom", editorRef)} />
    </div>
     {showPage && 
     <div style={{ minHeight: '100vh', flexBasis: '30%'}}> 
      <iframe title="abc" src="./pdfs/EMO.pdf"style={{width: '100%', minHeight: '100vh'}} />
     </div> 
      }
    </SplitterLayout>

    </div>
  )
}

export const MagicButton = ({ onSetMarkdown, onGetMarkdown }) => {
  const handleButtonClick = async () => {
    let selectedText = getSelectedText();
    let wholeText = onGetMarkdown();
    try {
      const result = await findAndTransform(wholeText, selectedText, processText, onSetMarkdown);
      onSetMarkdown(onGetMarkdown());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button onClick={handleButtonClick}>
      <FaMagic />
    </Button>
  );
};

