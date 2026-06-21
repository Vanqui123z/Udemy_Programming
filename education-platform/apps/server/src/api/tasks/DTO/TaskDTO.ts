import { QuestionType, TaskStatus } from "@prisma/client";


export interface TaskDTO {
  title: string;
  note?: string;
  dueAt?: string;
  aiGenerated?: boolean;
  duration?: number; // thời gian làm bài 
  memberIds?: string[];      // người được giao
  attachmentIds?: string[];  // file đính kèm

  questions?: {
    id?: string;
    questionNo: number;
    questionType: QuestionType;
    content: string;
    correctAnswer?: string;
    explanation?: string;
    score?: number;
    options?: {
      id?: string;
      optionKey: string;
      optionContent: string;
      isCorrect?: boolean;
    }[];
  }[];
}

export interface UpdateTaskStatusDTO {
  status: TaskStatus;
}

export interface SubmitTaskDTO {
  assignmentId: string;
  memberId: string;
  note?: string;
  answers?: {
    questionId: string;
    answerContent: string;
  }[];
  attachmentIds?: string[];
}