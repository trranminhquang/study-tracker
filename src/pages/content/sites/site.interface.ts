export enum QuestionType {
  SINGLE_CHOICE = "single_choice",
  MULTIPLE_CHOICE = "multiple_choice",
  TEXT = "text",
  VIDEO = "video", // for video-based questions
}

export interface BaseQuestion {
  id?: string; // optional unique identifier, can be generated
  type: QuestionType;
  content: string; // question text or HTML
  url: string; // e.g. 'khanacademy', 'w3school'
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

export type Answer =
  | { type: QuestionType.SINGLE_CHOICE; value: string }
  | { type: QuestionType.MULTIPLE_CHOICE; value: string[] }
  | { type: QuestionType.TEXT; value: string }
  | { type: QuestionType.VIDEO; value: string }; // for video answers, could be a URL or video ID

export interface QuestionAttempt {
  question: Question;
  answer: Answer;
  timestamp: number;
  site: string;
  url: string;
  isCorrect?: boolean; // optional, for correctness tracking
  isSkipped?: boolean; // optional, for skipped questions
  isTimedOut?: boolean; // optional, for timeouts
  durationMs?: number; // time spent on the question in milliseconds
}

export interface SiteHandler {
  site: string;
  isMatch: boolean;
  getQuestionType: () => QuestionType;
  extractQuestion: () => Question | null;
  extractAnswer: () => Answer | null;
  attachListeners: (onCapture: (attempt: QuestionAttempt) => void) => void;
  /**
   * Optionally intercept fetch responses for this site.
   */
  interceptFetchResponse?: (response: Response) => Promise<void>;
}
