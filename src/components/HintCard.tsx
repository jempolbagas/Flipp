import React from 'react';
import { motion } from 'framer-motion';
import { HintData } from '../utils/mathHints';

interface HintCardProps {
    hintData: HintData | null;
    onClose: () => void;
}

const HintCard: React.FC<HintCardProps> = ({ hintData, onClose }) => {
    if (!hintData) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-white rounded-2xl p-6 shadow-xl border-2 border-violet-100 mt-4 relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-400 to-pink-400" />

            <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-black text-violet-600 uppercase tracking-wider">
                    💡 Try this first!
                </h4>
                <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                    ✕
                </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 mb-4 text-center border border-slate-100">
                <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Example Problem</span>
                <div className="text-2xl font-black text-slate-700">
                    {hintData.exampleProblem.question} = <span className="text-emerald-500">{hintData.exampleProblem.answer}</span>
                </div>
            </div>

            <div className="space-y-2">
                {hintData.steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-3 text-sm text-slate-600 leading-relaxed"
                    >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-100 text-violet-600 font-bold flex items-center justify-center text-xs">
                            {index + 1}
                        </span>
                        <span dangerouslySetInnerHTML={{ __html: step }} />
                    </motion.div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400 font-medium italic">
                    Now try applying this logic to your problem!
                </p>
            </div>
        </motion.div>
    );
};

export default HintCard;
