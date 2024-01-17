import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableInputField from './DraggableInputField';

const PageBuilder = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ width: '100%', height: '500px', border: '1px solid #ccc' }}>
        <h2>Page Builder</h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <DraggableInputField width={200} height={40} text="Draggable Input Field" fontSize={16} fontWeight="normal" />
        </div>
      </div>
    </DndProvider>
  );
};

export default PageBuilder;
