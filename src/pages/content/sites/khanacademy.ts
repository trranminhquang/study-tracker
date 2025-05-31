import { SITE_DOMAINS } from "@common/constants";
import {
  QuestionType,
  Question,
  Answer,
  QuestionAttempt,
  SiteHandler,
  BaseQuestion,
  BaseAnswer,
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  TextQuestion,
  VideoQuestion,
  SingleChoiceAnswer,
  MultipleChoiceAnswer,
  TextAnswer,
  VideoAnswer,
} from "./site.interface";

export class KhanAcademyHandler implements SiteHandler {
  site = SITE_DOMAINS.KHAN_ACADEMY;

  get isMatch(): boolean {
    return window.location.hostname.endsWith(this.site);
  }

  getQuestionType(): QuestionType {
    const questionTypes = [
      QuestionType.SINGLE_CHOICE,
      QuestionType.MULTIPLE_CHOICE,
      QuestionType.TEXT,
      QuestionType.VIDEO,
    ];

    // simulate random question type selection
    return questionTypes[Math.floor(Math.random() * questionTypes.length)];
  }

  private extractSingleChoiceQuestion(
    baseQuestion: BaseQuestion
  ): SingleChoiceQuestion {
    const question: SingleChoiceQuestion = {
      ...baseQuestion,
      type: QuestionType.SINGLE_CHOICE,
      choices: [],
    };
    return question;
  }

  private extractMultipleChoiceQuestion(
    baseQuestion: BaseQuestion
  ): MultipleChoiceQuestion {
    const question: MultipleChoiceQuestion = {
      ...baseQuestion,
      type: QuestionType.MULTIPLE_CHOICE,
      choices: [],
    };
    return question;
  }

  private extractTextQuestion(baseQuestion: BaseQuestion): TextQuestion {
    const question: TextQuestion = {
      ...baseQuestion,
      type: QuestionType.TEXT,
      content: "",
    };
    return question;
  }

  private extractVideoQuestion(baseQuestion: BaseQuestion): VideoQuestion {
    const question: VideoQuestion = {
      ...baseQuestion,
      type: QuestionType.VIDEO,
      videoUrl: "",
    };
    return question;
  }

  extractQuestion(): Question {
    const questionType = this.getQuestionType();
    const baseQuestion: BaseQuestion = {
      type: questionType,
    };

    switch (questionType) {
      case QuestionType.SINGLE_CHOICE:
        return this.extractSingleChoiceQuestion(baseQuestion);
      case QuestionType.MULTIPLE_CHOICE:
        return this.extractMultipleChoiceQuestion(baseQuestion);
      case QuestionType.TEXT:
        return this.extractTextQuestion(baseQuestion);
      case QuestionType.VIDEO:
        return this.extractVideoQuestion(baseQuestion);
      default:
        throw new Error("Unsupported question type");
    }
  }

  private extractSingleChoiceAnswer(
    baseAnswer: BaseAnswer
  ): SingleChoiceAnswer {
    const answer: SingleChoiceAnswer = {
      ...baseAnswer,
      type: QuestionType.SINGLE_CHOICE,
      value: "",
    };
    return answer;
  }

  private extractMultipleChoiceAnswer(
    baseAnswer: BaseAnswer
  ): MultipleChoiceAnswer {
    const answer: MultipleChoiceAnswer = {
      ...baseAnswer,
      type: QuestionType.MULTIPLE_CHOICE,
      value: [],
    };
    return answer;
  }

  private extractTextAnswer(baseAnswer: BaseAnswer): TextAnswer {
    const answer: TextAnswer = {
      ...baseAnswer,
      type: QuestionType.TEXT,
      value: "",
    };
    return answer;
  }

  private extractVideoAnswer(baseAnswer: BaseAnswer): VideoAnswer {
    const answer: VideoAnswer = {
      ...baseAnswer,
      type: QuestionType.VIDEO,
      value: "",
    };
    return answer;
  }

  extractAnswer(): Answer {
    const questionType = this.getQuestionType();
    const baseAnswer: BaseAnswer = {};

    switch (questionType) {
      case QuestionType.SINGLE_CHOICE:
        return this.extractSingleChoiceAnswer(baseAnswer);
      case QuestionType.MULTIPLE_CHOICE:
        return this.extractMultipleChoiceAnswer(baseAnswer);
      case QuestionType.TEXT:
        return this.extractTextAnswer(baseAnswer);
      case QuestionType.VIDEO:
        return this.extractVideoAnswer(baseAnswer);
      default:
        throw new Error("Unsupported question type");
    }
  }

  attachListeners(onCapture: (attempt: QuestionAttempt) => void) {
    const observer = new MutationObserver(() => {
      const checkAnswerButton = document.querySelector(
        'button[data-testid="exercise-check-answer"]'
      );
      if (checkAnswerButton) {
        checkAnswerButton.addEventListener(
          "click",
          () => {
            const question = this.extractQuestion();
            const answer = this.extractAnswer();
            onCapture({
              question,
              answer,
            });
          },
          { once: true }
        );
        // Disconnect observer after attaching the listener to prevent multiple attachments
        // observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup observer when the component is unmounted
    return () => {
      observer.disconnect();
    };
  }

  // async interceptFetchResponse(response: Response): Promise<void> {
  //   // Only handle relevant Khan Academy API responses
  //   if (
  //     response.url.includes(
  //       "khanacademy.org/api/internal/_mt/graphql/attemptProblem"
  //     )
  //   ) {
  //     // Clone the response so the page can still read it
  //     const cloned = response.clone();
  //     cloned.json().then((data) => {
  //       // Do something with the response data
  //       console.log("[KhanAcademyHandler] Intercepted API response:", data);
  //       // Optionally send to background: chrome.runtime.sendMessage({ type: "API_RESPONSE", data });
  //     });
  //   }
  // }
}
