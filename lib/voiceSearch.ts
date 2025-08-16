export interface VoiceSearchResult {
    text: string;
    confidence: number;
    isFinal: boolean;
}

export class VoiceSearchManager {
    private recognition: any;
    private isSupported: boolean;
    private isListening: boolean = false;
    private onResultCallback?: (result: VoiceSearchResult) => void;
    private onErrorCallback?: (error: string) => void;

    constructor() {
        this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

        if (this.isSupported) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.setupRecognition();
        }
    }

    private setupRecognition() {
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 1;

        this.recognition.onresult = (event: any) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            if (finalTranscript) {
                this.onResultCallback?.({
                    text: finalTranscript,
                    confidence: event.results[event.results.length - 1][0].confidence,
                    isFinal: true
                });
            } else if (interimTranscript) {
                this.onResultCallback?.({
                    text: interimTranscript,
                    confidence: 0.5,
                    isFinal: false
                });
            }
        };

        this.recognition.onerror = (event: any) => {
            this.isListening = false;
            this.onErrorCallback?.(event.error);
        };

        this.recognition.onend = () => {
            this.isListening = false;
        };
    }

    startListening(onResult: (result: VoiceSearchResult) => void, onError?: (error: string) => void) {
        if (!this.isSupported) {
            onError?.('Voice recognition is not supported in this browser');
            return;
        }

        this.onResultCallback = onResult;
        this.onErrorCallback = onError;
        this.isListening = true;

        try {
            this.recognition.start();
        } catch (error) {
            this.isListening = false;
            onError?.('Failed to start voice recognition');
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    }

    isVoiceSupported(): boolean {
        return this.isSupported;
    }

    getListeningState(): boolean {
        return this.isListening;
    }
}

// Export singleton instance
export const voiceSearchManager = new VoiceSearchManager();