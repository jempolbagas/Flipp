import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmojiParticle {
    id: string;
    emoji: string;
    x: number;
    delay: number;
}

interface EmojiBurstProps {
    trigger: number; // Increment this to trigger a burst
    intensity?: 'normal' | 'celebration'; // celebration = more emojis for milestones
}

const EMOJIS = ['⭐', '🔥', '💯', '🚀', '✨', '🎯', '💪', '🌟'];

const EmojiBurst: React.FC<EmojiBurstProps> = ({ trigger, intensity = 'normal' }) => {
    const [particles, setParticles] = useState<EmojiParticle[]>([]);

    useEffect(() => {
        if (trigger === 0) return;

        const count = intensity === 'celebration' ? 8 : 4;
        const newParticles: EmojiParticle[] = [];

        for (let i = 0; i < count; i++) {
            newParticles.push({
                id: `${trigger}-${i}`,
                emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
                x: Math.random() * 200 - 100, // Random horizontal spread (-100 to 100)
                delay: Math.random() * 0.2, // Staggered start
            });
        }

        setParticles(newParticles);

        // Clean up particles after animation
        const timer = setTimeout(() => {
            setParticles([]);
        }, 1500);

        return () => clearTimeout(timer);
    }, [trigger, intensity]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <AnimatePresence>
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        initial={{
                            opacity: 1,
                            y: 0,
                            x: particle.x,
                            scale: 0.5,
                        }}
                        animate={{
                            opacity: 0,
                            y: -150,
                            scale: 1.2,
                            rotate: Math.random() > 0.5 ? 20 : -20,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 1.2,
                            delay: particle.delay,
                            ease: 'easeOut',
                        }}
                        className="absolute left-1/2 bottom-1/3 text-3xl"
                        style={{
                            marginLeft: particle.x,
                        }}
                    >
                        {particle.emoji}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default EmojiBurst;
