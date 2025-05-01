import React from 'react';

const MovableSection = ({ children, onMoveUp, onMoveDown }) => {
  return (
    <div className="section">
      <div className="section-controls">
        <button onClick={onMoveUp} disabled={onMoveUp === null}>Move Up</button>
        <button onClick={onMoveDown} disabled={onMoveDown === null}>Move Down</button>
      </div>
      {children}
    </div>
  );
};

export default MovableSection;
