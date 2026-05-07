// Type definitions for the application

export interface User {
  id: string;
  email: string;
  displayName: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export type DiagramType = 
  | 'swot'
  | 'fishbone'
  | 'venn'
  | 'mindmap'
  | 'flowchart'
  | 'timeline'
  | 'pyramid'
  | 'causeeffect'
  | 'conceptmap'
  | 'tchart';

export interface DiagramContent {
  [key: string]: string | string[];
}

export interface Diagram {
  id: string;
  title: string;
  type: DiagramType;
  topic: string;
  content: DiagramContent;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  tags?: string[];
  description?: string;
  evaluation?: EvaluationResponse;
  evaluatedAt?: string;
}

export interface DiagramTemplate {
  id: string;
  type: DiagramType;
  name: string;
  description: string;
  sections: string[];
  icon: string;
}

export type EducationLevel = 'primary' | 'middle' | 'high' | 'college';

export interface ScoreBreakdown {
  structure: number;
  content_quality: number;
  relevance: number;
  critical_thinking: number;
  clarity: number;
}

export interface EvaluationResponse {
  success: boolean;
  total_score: number;
  breakdown: ScoreBreakdown;
  strengths: string;
  improvements: string;
  suggestions: string;
  detectedLanguage?: 'uz' | 'en';
  error?: string;
}

export interface DiagramSubmission {
  id: string;
  diagramId: string;
  submittedBy: string;
  submittedAt: string;
  content: DiagramContent;
  evaluation?: EvaluationResponse;
  evaluatedAt?: string;
}

export interface EvaluationRequest {
  topic: string;
  diagramType: DiagramType;
  content: DiagramContent;
  educationLevel?: EducationLevel;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description?: string;
  diagrams: Diagram[];
  createdAt: string;
  updatedAt: string;
  isShared: boolean;
}

export interface ExportOptions {
  format: 'png' | 'pdf' | 'json';
  quality?: 'low' | 'medium' | 'high';
  includeMetadata?: boolean;
}
