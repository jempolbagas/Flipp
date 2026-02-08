import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateHint, HintData } from './utils/mathHints';
import HintCard from './components/HintCard';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { cn } from './utils/cn';

import BackgroundBlob from './components/BackgroundBlob';
import StatBox from './components/StatBox';
import SettingsModal from './components/SettingsModal';
import HistoryModal from './components/HistoryModal';
import GameControls from './components/GameControls';
import EmojiBurst from './components/EmojiBurst';

import { useGameLogic } from './hooks/useGameLogic';
import { useHaptics } from './hooks/useHaptics';

function App() {
  const logic = useGameLogic();
  const haptics = useHaptics();

  const [showHint, setShowHint] = useState<boolean>(false);
  const [hintData, setHintData] = useState<HintData | null>(null);

  // Settings UI State
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [initialSettings, setInitialSettings] = useState<{ min: number, max: number } | null>(null);

  // History UI State
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Emoji burst trigger
  const [burstTrigger, setBurstTrigger] = useState(0);
  const [burstIntensity, setBurstIntensity] = useState<'normal' | 'celebration'>('normal');

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus management
  useEffect(() => {
    if (!showSettings && !showHistory && inputRef.current) {
      inputRef.current.focus();
    }
  }, [logic.problem, logic.feedback, showSettings, showHistory]);


  const handleOpenSettings = () => {
    setInitialSettings({ min: logic.minRange, max: logic.maxRange });
    setShowSettings(true);
  };

  const applySettings = () => {
    setShowSettings(false);

    // Check if ranges changed
    if (initialSettings && (logic.minRange !== initialSettings.min || logic.maxRange !== initialSettings.max)) {
      logic.resetGameStore();
    } else {
      logic.getNewProblem();
    }
  };

  const toggleHint = () => {
    if (showHint) {
      setShowHint(false);
    } else {
      const data = generateHint(logic.operation);
      setHintData(data);
      setShowHint(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCheckAnswer();
    }
  };

  // Enhanced check answer with haptics and emoji burst
  const handleCheckAnswer = useCallback(() => {
    if (!logic.problem || logic.feedback !== null) return;

    const val = parseInt(logic.userAnswer, 10);
    if (isNaN(val)) return;

    const isCorrect = val === logic.problem.answer;
    const currentStreak = logic.streak[logic.operation];

    if (isCorrect) {
      haptics.vibrateSuccess();

      // Check for milestone celebration (5, 10, 15, 20...)
      const newStreak = currentStreak + 1;
      if (newStreak % 5 === 0) {
        setBurstIntensity('celebration');
        haptics.vibrateCelebration();
      } else {
        setBurstIntensity('normal');
      }
      setBurstTrigger(prev => prev + 1);
    } else {
      haptics.vibrateError();
    }

    logic.checkAnswer();
  }, [logic, haptics]);

  // Swipe gesture handler for operation switching (mobile)
  const operations = ['add', 'sub', 'mul', 'div'] as const;

  const handleSwipe = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50; // Minimum swipe distance

    if (Math.abs(info.offset.x) > threshold) {
      const currentIndex = operations.indexOf(logic.operation);

      if (info.offset.x > 0) {
        // Swipe right - previous operation
        const prevIndex = currentIndex === 0 ? operations.length - 1 : currentIndex - 1;
        logic.setOperation(operations[prevIndex]);
      } else {
        // Swipe left - next operation
        const nextIndex = (currentIndex + 1) % operations.length;
        logic.setOperation(operations[nextIndex]);
      }

      haptics.vibrateTap();
    }
  }, [logic, haptics, operations]);

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
                className="bg-white/20 p-3 md:p-2 rounded-full hover:bg-white/30 transition-colors"
                title="History"
              >
                <span className="text-xl">📜</span>
              </motion.button>
              <motion.button
                whileTap={buttonTap}
                onClick={handleOpenSettings}
                className="bg-white/20 p-3 md:p-2 rounded-full hover:bg-white/30 transition-colors"
                title="Settings"
              >
                <span className="text-xl">⚙️</span>
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <StatBox label="Score" value={logic.score} />
            <StatBox label="Streak" value={logic.streak[logic.operation]} isStreak />
            <StatBox label="Best" value={logic.highScore} />
          </div>
        </div>

        {/* Game Area - with swipe gesture support */}
        <motion.div
          className="p-6 md:p-8 flex flex-col items-center space-y-6 md:space-y-8 relative"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleSwipe}
        >
          {/* Emoji Burst */}
          <EmojiBurst trigger={burstTrigger} intensity={burstIntensity} />

          {/* Operations */}
          <GameControls operation={logic.operation} onOperationChange={logic.setOperation} />

          {/* Problem */}
          <div className="text-center">
            <motion.div
              key={logic.problem?.question} // Re-animate on new problem
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring' as const, stiffness: 300 }}
              className="text-5xl md:text-6xl font-black text-slate-700 mb-2"
            >
              {logic.problem ? logic.problem.question : '...'}
            </motion.div>
          </div>

          {/* Input & Check */}
          <div className="w-full relative">
            <motion.div
              animate={logic.shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <input
                ref={inputRef}
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                value={logic.userAnswer}
                onChange={(e) => logic.setUserAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="?"
                disabled={logic.feedback === 'correct'}
                className={cn(
                  "w-full h-16 md:h-20 text-center text-3xl md:text-4xl font-bold rounded-2xl border-4 bg-slate-50 focus:outline-none focus:ring-4 transition-all placeholder:text-slate-300",
                  logic.feedback === 'correct' ? "border-emerald-400 bg-emerald-50 text-emerald-600" :
                    logic.feedback === 'incorrect' ? "border-pink-400 bg-pink-50 text-pink-600" :
                      "border-slate-200 focus:border-violet-400 focus:ring-violet-100"
                )}
              />
            </motion.div>

            <AnimatePresence>
              {logic.feedback === 'correct' && (
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
            onClick={handleCheckAnswer}
            disabled={logic.feedback !== null}
            className={cn(
              "w-full py-4 rounded-2xl text-xl font-black text-white shadow-[0_4px_0_0_rgba(0,0,0,0.1)] transition-all active:shadow-none active:translate-y-1",
              logic.feedback === null ? "bg-violet-500 hover:bg-violet-600 shadow-violet-700" : "bg-slate-300 shadow-slate-400 cursor-not-allowed"
            )}
          >
            check!
          </motion.button>

        </motion.div>

        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          minRange={logic.minRange}
          setMinRange={logic.setMinRange}
          maxRange={logic.maxRange}
          setMaxRange={logic.setMaxRange}
          onApply={applySettings}
        />

        <HistoryModal
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          history={logic.history}
          streakHistory={logic.streakHistory}
        />

      </motion.div>
    </div>
  );
}

export default App;

