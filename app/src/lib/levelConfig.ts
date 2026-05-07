export type EducationLevel = 'primary' | 'middle' | 'high' | 'college';

export interface LevelConfig {
  key: EducationLevel;
  maxElements: number;
  showHints: boolean;
  showTooltips: boolean;
  showExamples: boolean;
  useEmojis: boolean;
  aiFeedbackStrength: 'gentle' | 'moderate' | 'strong' | 'full';
  colors: {
    primary: string;
    gradient: string;
    bg: string;
    border: string;
    icon: string;
  };
  ui: {
    fontSize: 'text-lg' | 'text-base' | 'text-sm' | 'text-sm';
    buttonSize: 'lg' | 'lg' | 'md' | 'md';
    padding: string;
    borderRadius: string;
  };
}

export const levelConfig: Record<EducationLevel, LevelConfig> = {
  primary: {
    key: 'primary',
    maxElements: 3,
    showHints: true,
    showTooltips: true,
    showExamples: true,
    useEmojis: true,
    aiFeedbackStrength: 'gentle',
    colors: {
      primary: '#F59E0B',
      gradient: 'from-yellow-400 via-orange-400 to-pink-400',
      bg: 'bg-yellow-50 dark:bg-yellow-950/30',
      border: 'border-yellow-300 dark:border-yellow-700',
      icon: '🌟',
    },
    ui: {
      fontSize: 'text-lg',
      buttonSize: 'lg',
      padding: 'p-6',
      borderRadius: 'rounded-3xl',
    },
  },
  middle: {
    key: 'middle',
    maxElements: 5,
    showHints: true,
    showTooltips: true,
    showExamples: false,
    useEmojis: true,
    aiFeedbackStrength: 'moderate',
    colors: {
      primary: '#3B82F6',
      gradient: 'from-blue-400 via-cyan-400 to-teal-400',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-300 dark:border-blue-700',
      icon: '📘',
    },
    ui: {
      fontSize: 'text-base',
      buttonSize: 'lg',
      padding: 'p-5',
      borderRadius: 'rounded-2xl',
    },
  },
  high: {
    key: 'high',
    maxElements: 8,
    showHints: false,
    showTooltips: false,
    showExamples: false,
    useEmojis: false,
    aiFeedbackStrength: 'strong',
    colors: {
      primary: '#8B5CF6',
      gradient: 'from-purple-500 via-violet-500 to-indigo-500',
      bg: 'bg-purple-50 dark:bg-purple-950/30',
      border: 'border-purple-300 dark:border-purple-700',
      icon: '🎓',
    },
    ui: {
      fontSize: 'text-sm',
      buttonSize: 'md',
      padding: 'p-4',
      borderRadius: 'rounded-xl',
    },
  },
  college: {
    key: 'college',
    maxElements: Infinity,
    showHints: false,
    showTooltips: false,
    showExamples: false,
    useEmojis: false,
    aiFeedbackStrength: 'full',
    colors: {
      primary: '#059669',
      gradient: 'from-emerald-500 via-green-500 to-teal-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-300 dark:border-emerald-700',
      icon: '🏛️',
    },
    ui: {
      fontSize: 'text-sm',
      buttonSize: 'md',
      padding: 'p-4',
      borderRadius: 'rounded-xl',
    },
  },
};

export const getLevelConfig = (level: EducationLevel): LevelConfig => {
  return levelConfig[level] || levelConfig.high;
};
