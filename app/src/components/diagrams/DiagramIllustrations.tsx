import React from 'react';
import { DiagramType } from '@/types';

interface DiagramIllustrationProps {
  type: DiagramType;
  className?: string;
}

export const DiagramIllustrations: React.FC<DiagramIllustrationProps> = ({ type, className = 'w-16 h-16' }) => {
  switch (type) {
    case 'swot':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          <defs>
            <linearGradient id="swotA" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#3b82f6"/>
            </linearGradient>
            <linearGradient id="swotB" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f472b6"/><stop offset="100%" stopColor="#ec4899"/>
            </linearGradient>
            <linearGradient id="swotC" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399"/><stop offset="100%" stopColor="#10b981"/>
            </linearGradient>
            <linearGradient id="swotD" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#f59e0b"/>
            </linearGradient>
            <filter id="swotShadow"><feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.18"/></filter>
          </defs>
          <rect x="10" y="10" width="36" height="36" rx="7" fill="url(#swotA)" filter="url(#swotShadow)"/>
          <rect x="54" y="10" width="36" height="36" rx="7" fill="url(#swotB)" filter="url(#swotShadow)"/>
          <rect x="10" y="54" width="36" height="36" rx="7" fill="url(#swotC)" filter="url(#swotShadow)"/>
          <rect x="54" y="54" width="36" height="36" rx="7" fill="url(#swotD)" filter="url(#swotShadow)"/>
          <rect x="10" y="10" width="36" height="36" rx="7" fill="white" opacity="0.15"/>
          <rect x="54" y="10" width="36" height="36" rx="7" fill="white" opacity="0.1"/>
          <text x="28" y="35" textAnchor="middle" fontSize="17" fill="white" fontWeight="800" opacity="0.95">S</text>
          <text x="72" y="35" textAnchor="middle" fontSize="17" fill="white" fontWeight="800" opacity="0.95">W</text>
          <text x="28" y="79" textAnchor="middle" fontSize="17" fill="white" fontWeight="800" opacity="0.95">O</text>
          <text x="72" y="79" textAnchor="middle" fontSize="17" fill="white" fontWeight="800" opacity="0.95">T</text>
          <line x1="49" y1="14" x2="49" y2="86" stroke="white" strokeWidth="2" opacity="0.35" strokeLinecap="round"/>
          <line x1="14" y1="49" x2="86" y2="49" stroke="white" strokeWidth="2" opacity="0.35" strokeLinecap="round"/>
          <circle cx="49" cy="49" r="4" fill="white" opacity="0.5"/>
        </svg>
      );
    case 'fishbone':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          <defs>
            <linearGradient id="fishSpine" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#5eead4" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#14b8a6"/>
            </linearGradient>
            <filter id="fishGlow"><feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#14b8a6" floodOpacity="0.35"/></filter>
          </defs>
          {/* Tail */}
          <path d="M8,50 Q14,42 16,50 Q14,58 8,50Z" fill="#5eead4" opacity="0.6"/>
          {/* Spine */}
          <line x1="16" y1="50" x2="76" y2="50" stroke="url(#fishSpine)" strokeWidth="3.5" strokeLinecap="round" filter="url(#fishGlow)"/>
          {/* Head */}
          <ellipse cx="82" cy="50" rx="10" ry="12" fill="#14b8a6" opacity="0.85"/>
          <ellipse cx="82" cy="50" rx="10" ry="12" fill="white" opacity="0.12"/>
          <circle cx="86" cy="47" r="2" fill="white" opacity="0.7"/>
          {/* Upper bones */}
          <line x1="30" y1="50" x2="20" y2="30" stroke="#2dd4bf" strokeWidth="2.2" strokeLinecap="round" opacity="0.85"/>
          <line x1="46" y1="50" x2="36" y2="26" stroke="#2dd4bf" strokeWidth="2.2" strokeLinecap="round" opacity="0.8"/>
          <line x1="62" y1="50" x2="54" y2="28" stroke="#2dd4bf" strokeWidth="2.2" strokeLinecap="round" opacity="0.75"/>
          {/* Sub-bones upper */}
          <line x1="25" y1="40" x2="18" y2="34" stroke="#99f6e4" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
          <line x1="41" y1="38" x2="34" y2="30" stroke="#99f6e4" strokeWidth="1.2" strokeLinecap="round" opacity="0.55"/>
          <line x1="58" y1="39" x2="52" y2="32" stroke="#99f6e4" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
          {/* Lower bones */}
          <line x1="30" y1="50" x2="20" y2="70" stroke="#2dd4bf" strokeWidth="2.2" strokeLinecap="round" opacity="0.75"/>
          <line x1="46" y1="50" x2="36" y2="74" stroke="#2dd4bf" strokeWidth="2.2" strokeLinecap="round" opacity="0.7"/>
          <line x1="62" y1="50" x2="54" y2="72" stroke="#2dd4bf" strokeWidth="2.2" strokeLinecap="round" opacity="0.65"/>
          {/* Sub-bones lower */}
          <line x1="25" y1="60" x2="18" y2="66" stroke="#99f6e4" strokeWidth="1.2" strokeLinecap="round" opacity="0.55"/>
          <line x1="41" y1="62" x2="34" y2="70" stroke="#99f6e4" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
          {/* Bone tips */}
          <circle cx="20" cy="30" r="3" fill="#5eead4" opacity="0.7"/>
          <circle cx="36" cy="26" r="3" fill="#5eead4" opacity="0.65"/>
          <circle cx="54" cy="28" r="3" fill="#5eead4" opacity="0.6"/>
          <circle cx="20" cy="70" r="3" fill="#5eead4" opacity="0.6"/>
          <circle cx="36" cy="74" r="3" fill="#5eead4" opacity="0.55"/>
          <circle cx="54" cy="72" r="3" fill="#5eead4" opacity="0.5"/>
        </svg>
      );
    case 'venn':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          <defs>
            <radialGradient id="vennL" cx="40%" cy="40%">
              <stop offset="0%" stopColor="#c084fc"/><stop offset="100%" stopColor="#8b5cf6"/>
            </radialGradient>
            <radialGradient id="vennR" cx="60%" cy="40%">
              <stop offset="0%" stopColor="#f9a8d4"/><stop offset="100%" stopColor="#ec4899"/>
            </radialGradient>
            <filter id="vennGlow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <circle cx="36" cy="50" r="26" fill="url(#vennL)" opacity="0.5" filter="url(#vennGlow)"/>
          <circle cx="64" cy="50" r="26" fill="url(#vennR)" opacity="0.5" filter="url(#vennGlow)"/>
          <circle cx="36" cy="50" r="26" stroke="#a78bfa" strokeWidth="2.5" fill="none" opacity="0.7"/>
          <circle cx="64" cy="50" r="26" stroke="#f472b6" strokeWidth="2.5" fill="none" opacity="0.7"/>
          {/* Intersection highlight */}
          <ellipse cx="50" cy="50" rx="12" ry="20" fill="white" opacity="0.25"/>
          <circle cx="50" cy="50" r="5" fill="white" opacity="0.5"/>
          {/* Sparkle dots */}
          <circle cx="24" cy="42" r="1.5" fill="white" opacity="0.6"/>
          <circle cx="76" cy="42" r="1.5" fill="white" opacity="0.6"/>
        </svg>
      );
    case 'mindmap':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          <defs>
            <radialGradient id="mindCenter" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#6ee7b7"/><stop offset="100%" stopColor="#10b981"/>
            </radialGradient>
            <filter id="mindGlow"><feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#10b981" floodOpacity="0.4"/></filter>
          </defs>
          {/* Curved branches */}
          <path d="M50,50 Q35,30 22,22" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" opacity="0.7" fill="none"/>
          <path d="M50,50 Q65,30 78,22" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" opacity="0.7" fill="none"/>
          <path d="M50,50 Q30,55 18,52" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" opacity="0.65" fill="none"/>
          <path d="M50,50 Q70,55 82,52" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" opacity="0.65" fill="none"/>
          <path d="M50,50 Q40,70 25,80" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" opacity="0.6" fill="none"/>
          <path d="M50,50 Q60,70 75,80" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" opacity="0.6" fill="none"/>
          {/* Sub-branches */}
          <line x1="22" y1="22" x2="12" y2="14" stroke="#a7f3d0" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
          <line x1="22" y1="22" x2="14" y2="28" stroke="#a7f3d0" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
          <line x1="78" y1="22" x2="88" y2="14" stroke="#a7f3d0" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
          <line x1="78" y1="22" x2="86" y2="28" stroke="#a7f3d0" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
          {/* Branch nodes */}
          <circle cx="22" cy="22" r="6" fill="#34d399" opacity="0.8"/>
          <circle cx="78" cy="22" r="6" fill="#34d399" opacity="0.75"/>
          <circle cx="18" cy="52" r="5" fill="#34d399" opacity="0.7"/>
          <circle cx="82" cy="52" r="5" fill="#34d399" opacity="0.65"/>
          <circle cx="25" cy="80" r="5" fill="#34d399" opacity="0.6"/>
          <circle cx="75" cy="80" r="5" fill="#34d399" opacity="0.55"/>
          {/* Sub-nodes */}
          <circle cx="12" cy="14" r="3" fill="#6ee7b7" opacity="0.5"/>
          <circle cx="14" cy="28" r="3" fill="#6ee7b7" opacity="0.45"/>
          <circle cx="88" cy="14" r="3" fill="#6ee7b7" opacity="0.5"/>
          <circle cx="86" cy="28" r="3" fill="#6ee7b7" opacity="0.45"/>
          {/* Center brain node */}
          <circle cx="50" cy="50" r="13" fill="url(#mindCenter)" filter="url(#mindGlow)"/>
          <circle cx="50" cy="50" r="13" fill="white" opacity="0.15"/>
          {/* Brain detail lines */}
          <path d="M44,47 Q50,42 56,47" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6"/>
          <path d="M44,53 Q50,48 56,53" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5"/>
          <line x1="50" y1="40" x2="50" y2="60" stroke="white" strokeWidth="1" opacity="0.3"/>
        </svg>
      );
    case 'flowchart':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          <defs>
            <linearGradient id="flowStart" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#f59e0b"/>
            </linearGradient>
            <linearGradient id="flowDec" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb923c"/><stop offset="100%" stopColor="#ea580c"/>
            </linearGradient>
            <linearGradient id="flowEnd" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fcd34d"/><stop offset="100%" stopColor="#d97706"/>
            </linearGradient>
            <filter id="flowSh"><feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodOpacity="0.2"/></filter>
          </defs>
          {/* Start rounded rect */}
          <rect x="28" y="8" width="44" height="18" rx="9" fill="url(#flowStart)" filter="url(#flowSh)"/>
          <rect x="28" y="8" width="44" height="18" rx="9" fill="white" opacity="0.15"/>
          {/* Arrow */}
          <line x1="50" y1="26" x2="50" y2="36" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
          <polygon points="50,38 46,33 54,33" fill="#fbbf24"/>
          {/* Process rect */}
          <rect x="30" y="38" width="40" height="16" rx="4" fill="url(#flowEnd)" filter="url(#flowSh)"/>
          <rect x="30" y="38" width="40" height="16" rx="4" fill="white" opacity="0.12"/>
          {/* Arrow */}
          <line x1="50" y1="54" x2="50" y2="62" stroke="#fb923c" strokeWidth="2" strokeLinecap="round"/>
          <polygon points="50,64 46,59 54,59" fill="#fb923c"/>
          {/* Decision diamond */}
          <polygon points="50,64 68,78 50,92 32,78" fill="url(#flowDec)" filter="url(#flowSh)"/>
          <polygon points="50,64 68,78 50,92 32,78" fill="white" opacity="0.1"/>
          {/* Side arrows */}
          <line x1="68" y1="78" x2="78" y2="78" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
          <polygon points="80,78 76,75 76,81" fill="#fb923c" opacity="0.7"/>
          <line x1="32" y1="78" x2="22" y2="78" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
          <polygon points="20,78 24,75 24,81" fill="#fbbf24" opacity="0.7"/>
          {/* Side boxes */}
          <rect x="80" y="72" width="14" height="12" rx="3" fill="url(#flowEnd)" opacity="0.7"/>
          <rect x="6" y="72" width="14" height="12" rx="3" fill="url(#flowStart)" opacity="0.7"/>
          {/* Labels */}
          <text x="50" y="20" textAnchor="middle" fontSize="6" fill="white" fontWeight="700">Start</text>
          <text x="50" y="49" textAnchor="middle" fontSize="5.5" fill="white" fontWeight="600">Process</text>
          <text x="50" y="80" textAnchor="middle" fontSize="4.5" fill="white" fontWeight="600">?</text>
        </svg>
      );
    case 'timeline':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          <defs>
            <linearGradient id="timeLine" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#fda4af"/><stop offset="50%" stopColor="#f43f5e"/><stop offset="100%" stopColor="#be123c"/>
            </linearGradient>
            <filter id="timeSh"><feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#f43f5e" floodOpacity="0.3"/></filter>
          </defs>
          {/* Main timeline line */}
          <line x1="10" y1="52" x2="90" y2="52" stroke="url(#timeLine)" strokeWidth="3" strokeLinecap="round" filter="url(#timeSh)"/>
          {/* Arrow tip */}
          <polygon points="90,52 85,48 85,56" fill="#be123c"/>
          {/* Event 1 - above */}
          <line x1="22" y1="52" x2="22" y2="34" stroke="#fda4af" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="22" cy="52" r="5" fill="#f43f5e" stroke="white" strokeWidth="2"/>
          <rect x="12" y="20" width="20" height="14" rx="4" fill="#f43f5e" opacity="0.8"/>
          <rect x="12" y="20" width="20" height="14" rx="4" fill="white" opacity="0.12"/>
          {/* Event 2 - below */}
          <line x1="42" y1="52" x2="42" y2="70" stroke="#fb7185" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="42" cy="52" r="5" fill="#fb7185" stroke="white" strokeWidth="2"/>
          <rect x="32" y="70" width="20" height="14" rx="4" fill="#fb7185" opacity="0.75"/>
          <rect x="32" y="70" width="20" height="14" rx="4" fill="white" opacity="0.1"/>
          {/* Event 3 - above */}
          <line x1="62" y1="52" x2="62" y2="34" stroke="#fda4af" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="62" cy="52" r="5" fill="#e11d48" stroke="white" strokeWidth="2"/>
          <rect x="52" y="20" width="20" height="14" rx="4" fill="#e11d48" opacity="0.7"/>
          <rect x="52" y="20" width="20" height="14" rx="4" fill="white" opacity="0.08"/>
          {/* Event 4 - below */}
          <line x1="80" y1="52" x2="80" y2="70" stroke="#fecdd3" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="80" cy="52" r="5" fill="#be123c" stroke="white" strokeWidth="2"/>
          <rect x="70" y="70" width="20" height="14" rx="4" fill="#be123c" opacity="0.65"/>
        </svg>
      );
    case 'pyramid':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          <defs>
            <linearGradient id="pyrTop" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#fde047"/><stop offset="100%" stopColor="#facc15"/>
            </linearGradient>
            <linearGradient id="pyrMid" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#f59e0b"/>
            </linearGradient>
            <linearGradient id="pyrBot" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#d97706"/>
            </linearGradient>
            <filter id="pyrSh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2"/></filter>
          </defs>
          {/* Top layer */}
          <polygon points="50,12 62,38 38,38" fill="url(#pyrTop)" filter="url(#pyrSh)"/>
          <polygon points="50,12 62,38 38,38" fill="white" opacity="0.2"/>
          {/* Middle layer */}
          <polygon points="38,40 62,40 72,60 28,60" fill="url(#pyrMid)" filter="url(#pyrSh)"/>
          <polygon points="38,40 62,40 72,60 28,60" fill="white" opacity="0.1"/>
          {/* Bottom layer */}
          <polygon points="28,62 72,62 84,86 16,86" fill="url(#pyrBot)" filter="url(#pyrSh)"/>
          <polygon points="28,62 72,62 84,86 16,86" fill="white" opacity="0.05"/>
          {/* Layer separations */}
          <line x1="38" y1="39" x2="62" y2="39" stroke="white" strokeWidth="1.5" opacity="0.5"/>
          <line x1="28" y1="61" x2="72" y2="61" stroke="white" strokeWidth="1.5" opacity="0.4"/>
          {/* Level indicators */}
          <circle cx="50" cy="26" r="3" fill="white" opacity="0.6"/>
          <circle cx="50" cy="50" r="3" fill="white" opacity="0.45"/>
          <circle cx="50" cy="74" r="3" fill="white" opacity="0.35"/>
        </svg>
      );
    case 'causeeffect':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          <defs>
            <linearGradient id="ceLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9"/><stop offset="100%" stopColor="#06b6d4"/>
            </linearGradient>
            <linearGradient id="ceRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8"/><stop offset="100%" stopColor="#0284c7"/>
            </linearGradient>
            <linearGradient id="ceArrow" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#06b6d4"/><stop offset="100%" stopColor="#0284c7"/>
            </linearGradient>
            <filter id="ceSh"><feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodOpacity="0.18"/></filter>
          </defs>
          {/* Grid lines background */}
          <line x1="14" y1="30" x2="40" y2="30" stroke="#67e8f9" strokeWidth="0.8" opacity="0.3"/>
          <line x1="14" y1="42" x2="40" y2="42" stroke="#67e8f9" strokeWidth="0.8" opacity="0.3"/>
          <line x1="14" y1="54" x2="40" y2="54" stroke="#67e8f9" strokeWidth="0.8" opacity="0.3"/>
          <line x1="14" y1="66" x2="40" y2="66" stroke="#67e8f9" strokeWidth="0.8" opacity="0.3"/>
          <line x1="60" y1="30" x2="86" y2="30" stroke="#38bdf8" strokeWidth="0.8" opacity="0.3"/>
          <line x1="60" y1="42" x2="86" y2="42" stroke="#38bdf8" strokeWidth="0.8" opacity="0.3"/>
          <line x1="60" y1="54" x2="86" y2="54" stroke="#38bdf8" strokeWidth="0.8" opacity="0.3"/>
          <line x1="60" y1="66" x2="86" y2="66" stroke="#38bdf8" strokeWidth="0.8" opacity="0.3"/>
          {/* Left matrix */}
          <rect x="10" y="20" width="34" height="56" rx="6" fill="url(#ceLeft)" opacity="0.85" filter="url(#ceSh)"/>
          <rect x="10" y="20" width="34" height="56" rx="6" fill="white" opacity="0.12"/>
          {/* Right matrix */}
          <rect x="56" y="20" width="34" height="56" rx="6" fill="url(#ceRight)" opacity="0.85" filter="url(#ceSh)"/>
          <rect x="56" y="20" width="34" height="56" rx="6" fill="white" opacity="0.1"/>
          {/* Arrows between */}
          <line x1="44" y1="38" x2="56" y2="38" stroke="url(#ceArrow)" strokeWidth="2" strokeLinecap="round"/>
          <polygon points="56,38 52,35 52,41" fill="#0284c7"/>
          <line x1="44" y1="50" x2="56" y2="50" stroke="url(#ceArrow)" strokeWidth="2.5" strokeLinecap="round"/>
          <polygon points="56,50 51,46 51,54" fill="#0284c7"/>
          <line x1="44" y1="62" x2="56" y2="62" stroke="url(#ceArrow)" strokeWidth="2" strokeLinecap="round"/>
          <polygon points="56,62 52,59 52,65" fill="#0284c7"/>
          {/* Row indicators left */}
          <rect x="16" y="33" width="22" height="4" rx="2" fill="white" opacity="0.35"/>
          <rect x="16" y="45" width="18" height="4" rx="2" fill="white" opacity="0.3"/>
          <rect x="16" y="57" width="20" height="4" rx="2" fill="white" opacity="0.25"/>
          {/* Row indicators right */}
          <rect x="62" y="33" width="22" height="4" rx="2" fill="white" opacity="0.35"/>
          <rect x="62" y="45" width="18" height="4" rx="2" fill="white" opacity="0.3"/>
          <rect x="62" y="57" width="20" height="4" rx="2" fill="white" opacity="0.25"/>
        </svg>
      );
    case 'conceptmap':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          <defs>
            <radialGradient id="cmCenter" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#a5b4fc"/><stop offset="100%" stopColor="#6366f1"/>
            </radialGradient>
            <radialGradient id="cmNode" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#c4b5fd"/><stop offset="100%" stopColor="#8b5cf6"/>
            </radialGradient>
            <filter id="cmGlow"><feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#6366f1" floodOpacity="0.3"/></filter>
          </defs>
          {/* Connection lines */}
          <path d="M50,50 Q35,30 24,22" stroke="#a5b4fc" strokeWidth="1.8" fill="none" opacity="0.6"/>
          <path d="M50,50 Q65,30 76,22" stroke="#a5b4fc" strokeWidth="1.8" fill="none" opacity="0.6"/>
          <path d="M50,50 Q35,65 20,72" stroke="#a5b4fc" strokeWidth="1.8" fill="none" opacity="0.55"/>
          <path d="M50,50 Q65,65 80,72" stroke="#a5b4fc" strokeWidth="1.8" fill="none" opacity="0.55"/>
          <line x1="50" y1="50" x2="50" y2="82" stroke="#a5b4fc" strokeWidth="1.8" opacity="0.5"/>
          {/* Label tags on lines */}
          <rect x="32" y="33" width="14" height="8" rx="3" fill="#818cf8" opacity="0.5"/>
          <rect x="54" y="33" width="14" height="8" rx="3" fill="#818cf8" opacity="0.45"/>
          {/* Outer nodes */}
          <circle cx="24" cy="22" r="8" fill="url(#cmNode)" opacity="0.8"/>
          <circle cx="76" cy="22" r="8" fill="url(#cmNode)" opacity="0.75"/>
          <circle cx="20" cy="72" r="7" fill="url(#cmNode)" opacity="0.7"/>
          <circle cx="80" cy="72" r="7" fill="url(#cmNode)" opacity="0.65"/>
          <circle cx="50" cy="82" r="7" fill="url(#cmNode)" opacity="0.6"/>
          {/* Node highlights */}
          <circle cx="22" cy="20" r="2.5" fill="white" opacity="0.35"/>
          <circle cx="74" cy="20" r="2.5" fill="white" opacity="0.3"/>
          {/* Center concept */}
          <circle cx="50" cy="50" r="14" fill="url(#cmCenter)" filter="url(#cmGlow)"/>
          <circle cx="50" cy="50" r="14" fill="white" opacity="0.15"/>
          <circle cx="46" cy="46" r="3" fill="white" opacity="0.3"/>
        </svg>
      );
    case 'tchart':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          <defs>
            <linearGradient id="tcLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e879f9"/><stop offset="100%" stopColor="#c026d3"/>
            </linearGradient>
            <linearGradient id="tcRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d946ef"/><stop offset="100%" stopColor="#a21caf"/>
            </linearGradient>
            <filter id="tcSh"><feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.18"/></filter>
          </defs>
          {/* Background panels */}
          <rect x="10" y="18" width="35" height="70" rx="8" fill="url(#tcLeft)" opacity="0.2"/>
          <rect x="55" y="18" width="35" height="70" rx="8" fill="url(#tcRight)" opacity="0.2"/>
          {/* T structure */}
          <line x1="50" y1="18" x2="50" y2="88" stroke="#d946ef" strokeWidth="3" strokeLinecap="round" filter="url(#tcSh)"/>
          <line x1="16" y1="18" x2="84" y2="18" stroke="#e879f9" strokeWidth="3" strokeLinecap="round" filter="url(#tcSh)"/>
          {/* Left items */}
          <rect x="18" y="30" width="24" height="6" rx="3" fill="#e879f9" opacity="0.6"/>
          <rect x="18" y="42" width="20" height="6" rx="3" fill="#e879f9" opacity="0.5"/>
          <rect x="18" y="54" width="22" height="6" rx="3" fill="#e879f9" opacity="0.4"/>
          <rect x="18" y="66" width="18" height="6" rx="3" fill="#e879f9" opacity="0.3"/>
          {/* Right items */}
          <rect x="58" y="30" width="24" height="6" rx="3" fill="#d946ef" opacity="0.6"/>
          <rect x="58" y="42" width="20" height="6" rx="3" fill="#d946ef" opacity="0.5"/>
          <rect x="58" y="54" width="22" height="6" rx="3" fill="#d946ef" opacity="0.4"/>
          <rect x="58" y="66" width="18" height="6" rx="3" fill="#d946ef" opacity="0.3"/>
          {/* Corner accent dots */}
          <circle cx="50" cy="18" r="4" fill="#d946ef" opacity="0.8"/>
          <circle cx="50" cy="18" r="4" fill="white" opacity="0.2"/>
        </svg>
      );
    default:
      return null;
  }
};

