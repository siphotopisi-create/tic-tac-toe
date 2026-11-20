import { useEffect, useReducer } from 'react';
import "./App.css";

// The game starts with nine empty squares.
const initialState = {
  board: Array(9).fill(null),
  currentPlayer: "X",
};

// This reducer manages our game state.
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(board) {
  for (const [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

function gameReducer(state, action) {
  switch (action.type) {
    case "MAKE_MOVE": {
      const index = action.payload;

      // Prevent overwriting squares or playing after game ends
      if (
  state.currentPlayer !== 'X' ||
  state.board[index] !== null ||
  calculateWinner(state.board) ||
  state.board.every((cell) => cell !== null)
) {
        return state;
      }

      const newBoard = [...state.board];
      newBoard[index] = state.currentPlayer;

      return {
        ...state,
        board: newBoard,
        currentPlayer: state.currentPlayer === "X" ? "O" : "X",
      };
    }
// Computer chooses a random empty square
case 'COMPUTER_MOVE': {
  if (
    state.currentPlayer !== 'O' ||
    calculateWinner(state.board) ||
    state.board.every((cell) => cell !== null)
  ) {
    return state;
  }

  const emptySquares = state.board
    .map((cell, index) => (cell === null ? index : null))
    .filter((index) => index !== null);

  if (emptySquares.length === 0) {
    return state;
  }

  const randomIndex = Math.floor(
    Math.random() * emptySquares.length
  );

  const newBoard = [...state.board];
  newBoard[emptySquares[randomIndex]] = 'O';

  return {
    ...state,
    board: newBoard,
    currentPlayer: 'X',
  };
}
    // Restart the game
    case "RESET": {
      return initialState;
    }

    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  useEffect(() => {
  if (
    state.currentPlayer !== 'O' ||
    calculateWinner(state.board) ||
    state.board.every((cell) => cell !== null)
  ) {
    return;
  }

  const timer = setTimeout(() => {
    dispatch({ type: 'COMPUTER_MOVE' });
  }, 500);

  return () => clearTimeout(timer);
}, [state]);

  const winner = calculateWinner(state.board);

  const isDraw = !winner && state.board.every((cell) => cell !== null);

  let status;

  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = "Draw!";
  } else {
  status =
    state.currentPlayer === 'X'
      ? 'Your Turn (X)'
      : 'Computer Thinking...';
}

  function handleSquareClick(index) {
    dispatch({
      type: "MAKE_MOVE",
      payload: index,
    });
  }

  function handleReset() {
    dispatch({
      type: "RESET",
    });
  }

  return (
    <main className="game-container">
      <h1>Tic Tac Toe</h1>

      <h2>{status}</h2>

      <div className="board">
        {state.board.map((square, index) => (
          <button
            key={index}
            className="square"
            onClick={() => handleSquareClick(index)}
          >
            {square}
          </button>
        ))}
      </div>

      <button className="reset-button" onClick={handleReset}>
        Restart Game
      </button>
    </main>
  );
}

export default App;
