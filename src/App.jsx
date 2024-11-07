import { useState, useEffect, useCallback } from 'react';
import './App.css';

const App = () => {
  const [snake, setSnake] = useState([[0, 0]]);
  const [food, setFood] = useState([5, 5]);
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);

  const generateFood = useCallback(() => {
    const x = Math.floor(Math.random() * 20);
    const y = Math.floor(Math.random() * 20);
    setFood([x, y]);
  }, []);

  const moveSnake = useCallback(() => {
    const newSnake = [...snake];
    const head = [...newSnake[0]];

    switch (direction) {
      case 'RIGHT': head[0] += 1; break;
      case 'LEFT': head[0] -= 1; break;
      case 'UP': head[1] -= 1; break;
      case 'DOWN': head[1] += 1; break;
      default: break;
    }

    // Check collision with walls
    if (head[0] < 0 || head[0] >= 20 || head[1] < 0 || head[1] >= 20) {
      setGameOver(true);
      return;
    }

    // Check collision with self
    if (newSnake.some(segment => segment[0] === head[0] && segment[1] === head[1])) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    // Check if snake ate food
    if (head[0] === food[0] && head[1] === food[1]) {
      generateFood();
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp': setDirection('UP'); break;
        case 'ArrowDown': setDirection('DOWN'); break;
        case 'ArrowLeft': setDirection('LEFT'); break;
        case 'ArrowRight': setDirection('RIGHT'); break;
        default: break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    const gameInterval = setInterval(moveSnake, 150);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      clearInterval(gameInterval);
    };
  }, [moveSnake]);

  const resetGame = () => {
    setSnake([[0, 0]]);
    setFood([5, 5]);
    setDirection('RIGHT');
    setGameOver(false);
  };

  return (
    <div className="game-container">
      {gameOver ? (
        <div className="game-over">
          <h2>Game Over!</h2>
          <button onClick={resetGame}>Play Again</button>
        </div>
      ) : (
        <div className="game-board">
          {Array.from({ length: 20 }, (_, row) => (
            <div key={row} className="row">
              {Array.from({ length: 20 }, (_, col) => (
                <div
                  key={`${row}-${col}`}
                  className={`cell ${
                    snake.some(([x, y]) => x === col && y === row)
                      ? 'snake'
                      : food[0] === col && food[1] === row
                      ? 'food'
                      : ''
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
