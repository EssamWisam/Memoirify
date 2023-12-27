import React, { useEffect } from 'react'
import './index.css'
import EditorPage from './pages/EditorPage/EditorPage'


function App() {

  const markdown = `
  Neural language models are probabilistic models of human text. They are predom-
  inantly trained using maximum likelihood estimation (MLE), which is equivalent
  to minimizing the forward cross-entropy between the empirical data distribution
  and the model distribution. However, various degeneration phenomena are still
  widely observed when decoding from the distributions learned by such models.
  We establish that the forward cross-entropy is suboptimal as a distance metric for
  aligning human and model distribution due to its (1) recall-prioritization (2) neg-
  ative diversity ignorance and (3) train-test mismatch. In this paper, we propose
  Earth Mover Distance Optimization (EMO) for auto-regressive language model-
  ing. EMO capitalizes on the inherent properties of earth mover distance to address
  the aforementioned challenges. Due to the high complexity of direct computation,
  we further introduce a feasible upper bound for EMO to ease end-to-end training.
  Upon extensive evaluation of language models trained using EMO and MLE. We
  find that EMO demonstrates a consistently better language modeling performance
  than MLE across domains. Moreover, EMO demonstrates noteworthy enhance-
  ments in downstream performance with minimal fine-tuning on merely 25,000
  sentences. This highlights the tremendous potential of EMO as a lightweight cal-
  ibration method for enhancing large-scale pre-trained language models. Our code
  and data are available at ab. 
  `

  return (
    <EditorPage markdown={markdown}/>
  )
}

export default App