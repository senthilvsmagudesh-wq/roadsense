
import React, { useState } from 'react';
import { ShieldAlert, TrendingUp, AlertOctagon, Target, BrainCircuit, Loader2 } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';
import { predictSafetyHotspots } from '../services/geminiService';

const historicalData = [
  { month: 'Jan', accidents: 24, interventions: 180 },
  { month: 'Feb', accidents: 22, interventions: 210 },
  { month: 'Mar', accidents: 18, interventions: 195 },
  { month: 'Apr', accidents: 25, interventions: 240 },
  { month: 'May', accidents: 15, interventions: 280 },
  { month: 'Jun', accidents: 12, interventions: 310 },
];

const Analytics: React.FC = () => {
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictions, setPredictions] = useState<any[]>([]);

  const runPrediction = async () => {
    setIsPredicting(true);
    const mockHistory = "Past 6 months: High volume at East Crossing during rain, 3 minor collisions at Sector 4 merge.";
    const result = await predictSafetyHotspots(mockHistory);
    setPredictions(result);
    setIsPredicting(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Predictive Safety Analytics</h1>
          <p className="text-slate-500 font-medium mt-2">AI-driven risk assessment and incident forecasting</p>
        </div>
        <button 
          onClick={runPrediction}
          disabled={isPredicting}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-md disabled:opacity-50"
        >
          {isPredicting ? <Loader2 className="animate-spin" size={20} /> : <BrainCircuit size={20} />}
          Generate Safety Forecast
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-slate-800">
            <TrendingUp className="text-blue-600" />
            Accidents vs. System Interventions
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}
                />
                <Bar dataKey="accidents" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="interventions" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-6 justify-center text-[10px] font-black text-slate-400 tracking-widest uppercase">
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-rose-500 rounded"></div> ACCIDENTS</div>
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded"></div> AI INTERVENTIONS</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
           <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
            <Target className="text-purple-600" />
            Safety Score Trend
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}
                />
                <Line type="monotone" dataKey="interventions" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-slate-800">
          <ShieldAlert className="text-yellow-600" />
          AI Safety Recommendations & Hotspots
        </h2>
        
        {predictions.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center opacity-40">
            <AlertOctagon size={48} className="mb-4 text-slate-300" />
            <p className="font-bold text-slate-400">No active safety forecasts. Click "Generate Safety Forecast" to begin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {predictions.map((p, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 transition-all hover:shadow-md hover:border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.area}</span>
                  <div className={`px-2 py-1 rounded-lg text-[10px] font-black ${p.riskScore > 7 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'} border ${p.riskScore > 7 ? 'border-rose-200' : 'border-amber-200'}`}>
                    Risk: {p.riskScore}/10
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-800">Potential Collision Zone</h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed font-medium italic">"{p.reason}"</p>
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                  <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-1">Mitigation Plan</p>
                  <p className="text-xs text-slate-700 font-bold leading-relaxed">{p.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
