declare module 'node-nlp' {
  export class NlpManager {
    constructor(settings?: { languages: string[] });
    addDocument(language: string, text: string, intent: string): void;
    train(): Promise<void>;
    process(language: string, text: string): Promise<{
      tokens?: string[];
      keywords?: string[];
      sentiment?: Record<string, unknown>;
    }>;
  }
} 