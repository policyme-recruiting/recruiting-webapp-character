import React, { useState } from 'react';
import { SKILL_LIST } from '../consts';

const SkillCheck = ({ handleSkillCheck }) => {
  const [selectedSkill, setSelectedSkill] = useState(SKILL_LIST[0].name);
  const [dc, setDc] = useState(0);

  const handleRoll = () => {
    handleSkillCheck(selectedSkill, dc);
  };

  return (
    <div className="skill-check">
      <h3>Skill Check</h3>
      <label>
        Skill:
        <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)}>
          {SKILL_LIST.map(skill => (
            <option key={skill.name} value={skill.name}>
              {skill.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        DC:
        <input type="number" value={dc} onChange={(e) => setDc(Number(e.target.value))} placeholder="DC" />
      </label>
      <button onClick={handleRoll}>Roll</button>
    </div>
  );
};

export default SkillCheck;
