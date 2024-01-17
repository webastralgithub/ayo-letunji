import React, { useState } from 'react';

const ToggleButton = ({ isActive,id, onToggleChange }) => {
  const [active, setActive] = useState(isActive);

  const handleChange = () => {
    setActive(!active);
    onToggleChange(!active,id); 
  };

  return (
    <label className="toggleSwitch">
      <input
        type="checkbox"
        checked={active}
        onChange={handleChange}
        className="toggleSwitch-checkbox"
      />
      <span className="toggleSwitch-slider"></span>
    </label>
  );
};

export default ToggleButton;
