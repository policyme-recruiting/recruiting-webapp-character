import React, { useState, useEffect } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts';
import CharacterSheet from './pages/CharacterSheet';

function App() {
  const [characters, setCharacters] = useState([{ id: 1, attributes: ATTRIBUTE_LIST.reduce((acc, attr) => ({ ...acc, [attr]: 10 }), {}), skills: SKILL_LIST.map(skill => ({ ...skill, points: 0 })) }]);
  const [skillCheckResult, setSkillCheckResult] = useState(null);
  const [classRequirements, setClassRequirements] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchedCharacters, setFetchedCharacters] = useState([]);

  const username = 'ramvilla997';

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://recruiting.verylongdomaintotestwith.ca/api/${username}/character`);
      if (response.ok) {
        const data = await response.json();
        if (data.characters && data.characters.length > 0) {
          setFetchedCharacters(data.characters);
        }
      } else {
        console.error('Failed to fetch characters');
      }
    } catch (error) {
      console.error('Error fetching characters:', error);
    }
    setLoading(false);
  };

  const saveCharacters = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://recruiting.verylongdomaintotestwith.ca/api/${username}/character`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ characters })
      });
      if (response.ok) {
        alert('Characters successfully stored');
      } else {
        console.error('Failed to save characters');
      }
    } catch (error) {
      console.error('Error saving characters:', error);
    }
    setLoading(false);
  };

  const addNewCharacter = () => {
    setCharacters([...characters, { id: characters.length + 1, attributes: ATTRIBUTE_LIST.reduce((acc, attr) => ({ ...acc, [attr]: 10 }), {}), skills: SKILL_LIST.map(skill => ({ ...skill, points: 0 })) }]);
  };

  const resetAllCharacters = () => {
    setCharacters([{ id: 1, attributes: ATTRIBUTE_LIST.reduce((acc, attr) => ({ ...acc, [attr]: 10 }), {}), skills: SKILL_LIST.map(skill => ({ ...skill, points: 0 })) }]);
    setSkillCheckResult(null);
    setClassRequirements(null);
  };

  const handleAttributeChange = (id, attribute, value) => {
    setCharacters(characters.map(character => character.id === id ? { ...character, attributes: { ...character.attributes, [attribute]: Math.max(0, character.attributes[attribute] + value) } } : character));
  };

  const handleSkillChange = (id, skill, value) => {
    const totalSkillPoints = 10 + (Math.floor((characters.find(character => character.id === id).attributes.Intelligence - 10) / 2) * 4);
    const currentSkillPoints = characters.find(character => character.id === id).skills.reduce((total, skill) => total + skill.points, 0);

    if (currentSkillPoints + value > totalSkillPoints) {
      alert('Not enough skill points available');
      return;
    }

    setCharacters(characters.map(character => character.id === id ? { ...character, skills: character.skills.map(s => s.name === skill ? { ...s, points: Math.max(0, s.points + value) } : s) } : character));
  };

  const handleSkillCheck = (id, skill, dc) => {
    const character = characters.find(character => character.id === id);
    const skillObj = character.skills.find(s => s.name === skill);
    const attributeModifier = Math.floor((character.attributes[skillObj.attributeModifier] - 10) / 2);
    const totalSkill = skillObj.points + attributeModifier;
    const roll = Math.floor(Math.random() * 20) + 1;
    const result = roll + totalSkill >= dc ? 'Success' : 'Failure';
    setSkillCheckResult({ characterId: id, skill, roll, dc, result, totalSkill });
  };

  const handleClassClick = (className) => {
    setClassRequirements(classRequirements === className ? null : className);
  };

  return (
    <div className="App">
      <header className="App-header">
        React Coding Exercise
      </header>

      <section className="App-section">
        <div className="buttons">
          <button onClick={addNewCharacter}>Add New Character</button>
          <button onClick={resetAllCharacters}>Reset All Characters</button>
          <button onClick={saveCharacters}>Save All Characters</button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          characters.length > 0 ? (
            characters.map((character, index) => (
              <CharacterSheet
                key={character.id}
                character={character}
                onAttributeChange={handleAttributeChange}
                onSkillChange={handleSkillChange}
                onSkillCheck={handleSkillCheck}
                skillCheckResult={skillCheckResult}
                classRequirements={classRequirements}
                handleClassClick={handleClassClick}
                index={index}
                setCharacters={setCharacters}
                characters={characters}
              />
            ))
          ) : (
            <p>No characters available</p>
          )
        )}
      </section>

      <section className="App-section">
        <h2>Fetched Characters</h2>
        {fetchedCharacters.length > 0 ? (
          fetchedCharacters.map((character, index) => (
            <div key={character.id} className="fetched-character">
              <h3>{`Character ${index + 1}`}</h3>
              <p><strong>Attributes:</strong></p>
              {ATTRIBUTE_LIST.map(attr => (
                <p key={attr}>{`${attr}: ${character.attributes[attr]}`}</p>
              ))}
              <p><strong>Skills:</strong></p>
              {character.skills.map(skill => (
                <p key={skill.name}>{`${skill.name}: ${skill.points}`}</p>
              ))}
            </div>
          ))
        ) : (
          <p>No fetched characters available</p>
        )}
      </section>
    </div>
  );
}

export default App;
