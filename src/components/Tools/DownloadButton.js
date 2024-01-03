import React from 'react';
import { MdOutlineDownloading } from "react-icons/md";
import { IconContext } from 'react-icons';
import { FaCloudDownloadAlt } from "react-icons/fa";

export const DownloadButton = ({ markdown }) => {
  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'markdown.md';
    link.click();
  };

  return (
    <div>
      <IconContext.Provider value={{ size: '1.3em', style: { verticalAlign: 'middle' } }}>
        <FaCloudDownloadAlt
          onClick={handleDownload}
          style={{ cursor: 'pointer', color: 'inherit' }}
        />
      </IconContext.Provider>
    </div>
  );
};