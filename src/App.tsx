import React, { useState, useEffect, useRef } from 'react';
import { generateProblem, Operation, Problem } from './utils/mathLogic';

function App() {
  const [operation, setOperation] = useState<Operation>('add');
  const [problem, setProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null); // 'correct', 'incorrect', or null
  const inputRef = useRef<HTMLInputElement>(null);

  const getNewProblem = (op?: Operation) => {
    const newProblem = generateProblem(op || operation);
    setProblem(newProblem);
    setUserAnswer('');
    setFeedback(null);
    if (inputRef.current) inputRef.current.focus();
  };

  useEffect(() => {
    getNewProblem();
  }, []);

  const handleOperationChange = (op: Operation) => {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
        {(['add', 'sub', 'mul', 'div'] as Operation[]).map(op => (
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
