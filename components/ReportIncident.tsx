
import React, { useState } from 'react';
import { AlertTriangle, MapPin, Send, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { validateIncidentReport } from '../services/geminiService';
import { IncidentReport } from '../types';

interface ReportIncidentProps {
  onReport: (report: IncidentReport) => void;
  onClose: () => void;
}

const ReportIncident: React.FC<ReportIncidentProps> = ({ onReport, onClose }) => {
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'FORM' | 'VALIDATING' | 'SUCCESS'>('FORM');
  const [validatedData, setValidatedData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !locationName) return;

    setLoading(true);
    setStep('VALIDATING');
    
    // AI Validation of User Report
    const result = await validateIncidentReport(description);
    setValidatedData(result);

    if (result.isValid) {
      const newReport: IncidentReport = {
        id: `INC-${Date.now()}`,
        type: result.category,
        description: result.cleanedDescription,
        location: locationName,
        timestamp: new Date().toLocaleTimeString(),
        status: 'Validated',
        confidence: result.confidence,
        coordinates: { lat: 37.7749, lng: -122.4194 } // Mock user location
      };
      onReport(newReport);
      setStep('SUCCESS');
      setTimeout(onClose, 2000);
    } else {
      setStep('FORM');
      setLoading(false);
      alert("AI could not validate this report. Please provide more detail (e.g., 'Car stalled on 5th Ave').");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-rose-500 p-6 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle size={20} />
            Report Incident
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg">
            <XCircle size={24} />
          </button>
        </div>

        <div className="p-6">
          {step === 'VALIDATING' ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
              <div>
                <p className="font-bold text-slate-800">AI Safety Review...</p>
                <p className="text-xs text-slate-500">Cross-referencing report context</p>
              </div>
            </div>
          ) : step === 'SUCCESS' ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center scale-up animate-in">
                <CheckCircle2 size={40} />
              </div>
              <div>
                <p className="font-bold text-slate-800">Report Broadcasted!</p>
                <p className="text-xs text-slate-500">Authorized agencies alerted</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">General Location</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="e.g. 5th St & Mission" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold text-slate-700 outline-none"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Incident Description</label>
                <textarea 
                  placeholder="Describe what's happening (e.g. Two car collision, oil spill...)" 
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-700 outline-none resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
              >
                <Send size={18} /> Submit Report
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportIncident;
