import { handleFileUpload } from './api';


export const PaperViewer = ({pdfUrl, setPdfUrl}) => {

    return (
      <div style={{ minHeight: '100vh', flexBasis: '30%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column' }}>
      {pdfUrl && <iframe src={pdfUrl} title="Uploaded PDF" style={{ width: '100%', minHeight: '100vh' }}></iframe>}
        <label for="file-upload" style={{color:'white', backgroundColor:'#00b0b0', cursor:'pointer', padding:'0.5rem', display:'block',
         margin:'0.7rem', borderRadius:'20px', minWidth:'10rem', textAlign:'center'}}>
           {(pdfUrl !== '') ? 'Change PDF' : 'Upload PDF'}
        </label>
        <input onChange={(e) => handleFileUpload(e, setPdfUrl)} id="file-upload" type="file" style={{display:'none'}}/>
      </div>
    )
  
  }
  