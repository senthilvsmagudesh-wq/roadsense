
import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Activity, 
  Map as MapIcon, 
  Truck, 
  Settings, 
  BarChart3, 
  TrafficCone,
  Menu,
  X,
  Bell,
  Globe,
  Languages,
  PlusCircle,
  LogOut,
  AlertTriangle,
  Route as RouteIcon
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import LiveFeed from './components/LiveFeed';
import SignalControl from './components/SignalControl';
import EmergencyHub from './components/EmergencyHub';
import Analytics from './components/Analytics';
import TrafficMap from './components/TrafficMap';
import RoutePlanner from './components/RoutePlanner';
import LoginPage from './components/LoginPage';
import ReportIncident from './components/ReportIncident';
import { IncidentReport } from './types';

// Global Context for App State
const AppContext = createContext({
  language: 'English',
  setLanguage: (l: string) => {},
  user: null as any,
  logout: () => {},
  incidents: [] as IncidentReport[],
  addIncident: (inc: IncidentReport) => {}
});

export const useAppStore = () => useContext(AppContext);

const App: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [language, setLanguage] = useState('English');
  const [user, setUser] = useState<any>(null);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  
  const languages = [
    { name: 'English', code: 'en' },
    { name: 'Spanish', code: 'es' },
    { name: 'French', code: 'fr' },
    { name: 'Hindi', code: 'hi' },
    { name: 'German', code: 'de' }
  ];

  const addIncident = (inc: IncidentReport) => {
    setIncidents(prev => [inc, ...prev]);
  };

  const logout = () => setUser(null);

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <AppContext.Provider value={{ language, setLanguage, user, logout, incidents, addIncident }}>
      <Router>
        <div className="flex h-screen text-slate-900 overflow-hidden bg-slate-50">
          {/* Desktop Sidebar */}
          <aside className={`hidden lg:flex flex-col z-50 transition-all duration-300 bg-white/90 backdrop-blur-xl border-r border-slate-200 shadow-sm ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
            <div className="p-6 flex items-center justify-between">
              {isSidebarOpen && (
                <div className="flex items-center gap-2 font-bold text-xl text-yellow-600">
                  <div className="bg-yellow-100 p-2 rounded-lg border border-yellow-200 shadow-sm">
                    <TrafficCone className="w-6 h-6 text-yellow-600" />
                  </div>
                  <span className="tracking-tight text-slate-900 font-bold">RoadSense</span>
                </div>
              )}
              {!isSidebarOpen && (
                 <div className="bg-yellow-100 p-2 rounded-lg border border-yellow-200 mx-auto">
                   <TrafficCone className="w-6 h-6 text-yellow-600" />
                 </div>
              )}
              <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors ml-auto">
                <Menu size={20} className="text-slate-500" />
              </button>
            </div>

            <nav className="flex-1 mt-6 px-4 space-y-2">
              <SidebarItem to="/" icon={<Activity size={20} />} label="Dashboard" expanded={isSidebarOpen} />
              <SidebarItem to="/planner" icon={<RouteIcon size={20} />} label="Route Planner" expanded={isSidebarOpen} />
              <SidebarItem to="/map" icon={<Globe size={20} />} label="Traffic Intel" expanded={isSidebarOpen} />
              <SidebarItem to="/live" icon={<MapIcon size={20} />} label="Live CV Audit" expanded={isSidebarOpen} />
              <SidebarItem to="/signals" icon={<Settings size={20} />} label="Signal Control" expanded={isSidebarOpen} />
              <SidebarItem to="/emergency" icon={<Truck size={20} />} label="Emergency Hub" expanded={isSidebarOpen} />
              <SidebarItem to="/analytics" icon={<BarChart3 size={20} />} label="Safety Analytics" expanded={isSidebarOpen} />
            </nav>

            <div className="p-4 border-t border-slate-100 space-y-2">
               <button 
                onClick={() => setReportModalOpen(true)}
                className={`w-full flex items-center gap-3 p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition-all shadow-lg active:scale-[0.98] ${!isSidebarOpen && 'justify-center px-0'}`}
               >
                 <AlertTriangle size={20} />
                 {isSidebarOpen && "Report Incident"}
               </button>
               <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3 border border-slate-200 relative group">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center font-bold text-white shadow-sm shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  {isSidebarOpen && (
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">User Profile</p>
                      <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                    </div>
                  )}
                  <button onClick={logout} className={`p-2 text-slate-400 hover:text-rose-600 ${!isSidebarOpen && 'absolute inset-0 opacity-0'}`}>
                    <LogOut size={16} />
                  </button>
               </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col relative overflow-hidden h-full pb-16 lg:pb-0">
            {/* Header */}
            <header className="h-14 lg:h-16 border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 bg-white/70 backdrop-blur-md sticky top-0 z-40 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="lg:hidden bg-yellow-100 p-1.5 rounded-lg border border-yellow-200">
                  <TrafficCone className="w-5 h-5 text-yellow-600" />
                </div>
                <h1 className="text-sm font-bold text-slate-800 lg:text-slate-500 uppercase tracking-widest">
                  <span className="lg:hidden">RoadSense</span>
                  <span className="hidden lg:inline text-xs">Integrated Environment</span>
                </h1>
              </div>
              
              <div className="flex items-center gap-2 lg:gap-6">
                <div className="hidden sm:flex items-center gap-2 bg-slate-100/50 rounded-full px-3 py-1 border border-slate-200">
                  <Languages size={14} className="text-slate-400" />
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-transparent text-[10px] font-bold text-slate-600 outline-none cursor-pointer"
                  >
                    {languages.map((l) => (
                      <option key={l.code} value={l.name}>{l.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 text-emerald-600 text-[10px] lg:text-xs font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="hidden md:inline">Network Active</span>
                </div>
                
                <button className="relative p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-yellow-500 rounded-full border-2 border-white shadow-sm"></span>
                </button>
              </div>
            </header>

            {/* Viewport */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
              <div className="max-w-7xl mx-auto min-h-full">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/planner" element={<RoutePlanner />} />
                  <Route path="/map" element={<TrafficMap />} />
                  <Route path="/live" element={<LiveFeed />} />
                  <Route path="/signals" element={<SignalControl />} />
                  <Route path="/emergency" element={<EmergencyHub />} />
                  <Route path="/analytics" element={<Analytics />} />
                </Routes>
              </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 px-2 z-50">
              <BottomNavItem to="/" icon={<Activity size={20} />} label="Home" />
              <BottomNavItem to="/planner" icon={<RouteIcon size={20} />} label="Route" />
              <button 
                onClick={() => setReportModalOpen(true)}
                className="flex flex-col items-center justify-center -mt-8 bg-rose-600 text-white w-14 h-14 rounded-full shadow-lg border-4 border-white active:scale-95 transition-all"
              >
                <AlertTriangle size={24} />
              </button>
              <BottomNavItem to="/map" icon={<Globe size={20} />} label="Intel" />
              <BottomNavItem to="/analytics" icon={<BarChart3 size={20} />} label="Stats" />
            </nav>

            {isReportModalOpen && (
              <ReportIncident 
                onReport={addIncident} 
                onClose={() => setReportModalOpen(false)} 
              />
            )}
          </main>
        </div>
      </Router>
    </AppContext.Provider>
  );
};

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, expanded }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
        isActive 
          ? 'bg-yellow-50 text-yellow-700 border border-yellow-200 shadow-sm' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
      }`}
    >
      <div className={isActive ? 'text-yellow-600' : ''}>{icon}</div>
      {expanded && <span className="font-bold text-sm tracking-tight">{label}</span>}
    </Link>
  );
};

const BottomNavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
        isActive ? 'text-yellow-600' : 'text-slate-400'
      }`}
    >
      <div className={`${isActive ? 'scale-110' : 'scale-100'} transition-transform`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </Link>
  );
};

export default App;
