import React, { useState, useEffect, useRef } from 'react';

/**
 * SplineBackground - Renders Spline 3D scene as hero background
 * Features:
 * - Lazy loads Spline viewer script
 * - Fallback gradient if loading fails (4s timeout)
 * - Interactive - allows mouse/touch drag
 * - Mobile-friendly
 */
const SplineBackground = ({ enableSpline = true }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const containerRef = useRef(null);
    const scriptLoadedRef = useRef(false);

    const SPLINE_URL = "https://prod.spline.design/zC1XMANhXvIYYWE3/scene.splinecode";
    const SCRIPT_URL = "https://unpkg.com/@splinetool/viewer@1.12.39/build/spline-viewer.js";
    const LOAD_TIMEOUT = 4000;

    useEffect(() => {
        if (!enableSpline) {
            setHasError(true);
            return;
        }

        const timeoutId = setTimeout(() => {
            if (!isLoaded) {
                console.warn('Spline loading timeout - using fallback');
                setHasError(true);
            }
        }, LOAD_TIMEOUT);

        if (!scriptLoadedRef.current && !document.querySelector(`script[src="${SCRIPT_URL}"]`)) {
            const script = document.createElement('script');
            script.type = 'module';
            script.src = SCRIPT_URL;
            script.async = true;

            script.onload = () => {
                scriptLoadedRef.current = true;
                setTimeout(() => {
                    setIsLoaded(true);
                    clearTimeout(timeoutId);
                }, 500);
            };

            script.onerror = () => {
                console.error('Failed to load Spline viewer script');
                setHasError(true);
                clearTimeout(timeoutId);
            };

            document.head.appendChild(script);
        } else if (document.querySelector(`script[src="${SCRIPT_URL}"]`)) {
            scriptLoadedRef.current = true;
            setTimeout(() => {
                setIsLoaded(true);
                clearTimeout(timeoutId);
            }, 500);
        }

        return () => {
            clearTimeout(timeoutId);
        };
    }, [enableSpline, isLoaded]);

    // Fallback gradient background
    if (hasError || !enableSpline) {
        return (
            <div
                className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black"
                aria-hidden="true"
            />
        );
    }

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-0 overflow-hidden"
            aria-hidden="true"
        >
            <spline-viewer
                url={SPLINE_URL}
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'block'
                }}
            />
        </div>
    );
};

export default SplineBackground;
