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

const HighlightMode = ({refresh}) => {
  const [currentSelection, activeEditor] = corePluginHooks.useEmitterValues('currentSelection', 'activeEditor');
  const [highlightMode, setHighlightMode] = useState(false);

  const currentHTMLNodes = React.useMemo(() => {
    return (
      activeEditor?.getEditorState().read(() => {
        const selectedNodes = currentSelection?.getNodes() || []
        const nearestNodes = []
        //console.log(selectedNodes[0].getTextContent())
        for (const node of selectedNodes) {
          if (!$isGenericHTMLNode(node))
          {
            //nearestNodes.push($getNearestNodeOfType(node, GenericHTMLNode))
            nearestNodes.push(node)

            //console.log("text content", selectedNodes[0].getTextContent())
          }
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
        //console.log("hey")
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
          //console.log(currentSelection);
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
        onClick={async () => {
          //setTimeout(() => {
          //  refresh();
          //   }, 100);
          if (activeEditor !== null && currentSelection !== null) {
            activeEditor.update(async () => {
              for (const currentHTMLNode of currentHTMLNodes) {
                if(currentHTMLNode.__type === 'text'){
                  console.log(currentHTMLNode.getTextContent())
                  let text = await processText(currentHTMLNode.getTextContent())
                  currentHTMLNode.setTextContent(text)

                    //`
// - one <span class="color-2"> red </span> well met <span class="color-2"> men </span>
// - two
// - three
//                   `)
                }
                //currentHTMLNode.setTextContent(currentHTMLNode.getTextContent().toUpperCase())
                //let selection = currentHTMLNode?.select()
                //console.log(currentHTMLNode?.getChildren())
                //currentHTMLNode?.remove()
                //selection?.insertNodes(currentHTMLNode?.getChildren() || [])
              }
            })
          }
          refresh()
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
        <button onClick={()=>{editorRef.current?.setMarkdown(editorRef.current?.getMarkdown().replace(/\\/g, ''))}}>Compile</button>
        <MDXEditor
          markdown={markdown}
          onChange={(md) => {}}
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

const allPlugins = (diffMarkdown, editorRef, ) => [
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
          <HighlightMode refresh={()=>editorRef.current?.setMarkdown(editorRef.current?.getMarkdown().replace(/\\/g, ''))} />
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
