import React, { useEffect, useState } from 'react'
import '@mdxeditor/editor/style.css'
import { MDXEditor } from '@mdxeditor/editor/MDXEditor'
import './editor.css'
import { FaMagic } from "react-icons/fa";
import { imageUploadHandler, processText } from './api';
import { getSelectedText, findAndTransform } from './logic';
import { $patchStyleText, $getSelectionStyleValueForProperty } from '@lexical/selection'

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
  corePluginHooks,
  GenericHTMLNode,
  $isGenericHTMLNode
} from '@mdxeditor/editor';
import { MdInvertColors } from "react-icons/md";
import { IconContext } from 'react-icons';
import { $getNearestNodeOfType } from '@lexical/utils'

const HighlightMode = () => {
  const [currentSelection, activeEditor] = corePluginHooks.useEmitterValues('currentSelection', 'activeEditor');
  const [highlightMode, setHighlightMode] = useState(false);

  const currentHTMLNodes = React.useMemo(() => {
    return (
      activeEditor?.getEditorState().read(() => {
        const selectedNodes = currentSelection?.getNodes() || []
        const nearestNodes = []
        for (const node of selectedNodes) {
          if (!$isGenericHTMLNode(node))
          nearestNodes.push($getNearestNodeOfType(node, GenericHTMLNode))
        }
        return nearestNodes;
      }) || null
    )
  }, [currentSelection, activeEditor])

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if Ctrl key is pressed and the '1' key is pressed
      if (event.ctrlKey && event.key === '1') {
        setHighlightMode((prev) => !prev);
        console.log("hey")
      }
    };

    // Add the event listener when the component mounts
    window.addEventListener('keydown', handleKeyDown);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (activeEditor !== null && currentSelection !== null && highlightMode) {
      activeEditor.update(() => {
        try {
          let current = $getSelectionStyleValueForProperty(currentSelection, 'color', -1);
          console.log(currentSelection);
          if (current !== '#3498db') {
            $patchStyleText(currentSelection, { 'color': '#3498db' });
          } else {
            //$patchStyleText(currentSelection, { 'background-color': undefined });
          }
        } catch (e) {
          console.log(e);
        }
      });
    }
  }, [currentSelection, highlightMode, activeEditor]);

  return (
    <>
      <IconContext.Provider value={{ size: '1.5em', style: { verticalAlign: 'middle' } }}>
        <MdInvertColors
          onClick={() => setHighlightMode((prev) => !prev)}
          style={{ cursor: 'pointer', color: highlightMode ? '#3498db' : 'inherit' }}
        />
      </IconContext.Provider>
      <button
        disabled={currentHTMLNodes.length === 0}
        onClick={() => {
          if (activeEditor !== null && currentSelection !== null) {
            activeEditor.update(() => {
              for (const currentHTMLNode of currentHTMLNodes) {
                let selection = currentHTMLNode?.select()
                currentHTMLNode?.remove()
                selection?.insertNodes(currentHTMLNode?.getChildren() || [])
              }
              
            })
          }
        }}
      >
        remove HTML nodes
      </button>
    </>
  );
};




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
          <HighlightMode/>
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
