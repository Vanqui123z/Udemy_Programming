

export interface AIAnalysisDTO {
  submissionId: string;

  score?: number;
  totalScore?: number;
  accuracy?: number;

  summary?: string;
  strengths?: string;
  weaknesses?: string;
  recommendations?: string;

  analysisJson?: any;
}