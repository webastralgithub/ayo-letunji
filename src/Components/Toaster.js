import React, { useState, useEffect } from 'react';

const Toaster = ({ message }) => {
  
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message !== '') {
      setVisible(true);
      const timeout = setTimeout(() => {
        setVisible(false);
      }, 3000); // Hide the toaster after 3 seconds
      return () => clearTimeout(timeout);
    }
  }, [message]);

  return (
    <div className={`toaster ${visible ? 'show' : ''}`}>
      {message}
    </div>
  );
};

export default Toaster;
