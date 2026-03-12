
import React, { useState } from 'react';
import { TrafficCone, Smartphone, CreditCard, Loader2, ChevronRight, ShieldCheck } from 'lucide-react';
import { verifyLicense } from '../services/geminiService';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [mobile, setMobile] = useState('');
  const [license, setLicense] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length < 10 || license.length < 5) {
      setError('Please enter valid mobile and license details.');
      return;
    }

    setLoading(true);
    setError('');
    
    // Simulate Gemini License Verification
    const verification = await verifyLicense(license);
    
    if (verification.isAuthorized) {
      onLogin({ mobile, name: verification.name, license });
    } else {
      setError('Driving License verification failed. Please check details.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen road-theme-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-yellow-500 p-8 flex flex-col items-center text-white relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <TrafficCone size={120} className="absolute -top-10 -right-10 rotate-12" />
          </div>
          <div className="bg-white p-3 rounded-2xl shadow-lg mb-4">
            <TrafficCone className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">RoadSense Login</h1>
          <p className="text-yellow-100 text-xs font-bold uppercase tracking-widest mt-1">Authorized Access Only</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl text-rose-600 text-xs font-bold flex items-center gap-2">
              <ShieldCheck size={16} />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Number</label>
            <div className="relative">
              <Smartphone size={18} className="absolute left-3 top-3 text-slate-400" />
              <input 
                type="tel" 
                placeholder="9876543210" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all font-bold text-slate-700"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Driving License ID</label>
            <div className="relative">
              <CreditCard size={18} className="absolute left-3 top-3 text-slate-400" />
              <input 
                type="text" 
                placeholder="DL-XXXXXXXXXXXX" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all font-bold text-slate-700 uppercase"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                Verify & Enter <ChevronRight size={20} />
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-slate-400 font-medium italic">
            By logging in, you agree to report traffic data responsibly for municipal safety.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
