
import React, { useState } from 'react';
import { Navigation, MapPin, Search, Loader2, Route, Info, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { fetchRouteIntel } from '../services/geminiService';
import { useAppStore } from '../App';
import VoiceButton from './VoiceButton';

const RoutePlanner: React.FC = () => {
  const { language } = useAppStore();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState<{ text: string; groundingChunks: any[] } | null>(null);

  const handlePlanRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination) return;

    setLoading(true);
    const result = await fetchRouteIntel(origin, destination, language);
    setRouteData(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3 text-slate-900">
            <Route className="text-emerald-600" />
            AI Route Planner
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">Strategic Navigation Hub</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
              <Search size={18} className="text-emerald-600" />
              Parameters
            </h2>

            <form onSubmit={handlePlanRoute} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Location</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Origin address..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-center -my-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                  <ArrowRight size={14} className="rotate-90 lg:rotate-0" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</label>
                <div className="relative">
                  <Navigation size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Where to?" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Route size={20} />}
                Plan Optimized Route
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100">
               <div className="flex items-start gap-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                 <Info size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                 <p className="text-[10px] text-emerald-800 font-medium leading-relaxed italic">
                   "AI routes prioritize fuel efficiency and risk mitigation over pure speed."
                 </p>
               </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[500px]">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-emerald-50 rounded-full"></div>
                <div className="absolute inset-0 border-t-4 border-emerald-600 rounded-full animate-spin"></div>
                <Route className="absolute inset-0 m-auto text-emerald-600" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest">Synthesizing Route Data</h3>
                <p className="text-slate-500 text-sm mt-2 font-medium">Analyzing real-time traffic patterns and predictive safety scores...</p>
              </div>
            </div>
          ) : routeData ? (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2 text-emerald-700 uppercase tracking-widest text-[10px] font-black">
                    <Clock size={14} />
                    Intelligence Output
                  </div>
                  <VoiceButton text={routeData.text} />
                </div>

                <div className="prose prose-slate max-w-none text-slate-600 font-medium text-sm lg:text-base leading-relaxed space-y-4">
                  {routeData.text.split('\n').map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>

                {routeData.groundingChunks.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Live Map Citations</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {routeData.groundingChunks.map((chunk, idx) => {
                        const place = chunk.maps || chunk.web;
                        if (!place) return null;
                        return (
                          <a 
                            key={idx}
                            href={place.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition-all group"
                          >
                            <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-600 truncate mr-2">
                              {place.title || "Route Segment"}
                            </span>
                            <ExternalLink size={14} className="text-slate-300 group-hover:text-emerald-600 shrink-0" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Summary Stats Mock (Integration) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Environmental Impact</p>
                  <p className="text-2xl font-black text-emerald-600">-14% CO2</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-1">Compared to direct highway route</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Safety Confidence</p>
                  <p className="text-2xl font-black text-blue-600">96.8%</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-1">Based on predictive hotspot logic</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4 min-h-[500px]">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-200">
                <Navigation size={32} className="text-slate-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-400">Ready to Route</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">Enter your origin and destination to generate a traffic-aware, safety-first path.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoutePlanner;
