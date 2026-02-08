
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Hook to detect mobile devices
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia('(max-width: 768px)').matches);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
}

// Interactive Background Component
export default function BackgroundBlob() {
    const isMobile = useIsMobile();
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animation for the blob
    const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    useEffect(() => {
        // Skip mouse tracking on mobile
        if (isMobile) return;

        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY, isMobile]);

    // Don't render on mobile - saves GPU/CPU resources
    if (isMobile) {
        return null;
    }

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
