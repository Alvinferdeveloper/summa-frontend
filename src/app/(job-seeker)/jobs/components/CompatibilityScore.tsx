
'use client';

import { motion } from 'framer-motion';

interface CompatibilityScoreProps {
  score: number;
  size?: number;
}

export default function CompatibilityScore({ score, size = 60 }: CompatibilityScoreProps) {
  const radius = (size / 2) - 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let color = '#FF4136';
  if (score >= 75) {
    color = '#2ECC40';
  } else if (score >= 40) {
    color = '#FFDC00';
  }

  return (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
      <svg className="absolute" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          stroke="#e6e6e6"
          fill="transparent"
          strokeWidth="4"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          stroke={color}
          fill="transparent"
          strokeWidth="4"
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          strokeDasharray={`${circumference} ${circumference}`}
        />
      </svg>
      <span className="font-bold text-lg">{Math.round(score)}%</span>
    </div>
  );
}
