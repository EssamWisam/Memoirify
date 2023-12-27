import React, { useEffect } from 'react'
import '@mdxeditor/editor/style.css'
import { MDXEditor } from '@mdxeditor/editor/MDXEditor'
import './index.css'
import { FaMagic } from "react-icons/fa";

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


async function imageUploadHandler(image) {
  // Will work when there is a backend of sorts...
  const formData = new FormData()
  formData.append('image', image)
  // send the file to your server and return 
  // the URL of the uploaded image in the response
  const response = await fetch('./uploads', {
    method: 'POST',
    body: formData
  })

  const json = (await response.json())
  alert(json)
  return json.url
}


async function processTextWithFlask(inputText) {
  try {
    const response = await fetch(
      'http://127.0.0.1:5001/process_text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify({
        text: inputText,
      }),
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    const processedText = data.processed_text;

    return processedText;
  } catch (error) {
    console.error('Error:', error);
    throw error; // Re-throw the error to be caught by the caller if needed
  }
}



async function processText(text) {
  try {
    var processedText = await processTextWithFlask(text);
    return processedText;
  } catch (error) {
    console.error('Error:', error);
  }
}



function getSelectedText() {
  var selectedText = "";
  var selection = window.getSelection();

  if (selection.rangeCount > 0) {
    var range = selection.getRangeAt(0);

    // Create a div element to contain the selected content
    var container = document.createElement("div");
    container.appendChild(range.cloneContents());

    // Traverse the container and collect text content with new lines
    selectedText = traverseNodes(container);
  }

  return selectedText;
}

function traverseNodes(node) {
  var text = "";

  // If it's a text node, append its content to the result
  if (node.nodeType === Node.TEXT_NODE) {
    text += node.nodeValue;
  } else {
    // If it's an element node, traverse its child nodes
    for (var i = 0; i < node.childNodes.length; i++) {
      text += traverseNodes(node.childNodes[i]);
    }

    // If it's a block-level element, add a new line
    if (isBlockElement(node)) {
      text += '\n\n';
    }
  }

  return text;
}

function isBlockElement(element) {
  var blockElements = ['P', 'DIV', 'BR', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'HR', 'ADDRESS', 'BLOCKQUOTE', 'PRE', 'DL', 'DT', 'DD', 'TABLE', 'CAPTION', 'THEAD', 'TFOOT', 'TBODY', 'COLGROUP', 'COL', 'TR', 'TH', 'TD', 'FIELDSET', 'LEGEND', 'SECTION', 'article', 'aside', 'details', 'figcaption', 'figure', 'footer', 'header', 'hgroup', 'menu', 'nav', 'article', 'section'];
  return blockElements.includes(element.nodeName);
}

async function findAndTransform(largeString, smallString, transformFunction, callback = (res) => {}) {
  const trimmedSmallString = smallString.trim();

  // Escape special characters in the trimmedSmallString
  const escapedSmallString = trimmedSmallString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Use match with a regular expression to find all occurrences
  const matches = largeString.match(new RegExp(escapedSmallString, 'g')) || [];

  if (matches.length === 0) {
    console.log("No matches found");
    return largeString;
  }

  if (matches.length > 1) {
    console.warn("Multiple matches found. Operating on the first match.");
  }

  const lastMatch = matches[0];
  const transformedValue = await transformFunction(lastMatch);

  const result = largeString.replace(lastMatch, transformedValue);

  callback(result);
  return result;
}

function App() {

  const markdown = `
  The dominant paradigm of natural language generation systems hinges on probabilistic neural lan-
  guage models (Radford et al., 2019; Zhang et al., 2022), which permit evaluating the probability
  of any given text sequence as well as generating novel ones using various decoding strategies upon
  learned distributions (Holtzman et al., 2019; Meister et al., 2023b). Language modeling, the process
  of aligning model distribution with that of human language, is usually formulated as a sequence
  prediction task in which maximum likelihood estimation (MLE) is typically adopted as the training
  objective owing to its simplicity and intuitiveness.
  `

const MagicButton = ({ onSetMarkdown, onGetMarkdown }) => {
  const handleButtonClick = async () => {
    let selectedText = getSelectedText();
    console.log("A: " + selectedText)
    let wholeText = onGetMarkdown();
    console.log("B: " + wholeText)
    try {
      const result = await findAndTransform(wholeText, selectedText, processText, onSetMarkdown);
      onSetMarkdown(onGetMarkdown());
      console.log("C: " + onGetMarkdown());
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
 



  const editorRef = React.createRef();


  const allPlugins = (diffMarkdown, editorRef, markdowno, setMarkdowno) => [
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
          <MagicButton onSetMarkdown={(newMarkdown) => { editorRef.current?.setMarkdown(newMarkdown); }} onGetMarkdown={() => editorRef.current?.getMarkdown()}/> 
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

export default App