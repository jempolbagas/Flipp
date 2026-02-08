
import { motion } from 'framer-motion';

export const StatBox = ({ label, value, isStreak }: { label: string, value: number, isStreak?: boolean }) => (
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

export default StatBox;
