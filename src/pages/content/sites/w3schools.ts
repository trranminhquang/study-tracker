import {
  Answer,
  Question,
  QuestionAttempt,
  QuestionType,
  SiteHandler,
} from "./site.interface";

export class W3SchoolsHandler implements SiteHandler {
  site = "w3schools";

  isMatch(): boolean {
    return /w3schools\.com/.test(window.location.hostname);
  }

  getQuestionType(): QuestionType {
    return QuestionType.TEXT;
  }

  extractQuestion(): Question | null {
    const questionEl = document.querySelector(
      ".exercisewindow .question, .exercisewindow h2"
    );
    if (!questionEl) return null;

    return {
      id: "",
      type: QuestionType.TEXT,
      content: questionEl.textContent || "",
      url: location.href,
      meta: {},
    };
  }

  extractAnswer(): Answer | null {
    const input = document.querySelector(
      'input[type="text"], input[type="number"], textarea'
    );
    if (!input) return null;

    return {
      type: QuestionType.TEXT,
      value: (input as HTMLInputElement).value,
    };
  }

  attachListeners(onCapture: (attempt: QuestionAttempt) => void) {
    const submitBtn = document.querySelector(
      'button[type="submit"], ._1f6t1qk'
    );
    if (submitBtn) {
      submitBtn.addEventListener(
        "click",
        () => {
          const question = this.extractQuestion();
          const answer = this.extractAnswer();
          if (question && answer) {
            onCapture({
              question,
              answer,
              timestamp: Date.now(),
              site: this.site,
              url: location.href,
            });
          }
        },
        true
      );
    }
  }
}
