import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SettingInput from './SettingInput';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    minRange: number;
    setMinRange: (val: number) => void;
    maxRange: number;
    setMaxRange: (val: number) => void;
    onApply: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    minRange,
    setMinRange,
    maxRange,
    setMaxRange,
    onApply,
}) => {
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
                        className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-2xl"
                    >
                        <h3 className="text-2xl font-bold text-violet-900 mb-6 text-center">Settings</h3>

                        <div className="space-y-4 mb-8">
                            <SettingInput label="Min Number" value={minRange} onChange={setMinRange} />
                            <SettingInput label="Max Number" value={maxRange} onChange={setMaxRange} />
                        </div>

                        <motion.button
                            whileTap={buttonTap}
                            onClick={onApply}
                            className="w-full bg-violet-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-violet-600"
                        >
                            Done
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SettingsModal;
