import React from 'react'

import '@mdxeditor/editor/style.css'
import { MDXEditor } from '@mdxeditor/editor/MDXEditor'
import './editor.css'

import 'rc-slider/assets/index.css';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import { PaperViewer } from '../Tools/PaperViewer';
import { ExtraToolbar } from '../Tools/ExtraToolbar';
import { MagicButton } from '../Tools/MagicButton';

import { selectShowPage } from '../../slices/editorSlice';

import { allPlugins } from '../Tools/Toolbar';

import { init, saveSet } from '../../utils';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { selectFileContent, SetFileContent } from '../../slices/editorSlice';
import { selectIsNewFile, SetIsNewFile } from '../../slices/editorSlice';




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
  const [pdfUrl, setPdfUrl] = React.useState(init('pdfUrl', ''));

  React.useEffect(() => {
    if (fileContent != null) {
      saveSet(setMarkdown, 'currentMD', fileContent);
      setKey(key + 1);
      setFileContent(null);
    }

  }, [fileContent]);

  React.useEffect(() => {
    if (isNewFile) {
      saveSet(setMarkdown, 'currentMD', '');
      setKey(key + 1);
      setIsNewFile(false);
      saveSet(setPdfUrl, 'pdfUrl', ``);
    }
  }, [isNewFile]);



  // use effect trigger only upon load: check if route is edit/new and in this case setMarkdown('')
  return (
    <div key={key} style={{ display: 'flex', flexDirection: 'row' }}>
      <SplitterLayout secondaryInitialSize={600} primaryInitialSize={800}>
        <div id="editableDiv" style={{ fontFamily: 'Avenir', flexBasis: '80%' }} >
          <ExtraToolbar
          markdown={markdown} setMarkdown={setMarkdown}
          onSetMarkdown={(newMarkdown) => { editorRef.current?.setMarkdown(newMarkdown.replace(/<!---->/g, '<br/>').replace(/<span class="[^"]*" \/>/g, '')); }}
          />
          <MDXEditor
            markdown={markdown}
            onChange={(md) => { saveSet(setMarkdown, 'currentMD', md.replace(/<!---->/g, '<br/>').replace(/<span class="[^"]*" \/>/g, '')); }}
            placeholder="Type some content here"
            autoFocus={true}
            className="dark-theme dark-editor"
            ref={editorRef}
            contentEditableClassName="prose max-w-full font-sans"
            plugins={allPlugins(initMarkdown)} />
        </div>
        {showPage &&
          <PaperViewer pdfUrl={pdfUrl} setPdfUrl={setPdfUrl}/>
        }
      </SplitterLayout>
    </div>
  )
}
