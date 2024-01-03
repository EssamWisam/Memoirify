import React, { useEffect } from 'react'
import { MDEditor } from '../../components/Editor/Editor';


function EditorPage({initMarkdown}) {
  return (
    <MDEditor initMarkdown={initMarkdown}/>
  )
}

export default EditorPage