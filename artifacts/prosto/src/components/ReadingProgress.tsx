import { useScroll, motion, useSpring } from 'framer-motion';

export default function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[101] origin-left pointer-events-none"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, hsl(46,98%,30%), hsl(46,98%,50%), hsl(36,98%,60%))',
        boxShadow: '0 0 12px 2px rgba(245,200,0,0.75)',
      }}
    />
  );
}
