
import React, { useState, useEffect } from 'react';
import { 
  Plus, Dumbbell, Heart, Zap, Activity, Trophy, ChevronRight, X, Info, TrendingUp, BarChart3, Weight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend, CartesianGrid } from 'recharts';

// Datos simulados por defecto
const defaultEvolutionData = [
  { date: 'Lun', volume: 4500 },
  { date: 'Mar', volume: 5200 },
  { date: 'Mie', volume: 0 },
  { date: 'Jue', volume: 6100 },
  { date: 'Vie', volume: 4800 },
  { date: 'Sab', volume: 7200 },
  { date: 'Dom', volume: 0 },
];

const defaultCompositionData = [
  { date: 'S1', peso: 82, musculo: 38, grasa: 18 },
  { date: 'S2', peso: 81.5, musculo: 38.2, grasa: 17.5 },
  { date: 'S3', peso: 80.8, musculo: 38.5, grasa: 16.8 },
  { date: 'S4', peso: 79.1, musculo: 39.2, grasa: 15.2 },
];

const MUSCLE_ZONES_INFO: Record<string, { name: string, status: string, reason: string, color: string, intensity: number }> = {
  chest: { name: 'Pectoral Mayor', status: 'Fatiga Crítica', reason: 'Volumen alto en las últimas 48h. Requiere recuperación activa.', color: '#ef4444', intensity: 0.9 },
  shoulders: { name: 'Deltoides', status: 'Carga Moderada', reason: 'Tensión estabilizadora acumulada. Apto para ejercicios de aislamiento.', color: '#fbbf24', intensity: 0.5 },
  abs: { name: 'Core / Abdominales', status: 'Óptimo', reason: 'Nivel de activación basal. Listo para sesión de alta intensidad.', color: '#22c55e', intensity: 0.8 },
  biceps: { name: 'Bíceps Braquial', status: 'Descansado', reason: 'Bajo volumen semanal. Potencial máximo de fuerza disponible.', color: '#22c55e', intensity: 0.2 },
  triceps: { name: 'Tríceps', status: 'Descansado', reason: 'Sin carga significativa reciente.', color: '#22c55e', intensity: 0.1 },
  back: { name: 'Dorsal Ancho', status: 'Carga Media', reason: 'Recuperación en curso tras sesión de tracción.', color: '#fbbf24', intensity: 0.6 },
  quads: { name: 'Cuádriceps', status: 'Óptimo', reason: 'Estado de homeostasis alcanzado.', color: '#22c55e', intensity: 0.2 },
  glutes: { name: 'Glúteo Mayor', status: 'Fatiga Alta', reason: 'Gran demanda metabólica en sesión de ayer.', color: '#ef4444', intensity: 0.85 },
  hamstrings: { name: 'Isquiosurales', status: 'Descansado', reason: 'Listos para carga excéntrica.', color: '#22c55e', intensity: 0.3 }
};

const MuscleHeatPoint = ({ id, path, zoneKey, onSelect }: { id: string, path: string, zoneKey: string, onSelect: (key: string) => void }) => {
  const zone = MUSCLE_ZONES_INFO[zoneKey] || { color: '#262626', intensity: 0 };
  const gradId = `heat-grad-${id}`;
  return (
    <g className="cursor-pointer transition-opacity hover:opacity-80" onClick={() => onSelect(zoneKey)}>
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={zone.color} stopOpacity={0.8 * zone.intensity} />
          <stop offset="70%" stopColor={zone.color} stopOpacity={0.2 * zone.intensity} />
          <stop offset="100%" stopColor={zone.color} stopOpacity="0" />
        </radialGradient>
        <filter id={`heat-blur-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <path d={path} fill={`url(#${gradId})`} filter={`url(#heat-blur-${id})`} />
      <path d={path} fill="none" stroke="white" strokeWidth="0.3" strokeOpacity="0.15" />
    </g>
  );
};

const Dashboard: React.FC<{ onNewWorkout: () => void, onNewMetrics: () => void, userMetrics?: any }> = ({ onNewWorkout, onNewMetrics, userMetrics }) => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState(defaultCompositionData);

  useEffect(() => {
    const savedHistory = localStorage.getItem('aura_metrics_history');
    if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (parsed.length > 1) {
            setHistoryData(parsed.map((m: any, idx: number) => ({
                date: `Log ${idx + 1}`,
                peso: m.peso,
                musculo: m.musculo,
                grasa: m.grasa
            })));
        }
    }
  }, [userMetrics]);

  return (
    <div className="flex flex-col gap-10 pb-60 animate-in fade-in duration-1000 bg-aura-dark min-h-screen relative">
      
      {/* FAB - ÚNICAMENTE EN HOME */}
      <div className="fixed bottom-36 right-8 z-[100] animate-in slide-in-from-bottom duration-700">
        <button onClick={onNewWorkout} className="w-20 h-20 bg-aura-blue text-white rounded-[32px] flex items-center justify-center shadow-[0_25px_50px_-12px_rgba(59,130,246,0.6)] active:scale-90 transition-all border-2 border-white/20">
          <Plus className="w-10 h-10 stroke-[4px]" />
        </button>
      </div>

      {/* Header */}
      <div className="px-8 pt-16 flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none text-white drop-shadow-2xl">AURA</h1>
          <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.5em] mt-2">Bio-Scanner v4.1</p>
        </div>
        <div className="w-16 h-16 rounded-[24px] overflow-hidden border-2 border-aura-blue/40 rotate-6 shadow-2xl bg-aura-surface p-1">
          <img src="https://picsum.photos/seed/aura-v9/200" alt="Avatar" className="w-full h-full object-cover rounded-[18px]" />
        </div>
      </div>

      {/* Resumen Biométrico Actual */}
      <div className="px-6 grid grid-cols-2 gap-4">
          <div className="bg-aura-surface p-8 rounded-[44px] border border-white/5 space-y-2">
              <p className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Peso Actual</p>
              <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black italic text-white">{userMetrics?.peso || '79.1'}</span>
                  <span className="text-xs text-gray-700 font-black">KG</span>
              </div>
          </div>
          <div className="bg-aura-surface p-8 rounded-[44px] border border-white/5 space-y-2 text-right">
              <p className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Grasa Corporal</p>
              <div className="flex items-baseline gap-1 justify-end">
                  <span className="text-4xl font-black italic text-red-500">{userMetrics?.grasa || '14.5'}</span>
                  <span className="text-xs text-gray-700 font-black">%</span>
              </div>
          </div>
      </div>

      {/* Evolución Gráfica Real */}
      <div className="px-6">
        <div className="bg-aura-surface rounded-[56px] p-12 border border-white/5 shadow-2xl space-y-10">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-aura-green" />
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Evolución Física</h3>
                </div>
                <button onClick={onNewMetrics} className="p-3 bg-white/5 rounded-2xl"><Plus className="w-4 h-4 text-gray-400"/></button>
            </div>
            <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                        <XAxis dataKey="date" stroke="#404040" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Tooltip contentStyle={{ backgroundColor: '#171717', border: 'none', borderRadius: '16px', fontSize: '10px' }} />
                        <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '8px', fontWeight: '900', textTransform: 'uppercase' }} />
                        <Line type="monotone" dataKey="peso" stroke="#3b82f6" strokeWidth={5} dot={{ r: 6, fill: '#3b82f6', strokeWidth: 0 }} name="Peso" />
                        <Line type="monotone" dataKey="musculo" stroke="#22c55e" strokeWidth={5} dot={{ r: 6, fill: '#22c55e', strokeWidth: 0 }} name="Músculo" />
                        <Line type="monotone" dataKey="grasa" stroke="#ef4444" strokeWidth={5} dot={{ r: 6, fill: '#ef4444', strokeWidth: 0 }} name="Grasa" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Heatmap de Fatiga */}
      <div className="px-6">
        <div className="bg-aura-surface rounded-[56px] p-10 border border-white/5 space-y-12 shadow-2xl relative overflow-hidden">
            <h4 className="text-[11px] font-black uppercase text-gray-500 tracking-[0.3em]">Neural Load Map</h4>
            
            <div className="flex justify-around items-center pt-4">
                <div className="flex flex-col items-center gap-6">
                    <svg viewBox="0 0 100 220" className="h-64 w-auto drop-shadow-2xl">
                        <path d="M50,15 C58,15 64,22 64,32 C64,42 58,50 50,50 C42,50 36,42 36,32 C36,22 42,15 50,15" fill="#1a1a1a" />
                        <MuscleHeatPoint id="f-chest" zoneKey="chest" onSelect={setSelectedZone} path="M32,58 Q50,48 68,58 L72,95 Q50,105 28,95 Z" />
                        <MuscleHeatPoint id="f-shoulders-l" zoneKey="shoulders" onSelect={setSelectedZone} path="M24,58 Q18,62 22,85 Q28,85 30,70 Z" />
                        <MuscleHeatPoint id="f-shoulders-r" zoneKey="shoulders" onSelect={setSelectedZone} path="M76,58 Q82,62 78,85 Q72,85 70,70 Z" />
                        <MuscleHeatPoint id="f-abs" zoneKey="abs" onSelect={setSelectedZone} path="M42,105 Q50,100 58,105 L56,155 Q50,165 44,155 Z" />
                        <MuscleHeatPoint id="f-quads-l" zoneKey="quads" onSelect={setSelectedZone} path="M32,165 Q25,200 35,215 Q45,215 46,165 Z" />
                        <MuscleHeatPoint id="f-quads-r" zoneKey="quads" onSelect={setSelectedZone} path="M68,165 Q75,200 65,215 Q55,215 54,165 Z" />
                    </svg>
                    <span className="text-[10px] font-black uppercase text-gray-700 tracking-[0.3em]">Anterior</span>
                </div>
                <div className="flex flex-col items-center gap-6">
                    <svg viewBox="0 0 100 220" className="h-64 w-auto drop-shadow-2xl">
                        <path d="M50,15 C58,15 64,22 64,32 C64,42 58,50 50,50 C42,50 36,42 36,32 C36,22 42,15 50,15" fill="#1a1a1a" />
                        <MuscleHeatPoint id="b-back" zoneKey="back" onSelect={setSelectedZone} path="M30,55 Q50,65 70,55 L76,105 Q50,120 24,105 Z" />
                        <MuscleHeatPoint id="b-triceps-l" zoneKey="triceps" onSelect={setSelectedZone} path="M22,75 Q16,110 20,135 Q26,135 28,100 Z" />
                        <MuscleHeatPoint id="b-triceps-r" zoneKey="triceps" onSelect={setSelectedZone} path="M78,75 Q84,110 80,135 Q74,135 72,100 Z" />
                        <MuscleHeatPoint id="b-glutes" zoneKey="glutes" onSelect={setSelectedZone} path="M32,135 Q50,125 68,135 L65,170 Q50,180 35,170 Z" />
                    </svg>
                    <span className="text-[10px] font-black uppercase text-gray-700 tracking-[0.3em]">Posterior</span>
                </div>
            </div>

            {selectedZone && (
                <div className="absolute inset-0 z-20 bg-aura-dark/95 backdrop-blur-xl animate-in fade-in duration-300 flex flex-col p-10 justify-center text-center">
                    <button onClick={() => setSelectedZone(null)} className="absolute top-8 right-8 p-3 bg-white/5 rounded-2xl"><X className="w-6 h-6"/></button>
                    <Activity className="w-16 h-16 mx-auto mb-6" style={{ color: MUSCLE_ZONES_INFO[selectedZone].color }} />
                    <h5 className="text-3xl font-black italic uppercase text-white mb-2">{MUSCLE_ZONES_INFO[selectedZone].name}</h5>
                    <p className="text-sm text-gray-400 font-medium leading-relaxed bg-white/5 p-8 rounded-[40px] italic">"{MUSCLE_ZONES_INFO[selectedZone].reason}"</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
