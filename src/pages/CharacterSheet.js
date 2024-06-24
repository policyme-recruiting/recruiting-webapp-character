import React, { useState } from 'react';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from '../consts';
const CharacterSheet = ({ character, index, setCharacters, characters }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [skillCheckResult, setSkillCheckResult] = useState(null);

  const getModifier = (attributeValue) => {
    return Math.floor((attributeValue - 10) / 2);
  };

  const updateAttribute = (attribute, value) => {
    if (value < 0 || value > 70) {
      alert('Attribute value must be between 0 and 70');
      return;
    }

    const totalAttributes = Object.values(character.attributes).reduce((total, attrValue) => total + attrValue, 0);

    if (totalAttributes + (value - character.attributes[attribute]) > 70) {
      alert('Total attribute points cannot exceed 70');
      return;
    }

    setCharacters((prev) => {
      const updatedCharacters = [...prev];
      updatedCharacters[index].attributes[attribute] = value;
      return updatedCharacters;
    });
  };

  const updateSkillPoints = (skill, points) => {
    if (points < 0) {
      return;
    }

    const totalSkillPoints = 10 + getModifier(character.attributes.Intelligence) * 4;
    const currentSkillPoints = character.skills.reduce((total, skill) => total + skill.points, 0);

    if (currentSkillPoints + (points - character.skills.find((s) => s.name === skill).points) > totalSkillPoints) {
      alert('Not enough skill points available');
      return;
    }

    setCharacters((prev) => {
      const updatedCharacters = [...prev];
      const skillIndex = updatedCharacters[index].skills.findIndex((s) => s.name === skill);
      if (skillIndex > -1) {
        updatedCharacters[index].skills[skillIndex].points = points;
      }
      return updatedCharacters;
    });
  };

  const handleClassClick = (className) => {
    setSelectedClass(CLASS_LIST[className]);
  };

  const handleSkillCheck = (skill, dc) => {
    if (isNaN(dc) || dc <= 0) {
      alert('DC must be a positive number');
      return;
    }

    const randomRoll = Math.floor(Math.random() * 20) + 1;
    const totalSkill =
      character.skills.find((s) => s.name === skill).points +
      getModifier(character.attributes[SKILL_LIST.find((s) => s.name === skill).attributeModifier]);

    setSkillCheckResult({
      character: index + 1,
      skill,
      rolled: randomRoll,
      dc,
      success: randomRoll + totalSkill >= dc,
    });
  };

  const totalSkillPoints = 10 + getModifier(character.attributes.Intelligence) * 4;
  const remainingPoints = totalSkillPoints - character.skills.reduce((total, skill) => total + skill.points, 0);

  const classMeetsRequirements = (className) => {
    const classReqs = CLASS_LIST[className];
    return Object.entries(classReqs).every(
      ([attr, value]) => character.attributes[attr] >= value
    );
  };

  return (
    <div className="character-container">
      <div className="character-header">{`Character ${index + 1}`}</div>

      <div className="skill-check">
        <h3>Skill Check</h3>
        <label>
          Skill:
          <select id={`skill-select-${index}`}>
            {SKILL_LIST.map((skill) => (
              <option value={skill.name} key={skill.name}>
                {skill.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          DC:
          <input id={`dc-input-${index}`} type="number" placeholder="DC" />
        </label>
        <button onClick={() => handleSkillCheck(document.getElementById(`skill-select-${index}`).value, Number(document.getElementById(`dc-input-${index}`).value))}>
          Roll
        </button>
      </div>

      {skillCheckResult && skillCheckResult.character === index + 1 && (
        <div className="skill-check-result">
          <h4>Skill Check Results</h4>
          <p>{`Character: ${skillCheckResult.character}`}</p>
          <p>{`Skill: ${skillCheckResult.skill}`}</p>
          <p>{`You Rolled: ${skillCheckResult.rolled}`}</p>
          <p>{`The DC was: ${skillCheckResult.dc}`}</p>
          <p>{`Result: ${skillCheckResult.success ? 'Success' : 'Failure'}`}</p>
        </div>
      )}

      <hr />
      <div className="top-section">
        <div className="attribute-list">
          <h3>Attributes</h3>
          {ATTRIBUTE_LIST.map((attr) => (
            <div className="attribute-item" key={attr}>
              <span>{`${attr}: ${character.attributes[attr]} (Modifier: ${getModifier(character.attributes[attr])})`}</span>
              <div>
                <button onClick={() => updateAttribute(attr, character.attributes[attr] - 1)} disabled={character.attributes[attr] <= 0}>-</button>
                <button onClick={() => updateAttribute(attr, character.attributes[attr] + 1)}>+</button>
              </div>
            </div>
          ))}
        </div>

        <div className="class-list">
          <h3>Classes</h3>
          {Object.keys(CLASS_LIST).map((className) => (
            <div
              key={className}
              className={`class-item ${classMeetsRequirements(className) ? 'highlight' : ''}`}
              onClick={() => handleClassClick(className)}
            >
              {className}
            </div>
          ))}
          {selectedClass && (
            <div className="class-requirements">
              <h4>{Object.keys(CLASS_LIST).find((key) => CLASS_LIST[key] === selectedClass)} Minimum Requirements</h4>
              {Object.entries(selectedClass).map(([key, value]) => (
                <div key={key}>{`${key}: ${value}`}</div>
              ))}
              <button onClick={() => setSelectedClass(null)}>Close Requirement View</button>
            </div>
          )}
        </div>

        <div className="skill-list">
          <h3>Skills (Total skill points available: {remainingPoints})</h3>
          {character.skills.map((skill) => {
            const attributeModifier = SKILL_LIST.find((s) => s.name === skill.name).attributeModifier;
            const modifierValue = getModifier(character.attributes[attributeModifier]);
            const totalValue = skill.points + modifierValue;
            return (
              <div className="skill-item" key={skill.name}>
                <span>{`${skill.name}: ${skill.points} (Modifier: ${attributeModifier}): ${modifierValue} Total: ${totalValue}`}</span>
                <div>
                  <button onClick={() => updateSkillPoints(skill.name, skill.points - 1)} disabled={skill.points <= 0}>-</button>
                  <button onClick={() => updateSkillPoints(skill.name, skill.points + 1)} disabled={remainingPoints <= 0}>+</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;
