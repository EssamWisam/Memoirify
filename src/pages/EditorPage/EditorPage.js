import React, { useEffect } from 'react'
import { MDEditor } from '../../components/Editor/Editor';


function EditorPage({markdown}) {
  return (
    <MDEditor markdown={markdown}/>
  )
}

export default EditorPage