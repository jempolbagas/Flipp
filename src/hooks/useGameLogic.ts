import { useState, useEffect, useCallback } from 'react';
import { generateProblem, Operation, Problem } from '../utils/mathLogic';
import { StreakRecord, HistoryItem } from '../types';

export const useGameLogic = () => {
    const [operation, setOperation] = useState<Operation>('add');
    const [problem, setProblem] = useState<Problem | null>(null);
    const [userAnswer, setUserAnswer] = useState<string>('');
    const [score, setScore] = useState<number>(0);
    const [streak, setStreak] = useState<Record<Operation, number>>({ add: 0, sub: 0, mul: 0, div: 0 });
    const [highScore, setHighScore] = useState<number>(0);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [streakHistory, setStreakHistory] = useState<StreakRecord[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [shake, setShake] = useState(0);

    // Settings
    const [minRange, setMinRange] = useState<number>(1);
    const [maxRange, setMaxRange] = useState<number>(20);

    // Load from LocalStorage
    useEffect(() => {
        const savedScore = localStorage.getItem('flipp_score');
        const savedStreak = localStorage.getItem('flipp_streak');
        const savedHighScore = localStorage.getItem('flipp_highScore');
        const savedStreakHistory = localStorage.getItem('flipp_streakHistory');

        if (savedScore) setScore(parseInt(savedScore, 10));
        if (savedStreak) {
            try {
                const parsedStreak = JSON.parse(savedStreak);
                setStreak((prev) => ({ ...prev, ...parsedStreak }));
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

    // Save to LocalStorage
    useEffect(() => {
        localStorage.setItem('flipp_score', score.toString());
        localStorage.setItem('flipp_streak', JSON.stringify(streak));
        localStorage.setItem('flipp_highScore', highScore.toString());
        localStorage.setItem('flipp_streakHistory', JSON.stringify(streakHistory));
    }, [score, streak, highScore, streakHistory]);


    const saveStreak = useCallback((op: Operation, val: number) => {
        if (val <= 0) return;
        const newRecord: StreakRecord = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            value: val,
            operation: op,
            range: { min: minRange, max: maxRange }
        };
        setStreakHistory((prev) => [newRecord, ...prev].slice(0, 50));
    }, [minRange, maxRange]);

    const getNewProblem = useCallback((op?: Operation) => {
        const newProblem = generateProblem(op || operation, minRange, maxRange);
        setProblem(newProblem);
        setUserAnswer('');
        setFeedback(null);
    }, [operation, minRange, maxRange]);

    // Initial problem generation
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
    };

    const checkAnswer = useCallback(() => {
        if (!problem) return;

        const val = parseInt(userAnswer, 10);
        if (isNaN(val)) return;

        const isCorrect = val === problem.answer;

        const newHistoryItem: HistoryItem = {
            id: crypto.randomUUID(),
            question: problem.question,
            userAnswer: userAnswer,
            correct: isCorrect,
            timestamp: Date.now(),
        };
        setHistory((prev) => [newHistoryItem, ...prev].slice(0, 10));

        if (isCorrect) {
            setFeedback('correct');
            setScore((s) => s + 1);
            setStreak((s) => {
                const newStreak = { ...s, [operation]: s[operation] + 1 };
                setHighScore((prevHigh) => Math.max(prevHigh, score + 1));
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
            setShake((prev) => prev + 1);

            saveStreak(operation, streak[operation]);

            setScore((s) => Math.max(0, s - 1));
            setStreak((s) => ({ ...s, [operation]: 0 }));

            setTimeout(() => {
                setFeedback(null);
                setUserAnswer('');
            }, 1000);
        }
    }, [problem, userAnswer, operation, score, streak, highScore, getNewProblem, saveStreak]);

    const resetGameStore = useCallback(() => {
        setHistory([]);
        // Save streaks for all active operations before reset
        (Object.keys(streak) as Operation[]).forEach(op => {
            if (streak[op] > 0) {
                saveStreak(op, streak[op]);
            }
        });

        setStreak({ add: 0, sub: 0, mul: 0, div: 0 });
        setScore(0);
        setFeedback(null);
        getNewProblem();
    }, [streak, saveStreak, getNewProblem]);


    return {
        operation,
        setOperation: handleOperationChange,
        problem,
        userAnswer,
        setUserAnswer,
        checkAnswer,
        score,
        streak,
        highScore,
        history,
        streakHistory,
        feedback,
        shake,
        minRange,
        setMinRange,
        maxRange,
        setMaxRange,
        resetGameStore,
        getNewProblem // exposed if needed
    };
};
