import { Injectable } from '@angular/core';
import { VoiceMessageService } from './voice-message-service';

declare var webkitSpeechRecognition: any;
declare var webkitSpeechGrammarList: any;

@Injectable({
    providedIn: 'root'
})
export class VoiceRecognizationService {
    public isInitialize = false;
    public started = false;
    public stopWhenSpeechEnds = true;
    public phrase: string;
    public selectedControlName: string
    public setVoiceRecognization: any;
    public component: any;

    private recognition = new webkitSpeechRecognition();
    private speechRecognitionList = new webkitSpeechGrammarList();
    // private speechRecognition = SpeechRecognition || webkitSpeechRecognition;
    // private speechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
    private grammar = '#JSGF V1.0;'
    // private recognition = new this.speechRecognition();
    // private speechRecognitionList = new this.speechGrammarList();

    /**
     *
     */
    constructor(private voiceMessage: VoiceMessageService) {

    }

    public init() {
        console.log('init - start');
        // const speechRecognition = SpeechRecognition || webkitSpeechRecognition;
        // const speechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
        // const grammar = '#JSGF V1.0;'
        // const recognition = new speechRecognition();
        // const speechRecognitionList = new speechGrammarList();

        this.speechRecognitionList.addFromString(this.grammar, 1);
        this.recognition.grammars = this.speechRecognitionList;
        this.recognition.lang = 'en-US';
        // this.recognition.interimResults = true;
        this.recognition.interimResults = false;
        this.recognition.continuous = true;

        this.recognition.onresult = (event) => {
            this.phrase = event.results[event.results.length - 1][0].transcript;
            // console.log(this.phrase)
            if (this.setVoiceRecognization) {
                this.setVoiceRecognization(this.phrase, this.selectedControlName, this.component);
            }

            // send message to subscribers via observable subject
            this.voiceMessage.sendMessage({ phrase: this.phrase, selectedControlName: this.selectedControlName });
        }

        this.recognition.onerror = (event) => {
            console.log('onError');
            this.started = false;
            console.log(`'Error occurred in recognition: ${event.error}`);
        }

        this.recognition.onspeechend = () => {
            console.log('onspeechend');
            if (this.stopWhenSpeechEnds) {
                this.recognition.stop();
            }
            console.log('onspeechend - stopped');
        };

        console.log('init - done');
    }

    start() {
        console.log('start');
        this.recognition.start();
        this.started = true;
        console.log('start - done');
    }


    stop() {
        console.log('stop');
        this.recognition.stop();
        this.started = false;
        console.log('stop - done');
    }

    clearMessages(): void {
        // clear messages
        this.voiceMessage.clearMessages();
    }
}