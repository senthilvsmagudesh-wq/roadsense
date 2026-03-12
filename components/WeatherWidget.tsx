import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, MapPin, Search, Loader2, CloudLightning, Snowflake } from 'lucide-react';
import { getWeatherAnalysis } from '../services/geminiService';
// Fix: useAppStore is the hook exported from App.tsx
import { useAppStore } from '../App';

const WeatherWidget: React.FC = () => {
  // Fix: useAppStore is the hook exported from App.tsx
  const { language } = useAppStore();
  const [city, setCity] = useState('San Francisco');
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (targetCity: string) => {
    setLoading(true);
    const data = await getWeatherAnalysis(targetCity, language);
    if (data) setWeatherData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather(city);
  }, [language]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCity(searchQuery);
      fetchWeather(searchQuery);
    }
  };

  const getWeatherIcon = (condition: string, size: number = 24) => {
    const cond = condition.toLowerCase();
    if (cond.includes('sun') || cond.includes('clear')) return <Sun className="text-yellow-500" size={size} />;
    if (cond.includes('rain')) return <CloudRain className="text-blue-500" size={size} />;
    if (cond.includes('storm') || cond.includes('thunder')) return <CloudLightning className="text-purple-500" size={size} />;
    if (cond.includes('snow')) return <Snowflake className="text-cyan-300" size={size} />;
    return <Cloud className="text-slate-400" size={size} />;
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-sm lg:text-lg font-bold flex items-center gap-2 text-slate-800">
          <Cloud className="text-blue-500 w-4 h-4 lg:w-5 lg:h-5" />
          Weather Intel
        </h2>
        <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="Search city..." 
            className="bg-slate-50 border border-slate-200 rounded-full pl-8 pr-4 py-1.5 text-xs focus:ring-1 focus:ring-blue-500/50 outline-none w-full sm:w-40"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={14} className="absolute left-3 top-2 text-slate-400" />
        </form>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-8">
          <Loader2 className="animate-spin text-blue-500" size={32} />
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Updating conditions...</p>
        </div>
      ) : weatherData ? (
        <div className="flex-1 flex flex-col justify-between space-y-4 lg:space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="p-3 lg:p-4 bg-slate-50 rounded-xl lg:rounded-2xl border border-slate-100 shadow-inner">
                {getWeatherIcon(weatherData.current.condition, 24)}
              </div>
              <div>
                <p className="text-xl lg:text-2xl font-black text-slate-900 leading-tight">
                  {Math.round(weatherData.current.temp)}°C
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] lg:text-xs font-bold text-slate-500">{weatherData.current.condition}</span>
                  <div className="flex items-center gap-1 text-[8px] lg:text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase font-bold max-w-[80px] truncate">
                    <MapPin size={8} /> {city}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-1 text-right">
              <div>
                <p className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-tighter">Humid</p>
                <p className="text-xs lg:text-sm font-bold text-slate-700 flex items-center justify-end gap-1"><Droplets size={10} className="text-blue-400" />{weatherData.current.humidity}%</p>
              </div>
              <div>
                <p className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-tighter">Wind</p>
                <p className="text-xs lg:text-sm font-bold text-slate-700 flex items-center justify-end gap-1"><Wind size={10} className="text-emerald-400" />{weatherData.current.wind}k/h</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 lg:gap-3">
            {weatherData.forecast.slice(0, 3).map((f: any, i: number) => (
              <div key={i} className="bg-slate-50/50 border border-slate-100 rounded-xl lg:rounded-2xl p-2 lg:p-3 flex flex-col items-center text-center">
                <span className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase mb-1.5 lg:mb-2">{f.day.slice(0, 3)}</span>
                <div className="mb-1.5 lg:mb-2">
                  {getWeatherIcon(f.condition, 18)}
                </div>
                <span className="text-[10px] lg:text-xs font-bold text-slate-800">{Math.round(f.temp)}°</span>
              </div>
            ))}
          </div>

          <div className="p-3 lg:p-4 bg-blue-50 border border-blue-100 rounded-xl lg:rounded-2xl">
            <p className="text-[8px] lg:text-[10px] text-blue-700 font-black uppercase tracking-widest mb-1 flex items-center gap-2">
              <Thermometer size={10} />
              AI Impact
            </p>
            <p className="text-[10px] lg:text-xs text-slate-600 leading-relaxed font-medium italic">
              "{weatherData.roadImpact}"
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center opacity-40 py-8">
          <Cloud size={40} className="text-slate-300 mb-2" />
          <p className="text-[10px] font-bold">Search a city</p>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;