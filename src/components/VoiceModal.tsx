import React, { useEffect, useState, useRef } from 'react';
import { Mic } from 'lucide-react';
import axios from 'axios';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResult: (transcript: string) => void;
  isListening: boolean;
  transcript: string;
}

const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  onClose,
  onResult,
  isListening,
  transcript
}) => {
  const [audioLevel, setAudioLevel] = useState(0);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isListening) {
      // Initialize audio recording
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          streamRef.current = stream;
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          
          const audioChunks: BlobPart[] = [];
          
          mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
          };
          
          mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const formData = new FormData();
            formData.append('audio', audioBlob);
            formData.append('language', 'en');
            
            try {
              const response = await axios.post('http://localhost:5000/api/voice/transcribe', formData);
              if (response.data.transcript) {
                onResult(response.data.transcript);
              }
            } catch (error) {
              console.error('Transcription error:', error);
            }
            
            stopListening();
          };
          
          mediaRecorder.start();
          setIsRecording(true);

          // Initialize audio context and analyzer
          audioContextRef.current = new AudioContext();
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 256;
          
          const source = audioContextRef.current.createMediaStreamSource(stream);
          source.connect(analyserRef.current);
          
          // Start analyzing audio
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          const updateAudioLevel = () => {
            analyserRef.current!.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            setAudioLevel(average / 128); // Normalize to 0-1
            animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
          };
          updateAudioLevel();
        })
        .catch(error => {
          console.error('Error accessing microphone:', error);
          stopListening();
        });
    }

    return () => {
      stopListening();
    };
  }, [isListening, onResult]);

  const stopListening = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setInterimTranscript('');
  };

  if (!isOpen) return null;

  // Calculate wave sizes based on audio level
  const baseSize = 32;
  const waveSizes = [1, 1.2, 1.4, 1.6, 1.8].map(multiplier => 
    baseSize * multiplier * (1 + audioLevel * 0.5)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Dynamic wavelength animations */}
        {isListening && (
          <>
            {waveSizes.map((size, index) => (
              <div
                key={index}
                className="absolute rounded-full border-4 border-loan/30 animate-wave"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDelay: `${index * 0.2}s`,
                  opacity: 0.3 - (index * 0.05),
                  borderWidth: `${4 - (index * 0.5)}px`,
                  transform: `scale(${1 + audioLevel * 0.3})`,
                }}
              />
            ))}
          </>
        )}
        
        {/* Mic button */}
        <button
          className="w-24 h-24 rounded-full flex items-center justify-center bg-loan text-white shadow-lg shadow-loan/30 transition-all duration-300 hover:scale-105"
          onClick={onClose}
        >
          <div className="relative">
            <Mic className="w-12 h-12" />
            {isListening && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="w-4 h-4 bg-white rounded-full animate-pulse"
                  style={{
                    transform: `scale(${1 + audioLevel * 0.5})`,
                    opacity: 0.8 + audioLevel * 0.2
                  }}
                />
              </div>
            )}
          </div>
        </button>
        
        {/* Transcript */}
        <div className="mt-8 w-full max-w-md">
          <div className="p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
            <p className="text-lg text-gray-800">
              {interimTranscript || (isListening ? 'Listening...' : '')}
            </p>
          </div>
          {isListening && (
            <div className="mt-2 text-center text-sm text-gray-500">
              Click the mic or tap outside to stop
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceModal;