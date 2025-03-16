import React, { useEffect, useRef } from 'react';

interface VoiceWaveformProps {
  isListening: boolean;
  audioLevel: number;
}

const VoiceWaveform: React.FC<VoiceWaveformProps> = ({ isListening, audioLevel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const barsCount = 64;
  const minHeight = 2;
  const maxHeight = 100;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawWaveform = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (!isListening) {
        // Draw a flat line when not listening
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
        return;
      }

      // Draw animated bars
      const barWidth = canvas.width / barsCount;
      const centerY = canvas.height / 2;

      for (let i = 0; i < barsCount; i++) {
        const x = i * barWidth;
        // Create a wave-like pattern using sine function and current time
        const time = Date.now() / 1000;
        const frequency = 2;
        const amplitude = audioLevel * (maxHeight - minHeight) + minHeight;
        const height = amplitude * Math.abs(Math.sin(frequency * time + i * 0.2));
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(x, centerY - height / 2, barWidth - 1, height);
      }

      animationFrameRef.current = requestAnimationFrame(drawWaveform);
    };

    drawWaveform();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isListening, audioLevel]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={150}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    />
  );
};

export default VoiceWaveform; 