'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const posRef = useRef({ x: 0, y: 0 });
    const targetRef = useRef({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check for touch device
        if ('ontouchstart' in window) return;

        const handleMouseMove = (e: MouseEvent) => {
            targetRef.current = { x: e.clientX, y: e.clientY };
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);
        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        // Detect hoverable elements
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isHoverable = target.matches('a, button, input, [role="button"], .hoverable');
            setIsHovering(isHoverable);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseover', handleMouseOver);

        // Animation loop with lerp
        let rafId: number;
        const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

        const animate = () => {
            posRef.current.x = lerp(posRef.current.x, targetRef.current.x, 0.15);
            posRef.current.y = lerp(posRef.current.y, targetRef.current.y, 0.15);

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
            }
            if (glowRef.current) {
                // Slower lerp for glow trail effect
                const glowX = lerp(posRef.current.x, targetRef.current.x, 0.08);
                const glowY = lerp(posRef.current.y, targetRef.current.y, 0.08);
                glowRef.current.style.transform = `translate(${glowX}px, ${glowY}px)`;
            }

            rafId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseover', handleMouseOver);
            cancelAnimationFrame(rafId);
        };
    }, [isVisible]);

    // Don't render on touch devices
    if (typeof window !== 'undefined' && 'ontouchstart' in window) {
        return null;
    }

    return (
        <>
            {/* Glow trail */}
            <div
                ref={glowRef}
                className="custom-cursor-glow"
                style={{
                    opacity: isVisible ? 0.4 : 0,
                }}
            />
            {/* Main cursor */}
            <div
                ref={cursorRef}
                className={`custom-cursor ${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''}`}
                style={{
                    opacity: isVisible ? 1 : 0,
                }}
            />
        </>
    );
}
