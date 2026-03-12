
import React, { useState } from 'react';
import { Truck, MapPin, Navigation, Siren, BellRing, CheckCircle2 } from 'lucide-react';

const EmergencyHub: React.FC = () => {
  const [activeResponders, setActiveResponders] = useState([
    { id: 'AMB-102', type: 'Ambulance', origin: 'Central Hosp', destination: 'Sector 4 Junction', priority: 'High', status: 'En Route' },
    { id: 'FIRE-44', type: 'Fire', origin: 'Station 2', destination: 'Industrial Zone', priority: 'Critical', status: 'Corridor Active' },
  ]);

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl lg:rounded-3xl p-4 lg:p-8 shadow-sm">
            <h2 className="text-xl lg:text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900">
              <Siren className="text-rose-600 animate-pulse w-5 h-5 lg:w-6 lg:h-6" />
              Response Matrix
            </h2>

            <div className="space-y-4">
              {activeResponders.map((res) => (
                <div key={res.id} className="bg-slate-50 border border-slate-200 rounded-xl lg:rounded-2xl p-4 lg:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 lg:gap-6 shadow-sm">
                  <div className={`p-3 lg:p-4 rounded-full border ${res.type === 'Ambulance' ? 'bg-rose-100 text-rose-600 border-rose-200' : 'bg-orange-100 text-orange-600 border-orange-200'}`}>
                    <Truck size={24} className="lg:w-8 lg:h-8" />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[8px] lg:text-[10px] font-black text-slate-400 tracking-widest">{res.id}</span>
                      <span className="bg-rose-100 text-rose-700 text-[8px] lg:text-[10px] font-black px-1.5 lg:px-2 py-0.5 rounded border border-rose-200 uppercase tracking-tight">
                        {res.priority}
                      </span>
                    </div>
                    <h3 className="text-base lg:text-xl font-bold text-slate-800">{res.type} Dispatch</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[10px] lg:text-sm text-slate-500 font-medium">
                      <div className="flex items-center gap-1"><MapPin size={12} className="text-slate-400" /> {res.origin}</div>
                      <div className="hidden md:block w-4 h-px bg-slate-200"></div>
                      <div className="flex items-center gap-1"><Navigation size={12} className="text-slate-400" /> {res.destination}</div>
                    </div>
                  </div>
                  <div className="w-full md:w-auto text-left md:text-right flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3">
                    <span className={`text-[10px] lg:text-sm font-black uppercase tracking-tight ${res.status === 'Corridor Active' ? 'text-emerald-600' : 'text-blue-600'}`}>
                      {res.status}
                    </span>
                    <button className="bg-rose-600 hover:bg-rose-700 text-white px-3 lg:px-6 py-1.5 lg:py-2 rounded-lg lg:rounded-xl text-[10px] lg:text-sm font-bold shadow-md transition-all">
                      Corridor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl lg:rounded-3xl p-4 lg:p-8 shadow-sm">
            <h2 className="text-lg lg:text-xl font-bold mb-6 text-slate-800">History</h2>
            <div className="overflow-x-auto -mx-4 lg:mx-0">
              <table className="w-full text-left text-xs lg:text-sm text-slate-500 min-w-[300px] px-4">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 px-4 font-black uppercase tracking-widest text-[8px] lg:text-[10px]">ID</th>
                    <th className="pb-4 font-black uppercase tracking-widest text-[8px] lg:text-[10px]">Time</th>
                    <th className="pb-4 text-right px-4 font-black uppercase tracking-widest text-[8px] lg:text-[10px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-800">AMB-99</td>
                    <td className="py-4 font-medium text-slate-500">4m 12s</td>
                    <td className="py-4 text-emerald-600 text-right px-4"><CheckCircle2 size={16} className="inline-block" /></td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-800">POL-22</td>
                    <td className="py-4 font-medium text-slate-500">2m 45s</td>
                    <td className="py-4 text-emerald-600 text-right px-4"><CheckCircle2 size={16} className="inline-block" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl lg:rounded-3xl p-4 lg:p-8 shadow-sm">
            <h2 className="text-lg lg:text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
              <BellRing className="text-blue-600 w-5 h-5 lg:w-6 lg:h-6" />
              Quick Dispatch
            </h2>
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              <DispatchBtn icon={<Truck className="text-rose-600" size={20} />} label="Med-Evac" />
              <DispatchBtn icon={<Truck className="text-orange-600" size={20} />} label="Fire" />
              <DispatchBtn icon={<Truck className="text-blue-600" size={20} />} label="Police" />
              <DispatchBtn icon={<Truck className="text-emerald-600" size={20} />} label="Rescue" />
            </div>
            <div className="mt-6 lg:mt-8 p-3 lg:p-4 bg-slate-50 rounded-xl lg:rounded-2xl border border-slate-100">
              <p className="text-[10px] lg:text-xs text-slate-500 font-medium italic leading-relaxed">
                AI automated corridor management ensures all signals switch to green 15s before arrival.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl lg:rounded-3xl p-4 lg:p-8 shadow-sm">
            <h2 className="text-lg lg:text-xl font-bold mb-6 text-slate-800">Zones</h2>
            <div className="space-y-4">
              <ZoneItem label="Central Hub" status="Stable" color="bg-emerald-500" />
              <ZoneItem label="Sector 4" status="Caution" color="bg-amber-500" />
              <ZoneItem label="Ind. Loop" status="Stable" color="bg-emerald-500" />
              <ZoneItem label="South Gate" status="Traffic" color="bg-rose-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DispatchBtn: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <button className="flex flex-col items-center justify-center p-4 lg:p-6 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all rounded-xl lg:rounded-2xl group shadow-sm">
    <div className="mb-2 lg:mb-3 group-hover:scale-110 transition-transform">{icon}</div>
    <span className="text-[8px] lg:text-[10px] font-black text-slate-600 tracking-widest uppercase truncate w-full">{label}</span>
  </button>
);

const ZoneItem: React.FC<{ label: string; status: string; color: string }> = ({ label, status, color }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 lg:gap-3">
      <div className={`w-2 lg:w-2.5 h-2 lg:h-2.5 rounded-full ${color} shadow-sm`}></div>
      <span className="text-[11px] lg:text-sm font-bold text-slate-700">{label}</span>
    </div>
    <span className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-tighter">{status}</span>
  </div>
);

export default EmergencyHub;
