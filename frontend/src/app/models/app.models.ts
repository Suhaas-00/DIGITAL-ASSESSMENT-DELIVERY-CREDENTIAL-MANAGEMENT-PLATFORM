export interface User {
  id?: number;
  username: string;
  email: string;
  role: 'ADMINISTRATOR' | 'CANDIDATE' | 'EXAMINER';
  fullName?: string; // ✅ Added (useful for UI)
  password?: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
  userId?: number;
}

export interface Assessment {
  id?: number;
  title: string;
  description: string;
  domain: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  startDateTime: string;
  endDateTime: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED';
  questions?: Question[];
  assignedCandidates?: User[];
  createdBy?: { id: number; username: string };
}

export interface Question {
  id?: number;
  questionText?: string;
  question_text?: string;
  questionType: 'MCQ' | 'TRUE_FALSE';
  difficultyLevel: 'EASY' | 'MEDIUM' | 'HARD';
  marks: number;
  options: string;
  correctAnswer: string;
}

export interface Attempt {
  id?: number;
  candidate: User;
  assessment: Assessment;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED';
  score?: number;
  responses?: string;
  startTime?: string;
  endTime?: string;
  evaluatedBy?: { id: number; username: string };
  remarks?: string;
  evaluatedAt?: string;
}

export interface Credential {
  id?: number;
  credentialCode: string;
  candidate: User;
  assessment: Assessment;
  issueDate: string;
  expiryDate: string;
  status: 'ACTIVE' | 'REVOKED';
}