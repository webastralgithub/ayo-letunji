// SidebarFolder.js
import React, { useState } from 'react';
import "./SidebarFolder.css"
import { Link } from 'react-router-dom';
const SidebarFolder = ({ folder }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="nav-inner-nav-screen-sht">
     
      <div className="folder-header" onClick={handleToggle}>
      {folder.views && <span className={isOpen ? 'arow-rotate' : ''} >{isOpen ? '>' : '>'}</span>}
        <span>{folder.name}</span>
        
      </div>
      {isOpen && folder.views && (
        <div className="folder-children">
          {folder.views.map(child => (
            <SidebarFolder key={child.id} folder={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarFolder;
