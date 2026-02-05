import React, { useState, useEffect, useRef } from 'react';
import { generateProblem, Operation, Problem } from './utils/mathLogic';

function App() {
  const [operation, setOperation] = useState<Operation>('add');
  const [problem, setProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [history, setHistory] = useState<Array<{ question: string, userAnswer: string, correct: boolean, timestamp: number }>>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  // Settings
  const [minRange, setMinRange] = useState<number>(1);
  const [maxRange, setMaxRange] = useState<number>(10);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedScore = localStorage.getItem('flipp_score');
    const savedStreak = localStorage.getItem('flipp_streak');
    const savedHighScore = localStorage.getItem('flipp_highScore');

    if (savedScore) setScore(parseInt(savedScore, 10));
    if (savedStreak) setStreak(parseInt(savedStreak, 10));
    if (savedHighScore) setHighScore(parseInt(savedHighScore, 10));
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('flipp_score', score.toString());
    localStorage.setItem('flipp_streak', streak.toString());
    localStorage.setItem('flipp_highScore', highScore.toString());
  }, [score, streak, highScore]);

  const getNewProblem = (op?: Operation) => {
    const newProblem = generateProblem(op || operation, minRange, maxRange);
    setProblem(newProblem);
    setUserAnswer('');
    setFeedback(null);
    if (inputRef.current) inputRef.current.focus();
  };

  // Re-generate problem if ranges change (optional, but good UX)
  useEffect(() => {
    getNewProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOperationChange = (op: Operation) => {
    setOperation(op);
    const newProblem = generateProblem(op, minRange, maxRange);
    setProblem(newProblem);
    setUserAnswer('');
    setFeedback(null);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleCheck = () => {
    if (!problem) return;

    const val = parseInt(userAnswer, 10);
    if (isNaN(val)) return;

    const isCorrect = val === problem.answer;

    // Update History
    const newHistoryItem = {
      question: problem.question,
      userAnswer: userAnswer,
      correct: isCorrect,
      timestamp: Date.now(),
    };
    setHistory(prev => [newHistoryItem, ...prev].slice(0, 10));

    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 1);
      setStreak(s => {
        const newStreak = s + 1;
        setHighScore(prevHigh => Math.max(prevHigh, score + 1)); // Use total score for high score? Or streak? Request said "High Score", ambiguous. Usually high score refers to 'Score'. Let's track Score as high score.
        // Wait, "High Score: Track the user's highest score in a session". 
        // If score resets on wrong answer, tehn it's a current-run score. 
        // But original app decremented score. 
        // Request: "Display the current streak next to the score". 
        // Request: "High Score: Track the user's highest score". 
        // I will interpret High Score as the maximum value `score` has reached.
        return newStreak;
      });
      // Logic for High Score tracking based on 'score' state
      if (score + 1 > highScore) {
        setHighScore(score + 1);
      }

      setTimeout(() => {
        getNewProblem();
      }, 1000);
    } else {
      setFeedback('incorrect');
      setScore(s => Math.max(0, s - 1));
      setStreak(0);
      setTimeout(() => {
        setFeedback(null);
        setUserAnswer('');
        if (inputRef.current) inputRef.current.focus();
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  const applySettings = () => {
    setShowSettings(false);
    getNewProblem();
  };

  return (
    <div className={`app-container ${feedback}`}>
      <header>
        <div className="header-top">
          <h1 className="logo">Flipp</h1>
          <button className="settings-btn" onClick={() => setShowSettings(!showSettings)}>⚙️</button>
        </div>
        <div className="stats-bar">
          <div className="stat">Score: {score}</div>
          <div className="stat">🔥 Streak: {streak}</div>
          <div className="stat">🏆 Best: {highScore}</div>
        </div>
      </header>

      {showSettings && (
        <div className="settings-panel">
          <h3>Game Settings</h3>
          <div className="setting-row">
            <label>Min Number:</label>
            <input type="number" value={minRange} onChange={e => setMinRange(Number(e.target.value))} />
          </div>
          <div className="setting-row">
            <label>Max Number:</label>
            <input type="number" value={maxRange} onChange={e => setMaxRange(Number(e.target.value))} />
          </div>
          <button className="close-settings" onClick={applySettings}>Done</button>
        </div>
      )}

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
            disabled={feedback === 'correct'}
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

      {history.length > 0 && (
        <div className="history-section">
          <h3>History</h3>
          <ul className="history-list">
            {history.map((item, idx) => (
              <li key={idx} className={`history-item ${item.correct ? 'correct' : 'incorrect'}`}>
                <span className="h-q">{item.question}</span>
                <span className="h-a">= {item.userAnswer}</span>
                <span className="h-icon">{item.correct ? '✅' : '❌'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
