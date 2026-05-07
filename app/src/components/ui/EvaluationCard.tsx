'use client';

import React from 'react';
import { EvaluationResponse } from '@/types';
import Card from './Card';

// Localized labels for evaluation sections
const LABELS = {
  en: {
    evaluationScore: 'EVALUATION SCORE',
    outOf: 'out of 100',
    scoreBreakdown: 'Score Breakdown',
    structure: 'Structure (20%)',
    contentQuality: 'Content Quality (30%)',
    relevance: 'Relevance (20%)',
    criticalThinking: 'Critical Thinking (20%)',
    clarity: 'Clarity (10%)',
    strengths: '✓ Strengths',
    improvements: '⚠ Areas for Improvement',
    suggestions: '💡 Suggestions',
  },
  uz: {
    evaluationScore: 'BAHOLASH NATIJASI',
    outOf: '100 dan',
    scoreBreakdown: 'Ballar taqsimoti',
    structure: 'Tuzilma (20%)',
    contentQuality: 'Kontent sifati (30%)',
    relevance: 'Mavzuga mosligi (20%)',
    criticalThinking: 'Tanqidiy fikrlash (20%)',
    clarity: 'Tushunarlilik (10%)',
    strengths: '✓ Kuchli tomonlar',
    improvements: '⚠ Yaxshilash kerak',
    suggestions: '💡 Tavsiyalar',
  },
};

interface EvaluationCardProps {
  evaluation: EvaluationResponse;
}

export const EvaluationCard: React.FC<EvaluationCardProps> = ({ evaluation }) => {
  const lang = evaluation.detectedLanguage || 'en';
  const l = LABELS[lang] || LABELS.en;
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-pastel-purple';
    if (score >= 75) return 'text-gray-800';
    if (score >= 65) return 'text-pastel-purple';
    return 'text-pastel-purple';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return 'bg-pastel-yellow/55 border-pastel-yellow';
    if (score >= 75) return 'bg-pastel-blue/35 border-pastel-blue';
    if (score >= 65) return 'bg-pastel-pink/45 border-pastel-pink';
    return 'bg-pastel-pink/45 border-pastel-purple/50';
  };

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <Card
        className={`border-2 p-6 text-center ${getScoreBgColor(evaluation.total_score)}`}
      >
        <p className="text-sm font-semibold text-gray-600 mb-2">{l.evaluationScore}</p>
        <p className={`text-5xl font-bold ${getScoreColor(evaluation.total_score)}`}>
          {evaluation.total_score}
        </p>
        <p className="text-sm text-gray-600 mt-2">{l.outOf}</p>
      </Card>

      {/* Score Breakdown */}
      <Card>
        <h3 className="text-lg font-bold mb-4">{l.scoreBreakdown}</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold">{l.structure}</span>
              <span className="font-bold">{evaluation.breakdown.structure}/20</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-pastel-blue h-2 rounded-full"
                style={{ width: `${(evaluation.breakdown.structure / 20) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold">{l.contentQuality}</span>
              <span className="font-bold">{evaluation.breakdown.content_quality}/30</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-pastel-yellow h-2 rounded-full"
                style={{ width: `${(evaluation.breakdown.content_quality / 30) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold">{l.relevance}</span>
              <span className="font-bold">{evaluation.breakdown.relevance}/20</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-pastel-purple h-2 rounded-full"
                style={{ width: `${(evaluation.breakdown.relevance / 20) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold">{l.criticalThinking}</span>
              <span className="font-bold">{evaluation.breakdown.critical_thinking}/20</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-pastel-pink h-2 rounded-full"
                style={{
                  width: `${(evaluation.breakdown.critical_thinking / 20) * 100}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold">{l.clarity}</span>
              <span className="font-bold">{evaluation.breakdown.clarity}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-pastel-purple h-2 rounded-full"
                style={{ width: `${(evaluation.breakdown.clarity / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Strengths */}
      <Card className="bg-pastel-yellow/50 border-l-4 border-pastel-yellow">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{l.strengths}</h3>
        <p className="text-gray-700 text-sm">{evaluation.strengths}</p>
      </Card>

      {/* Areas for Improvement */}
      <Card className="bg-pastel-pink/45 border-l-4 border-pastel-purple">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{l.improvements}</h3>
        <p className="text-gray-700 text-sm">{evaluation.improvements}</p>
      </Card>

      {/* Suggestions */}
      <Card className="bg-pastel-blue/35 border-l-4 border-pastel-blue">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{l.suggestions}</h3>
        <p className="text-gray-700 text-sm">{evaluation.suggestions}</p>
      </Card>
    </div>
  );
};
