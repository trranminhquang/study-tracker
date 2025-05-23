export default class Storage {
  static async get<T>(
    key: string,
    area: "local" | "sync" = "local"
  ): Promise<T | undefined> {
    try {
      const result = await new Promise<{ [key: string]: T }>(
        (resolve, reject) => {
          chrome.storage[area].get(key, (values) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else resolve(values);
          });
        }
      );
      return result[key];
    } catch (error) {
      console.info(`Storage.get error for key "${key}":`, error);
    }
  }

  static set<T>(
    key: string,
    value: T,
    area: "local" | "sync" = "local"
  ): Promise<void> {
    try {
      return new Promise<void>((resolve, reject) => {
        chrome.storage[area].set({ [key]: value }, () => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else resolve();
        });
      });
    } catch (error) {
      console.info(`Storage.set error for key "${key}":`, error);
      throw error;
    }
  }

  static remove(key: string, area: "local" | "sync" = "local"): Promise<void> {
    try {
      return new Promise<void>((resolve, reject) => {
        chrome.storage[area].remove(key, () => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else resolve();
        });
      });
    } catch (error) {
      console.info(`Storage.remove error for key "${key}":`, error);
      throw error;
    }
  }
}

export const STORAGE_KEY_USER = "auth_user";
export const STORAGE_KEY_TOKEN = "auth_token";
