
import React from 'react';
// Added Activity to the imports
import { ChevronLeft, TrendingUp, Zap, Target, History, Trophy, Maximize, Target as Bullseye, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';

const mockHistory = [
  { date: '12 Ene', weight: 60, reps: 12, rpe: 8 },
  { date: '19 Ene', weight: 65, reps: 10, rpe: 9 },
  { date: '26 Ene', weight: 70, reps: 8, rpe: 9 },
  { date: '02 Feb', weight: 70, reps: 10, rpe: 10 },
  { date: '09 Feb', weight: 75, reps: 6, rpe: 9 },
];

interface ExerciseDetailProps {
  exercise: any;
  onBack: () => void;
}

const ExerciseDetail: React.FC<ExerciseDetailProps> = ({ exercise, onBack }) => {
  const isCrossfit = exercise.category === 'Crossfit';

  return (
    <div className="fixed inset-0 bg-aura-dark z-[60] flex flex-col animate-in slide-in-from-right duration-300 overflow-y-auto pb-40">
      <div className="sticky top-0 glass z-10 px-6 py-8 flex items-center gap-4">
        <button onClick={onBack} className="p-3 bg-white/5 rounded-2xl">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">{exercise.name}</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{exercise.muscle_group}</p>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* New Performance Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-aura-surface rounded-3xl p-6 border border-white/5">
              <div className="flex justify-between items-start mb-4">
                 <Trophy className="w-5 h-5 text-aura-blue" />
                 <span className="text-[8px] font-black uppercase text-gray-600">All Time</span>
              </div>
              <p className="text-[9px] font-black uppercase text-gray-500 mb-1">Peso Máximo</p>
              <div className="flex items-baseline gap-1">
                 <span className="text-4xl font-black italic">75.0</span>
                 <span className="text-xs text-gray-600">kg</span>
              </div>
           </div>
           <div className="bg-aura-surface rounded-3xl p-6 border border-white/5">
              <div className="flex justify-between items-start mb-4">
                 <Bullseye className="w-5 h-5 text-aura-green" />
                 <span className="text-[8px] font-black uppercase text-gray-600">Con Max Peso</span>
              </div>
              <p className="text-[9px] font-black uppercase text-gray-500 mb-1">Máx Reps</p>
              <div className="flex items-baseline gap-1">
                 <span className="text-4xl font-black italic">6</span>
                 <span className="text-xs text-gray-600">reps</span>
              </div>
           </div>
        </div>

        {/* Intensity Chart */}
        <div className="bg-aura-surface rounded-[32px] p-6 border border-white/5">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-black uppercase italic flex items-center gap-2">
                 <Activity className="w-4 h-4 text-aura-blue" /> Evolución de Carga
              </h3>
              <div className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-black uppercase text-gray-500">Últimos 30d</div>
           </div>
           <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={mockHistory}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                    <XAxis dataKey="date" stroke="#525252" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                    <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip contentStyle={{ backgroundColor: '#171717', border: 'none', borderRadius: '16px', fontWeight: 'bold' }} />
                    <Area type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorWeight)" dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }} />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Logs */}
        <div className="space-y-4">
           <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest px-2">Sesiones Recientes</h3>
           {mockHistory.slice().reverse().map((log, idx) => (
             <div key={idx} className="bg-aura-surface p-6 rounded-3xl border border-white/5 flex justify-between items-center group active:scale-95 transition-transform">
                <div>
                   <p className="text-sm font-black italic uppercase leading-none">{log.date}</p>
                   <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">{log.weight}kg x {log.reps} reps</p>
                </div>
                <div className="flex flex-col items-end">
                   <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-orange-500 fill-current" />
                      <span className="text-xs font-black">RPE {log.rpe}</span>
                   </div>
                   <span className="text-[8px] font-black uppercase text-aura-green mt-1">+2.5kg vs ant.</span>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;
