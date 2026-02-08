import React from 'react';
import { motion } from 'framer-motion';
import { Operation } from '../utils/mathLogic';
import { cn } from '../utils/cn';

interface GameControlsProps {
    operation: Operation;
    onOperationChange: (op: Operation) => void;
}

const GameControls: React.FC<GameControlsProps> = ({ operation, onOperationChange }) => {
    const buttonTap = { scale: 0.9, transition: { type: "spring" as const, stiffness: 400, damping: 10 } };
    const operations: Operation[] = ['add', 'sub', 'mul', 'div'];

    return (
        <div className="flex space-x-3 bg-violet-50 p-2 rounded-2xl">
            {operations.map(op => (
                <motion.button
                    key={op}
                    whileTap={buttonTap}
                    onClick={() => onOperationChange(op)}
                    className={cn(
                        "w-14 h-14 md:w-12 md:h-12 rounded-xl text-2xl font-bold flex items-center justify-center transition-all shadow-sm",
                        operation === op
                            ? "bg-violet-500 text-white shadow-violet-200 shadow-md transform scale-105"
                            : "bg-white text-violet-300 hover:bg-violet-100"
                    )}
                >
                    {op === 'add' ? '+' : op === 'sub' ? '−' : op === 'mul' ? '×' : '÷'}
                </motion.button>
            ))}
        </div>
    );
};

export default GameControls;
