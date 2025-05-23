export type Question = {
  title: string;
  content: string;
};

export type Answer = {
  content: string;
  isCorrect: boolean;
};

export interface SiteHandler {
  isMatch(): boolean;
  getQuestionAnswer(): { question: Question; answer: Answer } | null;
  registerCaptureListener(
    onCapture: (qa: { question: Question; answer: Answer }) => void
  ): void;
}
