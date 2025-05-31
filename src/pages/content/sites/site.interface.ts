export enum QuestionType {
  SINGLE_CHOICE = "single_choice",
  MULTIPLE_CHOICE = "multiple_choice",
  TEXT = "text",
  VIDEO = "video", // for video-based questions
}

export interface BaseQuestion {
  id?: string; // optional unique identifier, can be generated
  type: QuestionType;
  meta?: Record<string, unknown>; // site-specific extra info
}

export interface SingleChoiceQuestion extends BaseQuestion {
  type: QuestionType.SINGLE_CHOICE;
  choices: string[];
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: QuestionType.MULTIPLE_CHOICE;
  choices: string[];
}

export interface TextQuestion extends BaseQuestion {
  type: QuestionType.TEXT;
  content: string; // the question text or prompt
  description?: string; // optional description or hint
}

export interface VideoQuestion extends BaseQuestion {
  type: QuestionType.VIDEO;
  videoUrl: string; // URL of the video
}

export type Question =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | TextQuestion
  | VideoQuestion;

export interface BaseAnswer {}

export interface SingleChoiceAnswer extends BaseAnswer {
  type: QuestionType.SINGLE_CHOICE;
  value: string; // selected choice
}

export interface MultipleChoiceAnswer extends BaseAnswer {
  type: QuestionType.MULTIPLE_CHOICE;
  value: string[]; // selected choices
}

export interface TextAnswer extends BaseAnswer {
  type: QuestionType.TEXT;
  value: string; // user input text
}

export interface VideoAnswer extends BaseAnswer {
  type: QuestionType.VIDEO;
  value: string; // for video answers, could be a URL or video ID
}

export type Answer =
  | SingleChoiceAnswer
  | MultipleChoiceAnswer
  | TextAnswer
  | VideoAnswer;

export interface QuestionAttempt {
  question: Question;
  answer: Answer;
  site?: string;
  url?: string;
  isCorrect?: boolean; // optional, for correctness tracking
  isSkipped?: boolean; // optional, for skipped questions
  isTimedOut?: boolean; // optional, for timeouts
  durationMs?: number; // time spent on the question in milliseconds
  timestamp?: number; // optional, when the attempt was made
}

export interface SiteHandler {
  site: string;
  isMatch: boolean;
  extractQuestion: () => Question;
  extractAnswer: () => Answer;
  getQuestionType: () => QuestionType;
  attachListeners: (onCapture: (attempt: QuestionAttempt) => void) => void;
  interceptFetchResponse?: (response: Response) => Promise<void>;
}
