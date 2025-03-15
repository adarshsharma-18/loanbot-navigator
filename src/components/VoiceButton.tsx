
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceButtonProps {
  onResult: (transcript: string) => void;
  disabled?: boolean;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({ onResult, disabled = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasRipple, setHasRipple] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          
          if (event.results[0].isFinal) {
            setIsProcessing(true);
            setTimeout(() => {
              onResult(transcript);
              stopListening();
              setIsProcessing(false);
            }, 500);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error', event);
          stopListening();
        };

        recognitionRef.current.onend = () => {
          if (isListening) {
            setIsListening(false);
          }
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        stopListening();
      }
    };
  }, [onResult, isListening]);

  const toggleListening = () => {
    if (disabled || isProcessing) return;
    
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.start();
      setIsListening(true);
      setHasRipple(true);
      setTimeout(() => setHasRipple(false), 1000);
    } catch (error) {
      console.error('Could not start speech recognition', error);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Could not stop speech recognition', error);
    }
  };

  return (
    <button
      className={`voice-button ${isListening ? 'voice-button-active' : ''} ${hasRipple ? 'voice-button-ripple' : ''} ${disabled || isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
      onClick={toggleListening}
      disabled={disabled || isProcessing}
      aria-label={isListening ? 'Stop listening' : 'Start voice input'}
    >
      {isProcessing ? (
        <Loader2 className="w-6 h-6 animate-spin" />
      ) : isListening ? (
        <Mic className="w-6 h-6 text-red-500" />
      ) : (
        <Mic className="w-6 h-6" />
      )}
    </button>
  );
};

export default VoiceButton;
