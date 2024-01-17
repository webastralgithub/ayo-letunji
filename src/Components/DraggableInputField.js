import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableInputField = ({ width, height, text, fontSize, fontWeight }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'inputField',
    item: { id: 'inputField', type: 'input', width, height, text, fontSize, fontWeight },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const inputStyle = {
    width: `${width}px`,
    height: `${height}px`,
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    border: '1px dashed #000',
    padding: '5px',
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
  };

  return (
    <div ref={drag} style={inputStyle}>
      <input type="text" placeholder={text} style={{ width: '100%', height: '100%', border: 'none' }} />
    </div>
  );
};

export default DraggableInputField;
