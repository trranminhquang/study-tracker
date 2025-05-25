import { MessageType } from "@lib/chrome/messaging";
import {
  Answer,
  Question,
  QuestionAttempt,
  QuestionType,
  SiteHandler,
} from "./site.interface";

export class KhanAcademyHandler implements SiteHandler {
  site = "khanacademy.org";
  get isMatch(): boolean {
    return /khanacademy\.org/.test(location.href);
  }

  getQuestionType(): QuestionType {
    return QuestionType.TEXT;
  }

  extractQuestion(): Question {
    // const questionEl = document.querySelector(
    //   ".perseus-question .perseus-renderer"
    // );
    return {
      id: "",
      type: QuestionType.TEXT,
      content: 'questionEl?.innerHTML || "",',
      url: location.href,
      meta: {},
    };
  }

  extractAnswer(): Answer {
    // const input = document.querySelector(
    //   'input[type="text"], input[type="number"], textarea'
    // );
    return {
      type: QuestionType.TEXT,
      value: "(input as HTMLInputElement).value",
    };
  }

  attachListeners(onCapture: (attempt: QuestionAttempt) => void) {
    // wait for the content to load
    const observer = new MutationObserver(() => {
      const button = document.querySelector(
        'button[data-testid="exercise-check-answer"]'
      );
      if (button) {
        // Attach the event listener only once
        button.addEventListener(
          "click",
          () => {
            const question = this.extractQuestion();
            const answer = this.extractAnswer();

            const attempt: QuestionAttempt = {
              question,
              answer,
              timestamp: Date.now(),
              site: this.site,
              url: location.href,
            };
            onCapture(attempt);
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

  async interceptFetchResponse(response: Response): Promise<void> {
    // Only handle relevant Khan Academy API responses
    if (response.url.includes("khanacademy.org/api/internal/_mt/graphql/attemptProblem")) {
      // Clone the response so the page can still read it
      const cloned = response.clone();
      cloned.json().then((data) => {
        // Do something with the response data
        console.log("[KhanAcademyHandler] Intercepted API response:", data);
        // Optionally send to background: chrome.runtime.sendMessage({ type: "API_RESPONSE", data });
      });
    }
  }
}
