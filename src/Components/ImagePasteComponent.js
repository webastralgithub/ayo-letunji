import React, { useRef } from 'react';

const ImagePasteComponent = ({updateImage}) => {
  const pasteContainerRef = useRef(null);

  const handlePasteButtonClick = async () => {
    const pasteContainer = pasteContainerRef.current;

    if (pasteContainer) {
      // Clear paste article
      pasteContainer.textContent = '';

      try {
        // Read clipboard data
        const data = await navigator.clipboard.read();

        // Check if it's an image
        const clipboardContent = data[0];

        console.log(clipboardContent);

        // Get blob representing the image
        const blob = await clipboardContent.getType('image/png');

        // Create blob URL
        const blobUri = window.URL.createObjectURL(blob);
        updateImage(blobUri)
       
      } catch (err) {
        console.log(err);

        // If there is an error, assume it's not an image
        const text = await navigator.clipboard.readText();
        pasteContainer.textContent = text;
      }
    }
  };

  return (
    <div>
      <button onClick={handlePasteButtonClick}>Paste Image</button>
    
      <div
        ref={pasteContainerRef}
        style={{ border: '1px solid black', margin: '10px', padding: '10px' }}
      ></div>
    </div>
  );
};

export default ImagePasteComponent;
