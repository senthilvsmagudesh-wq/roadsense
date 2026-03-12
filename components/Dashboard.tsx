
import React from 'react';
import { 
  Car, 
  Clock, 
  ShieldAlert, 
  TrendingDown,
  Wind
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import WeatherWidget from './WeatherWidget';

const data = [
  { time: '08:00', volume: 450 },
  { time: '10:00', volume: 800 },
  { time: '12:00', volume: 600 },
  { time: '14:00', volume: 750 },
  { time: '16:00', volume: 950 },
  { time: '18:00', volume: 1100 },
  { time: '20:00', volume: 500 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <StatCard 
          title="Vehicles" 
          value="12.4K" 
          change="+12%" 
          positive={false} 
          icon={<Car className="text-blue-600 w-4 h-4 lg:w-5 lg:h-5" />} 
        />
        <StatCard 
          title="Travel" 
          value="18m" 
          change="-4m" 
          positive={true} 
          icon={<Clock className="text-emerald-600 w-4 h-4 lg:w-5 lg:h-5" />} 
        />
        <StatCard 
          title="Safety" 
          value="98.2" 
          change="+1.4%" 
          positive={true} 
          icon={<ShieldAlert className="text-yellow-600 w-4 h-4 lg:w-5 lg:h-5" />} 
        />
        <StatCard 
          title="Fuel Saved" 
          value="1.2T" 
          change="+15%" 
          positive={true} 
          icon={<Wind className="text-cyan-600 w-4 h-4 lg:w-5 lg:h-5" />} 
        />
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-8 space-y-6 lg:space-y-8 order-2 lg:order-1">
          {/* Chart Section */}
          <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <h2 className="text-sm lg:text-lg font-bold flex items-center gap-2 text-slate-800">
                <TrendingDown className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-600" />
                Traffic Volume
              </h2>
              <select className="bg-slate-50 border border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-600 rounded-lg px-2 lg:px-3 py-1 lg:py-1.5 outline-none">
                <option>24H</option>
                <option>7D</option>
              </select>
            </div>
            <div className="h-[200px] lg:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#eab308" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b', fontSize: '10px' }}
                  />
                  <Area type="monotone" dataKey="volume" stroke="#eab308" fillOpacity={1} fill="url(#colorVol)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
             <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm">
               <h2 className="text-sm lg:text-lg font-bold mb-4 lg:mb-6 text-slate-800 border-b border-slate-100 pb-3 lg:pb-4">Infrastructure</h2>
               <div className="space-y-4 lg:space-y-6">
                 <HealthItem label="Intersection A1" value={85} color="bg-yellow-500" />
                 <HealthItem label="Central Hub" value={98} color="bg-emerald-500" />
                 <HealthItem label="Highway Exit 4" value={42} color="bg-rose-500" />
               </div>
             </div>
             <div className="bg-yellow-50/50 border border-yellow-100 rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm flex flex-col justify-center">
                <p className="text-[10px] text-yellow-700 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></span>
                  Operational Alert
                </p>
                <p className="text-xs lg:text-sm text-slate-700 font-medium leading-relaxed italic border-l-2 border-yellow-400 pl-3 lg:pl-4">
                  "Current weather patterns suggests 15% increase in slippery road conditions in Northern Sectors."
                </p>
             </div>
          </div>
        </div>

        {/* Sidebar/Mobile Top section */}
        <div className="lg:col-span-4 order-1 lg:order-2">
          <WeatherWidget />
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; change: string; positive: boolean; icon: React.ReactNode }> = ({ title, value, change, positive, icon }) => (
  <div className="bg-white border border-slate-200 rounded-xl lg:rounded-2xl p-3 lg:p-6 transition-all hover:shadow-md">
    <div className="flex items-center justify-between mb-2 lg:mb-4">
      <div className="p-1.5 lg:p-3 bg-slate-50 rounded-lg border border-slate-100">{icon}</div>
      <span className={`text-[8px] lg:text-[10px] font-bold px-1.5 py-0.5 rounded-md ${positive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'} border ${positive ? 'border-emerald-100' : 'border-rose-100'}`}>
        {change}
      </span>
    </div>
    <p className="text-slate-400 text-[8px] lg:text-[10px] font-bold uppercase tracking-widest truncate">{title}</p>
    <h3 className="text-sm lg:text-2xl font-bold mt-1 text-slate-900">{value}</h3>
  </div>
);

const HealthItem: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="space-y-1.5 lg:space-y-2">
    <div className="flex justify-between text-[10px] lg:text-xs">
      <span className="text-slate-500 font-bold">{label}</span>
      <span className="font-bold text-slate-800">{value}%</span>
    </div>
    <div className="w-full h-1 lg:h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
      <div className={`h-full ${color}`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

export default Dashboard;
