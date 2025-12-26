
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Camera, Sparkles, Loader2, Scale, Zap, Ruler, Activity, Flame, Shield, Database } from 'lucide-react';
import { analyzeBodyPhoto } from '../geminiService';
import { calculateBMI } from '../utils';

const BodyRegistration: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  
  // Usamos nombres de variables que coincidan con lo que espera el Dashboard
  const [metrics, setMetrics] = useState({
    peso: 79.1,
    height: 180,
    grasa: 14.5,
    musculo: 42.1,
    hueso: 3.2
  });

  useEffect(() => {
    const last = localStorage.getItem('aura_last_metrics');
    if (last) {
        setMetrics(JSON.parse(last));
    }
  }, []);

  const handleMetricChange = (key: string, value: string) => {
    const num = parseFloat(value) || 0;
    setMetrics(prev => ({ ...prev, [key]: num }));
  };

  const handleSave = () => {
    const bmi = calculateBMI(metrics.peso, metrics.height);
    const fullMetrics = { ...metrics, bmi, date: new Date().toISOString() };
    
    // Guardamos en localStorage para que el Dashboard lo detecte
    localStorage.setItem('aura_last_metrics', JSON.stringify(fullMetrics));
    
    // También guardamos un histórico simple para la gráfica si no existe
    const history = JSON.parse(localStorage.getItem('aura_metrics_history') || '[]');
    history.push(fullMetrics);
    localStorage.setItem('aura_metrics_history', JSON.stringify(history.slice(-10))); // Guardamos últimos 10 logs
    
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-aura-dark z-[130] flex flex-col animate-in slide-in-from-bottom duration-600 overflow-y-auto pb-40">
      <div className="sticky top-0 glass z-50 px-8 py-10 flex items-center justify-between border-b border-white/5">
        <button onClick={onCancel} className="p-4 bg-white/5 rounded-2xl active:scale-90 transition-all">
          <ChevronLeft className="w-7 h-7" />
        </button>
        <h1 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">Bio-Logger Hub</h1>
        <button onClick={handleSave} className="bg-aura-blue text-white font-black uppercase text-[10px] px-8 py-4 rounded-2xl shadow-lg shadow-aura-blue/20 active:scale-95 transition-all">Guardar</button>
      </div>

      <div className="px-8 space-y-12 mt-8">
        <div className="space-y-3 text-center">
            <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter">Métricas Vitales</h2>
            <p className="text-[10px] text-aura-blue font-bold uppercase tracking-widest italic">Actualiza tu composición corporal</p>
        </div>
        
        {/* Progress Photo */}
        <div className="relative aspect-square bg-aura-surface rounded-[60px] border-2 border-dashed border-white/5 flex items-center justify-center overflow-hidden shadow-2xl">
            {photo ? (
                <div className="relative w-full h-full">
                    <img src={photo} alt="Body Progress" className="w-full h-full object-cover" />
                    <button onClick={() => setPhoto(null)} className="absolute top-8 right-8 p-4 bg-black/70 rounded-full backdrop-blur-xl border border-white/10">
                        <Zap className="w-6 h-6 text-white fill-current"/>
                    </button>
                </div>
            ) : (
                <label className="cursor-pointer flex flex-col items-center gap-6 p-12 text-center group">
                    <div className="p-10 bg-white/5 rounded-full text-gray-700 group-hover:text-aura-blue transition-all">
                        <Camera className="w-16 h-16" />
                    </div>
                    <span className="text-[11px] font-black uppercase text-gray-500 tracking-[0.3em]">Cargar Foto</span>
                    <input type="file" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setPhoto(reader.result as string);
                            reader.readAsDataURL(file);
                        }
                    }} />
                </label>
            )}
        </div>

        {/* Peso y Estatura */}
        <div className="bg-aura-surface p-10 rounded-[50px] border border-white/5 shadow-inner grid grid-cols-2 gap-8 relative">
            <div className="space-y-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">Estatura (cm)</span>
                <input type="number" value={metrics.height} onChange={e => handleMetricChange('height', e.target.value)} className="bg-transparent text-5xl font-black italic outline-none text-white w-full" />
            </div>
            <div className="w-px h-16 bg-white/5 absolute left-1/2 top-1/2 -translate-y-1/2" />
            <div className="space-y-4 pl-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">Peso (kg)</span>
                <input type="number" step="0.1" value={metrics.peso} onChange={e => handleMetricChange('peso', e.target.value)} className="bg-transparent text-5xl font-black italic outline-none text-white w-full" />
            </div>
        </div>

        {/* % Grasa, Músculo y Hueso */}
        <div className="grid grid-cols-3 gap-5">
            {[
                { label: 'Grasa %', key: 'grasa', icon: Flame, color: 'text-red-500', bg: 'bg-red-500/10' },
                { label: 'Músculo %', key: 'musculo', icon: Activity, color: 'text-aura-green', bg: 'bg-aura-green/10' },
                { label: 'Hueso %', key: 'hueso', icon: Database, color: 'text-aura-blue', bg: 'bg-aura-blue/10' }
            ].map((item) => (
                <div key={item.key} className="bg-aura-surface p-6 rounded-[36px] border border-white/5 space-y-4 shadow-xl">
                    <div className={`p-3 w-fit rounded-xl ${item.bg} ${item.color}`}>
                        <item.icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                        <input 
                            type="number" 
                            step="0.1" 
                            value={(metrics as any)[item.key]} 
                            onChange={e => handleMetricChange(item.key, e.target.value)} 
                            className="bg-transparent text-2xl font-black italic outline-none text-white w-full" 
                        />
                        <p className="text-[8px] font-black uppercase text-gray-600 tracking-tighter">{item.label}</p>
                    </div>
                </div>
            ))}
        </div>

        <button 
            disabled={!photo || loading}
            onClick={async () => {
                setLoading(true);
                const res = await analyzeBodyPhoto(photo!, { weight: metrics.peso, height: metrics.height });
                setAnalysis(res || null);
                setLoading(false);
            }}
            className="w-full py-8 bg-gradient-to-br from-aura-blue to-indigo-900 rounded-[40px] font-black italic uppercase text-2xl shadow-2xl flex items-center justify-center gap-5 active:scale-95 transition-all disabled:opacity-30"
        >
            {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Sparkles className="w-8 h-8" />}
            IA Scanner
        </button>

        {analysis && (
            <div className="bg-aura-surface p-10 rounded-[50px] border border-aura-blue/30 space-y-6 animate-in slide-in-from-top duration-700 shadow-3xl mb-12 relative overflow-hidden">
                <div className="flex items-center gap-4 text-aura-blue">
                    <Zap className="w-6 h-6 fill-current" />
                    <h4 className="font-black uppercase tracking-[0.2em] text-sm italic">Reporte de IA</h4>
                </div>
                <p className="text-xs text-gray-400 font-medium leading-relaxed italic whitespace-pre-wrap">{analysis}</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default BodyRegistration;
