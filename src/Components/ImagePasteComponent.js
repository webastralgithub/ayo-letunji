import React, { useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import InputField from './InputField';
const ImagePasteComponent = ({updateImage}) => {
  const inputRef = useRef(null);

  const handlePaste = (event) => {
    event.preventDefault();

    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    const imageItem = Array.from(items).find((item) => item.type.indexOf('image') !== -1);

    if (imageItem) {
      const blob = imageItem.getAsFile();
      const imageUrl = URL.createObjectURL(blob);
        updateImage(imageUrl);
      let file = new File([blob], "file name", { type: blob.type, lastModified: new Date().getTime() });
      let container = new DataTransfer();
      container.items.add(file);

      const fileInput = inputRef.current;
      if (fileInput) {
        fileInput.files = container.files;
      }
      console.log(file);
    }
    
  };

  return (
    <div>
      <input ref={inputRef} type="file" style={{ display: 'none' }} />
      <p>Paste an image here:</p>
      <div
        onPaste={(event) => {
          handlePaste(event);
        }}
        contentEditable
        style={{ width: '100%', height: '500px', border: '1px solid black' }}
      ></div>
  
    </div>
  );
};

export default ImagePasteComponent;
