import { Operation } from './utils/mathLogic';

export interface StreakRecord {
    id: string;
    timestamp: number;
    value: number;
    operation: Operation;
    range: { min: number, max: number };
}

export interface HistoryItem {
    id: string;
    question: string;
    userAnswer: string;
    correct: boolean;
    timestamp: number;
}
