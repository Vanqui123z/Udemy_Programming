export type UserRole = 'parent' | 'member';
export type TaskStatus = 'assigned' | 'viewed' | 'completed';
export type NotificationType = 'new_task' | 'submission' | 'deadline';
export type QuestionType = 'multiple_choice' | 'short_answer';
export type FileType = 'document' | 'image' | 'video' | 'audio';
export type Gender = 'MALE' | 'FEMALE';
export type ParentView = 'members' | 'task-board' | 'files' | 'reports' | 'notifications' | 'ai-creator' | 'ai-grader';
export type MemberView = 'tasks' | 'task-detail' | 'ai-quiz' | 'notifications';
export type AuthScreen = 'landing' | 'parent-login' | 'parent-register' | 'parent-otp' | 'parent-forgot' | 'member-login';

export interface Parent {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface Member {
  id: string;
  name: string;
  gender: Gender;
  grade: string;
  interest: string[];
  username: string;
  password: string;
  parentId: string;
}

export interface MemberRepons {

  avatarId: string | null;
  birthDate: string | null;
  full_name: string | null;
  gender: string | null;
  id: string | null;
  lastLoginAt: string | null;
  password_hash: string | null;
  isActive: string | null;
  provider: string | null;
  providerId: string | null;
  updatedAt: string | null;
  username: string | null;
}

export interface FileAttachment {
  id: string;
  name: string;
  type: FileType;
  size: string;
  uploadedAt: string;
  uploadedBy: 'parent' | 'member';
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer?: string;
}

export interface Answer {
  questionId: string;
  answer: string;
}

export interface AIAnalysisItem {
  questionId: string;
  questionText: string;
  memberAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  suggestion: string;
}

export interface Submission {
  id: string;
  memberId: string;
  memberName: string;
  files: FileAttachment[];
  answers: Answer[];
  submittedAt: string;
  note?: string;
  aiScore?: number;
  aiAnalysis?: AIAnalysisItem[];
}

export interface Task {
  id: string;
  title: string;
  note: string;
  date: string;
  duration: string;
  assignedTo: string[];
  files: FileAttachment[];
  memberStatus: Record<string, TaskStatus>;
  questions: Question[];
  submissions: Submission[];
  createdAt: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  taskId?: string;
  taskTitle?: string;
  memberName?: string;
  read: boolean;
  forRole: 'parent' | 'member';
  forUserId: string;
  createdAt: string;
}
