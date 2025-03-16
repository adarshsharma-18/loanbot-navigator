import React, { useState } from 'react';
import { Mic, Loader2 } from 'lucide-react';
import VoiceModal from './VoiceModal';
import './VoiceButton.css';

interface VoiceButtonProps {
  onResult: (transcript: string) => void;
  disabled?: boolean;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({ onResult, disabled = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleResult = (transcript: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      onResult(transcript);
      setIsProcessing(false);
      setShowModal(false);
    }, 500);
  };

  const toggleListening = () => {
    if (disabled || isProcessing) return;
    
    if (isListening) {
      setIsListening(false);
      setShowModal(false);
    } else {
      setShowModal(true);
      setIsListening(true);
    }
  };

  return (
    <>
      <button
        className={`voice-button ${isListening ? 'voice-button-active' : ''} ${disabled || isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
        onClick={toggleListening}
        disabled={disabled || isProcessing}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isProcessing ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </button>

      <VoiceModal
        isOpen={showModal}
        onClose={() => {
          setIsListening(false);
          setShowModal(false);
        }}
        onResult={handleResult}
        isListening={isListening}
        transcript=""
      />
    </>
  );
};

export default VoiceButton;
