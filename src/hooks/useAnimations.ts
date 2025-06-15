
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const useAnimations = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Fade in animation for cards
    const cards = containerRef.current.querySelectorAll('.post-card');
    gsap.fromTo(cards, 
      { 
        opacity: 0, 
        y: 50,
        scale: 0.9
      }, 
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      }
    );

    // Animate buttons on hover
    const buttons = containerRef.current.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        gsap.to(button, { scale: 1.05, duration: 0.2, ease: "power2.out" });
      });
      
      button.addEventListener('mouseleave', () => {
        gsap.to(button, { scale: 1, duration: 0.2, ease: "power2.out" });
      });
    });

    // Cleanup
    return () => {
      buttons.forEach(button => {
        button.removeEventListener('mouseenter', () => {});
        button.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  return { containerRef };
};
