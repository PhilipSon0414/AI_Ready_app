export type QuestionType = 'multiple_choice' | 'fill_blank' | 'code_output' | 'error_fix' | 'concept';

export interface Question {
  id: string;
  type: QuestionType;
  unitId: number;
  prompt: string;
  code?: string;
  choices?: string[];
  answer: string;
  explanation: string;
}

export interface Unit {
  id: number;
  title: string;
  subtitle: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
  topics: string[];
}

export interface UnitProgress {
  unitId: number;
  completed: number;
  correct: number;
  total: number;
  unlocked: boolean;
}

export interface WrongAnswer {
  id: string;
  question: Question;
  userAnswer: string;
  timestamp: number;
}

export interface DailyRecord {
  date: string;
  xp: number;
  questionsAnswered: number;
}

export interface AppState {
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string;
  unitProgress: Record<number, UnitProgress>;
  wrongAnswers: WrongAnswer[];
  badges: string[];
  dailyRecords: DailyRecord[];
}
