
import React, { useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';
import { playPCM } from '../utils/audioUtils';

interface VoiceButtonProps {
  text: string;
  size?: number;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({ text, size = 18 }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSpeak = async () => {
    if (isPlaying || loading) return;
    
    setLoading(true);
    const audioData = await generateSpeech(text);
    setLoading(false);

    if (audioData) {
      setIsPlaying(true);
      await playPCM(audioData);
      setIsPlaying(false);
    }
  };

  return (
    <button 
      onClick={handleSpeak}
      disabled={loading}
      className={`p-2 rounded-full transition-all ${
        isPlaying 
          ? 'bg-yellow-500 text-white animate-pulse shadow-lg shadow-yellow-500/30' 
          : 'bg-slate-100 text-slate-500 hover:bg-yellow-100 hover:text-yellow-700'
      } disabled:opacity-50`}
      title="Listen to Report"
    >
      {loading ? (
        <Loader2 size={size} className="animate-spin" />
      ) : isPlaying ? (
        <VolumeX size={size} />
      ) : (
        <Volume2 size={size} />
      )}
    </button>
  );
};

export default VoiceButton;
