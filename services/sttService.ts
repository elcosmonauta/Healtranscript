// Type definitions for Web Speech API
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

export interface STTEvent {
  text: string;
  isFinal: boolean;
  confidence: number;
}

type STTCallback = (event: STTEvent) => void;

class STTService {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private onResultCallback: STTCallback | null = null;

  constructor() {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      if (this.recognition) {
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'es-ES'; // Default to Spanish
      }
    } else {
      console.warn('Speech Recognition API not supported in this browser.');
    }
  }

  start(onResult: STTCallback) {
    if (!this.recognition) {
      console.error('STT not supported');
      return;
    }
    if (this.isListening) return;

    this.onResultCallback = onResult;
    this.isListening = true;

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
           if (this.onResultCallback) {
             this.onResultCallback({
               text: transcript.trim(),
               isFinal: true,
               confidence: event.results[i][0].confidence
             });
           }
        } else {
          interimTranscript += transcript;
        }
      }
      // Optional: Emit interim
      if (interimTranscript && this.onResultCallback) {
        this.onResultCallback({
          text: interimTranscript,
          isFinal: false,
          confidence: 0
        });
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('STT Error', event.error);
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        // Auto-restart if it stopped but we didn't ask it to
        try {
            this.recognition?.start();
        } catch (e) {
            // ignore
        }
      }
    };

    try {
        this.recognition.start();
    } catch(e) {
        console.error("Failed to start recognition", e);
    }
  }

  stop() {
    if (!this.recognition) return;
    this.isListening = false;
    this.recognition.stop();
    this.onResultCallback = null;
  }
}

export const sttService = new STTService();