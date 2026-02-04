import React, { useState, useEffect, useRef } from 'react';
import { generateProblem } from './utils/mathLogic';

function App() {
  const [operation, setOperation] = useState('add');
  const [problem, setProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect', or null
  const inputRef = useRef(null);

  const getNewProblem = (op) => {
    const newProblem = generateProblem(op || operation);
    setProblem(newProblem);
    setUserAnswer('');
    setFeedback(null);
    if (inputRef.current) inputRef.current.focus();
  };

  useEffect(() => {
    getNewProblem();
  }, []);

  const handleOperationChange = (op) => {
    setOperation(op);
    getNewProblem(op);
  };

  const handleCheck = () => {
    if (!problem) return;

    // Normalize input (allow users to type just numbers, handle negatives)
    const val = parseInt(userAnswer, 10);
    if (isNaN(val)) return;

    if (val === problem.answer) {
      setFeedback('correct');
      setScore(s => s + 1);
      setTimeout(() => {
        getNewProblem();
      }, 1000); // Wait 1s to show success
    } else {
      setFeedback('incorrect');
      setScore(s => Math.max(0, s - 1));
      setTimeout(() => {
        setFeedback(null);
        setUserAnswer('');
        if (inputRef.current) inputRef.current.focus();
      }, 1000); // 1s to show error then reset input
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  return (
    <div className={`app-container ${feedback}`}>
      <header>
        <h1 className="logo">Flipp</h1>
        <div className="score">Score: {score}</div>
      </header>

      <div className="operations">
        {['add', 'sub', 'mul', 'div'].map(op => (
          <button
            key={op}
            className={`op-btn ${operation === op ? 'active' : ''}`}
            onClick={() => handleOperationChange(op)}
          >
            {op === 'add' ? '+' : op === 'sub' ? '−' : op === 'mul' ? '×' : '÷'}
          </button>
        ))}
      </div>

      <main className="game-area">
        <div className="problem-display">
          {problem ? problem.question : '...'}
        </div>

        <div className="input-area">
          <input
            ref={inputRef}
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="?"
            disabled={feedback === 'correct'} // Disable input while showing success
          />
          <button
            className="check-btn"
            onClick={handleCheck}
            disabled={feedback !== null}
          >
            Check
          </button>
        </div>

        {feedback && (
          <div className={`feedback-message ${feedback}`}>
            {feedback === 'correct' ? 'Correct!' : 'Try Again'}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
