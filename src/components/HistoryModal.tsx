import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { StreakRecord, HistoryItem } from '../types';

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: HistoryItem[];
    streakHistory: StreakRecord[];
}

const HistoryModal: React.FC<HistoryModalProps> = ({
    isOpen,
    onClose,
    history,
    streakHistory,
}) => {
    const [activeTab, setActiveTab] = useState<'problems' | 'streaks'>('problems');

    const buttonTap = { scale: 0.9, transition: { type: "spring" as const, stiffness: 400, damping: 10 } };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
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
                                onClick={() => setActiveTab('problems')}
                                className={cn(
                                    "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                                    activeTab === 'problems' ? "bg-white text-violet-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                Context
                            </button>
                            <button
                                onClick={() => setActiveTab('streaks')}
                                className={cn(
                                    "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                                    activeTab === 'streaks' ? "bg-white text-violet-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                Streaks
                            </button>
                        </div>

                        <div className="space-y-3 mb-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
                            {activeTab === 'problems' ? (
                                history.length === 0 ? (
                                    <div className="text-center text-slate-400 py-4 font-medium">No attempts yet!</div>
                                ) : (
                                    history.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
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
                            onClick={onClose}
                            className="w-full bg-violet-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-violet-600 shrink-0"
                        >
                            Close
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default HistoryModal;
