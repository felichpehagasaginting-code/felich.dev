'use client';

import { useState, useEffect, useCallback } from 'react';

interface TypingAnimationProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export default function TypingAnimation({
  texts,
  typingSpeed = 80,
  deletingSpeed = 50,
  pauseDuration = 2000,
  className = '',
}: TypingAnimationProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const animate = useCallback(() => {
    const currentFullText = texts[currentTextIndex];

    if (!isDeleting) {
      if (displayText.length < currentFullText.length) {
        return setTimeout(() => {
          setDisplayText(currentFullText.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        return setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      if (displayText.length > 0) {
        return setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        return undefined;
      }
    }
  }, [currentTextIndex, displayText, isDeleting, texts, typingSpeed, deletingSpeed, pauseDuration]);

  useEffect(() => {
    const timeout = animate();
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [animate]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse text-primary">|</span>
    </span>
  );
}
