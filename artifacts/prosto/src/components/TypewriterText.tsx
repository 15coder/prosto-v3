import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  cursorClassName?: string;
}

export default function TypewriterText({
  text,
  delay = 0,
  speed = 90,
  className = '',
  cursorClassName = '',
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(delay === 0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (delay === 0) return;
    const t = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started || done) return;
    if (displayed.length >= text.length) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(t);
  }, [displayed, started, done, text, speed]);

  return (
    <span className={className} aria-label={text}>
      {displayed}
      {!done && (
        <span
          className={`inline-block w-[2px] h-[0.85em] bg-primary align-middle mr-0.5 animate-pulse rounded-full ${cursorClassName}`}
        />
      )}
    </span>
  );
}
