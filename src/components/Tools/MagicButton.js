
import { getSelectedText } from "./logic";
import { processText } from "./api";
import { findAndTransform } from "./logic";
import { RiMagicLine } from "react-icons/ri";

export const MagicButton = ({ onSetMarkdown, markdown, setMarkdown }) => {
    const handleButtonClick = async () => {
      let selectedText = getSelectedText();
      let wholeText = markdown;
      try {
        const result = await findAndTransform(wholeText, selectedText, processText, onSetMarkdown);
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <button style={{ backgroundColor: 'transparent', outline: 'none', color: 'inherit', border: 'none', padding: '0', margin: '0' }} onClick={handleButtonClick}>
        <RiMagicLine style={{ fontSize: '1.3rem', cursor: 'pointer' }} />
        </button>
    );
  };
  
  