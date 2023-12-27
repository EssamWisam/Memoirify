import React, { useEffect } from 'react'
import './index.css'
import EditorPage from './pages/EditorPage/EditorPage'


function App() {

  const markdown = `
  An ‘event’ can describe any state with a timestamp. Some events are directly observable (death,
    crime reports, flooding) while others represent latent changes in an underlying process (flares in
    disease, social unrest, a cyber-attack). Predicting events—when, whether and where they occur—is
    an increasingly important task in science, industry and public policy.
    This project focusses on the interconnected problems of measuring and predicting health and
    well-being. Health and well-being exist at two levels: within the individual, where we may observe or
    measure a patient’s genetics, medical history and life course; and at the societal level, where the effect
    of the physical and socio-political environment might be apparent. Many public health epidemiologists
    hold that societal welfare and individual well-being are intrinsically linked. It may follow, therefore,
    that learning the dynamics of socio-political events can aid understanding of individual well-being,
    and vice versa.
    We consider the world of events from two perspectives. ‘Events as output’ encompasses time-to-
    event analysis, where the task is to estimate the risk of an (adverse) event or the time until it occurs.
    ‘Events as input’ encompasses intensive longitudinal data analysis or the analysis of irregularly-
    spaced time series. In both areas, a key challenge is extracting useful features from high-dimensional,
    complex or dependent data structures to predict an outcome, be it dynamic or static. Existing
    machine learning tools and methods may need to be extended and adapted to handle such tasks.
    The project explores methods of selecting and extracting features from whole genome data for
    survival problems (individual health), the effect of different levels of data aggregation on spatio-
    temporal models (societal health) and the challenges behind building a transparent, explainable and
    useful data science pipeline for such complex temporal data. A particular focus is paid to automation
    of the data cleaning process, as well as to effective combination of scientific and machine learning
    knowledge on problems where data are messy, sparse or only available in aggregate form.
    Utility of the developed models and pipelines will be demonstrated through the collation of ap-
    propriate benchmarks and open data sets and application to several real-world problems, ultimately
    culminating in implementation as tools designed for the use of stakeholders and policymakers.    
  `

  return (
    <EditorPage markdown={markdown}/>
  )
}

export default App