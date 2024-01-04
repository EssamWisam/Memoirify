
import { PaperToggle } from "./PaperToggle"
import { WidthSlider } from "./WidthSlider"
import { MagicButton } from "./MagicButton"
import { DownloadButton } from "./DownloadButton"
import { Link } from 'react-router-dom';
import { MdHomeFilled } from "react-icons/md";

export const ExtraToolbar = ({markdown, setMarkdown, onSetMarkdown}) => {

    return (
      <div style={{position: 'sticky', top: 0, zIndex:99999, color: 'rgb(157, 161, 166)', backgroundColor: '#212425', display: 'flex', flexDirection: 'row', gap: '1.3rem', padding: '0.5rem' }}>
      <Link style={{ color: 'rgb(157, 161, 166)', textDecoration: 'none' }} to="/">
        <MdHomeFilled style={{ fontSize: '1.3rem', marginLeft: '0.5rem' }} />
      </Link>
      <PaperToggle />
      <WidthSlider />
      <MagicButton
        onSetMarkdown={onSetMarkdown}
        markdown={markdown}
        setMarkdown={setMarkdown}
      />
      <DownloadButton markdown={markdown} />
    </div>
    )
  
  }