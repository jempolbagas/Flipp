import React, { useState, useEffect, useRef } from 'react';
import { generateProblem, Operation, Problem } from './utils/mathLogic';
import { generateHint, HintData } from './utils/mathHints';
import HintCard from './components/HintCard';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for clean tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Interactive Background Component
function BackgroundBlob() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for the blob
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-96 h-96 bg-gradient-to-r from-violet-300 to-pink-300 rounded-full blur-3xl opacity-40 pointer-events-none -z-10"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
      }}
    />
  );
}

export interface StreakRecord {
  id: string;
  timestamp: number;
  value: number;
  operation: Operation;
  range: { min: number, max: number };
}

function App() {
  const [operation, setOperation] = useState<Operation>('add');
  const [problem, setProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<Record<Operation, number>>({ add: 0, sub: 0, mul: 0, div: 0 });
  const [highScore, setHighScore] = useState<number>(0);
  const [history, setHistory] = useState<Array<{ question: string, userAnswer: string, correct: boolean, timestamp: number }>>([]);
  const [streakHistory, setStreakHistory] = useState<StreakRecord[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [shake, setShake] = useState(0); // Key to trigger shake animation
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hintData, setHintData] = useState<HintData | null>(null);

  // Settings
  const [minRange, setMinRange] = useState<number>(1);
  const [maxRange, setMaxRange] = useState<number>(20); // Default bumped to 20 for fun
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [historyTab, setHistoryTab] = useState<'problems' | 'streaks'>('problems');

  const inputRef = useRef<HTMLInputElement>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedScore = localStorage.getItem('flipp_score');
    const savedStreak = localStorage.getItem('flipp_streak');
    const savedHighScore = localStorage.getItem('flipp_highScore');
    const savedStreakHistory = localStorage.getItem('flipp_streakHistory');

    if (savedScore) setScore(parseInt(savedScore, 10));
    if (savedStreak) {
      try {
        const parsedStreak = JSON.parse(savedStreak);
        setStreak(prev => ({ ...prev, ...parsedStreak }));
      } catch (e) {
        console.log("Migrating streak from single number or error parsing", e);
      }
    }
    if (savedHighScore) setHighScore(parseInt(savedHighScore, 10));
    if (savedStreakHistory) {
      try {
        setStreakHistory(JSON.parse(savedStreakHistory));
      } catch (e) {
        console.log("Error parsing streak history", e);
      }
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('flipp_score', score.toString());
    localStorage.setItem('flipp_streak', JSON.stringify(streak));
    localStorage.setItem('flipp_highScore', highScore.toString());
    localStorage.setItem('flipp_streakHistory', JSON.stringify(streakHistory));
  }, [score, streak, highScore, streakHistory]);

  const saveStreak = (op: Operation, val: number) => {
    if (val <= 0) return;
    const newRecord: StreakRecord = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      value: val,
      operation: op,
      range: { min: minRange, max: maxRange }
    };
    setStreakHistory(prev => [newRecord, ...prev].slice(0, 50));
  };

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
    setHistory(prev => [newHistoryItem, ...prev].slice(0, 10)); // Keep last 10

    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 1);
      setStreak(s => {
        const newStreak = { ...s, [operation]: s[operation] + 1 };
        setHighScore(prevHigh => Math.max(prevHigh, score + 1));
        return newStreak;
      });
      if (score + 1 > highScore) {
        setHighScore(score + 1);
      }

      setTimeout(() => {
        getNewProblem();
      }, 1000);
    } else {
      setFeedback('incorrect');
      setShake(prev => prev + 1); // Trigger shake
      // Save streak before resetting
      saveStreak(operation, streak[operation]);

      setScore(s => Math.max(0, s - 1));
      setStreak(s => ({ ...s, [operation]: 0 }));
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

  // Track settings on open to detect changes
  const [initialSettings, setInitialSettings] = useState<{ min: number, max: number } | null>(null);

  const handleOpenSettings = () => {
    setInitialSettings({ min: minRange, max: maxRange });
    setShowSettings(true);
  };

  const applySettings = () => {
    setShowSettings(false);

    // Check if ranges changed
    if (initialSettings && (minRange !== initialSettings.min || maxRange !== initialSettings.max)) {
      setHistory([]);

      // Save streaks for all active operations before reset
      (Object.keys(streak) as Operation[]).forEach(op => {
        if (streak[op] > 0) {
          saveStreak(op, streak[op]);
        }
      });

      setStreak({ add: 0, sub: 0, mul: 0, div: 0 });
      setScore(0);
      setFeedback(null); // Clear any feedback
    }

    getNewProblem();
  };

  const toggleHint = () => {
    if (showHint) {
      setShowHint(false);
    } else {
      const data = generateHint(operation);
      setHintData(data);
      setShowHint(true);
    }
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring' as const, duration: 0.5 } }
  };

  const buttonTap = { scale: 0.9, transition: { type: "spring" as const, stiffness: 400, damping: 10 } };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 selection:bg-pink-200 overflow-hidden relative">
      <BackgroundBlob />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border-4 border-violet-100 overflow-hidden relative"
      >
        {/* Header */}
        <div className="bg-violet-500 p-6 text-white rounded-b-[2.5rem] shadow-lg relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-black tracking-tight" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>Flipp</h1>
            <div className="flex gap-2">
              <motion.button
                whileTap={buttonTap}
                onClick={() => setShowHistory(!showHistory)}
                className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
                title="History"
              >
                <span className="text-xl">📜</span>
              </motion.button>
              <motion.button
                whileTap={buttonTap}
                onClick={handleOpenSettings}
                className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
                title="Settings"
              >
                <span className="text-xl">⚙️</span>
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <StatBox label="Score" value={score} />
            <StatBox label="Streak" value={streak[operation]} isStreak />
            <StatBox label="Best" value={highScore} />
          </div>
        </div>

        {/* Game Area */}
        <div className="p-8 flex flex-col items-center space-y-8">

          {/* Operations */}
          <div className="flex space-x-3 bg-violet-50 p-2 rounded-2xl">
            {(['add', 'sub', 'mul', 'div'] as Operation[]).map(op => (
              <motion.button
                key={op}
                whileTap={buttonTap}
                onClick={() => handleOperationChange(op)}
                className={cn(
                  "w-12 h-12 rounded-xl text-2xl font-bold flex items-center justify-center transition-all shadow-sm",
                  operation === op
                    ? "bg-violet-500 text-white shadow-violet-200 shadow-md transform scale-105"
                    : "bg-white text-violet-300 hover:bg-violet-100"
                )}
              >
                {op === 'add' ? '+' : op === 'sub' ? '−' : op === 'mul' ? '×' : '÷'}
              </motion.button>
            ))}
          </div>

          {/* Problem */}
          <div className="text-center">
            <motion.div
              key={problem?.question} // Re-animate on new problem
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring' as const, stiffness: 300 }}
              className="text-6xl font-black text-slate-700 mb-2"
            >
              {problem ? problem.question : '...'}
            </motion.div>
          </div>

          {/* Input & Check */}
          <div className="w-full relative">
            <motion.div
              animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <input
                ref={inputRef}
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="?"
                disabled={feedback === 'correct'}
                className={cn(
                  "w-full h-20 text-center text-4xl font-bold rounded-2xl border-4 bg-slate-50 focus:outline-none focus:ring-4 transition-all placeholder:text-slate-300",
                  feedback === 'correct' ? "border-emerald-400 bg-emerald-50 text-emerald-600" :
                    feedback === 'incorrect' ? "border-pink-400 bg-pink-50 text-pink-600" :
                      "border-slate-200 focus:border-violet-400 focus:ring-violet-100"
                )}
              />
            </motion.div>

            <AnimatePresence>
              {feedback === 'correct' && (
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-6 -right-4 bg-emerald-400 text-white px-4 py-1 rounded-full font-bold shadow-lg text-sm transform rotate-12"
                >
                  Awesome!
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileTap={buttonTap}
              onClick={toggleHint}
              className="absolute top-1/2 -translate-y-1/2 right-4 text-violet-300 hover:text-violet-500 transition-colors p-2"
              title="Need a hint?"
            >
              <span className="text-xl">💡</span>
            </motion.button>
          </div>

          <AnimatePresence>
            {showHint && hintData && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <HintCard hintData={hintData} onClose={() => setShowHint(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileTap={buttonTap}
            whileHover={{ scale: 1.02 }}
            onClick={handleCheck}
            disabled={feedback !== null}
            className={cn(
              "w-full py-4 rounded-2xl text-xl font-black text-white shadow-[0_4px_0_0_rgba(0,0,0,0.1)] transition-all active:shadow-none active:translate-y-1",
              feedback === null ? "bg-violet-500 hover:bg-violet-600 shadow-violet-700" : "bg-slate-300 shadow-slate-400 cursor-not-allowed"
            )}
          >
            check!
          </motion.button>

        </div>

        {/* Global Modal Overlay to handle stacking if needed, though simple checks work */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-violet-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-2xl"
              >
                <h3 className="text-2xl font-bold text-violet-900 mb-6 text-center">Settings</h3>

                <div className="space-y-4 mb-8">
                  <SettingInput label="Min Number" value={minRange} onChange={setMinRange} />
                  <SettingInput label="Max Number" value={maxRange} onChange={setMaxRange} />
                </div>

                <motion.button
                  whileTap={buttonTap}
                  onClick={applySettings}
                  className="w-full bg-violet-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-violet-600"
                >
                  Done
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Modal */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="absolute inset-0 bg-violet-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
              >
                <h3 className="text-2xl font-bold text-violet-900 mb-4 text-center">History</h3>

                {/* Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                  <button
                    onClick={() => setHistoryTab('problems')}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                      historyTab === 'problems' ? "bg-white text-violet-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    Context
                  </button>
                  <button
                    onClick={() => setHistoryTab('streaks')}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                      historyTab === 'streaks' ? "bg-white text-violet-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    Streaks
                  </button>
                </div>

                <div className="space-y-3 mb-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
                  {historyTab === 'problems' ? (
                    history.length === 0 ? (
                      <div className="text-center text-slate-400 py-4 font-medium">No attempts yet!</div>
                    ) : (
                      history.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="font-bold text-slate-700 text-lg tracking-wider">{item.question}</span>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-bold text-lg",
                              item.correct ? "text-emerald-500" : "text-pink-500 line-through"
                            )}>
                              {item.userAnswer}
                            </span>
                            <span className="text-xl">
                              {item.correct ? '✅' : '❌'}
                            </span>
                          </div>
                        </div>
                      ))
                    )
                  ) : (
                    // Streak History Tab
                    streakHistory.length === 0 ? (
                      <div className="text-center text-slate-400 py-4 font-medium">No streaks recorded yet!</div>
                    ) : (
                      streakHistory.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-amber-50 p-3 rounded-xl border border-amber-100">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {item.operation === 'add' ? '➕' : item.operation === 'sub' ? '➖' : item.operation === 'mul' ? '✖️' : '➗'}
                              </span>
                              <span className="font-bold text-amber-900 text-lg">Streak: {item.value}</span>
                            </div>
                            <span className="text-xs text-amber-600/70 font-medium">
                              Range: {item.range.min} - {item.range.max}
                            </span>
                            <span className="text-[10px] text-amber-400">
                              {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="text-2xl">🏆</div>
                        </div>
                      ))
                    )
                  )}
                </div>

                <motion.button
                  whileTap={buttonTap}
                  onClick={() => setShowHistory(false)}
                  className="w-full bg-violet-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-violet-600 shrink-0"
                >
                  Close
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}

// Subcomponents for cleaner code
const StatBox = ({ label, value, isStreak }: { label: string, value: number, isStreak?: boolean }) => (
  <div className="bg-white/20 rounded-2xl p-2 text-center backdrop-blur-sm">
    <div className="text-xs font-bold text-violet-100 uppercase tracking-wider mb-1">{label}</div>
    <motion.div
      key={value} // Re-animate on change
      initial={{ scale: 1.5, color: isStreak ? '#fcd34d' : '#fff' }}
      animate={{ scale: 1, color: '#fff' }}
      className="text-2xl font-black"
    >
      {value}
    </motion.div>
  </div>
);

const SettingInput = ({ label, value, onChange }: { label: string, value: number, onChange: (n: number) => void }) => (
  <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center">
    <label className="font-bold text-slate-600">{label}</label>
    <input
      type="number"
      value={value}
      onChange={e => onChange(parseInt(e.target.value) || 0)}
      className="w-20 text-center font-bold text-lg bg-white border-2 border-slate-200 rounded-lg py-1 focus:border-violet-400 outline-none text-violet-600"
    />
  </div>
);

export default App;
