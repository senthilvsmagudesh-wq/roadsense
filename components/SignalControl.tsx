
import React, { useState } from 'react';
import { RotateCcw, Info } from 'lucide-react';

const signalsInitial = [
  { id: 'INT-001', name: 'Main & 5th St', mode: 'Auto', color: 'Green', time: 45 },
  { id: 'INT-002', name: 'West Gate Pkwy', mode: 'Auto', color: 'Red', time: 12 },
  { id: 'INT-003', name: 'Commerce Ave', mode: 'Manual', color: 'Yellow', time: 3 },
  { id: 'INT-004', name: 'University Blvd', mode: 'Auto', color: 'Green', time: 58 },
];

const SignalControl: React.FC = () => {
  const [signals, setSignals] = useState(signalsInitial);

  const toggleMode = (id: string) => {
    setSignals(prev => prev.map(s => s.id === id ? { ...s, mode: s.mode === 'Auto' ? 'Manual' : 'Auto' } : s));
  };

  const changeColor = (id: string, color: string) => {
    setSignals(prev => prev.map(s => s.id === id ? { ...s, color: color as any } : s));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-gradient-to-r from-yellow-500 to-amber-600 rounded-3xl p-8 text-white shadow-md flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Adaptive Signal Control</h2>
          <p className="text-yellow-50 font-medium max-w-lg">Manage city-wide intersection timings or allow AI-driven adaptive cycles based on real-time metrics.</p>
        </div>
        <button className="bg-white/20 backdrop-blur hover:bg-white/30 px-8 py-3 rounded-2xl font-bold border border-white/30 transition-all shadow-sm">
          Deploy Global AI Strategy
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {signals.map((sig) => (
          <div key={sig.id} className="bg-white border border-slate-200 rounded-2xl p-6 overflow-hidden relative shadow-sm transition-all hover:shadow-md">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full opacity-10 blur-2xl ${
              sig.color === 'Green' ? 'bg-emerald-500' : sig.color === 'Red' ? 'bg-red-500' : 'bg-amber-500'
            }`}></div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{sig.id}</span>
                <h3 className="text-lg font-bold text-slate-800">{sig.name}</h3>
              </div>
              <button 
                onClick={() => toggleMode(sig.id)}
                className={`text-[10px] font-black px-2 py-1 rounded-full border ${
                  sig.mode === 'Auto' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                } uppercase tracking-tight`}
              >
                {sig.mode}
              </button>
            </div>

            <div className="flex flex-col items-center justify-center py-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
              <div className={`text-5xl font-mono font-black mb-2 ${
                 sig.color === 'Green' ? 'text-emerald-600' : sig.color === 'Red' ? 'text-rose-600' : 'text-amber-600'
              }`}>
                {sig.time < 10 ? `0${sig.time}` : sig.time}
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Seconds Remaining</span>
            </div>

            <div className="flex gap-2">
              <SignalButton 
                color="Red" 
                active={sig.color === 'Red'} 
                onClick={() => changeColor(sig.id, 'Red')} 
                disabled={sig.mode === 'Auto'}
              />
              <SignalButton 
                color="Yellow" 
                active={sig.color === 'Yellow'} 
                onClick={() => changeColor(sig.id, 'Yellow')} 
                disabled={sig.mode === 'Auto'}
              />
              <SignalButton 
                color="Green" 
                active={sig.color === 'Green'} 
                onClick={() => changeColor(sig.id, 'Green')} 
                disabled={sig.mode === 'Auto'}
              />
            </div>

            {sig.mode === 'Auto' && (
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-emerald-600 font-bold">
                <RotateCcw size={12} className="animate-spin" />
                <span className="text-[10px] italic tracking-tight">AI Synchronizing...</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-start gap-4 shadow-sm">
        <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
          <Info className="text-blue-600" size={24} />
        </div>
        <div>
          <h4 className="font-bold text-slate-800">System Information</h4>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed font-medium">
            In "Auto" mode, the system uses the <b>Gemini Omni-Logic Engine</b> to calculate optimal timing offsets between neighboring intersections. 
            This reduces the "Stop-and-Go" wave effect, potentially saving up to 200 gallons of fuel daily per corridor.
          </p>
        </div>
      </div>
    </div>
  );
};

const SignalButton: React.FC<{ color: string; active: boolean; onClick: () => void; disabled: boolean }> = ({ color, active, onClick, disabled }) => {
  const colorMap: any = {
    Red: active ? 'bg-rose-600 text-white shadow-md' : 'bg-rose-50 text-rose-300 border border-rose-100',
    Yellow: active ? 'bg-amber-500 text-white shadow-md' : 'bg-amber-50 text-amber-300 border border-amber-100',
    Green: active ? 'bg-emerald-600 text-white shadow-md' : 'bg-emerald-50 text-emerald-300 border border-emerald-100'
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 py-2 rounded-lg font-black text-xs transition-all ${colorMap[color]} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    >
      {color.charAt(0)}
    </button>
  );
};

export default SignalControl;
