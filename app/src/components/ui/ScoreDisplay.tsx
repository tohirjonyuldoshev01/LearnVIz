import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { AnimatedCard } from './AnimatedCard';
import { useLanguage } from '@/context/LanguageContext';

interface ScoreDisplayProps {
  score: number;
  maxScore?: number;
  strengths?: string[];
  improvements?: string[];
  suggestions?: string[];
  messageText?: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  maxScore = 100,
  strengths = [],
  improvements = [],
  suggestions = [],
  messageText,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    let animationFrame: number;
    let currentVal = 0;

    const animate = () => {
      currentVal += (score - currentVal) * 0.05;
      setAnimatedScore(Math.floor(currentVal));
      if (Math.abs(currentVal - score) > 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setAnimatedScore(score);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [score]);

  const percentage = (animatedScore / maxScore) * 100;
  const isHighScore = percentage >= 75;
  const isGoodScore = percentage >= 50;

  const circleRadius = 70;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getScoreColor = () => {
    if (isHighScore) return '#DD7BDF';
    if (isGoodScore) return '#FFF58A';
    return '#FFBBE1';
  };

  const getScoreLabel = () => {
    if (isHighScore) return t.score.excellent;
    if (isGoodScore) return t.score.good;
    return t.score.goodStart;
  };

  return (
    <div className="w-full space-y-8">
      {/* Main Score Circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex justify-center"
      >
        <div className="relative w-64 h-64">
          <svg
            className="w-full h-full"
            viewBox="0 0 200 200"
            style={{ transform: 'rotate(-90deg)' }}
          >
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r={circleRadius}
              fill="none"
              stroke="#B3BFFF"
              strokeWidth="8"
              className="dark:stroke-pastel-blue/60"
            />

            {/* Progress circle */}
            <motion.circle
              cx="100"
              cy="100"
              r={circleRadius}
              fill="none"
              stroke={getScoreColor()}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '100px 100px' }}
            />
          </svg>

          {/* Score Text */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className="text-5xl font-bold text-gray-900 dark:text-gray-50">
              {animatedScore}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              / {maxScore}
            </span>
            <span className="text-lg font-semibold mt-4 text-center" style={{ color: getScoreColor() }}>
              {getScoreLabel()}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {messageText && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-center text-gray-600 dark:text-gray-400 text-lg"
        >
          {messageText}
        </motion.p>
      )}

      {/* Feedback Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Strengths */}
        {strengths.length > 0 && (
          <AnimatedCard variant="default" delay={0.6}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-pastel-purple" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                  {t.score.strengths}
                </h3>
              </div>
              <ul className="space-y-2">
                {strengths.map((strength, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-pastel-yellow mt-1.5 flex-shrink-0" />
                    <span>{strength}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </AnimatedCard>
        )}

        {/* Improvements */}
        {improvements.length > 0 && (
          <AnimatedCard variant="default" delay={0.7}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-pastel-purple" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                  {t.score.improvements}
                </h3>
              </div>
              <ul className="space-y-2">
                {improvements.map((improvement, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-pastel-pink mt-1.5 flex-shrink-0" />
                    <span>{improvement}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </AnimatedCard>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <AnimatedCard variant="default" delay={0.8}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-6 h-6 text-pastel-purple" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                  {t.score.suggestions}
                </h3>
              </div>
              <ul className="space-y-2">
                {suggestions.map((suggestion, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                    className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-pastel-blue mt-1.5 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </AnimatedCard>
        )}
      </div>
    </div>
  );
};

export default ScoreDisplay;
