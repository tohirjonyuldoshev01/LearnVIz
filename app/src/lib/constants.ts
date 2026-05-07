import { DiagramType, DiagramTemplate } from '@/types';

export const DIAGRAM_TEMPLATES: Record<DiagramType, DiagramTemplate> = {
  swot: {
    id: 'swot',
    type: 'swot',
    name: 'SWOT Analysis',
    description: 'Analyze Strengths, Weaknesses, Opportunities, and Threats',
    sections: ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'],
    icon: '📊',
  },
  fishbone: {
    id: 'fishbone',
    type: 'fishbone',
    name: 'Fishbone Diagram',
    description: 'Cause and Effect Analysis',
    sections: ['Problem', 'People', 'Process', 'Materials', 'Environment', 'Methods'],
    icon: '🐟',
  },
  venn: {
    id: 'venn',
    type: 'venn',
    name: 'Venn Diagram',
    description: 'Compare similarities and differences',
    sections: ['Set A', 'Common', 'Set B'],
    icon: '🔵',
  },
  mindmap: {
    id: 'mindmap',
    type: 'mindmap',
    name: 'Mind Map',
    description: 'Hierarchical idea organization',
    sections: ['Central Idea', 'Main Branches', 'Sub-branches'],
    icon: '🧠',
  },
  flowchart: {
    id: 'flowchart',
    type: 'flowchart',
    name: 'Flowchart',
    description: 'Process and workflow visualization',
    sections: ['Start', 'Process', 'Decision', 'Output', 'End'],
    icon: '⬜',
  },
  timeline: {
    id: 'timeline',
    type: 'timeline',
    name: 'Timeline',
    description: 'Historical events and chronological sequences',
    sections: ['Past', 'Present', 'Future'],
    icon: '📅',
  },
  pyramid: {
    id: 'pyramid',
    type: 'pyramid',
    name: 'Pyramid Diagram',
    description: 'Hierarchical levels and priorities',
    sections: ['Top', 'Upper-Middle', 'Middle', 'Lower-Middle', 'Base'],
    icon: '🔺',
  },
  causeeffect: {
    id: 'causeeffect',
    type: 'causeeffect',
    name: 'Cause-Effect Matrix',
    description: 'Relationship matrix between causes and effects',
    sections: ['Causes', 'Effects', 'Correlation'],
    icon: '📈',
  },
  conceptmap: {
    id: 'conceptmap',
    type: 'conceptmap',
    name: 'Concept Map',
    description: 'Knowledge and relationship mapping',
    sections: ['Concept 1', 'Relationship', 'Concept 2'],
    icon: '🗺️',
  },
  tchart: {
    id: 'tchart',
    type: 'tchart',
    name: 'T-Chart',
    description: 'Compare two sides of a topic',
    sections: ['Left', 'Right'],
    icon: '📋',
  },
};

export const EDUCATION_LEVELS = [
  { value: 'primary', label: 'Primary School' },
  { value: 'middle', label: 'Middle School' },
  { value: 'high', label: 'High School' },
  { value: 'college', label: 'College/University' },
];

export const LANGUAGES = [
  { value: 'English', label: 'English' },
  { value: 'Uzbek', label: 'Oʻzbekcha' },
];

export const DIAGRAM_COLORS = {
  primary: '#3B82F6',
  secondary: '#1E40AF',
  accent: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
};
