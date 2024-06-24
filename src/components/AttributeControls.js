import React from 'react';
import { ATTRIBUTE_LIST } from '../consts';

const AttributeControls = ({ attributes, handleAttributeChange }) => {
  const getModifier = (value) => Math.floor((value - 10) / 2);

  return (
    <div className="attribute-controls">
      <h3>Attributes</h3>
      {ATTRIBUTE_LIST.map(attr => (
        <div className="attribute-item" key={attr}>
          <span>{`${attr}: ${attributes[attr]} (Modifier: ${getModifier(attributes[attr])})`}</span>
          <div>
            <button onClick={() => handleAttributeChange(attr, attributes[attr] - 1)} disabled={attributes[attr] <= 0}>-</button>
            <button onClick={() => handleAttributeChange(attr, attributes[attr] + 1)}>+</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttributeControls;
