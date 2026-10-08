import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const levels = {
  easy: 8,
  medium: 16,
  hard: 24, 
};

const images = [
  '🐱', '🐶', '🐭', '🐹',
  '🐰', '🦊', '🐻', '🐼',
  '🦁', '🐯', '🐨', '🐵',
];

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};


const App = () => {
  const [level, setLevel] = useState(null);
  const [cards, setCards] = useState([]);
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [timer, setTimer] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (level) {
      const newCards = shuffleArray([...images.slice(0, level / 2), ...images.slice(0, level / 2)]);
      setCards(newCards);
    }
  }, [level]);

  useEffect(() => {
    let timerInterval;

    if (gameStarted) {
      timerInterval = setInterval(() => {
        if (timer > 0 && matchedPairs.length !== level / 2) {
          setTimer((prev) => prev - 1);
        } else {
          clearInterval(timerInterval);
          setGameOver(true);
        }
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [timer, matchedPairs, level, gameStarted]);

  useEffect(() => {
    if (flippedIndexes.length === 2) {
      const [index1, index2] = flippedIndexes;
      if (cards[index1] === cards[index2]) {
        setMatchedPairs((prev) => [...prev, cards[index1]]);
      }
      setTimeout(() => setFlippedIndexes([]), 1000);
    }
  }, [flippedIndexes, cards]);
 
  const handleCardClick = (index) => {
    if (gameStarted && flippedIndexes.length < 2 && !flippedIndexes.includes(index) && !matchedPairs.includes(cards[index])) {
      setFlippedIndexes((prev) => [...prev, index]);
      setMoves((prevMoves) => prevMoves + 1);
    }
  };

  const handleStartClick = () => {
    setGameStarted(true);
  };

  const handleLevelClick = (selectedLevel) => {
    setLevel(levels[selectedLevel]);
  };

  const renderLevelSelection = () => (
    <div className="text-center">
      <img
        src="https://th.bing.com/th/id/R.ab092b1734660d86d9c8c8d6e7beb8c6?rik=tJCG7NUU%2byTz9Q&riu=http%3a%2f%2fwww.desicomments.com%2fwp-content%2fuploads%2f2017%2f07%2fHello.gif&ehk=xYSE%2btB8K9AmY84tj6OBZ6le2wvS27Op%2b6XMmbau1BE%3d&risl=&pid=ImgRaw&r=0"  
        alt="Hello Smiley"
        style={{ width: '100px', height: '200px' , paddingTop: 60}}  
      />
      <h1 style={{ paddingTop: 20 , color: 'darkblue' , fontFamily:'fantasy', fontSize: 30}}>Welcome to<br></br> Memory Card Game</h1>
      <h2>Select a Level</h2>
      {Object.keys(levels).map((l) => (
        <button key={l} onClick={() => handleLevelClick(l)}>
          {l}
        </button>
      ))} 
    </div>
  );
  
  const renderGame = () => (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Memory Card Game</h1>
      <div className="row row-cols-md-3 row-cols-lg-4 row-cols-xl-6">
        {cards.map((card, index) => (
          <div key={index} className={`col mb-3`}>
            <div
              onClick={() => handleCardClick(index)}
              className={`card h-100 text-white text-center ${
                flippedIndexes.includes(index) || matchedPairs.includes(card) ? 'flipped' : ''
              }`}
            >
              <div className="card-body d-flex align-items-center justify-content-center">
                {flippedIndexes.includes(index) || matchedPairs.includes(card) ? (
                  <span className="text-4xl">{card}</span>
                ) : (
                  <span className="text-4xl">🎴</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-3">
        <h2 id='time'>Time Remaining: {timer} seconds</h2>
        <h2 id='move'>Total Moves: {moves}</h2>
        {!gameStarted && <button onClick={handleStartClick}>Start Game</button>}
        {gameOver && matchedPairs.length !== level / 2 && (
          <div>
            <h3 id='red'>Game Over</h3>
            <p>Total Moves: {moves}</p>
          </div>
        )}
        {matchedPairs.length === level / 2 && (
          <div>
            <h3 id='green'>Win!</h3>
            <p>Total Moves: {moves}</p>
          </div>
        )}
      </div>
    
    </div>
  );

  return (
    <div>
      {!level ? renderLevelSelection() : renderGame()}
      <footer className="text-center mt-5">
        <p style={{fontSize:10, color:'grey'}}>&copy; 2024 Afrah Ali. All Rights Reserved.</p>
      </footer>
    </div>
  );

};

export default App;
