import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableFormInput = ({ type, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'formInput',
    item: { type, label },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        border: '1px dashed #000',
        padding: '5px',
        marginBottom: '5px',
      }}
    >
      {label}
    </div>
  );
};

export default DraggableFormInput;
