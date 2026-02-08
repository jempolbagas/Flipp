import { useCallback } from 'react';

/**
 * Custom hook for haptic feedback using the Vibration API.
 * Falls back gracefully on unsupported devices.
 */
export const useHaptics = () => {
    const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

    const vibrate = useCallback((pattern: number | number[]) => {
        if (isSupported) {
            navigator.vibrate(pattern);
        }
    }, [isSupported]);

    /** Short pulse for successful actions */
    const vibrateSuccess = useCallback(() => {
        vibrate(50);
    }, [vibrate]);

    /** Double buzz for errors */
    const vibrateError = useCallback(() => {
        vibrate([50, 50, 50]);
    }, [vibrate]);

    /** Light tap for button presses */
    const vibrateTap = useCallback(() => {
        vibrate(10);
    }, [vibrate]);

    /** Strong pulse for milestone celebrations */
    const vibrateCelebration = useCallback(() => {
        vibrate([50, 30, 50, 30, 100]);
    }, [vibrate]);

    return {
        isSupported,
        vibrateSuccess,
        vibrateError,
        vibrateTap,
        vibrateCelebration,
    };
};
