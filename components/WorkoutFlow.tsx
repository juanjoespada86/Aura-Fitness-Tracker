
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, Dumbbell, Heart, Check, Plus, Trash2, Search, Flame, Zap, X, Trophy, Activity
} from 'lucide-react';
import { WorkoutType, FitnessSubType } from '../types';

const GLOBAL_EXERCISES = [
    // FITNESS
    { id: '1', name: 'Bench Press', category: 'Fitness', muscle_group: 'Chest' },
    { id: '2', name: 'Squat', category: 'Fitness', muscle_group: 'Legs' },
    { id: '3', name: 'Deadlift', category: 'Fitness', muscle_group: 'Back' },
    { id: '11', name: 'Shoulder Press', category: 'Fitness', muscle_group: 'Shoulders' },
    { id: '12', name: 'Bicep Curl', category: 'Fitness', muscle_group: 'Arms' },
    // CARDIO
    { id: '4', name: 'Running', category: 'Cardio', muscle_group: 'Full Body' },
    { id: '5', name: 'Swimming', category: 'Cardio', muscle_group: 'Full Body' },
    { id: '6', name: 'Cycling', category: 'Cardio', muscle_group: 'Legs' },
    // CROSSFIT
    { id: '7', name: 'Burpees', category: 'Crossfit', muscle_group: 'Full Body' },
    { id: '8', name: 'Thrusters', category: 'Crossfit', muscle_group: 'Full Body' },
    { id: '9', name: 'Box Jumps', category: 'Crossfit', muscle_group: 'Legs' },
    { id: '10', name: 'Wall Balls', category: 'Crossfit', muscle_group: 'Full Body' },
];

const SUBTYPES: FitnessSubType[] = ['Empuje', 'Tirón', 'Pierna', 'Full Body', 'Core', 'Personalizado'];

const WorkoutFlow: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<WorkoutType | null>(null);
  const [subType, setSubType] = useState<string>('');
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customExercises, setCustomExercises] = useState<any[]>([]);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [newExName, setNewExName] = useState('');

  const allExercises = useMemo(() => [...GLOBAL_EXERCISES, ...customExercises], [customExercises]);

  const filteredExercises = useMemo(() => {
    return allExercises.filter(ex => 
        ex.category === type && 
        ex.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allExercises, type, searchTerm]);

  const addExercise = (ex: any) => {
    // Al añadir un ejercicio, ya inicializamos con un set vacío pero estructurado
    setSelectedExercises([...selectedExercises, { ...ex, sets: [] }]);
    setStep(4);
  };

  const handleAddCustom = () => {
    if (!newExName || !type) return;
    const newEx = { 
        id: `custom-${Date.now()}`, 
        name: newExName, 
        category: type, 
        muscle_group: 'Personalizado' 
    };
    setCustomExercises([...customExercises, newEx]);
    addExercise(newEx);
    setNewExName('');
    setShowAddCustom(false);
  };

  const addSet = (exerciseIndex: number) => {
    const updated = [...selectedExercises];
    if (type === WorkoutType.CARDIO) {
        updated[exerciseIndex].sets.push({ distance: 0, time_seconds: 0, avg_heart_rate: 0 });
    } else {
        updated[exerciseIndex].sets.push({ weight: 0, reps: 0, rpe: 8, is_failure: false });
    }
    setSelectedExercises(updated);
  };

  const toggleFailure = (exIdx: number, sIdx: number) => {
    const updated = [...selectedExercises];
    updated[exIdx].sets[sIdx].is_failure = !updated[exIdx].sets[sIdx].is_failure;
    setSelectedExercises(updated);
  };

  const handleTypeSelect = (t: WorkoutType) => {
    setType(t);
    setSearchTerm('');
    if (t === WorkoutType.FITNESS) {
      setStep(2);
    } else {
      setSubType(t); 
      setStep(3); 
    }
  };

  return (
    <div className="fixed inset-0 bg-aura-dark z-[120] flex flex-col animate-in slide-in-from-right duration-400 overflow-y-auto pb-40">
      <div className="sticky top-0 glass z-50 px-8 py-10 flex items-center justify-between border-b border-white/5">
        <button onClick={step === 1 ? onCancel : () => setStep(step - 1)} className="p-4 bg-white/5 rounded-2xl active:scale-90 transition-all">
          <ChevronLeft className="w-7 h-7" />
        </button>
        <h1 className="text-xs font-black uppercase tracking-[0.5em] text-white/40">Protocolo {type || 'Log'}</h1>
        <div className="w-10 h-1 bg-aura-blue rounded-full" />
      </div>

      <div className="px-8 space-y-12 mt-8">
        {step === 1 && (
          <div className="space-y-10">
            <h2 className="text-5xl font-black italic uppercase leading-none text-white">Iniciar<br/><span className="text-aura-blue">Sesión</span></h2>
            <div className="grid grid-cols-1 gap-6">
              {[
                { t: WorkoutType.FITNESS, icon: Dumbbell, color: 'text-aura-blue', bg: 'bg-aura-blue/10', desc: 'Fuerza e Hipertrofia' },
                { t: WorkoutType.CROSSFIT, icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10', desc: 'WODs y AMRAPs' },
                { t: WorkoutType.CARDIO, icon: Heart, color: 'text-aura-green', bg: 'bg-aura-green/10', desc: 'Running y Resistencia' }
              ].map(m => (
                <button key={m.t} onClick={() => handleTypeSelect(m.t as WorkoutType)} className="flex items-center gap-8 p-10 bg-aura-surface rounded-[48px] border border-white/5 active:scale-95 shadow-2xl text-left">
                  <div className={`p-6 ${m.bg} ${m.color} rounded-3xl shadow-lg`}><m.icon className="w-10 h-10" /></div>
                  <div>
                    <span className="text-2xl font-black italic uppercase text-white leading-none">{m.t}</span>
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-2 block leading-tight">{m.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right">
            <h2 className="text-4xl font-black italic uppercase text-white">Segmento</h2>
            <div className="grid grid-cols-2 gap-6">
              {SUBTYPES.map(s => (
                <button key={s} onClick={() => { setSubType(s); setStep(3); }} className="p-10 bg-aura-surface border border-white/5 rounded-[40px] font-black uppercase text-xs tracking-widest text-white active:scale-95 transition-all shadow-xl">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right">
            <div className="flex justify-between items-end">
                <h2 className="text-4xl font-black italic uppercase text-white leading-tight">Ejercicios<br/>{type}</h2>
                <button onClick={() => setShowAddCustom(true)} className="text-[10px] font-black uppercase text-white bg-aura-blue px-6 py-3 rounded-2xl">Custom +</button>
            </div>
            
            <div className="relative">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-600" />
                <input 
                    type="text" 
                    placeholder={`Filtrar ${type}...`} 
                    className="w-full bg-aura-surface p-8 pl-18 rounded-[40px] font-black border border-white/10 outline-none focus:border-aura-blue/50 text-white" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
            </div>

            <div className="space-y-5">
              {filteredExercises.map(ex => (
                <button key={ex.id} onClick={() => addExercise(ex)} className="w-full p-10 bg-aura-surface rounded-[48px] border border-white/5 flex justify-between items-center group active:scale-[0.98] transition-all shadow-xl">
                   <div className="text-left">
                     <p className="font-black italic text-2xl uppercase text-white leading-none">{ex.name}</p>
                     <p className="text-[11px] text-gray-600 font-bold uppercase mt-3 tracking-widest">{ex.muscle_group}</p>
                   </div>
                   <div className="p-5 bg-white/5 rounded-2xl group-active:bg-aura-blue group-active:text-white">
                     <Plus className="w-8 h-8" />
                   </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-right pb-20">
            {selectedExercises.map((ex, exIdx) => (
              <div key={exIdx} className="space-y-8">
                <div className="bg-aura-surface p-8 rounded-[44px] border border-aura-blue/20 flex justify-between items-center shadow-2xl">
                   <div>
                      <h3 className="text-2xl font-black italic uppercase text-white leading-none tracking-tighter">{ex.name}</h3>
                      <p className="text-[10px] font-black uppercase text-aura-blue mt-3 tracking-[0.2em] italic">Grabando Datos...</p>
                   </div>
                   <button onClick={() => setSelectedExercises(selectedExercises.filter((_, i) => i !== exIdx))} className="p-4 bg-red-500/10 rounded-2xl text-red-500"><Trash2 className="w-6 h-6"/></button>
                </div>

                <div className="space-y-4">
                    {ex.sets.map((s: any, sIdx: number) => (
                      <div key={sIdx} className="grid grid-cols-6 gap-4 items-center bg-aura-surface p-6 rounded-[36px] border border-white/5 shadow-inner">
                        <div className="h-14 bg-white/5 rounded-2xl flex items-center justify-center font-black italic text-gray-600 text-lg">{sIdx + 1}</div>
                        {type === WorkoutType.CARDIO ? (
                            <>
                                <input type="number" className="col-span-2 h-14 bg-white/5 rounded-2xl text-center font-black text-xl outline-none" placeholder="KM" />
                                <input type="number" className="col-span-2 h-14 bg-white/5 rounded-2xl text-center font-black text-xl outline-none" placeholder="MIN" />
                            </>
                        ) : (
                            <>
                                <input type="number" className="col-span-2 h-14 bg-white/5 rounded-2xl text-center font-black text-xl outline-none" placeholder="KG" />
                                <input type="number" className="col-span-2 h-14 bg-white/5 rounded-2xl text-center font-black text-xl outline-none" placeholder="REPS" />
                            </>
                        )}
                        {/* BOTÓN DE FALLO RESTAURADO */}
                        <button 
                            onClick={() => toggleFailure(exIdx, sIdx)}
                            className={`h-14 rounded-2xl flex items-center justify-center transition-all ${s.is_failure ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-white/5 text-gray-700'}`}
                        >
                            <Flame className={`w-7 h-7 ${s.is_failure ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => addSet(exIdx)} className="w-full py-7 border-2 border-dashed border-white/10 rounded-[36px] text-[11px] font-black uppercase text-gray-700 active:scale-95">Añadir Serie +</button>
                </div>
              </div>
            ))}
            <div className="space-y-6 pt-10">
                <button onClick={() => setStep(3)} className="w-full py-8 bg-aura-surface rounded-[40px] font-black uppercase text-[10px] tracking-widest border border-white/10 active:scale-95">Añadir Ejercicio</button>
                <button onClick={onCancel} className="w-full py-10 bg-aura-blue rounded-[40px] font-black italic uppercase text-3xl shadow-2xl active:scale-95 transition-all">Sincronizar Log</button>
            </div>
          </div>
        )}
      </div>

      {showAddCustom && (
          <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-8 animate-in fade-in duration-300">
              <div className="bg-aura-surface w-full max-w-sm rounded-[64px] p-12 border border-white/10 space-y-10 animate-in zoom-in duration-400">
                  <div className="flex justify-between items-center">
                    <h4 className="text-2xl font-black italic uppercase text-white leading-none">Custom Lab</h4>
                    <button onClick={() => setShowAddCustom(false)} className="p-3 bg-white/5 rounded-full"><X className="w-6 h-6 text-gray-500" /></button>
                  </div>
                  <input 
                    type="text" 
                    autoFocus 
                    placeholder="Nombre del Ejercicio" 
                    className="w-full bg-white/5 p-8 rounded-[36px] font-black border border-white/10 outline-none text-white text-2xl" 
                    value={newExName} 
                    onChange={(e) => setNewExName(e.target.value)} 
                  />
                  <button onClick={handleAddCustom} className="w-full py-8 bg-aura-blue rounded-[36px] font-black italic uppercase tracking-tighter text-2xl shadow-2xl active:scale-95 transition-all">Crear</button>
              </div>
          </div>
      )}
    </div>
  );
};

export default WorkoutFlow;
