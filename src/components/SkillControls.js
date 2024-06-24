import React from 'react';
import { SKILL_LIST } from '../consts';

const SkillControls = ({ attributes, skills, handleSkillChange }) => {
  const getModifier = (value) => Math.floor((value - 10) / 2);
  const totalSkillPoints = 10 + (getModifier(attributes.Intelligence) * 4);
  const spentPoints = skills.reduce((total, skill) => total + skill.points, 0);
  const remainingPoints = totalSkillPoints - spentPoints;

  return (
    <div className="skill-controls">
      <h3>Skills (Total skill points available: {remainingPoints})</h3>
      {skills.map(skill => {
        const attributeModifier = SKILL_LIST.find(s => s.name === skill.name).attributeModifier;
        const modifierValue = getModifier(attributes[attributeModifier]);
        const totalValue = skill.points + modifierValue;
        return (
          <div className="skill-item" key={skill.name}>
            <span>{`${skill.name}: ${skill.points} (Modifier: ${attributeModifier}): ${modifierValue} Total: ${totalValue}`}</span>
            <div>
              <button onClick={() => handleSkillChange(skill.name, skill.points - 1)} disabled={skill.points <= 0}>-</button>
              <button onClick={() => handleSkillChange(skill.name, skill.points + 1)} disabled={remainingPoints <= 0}>+</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SkillControls;
