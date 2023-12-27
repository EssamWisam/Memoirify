import React, { useEffect } from 'react'
import '@mdxeditor/editor/style.css'
import { MDXEditor } from '@mdxeditor/editor/MDXEditor'
import './editor.css'
import { FaMagic } from "react-icons/fa";
import { imageUploadHandler, processText } from './api';
import { getSelectedText, findAndTransform } from './logic';

import {
  toolbarPlugin,
  listsPlugin,
  quotePlugin,
  headingsPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  thematicBreakPlugin,
  frontmatterPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  directivesPlugin,
  AdmonitionDirectiveDescriptor,
  diffSourcePlugin,
  markdownShortcutPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  DiffSourceToggleWrapper,
  Button,
} from '@mdxeditor/editor'



const MDEditor = ({markdown}) => {
   
    const editorRef = React.createRef();
  
    return (
      <div id="editableDiv" style={{fontFamily:'Avenir'}} >
        <MDXEditor
          markdown={markdown}
          onChange={(md) => {console.log(md)}}
          placeholder="Type some content here"
          autoFocus={true} 
          className="dark-theme dark-editor"
          ref={editorRef}
          contentEditableClassName="prose max-w-full font-sans" plugins={allPlugins("# Initial Boom", editorRef)} />
      </div>
    )
  }

const MagicButton = ({ onSetMarkdown, onGetMarkdown }) => {
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

const allPlugins = (diffMarkdown, editorRef) => [
    toolbarPlugin({
      toolbarContents: () => (<>
        <DiffSourceToggleWrapper>
          <UndoRedo />
          <BoldItalicUnderlineToggles />
          <CodeToggle />
          <CreateLink />
          <ListsToggle />
          <InsertCodeBlock />
          <InsertImage />
          <InsertTable />
          <InsertThematicBreak />
          <MagicButton onSetMarkdown={(newMarkdown) => { editorRef.current?.setMarkdown(newMarkdown.replace(/<!---->/g, '<br/>')); }} onGetMarkdown={() => editorRef.current?.getMarkdown()}/> 
        </DiffSourceToggleWrapper>
      </>)
    }),
    listsPlugin(),
    quotePlugin(),
    headingsPlugin(),
    linkPlugin(),
    linkDialogPlugin(),
    // eslint-disable-next-line @typescript-eslint/require-await
    imagePlugin({ imageUploadHandler }),
    tablePlugin(),
    thematicBreakPlugin(),
    frontmatterPlugin(),
    codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
    codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'text', tsx: 'TypeScript' } }),
    directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor] }),
    diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown }),
    markdownShortcutPlugin(),
  ]

  export default MDEditor;
