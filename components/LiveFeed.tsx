import React, { useState, useRef } from 'react';
import { Camera, RefreshCw, Layers, Zap, Info } from 'lucide-react';
import { analyzeTrafficState } from '../services/geminiService';
// Fix: useAppStore is the hook exported from App.tsx
import { useAppStore } from '../App';
import VoiceButton from './VoiceButton';

const LiveFeed: React.FC = () => {
  // Fix: useAppStore is the hook exported from App.tsx
  const { language } = useAppStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [camStatus, setCamStatus] = useState<'IDLE' | 'ACTIVE' | 'ERROR'>('IDLE');
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCamStatus('ACTIVE');
      }
    } catch (err) {
      console.error(err);
      setCamStatus('ERROR');
    }
  };

  const handleManualAnalyze = async () => {
    setIsAnalyzing(true);
    const mockSummary = "Intersection 4: 25 vehicles, 2 buses, high density in North-bound lane. Estimated wait time 120s.";
    const result = await analyzeTrafficState(mockSummary, language);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3 text-slate-900">
            <Camera className="text-blue-600" />
            Live CV Analysis
          </h1>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px]">Processing Language: {language}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={startCamera}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl transition-colors font-bold text-sm shadow-sm"
          >
            <RefreshCw size={18} /> Initialize Feed
          </button>
          <button 
            onClick={handleManualAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl transition-all shadow-md font-bold text-sm"
          >
            {isAnalyzing ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
            Run AI Audit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-slate-100 border border-slate-200 rounded-3xl overflow-hidden relative aspect-video shadow-sm">
          {camStatus === 'ACTIVE' ? (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold font-mono text-slate-800 shadow-sm">
                CAM_SEC_04_NORTH
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-sm shadow-red-500/50"></span>
                <span className="text-[10px] font-black text-white uppercase tracking-wider drop-shadow-md">REC</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Camera size={48} className="text-slate-300" />
              <p className="text-slate-400 font-bold">Camera Feed Inactive</p>
              <button onClick={startCamera} className="text-blue-600 hover:underline text-sm font-bold">Connect to surveillance node</button>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 h-full flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                <Layers className="text-purple-600" />
                AI Recommendations
              </h2>
              {analysisResult && <VoiceButton text={analysisResult.analysis} />}
            </div>
            
            {!analysisResult ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 p-4">
                <Info size={32} className="mb-4 text-slate-400" />
                <p className="text-sm font-bold text-slate-500 leading-relaxed">Trigger an AI Audit to analyze flow patterns.</p>
              </div>
            ) : (
              <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div>
                  <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Analysis ({language})</h3>
                  <p className="text-sm font-medium leading-relaxed text-slate-700">{analysisResult.analysis}</p>
                </div>

                <div>
                  <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Suggested Controls</h3>
                  <div className="space-y-3">
                    {analysisResult.suggestedTimings?.map((s: any, i: number) => (
                      <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-blue-700 font-bold text-xs">{s.intersectionId}</span>
                          <span className="text-emerald-700 font-bold text-xs">+{s.greenDuration}s Green</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium italic">{s.reasoning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;