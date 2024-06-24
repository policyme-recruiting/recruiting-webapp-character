import React, { useState } from 'react';
import { CLASS_LIST } from '../consts';

const ClassDisplay = ({ attributes, handleClassClick }) => {
  const [selectedClass, setSelectedClass] = useState(null);

  const classMeetsRequirements = (className) => {
    const classReqs = CLASS_LIST[className];
    return Object.entries(classReqs).every(
      ([attr, value]) => attributes[attr] >= value
    );
  };

  const handleClassSelection = (className) => {
    setSelectedClass(CLASS_LIST[className]);
    handleClassClick(className);
  };

  return (
    <div className="class-display">
      <h3>Classes</h3>
      {Object.keys(CLASS_LIST).map(className => (
        <div
          key={className}
          className={`class-item ${classMeetsRequirements(className) ? 'highlight' : ''}`}
          onClick={() => handleClassSelection(className)}
        >
          {className}
        </div>
      ))}
      {selectedClass && (
        <div className="class-requirements">
          <h4>{Object.keys(CLASS_LIST).find(key => CLASS_LIST[key] === selectedClass)} Minimum Requirements</h4>
          {Object.entries(selectedClass).map(([key, value]) => (
            <div key={key}>{`${key}: ${value}`}</div>
          ))}
          <button onClick={() => setSelectedClass(null)}>Close Requirement View</button>
        </div>
      )}
    </div>
  );
};

export default ClassDisplay;
