import React from 'react'
import { Link } from 'react-router-dom';

import '@mdxeditor/editor/style.css'
import { MDXEditor } from '@mdxeditor/editor/MDXEditor'
import './editor.css'
import { RiMagicLine } from "react-icons/ri";
import { MdHomeFilled } from "react-icons/md";

import { processText } from './api';
import { getSelectedText, findAndTransform } from './logic';

import 'rc-slider/assets/index.css';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

import { Button } from '@mdxeditor/editor';
import { selectShowPage } from '../../slices/editorSlice';

import { allPlugins } from '../Tools/Toolbar';

import { init, saveSet } from '../../utils';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { selectFileContent, SetFileContent } from '../../slices/editorSlice';
import { selectIsNewFile, SetIsNewFile } from '../../slices/editorSlice';

import { DownloadButton }
  from '../Tools/DownloadButton';
import { PaperToggle } from '../Tools/PaperToggle';
import { WidthSlider } from '../Tools/WidthSlider'

export const MDEditor = ({ initMarkdown }) => {
  const dispatch = useDispatch();

  const editorRef = React.createRef();
  const showPage = useSelector(selectShowPage);

  const [markdown, setMarkdown] = React.useState(init('currentMD', initMarkdown));
  const fileContent = useSelector(selectFileContent);
  const isNewFile = useSelector(selectIsNewFile);
  const setIsNewFile = (s) => dispatch(SetIsNewFile(s))
  const setFileContent = (s) => dispatch(SetFileContent(s))

  const [key, setKey] = React.useState(0);

  React.useEffect(() => {
    if (fileContent != null) {
      saveSet(setMarkdown, 'currentMD', fileContent);
      setKey(key + 1);
      setFileContent(null);
    }

  }, [fileContent]);

  React.useEffect(() => {
    if (isNewFile) {
      saveSet(setMarkdown, 'currentMD', ' ');
      setKey(key + 1);
      setIsNewFile(false);
    }
  }, [isNewFile]);


  // use effect trigger only upon load: check if route is edit/new and in this case setMarkdown('')
  return (
    <div key={key} style={{ display: 'flex', flexDirection: 'row' }}>
      <SplitterLayout secondaryInitialSize={600} primaryInitialSize={800}>
        <div id="editableDiv" style={{ fontFamily: 'Avenir', flexBasis: '80%' }} >
          <div style={{position: 'sticky', top: 0, zIndex:99999, color: 'rgb(157, 161, 166)', backgroundColor: '#212425', display: 'flex', flexDirection: 'row', gap: '1.3rem', padding: '0.5rem' }}>
            <Link style={{ color: 'rgb(157, 161, 166)', textDecoration: 'none' }} to="/">
              <MdHomeFilled style={{ fontSize: '1.3rem', marginLeft: '0.5rem' }} />
            </Link>
            <PaperToggle />
            <WidthSlider />
            <MagicButton
              onSetMarkdown={(newMarkdown) => { editorRef.current?.setMarkdown(newMarkdown.replace(/<!---->/g, '<br/>')); }}
              markdown={markdown}
              setMarkdown={setMarkdown}
            />
            <DownloadButton markdown={markdown} />
          </div>
          <MDXEditor
            markdown={markdown}
            onChange={(md) => { saveSet(setMarkdown, 'currentMD', md); console.log(editorRef.current?.getMarkdown()) }}
            placeholder="Type some content here"
            autoFocus={true}
            className="dark-theme dark-editor"
            ref={editorRef}
            contentEditableClassName="prose max-w-full font-sans"
            plugins={allPlugins(initMarkdown, editorRef, markdown, (md) => { saveSet(setMarkdown, 'currentMD', md.replace(/<!---->/g, '<br/>')) }, key, setKey)} />
        </div>
        {showPage &&
          <div style={{ minHeight: '100vh', flexBasis: '30%' }}>
            <iframe title="abc" src="./pdfs/EMO.pdf" style={{ width: '100%', minHeight: '100vh' }} />
          </div>
        }
      </SplitterLayout>
    </div>
  )
}

export const MagicButton = ({ onSetMarkdown, markdown, setMarkdown }) => {
  const handleButtonClick = async () => {
    let selectedText = getSelectedText();
    let wholeText = markdown;
    try {
      const result = await findAndTransform(wholeText, selectedText, processText, onSetMarkdown);
      //onSetMarkdown(onGetMarkdown());
      //if(result) {
      //setKey(key + 1);
      //}
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button style={{ backgroundColor: 'transparent', outline: 'none', color: 'inherit', border: 'none', padding: '0', margin: '0' }} onClick={handleButtonClick}><RiMagicLine style={{ fontSize: '1.3rem', cursor: 'pointer' }} /></button>
  );
};

