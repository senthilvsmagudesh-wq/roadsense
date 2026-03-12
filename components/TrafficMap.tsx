import React, { useState, useEffect } from 'react';
// Fix: Added MapPin to the lucide-react imports
import { Map as MapIcon, MapPin, Navigation, Info, ExternalLink, RefreshCw, Compass, AlertCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { fetchLocalTraffic } from '../services/geminiService';
import { useAppStore } from '../App';
import VoiceButton from './VoiceButton';

const TrafficMap: React.FC = () => {
  const { language, incidents } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [analysis, setAnalysis] = useState<{ text: string; groundingChunks: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getCoordinates = () => {
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(coords);
        handleFetchTraffic(coords.lat, coords.lng);
      },
      (err) => {
        setError("Could not access location. Please enable GPS permissions.");
        setLoading(false);
      }
    );
  };

  const handleFetchTraffic = async (lat: number, lng: number) => {
    setLoading(true);
    const result = await fetchLocalTraffic(lat, lng, language);
    setAnalysis(result);
    setLoading(false);
  };

  useEffect(() => {
    getCoordinates();
  }, [language]);

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3 text-slate-900">
            <MapIcon className="text-blue-600" />
            Traffic Intelligence
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">Locale: {language}</p>
        </div>
        
        <div className="flex items-center gap-3">
          {location && (
            <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs shadow-sm">
              <Compass size={14} className="text-blue-600 animate-pulse" />
              <span className="text-slate-600 font-mono font-bold">
                {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </span>
            </div>
          )}
          <button 
            onClick={() => location && handleFetchTraffic(location.lat, location.lng)}
            disabled={loading}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50 text-slate-600 shadow-sm"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-700 shadow-sm">
          <AlertCircle size={20} />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Map Visual Replacement */}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 lg:p-8 relative overflow-hidden h-full min-h-[400px] lg:min-h-[500px] flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-blue-700 uppercase tracking-widest text-[10px] font-black">
                <Navigation size={14} />
                Situation Report ({language})
              </div>
              {analysis && !loading && <VoiceButton text={analysis.text} />}
            </div>

            {/* Incident Overlays Simulation */}
            <div className="flex-1 relative bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden mb-6 p-4">
               {/* Pulse markers for incidents */}
               {incidents.map((inc) => (
                 <div key={inc.id} className="absolute animate-bounce" style={{ top: '30%', left: '40%' }}>
                    <div className="relative group cursor-pointer">
                       <AlertTriangle className="text-rose-600 drop-shadow-lg" size={32} />
                       <div className="absolute -inset-2 bg-rose-500/20 rounded-full animate-ping"></div>
                       {/* Tooltip on hover */}
                       <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-slate-900 text-white p-3 rounded-xl text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-xl border border-white/10">
                          <p className="text-rose-400 mb-1 uppercase tracking-widest">USER REPORTED: {inc.type}</p>
                          <p className="mb-1 leading-tight">{inc.description}</p>
                          <p className="text-slate-400">{inc.timestamp} @ {inc.location}</p>
                       </div>
                    </div>
                 </div>
               ))}
               
               <div className="h-full flex flex-col items-center justify-center text-center opacity-20 select-none">
                  <MapIcon size={120} className="mb-4 text-slate-300" />
                  <p className="text-xl font-black uppercase tracking-[0.2em] text-slate-400">Tactical Map View</p>
               </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
                  <div className="absolute inset-0 border-t-4 border-blue-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-slate-500 animate-pulse font-bold">Querying AI Infrastructure...</p>
              </div>
            ) : analysis ? (
              <div className="flex-1 overflow-y-auto max-h-[200px] lg:max-h-none">
                <div className="prose prose-slate max-w-none text-slate-600 font-medium text-sm lg:text-base leading-relaxed space-y-4">
                  {analysis.text.split('\n').map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                <MapIcon size={48} className="mb-4 text-slate-400" />
                <p className="font-bold">Waiting for GPS synchronization...</p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-400 font-bold">
              <Info size={14} />
              <span>Grounded by Gemini 2.5 Flash Maps Retrieval.</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
              <AlertTriangle size={18} className="text-rose-600" />
              Recent Alerts
            </h2>
            
            <div className="space-y-3">
              {incidents.length ? (
                incidents.map((inc) => (
                  <div key={inc.id} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl animate-in slide-in-from-right-2">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest">{inc.type}</span>
                      <span className="text-[8px] font-bold text-rose-400 uppercase">{inc.timestamp}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 leading-tight mb-1">{inc.description}</p>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 font-medium"><MapPin size={10} /> {inc.location}</p>
                    <div className="mt-2 pt-2 border-t border-rose-100 flex items-center gap-1.5 text-[8px] font-black text-emerald-600 uppercase">
                       <ShieldCheck size={10} /> AI VALIDATED
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-slate-400 italic font-medium">
                  No critical incidents reported in the last 60 minutes.
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
              <ExternalLink size={18} className="text-emerald-600" />
              Place References
            </h2>
            
            <div className="space-y-3">
              {analysis?.groundingChunks?.length ? (
                analysis.groundingChunks.map((chunk: any, idx: number) => {
                  const place = chunk.maps || chunk.web;
                  if (!place) return null;
                  return (
                    <a 
                      key={idx}
                      href={place.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition-all group shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {place.title || "Reference Location"}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-black">
                            Google Maps Source
                          </p>
                        </div>
                        <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </a>
                  );
                })
              ) : (
                <div className="py-12 text-center text-sm text-slate-400 italic font-medium">
                  No active place references found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficMap;