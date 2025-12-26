
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import WorkoutFlow from './components/WorkoutFlow';
import BodyRegistration from './components/BodyRegistration';
import Profile from './components/Profile';
import ExerciseDetail from './components/ExerciseDetail';
import { Home, Dumbbell, User, Trophy, BarChart3, Zap, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'workouts' | 'profile' | 'stats'>('home');
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showMetricsModal, setShowMetricsModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any | null>(null);
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [userMetrics, setUserMetrics] = useState<any>(null);

  // Efecto para detectar si es el primer uso
  useEffect(() => {
    const hasData = localStorage.getItem('aura_initial_setup');
    const lastMetrics = localStorage.getItem('aura_last_metrics');
    if (hasData) {
      setIsFirstRun(false);
      if (lastMetrics) setUserMetrics(JSON.parse(lastMetrics));
    }
  }, []);

  const handleFirstSetupComplete = () => {
    localStorage.setItem('aura_initial_setup', 'true');
    setIsFirstRun(false);
    setShowMetricsModal(false);
    // Recargar métricas tras guardar en BodyRegistration
    const lastMetrics = localStorage.getItem('aura_last_metrics');
    if (lastMetrics) setUserMetrics(JSON.parse(lastMetrics));
  };

  return (
    <div className="min-h-screen bg-aura-dark safe-area-bottom selection:bg-aura-blue/30 text-white selection:text-white">
      {/* Pantalla de Bienvenida / Onboarding */}
      {isFirstRun && !showMetricsModal && (
        <div className="fixed inset-0 z-[100] bg-aura-dark flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in fade-in duration-1000">
            <div className="w-24 h-24 bg-aura-blue rounded-[32px] rotate-12 flex items-center justify-center shadow-2xl shadow-aura-blue/40">
                <Zap className="w-12 h-12 text-white fill-current" />
            </div>
            <div className="space-y-2">
                <h1 className="text-5xl font-black italic uppercase tracking-tighter">AURA</h1>
                <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">Prepare for Evolution</p>
            </div>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">Bienvenido a tu nueva conciencia física. Configura tus métricas base para comenzar el seguimiento inteligente.</p>
            <button 
                onClick={() => setShowMetricsModal(true)}
                className="w-full py-6 bg-white text-aura-dark rounded-[24px] font-black italic uppercase text-xl shadow-2xl active:scale-95 transition-all"
            >
                Configurar Biometría
            </button>
        </div>
      )}

      {/* Content Area */}
      <main className="max-w-md mx-auto min-h-screen relative overflow-x-hidden">
        {activeTab === 'home' && (
          <Dashboard 
            onNewWorkout={() => setShowWorkoutModal(true)} 
            onNewMetrics={() => setShowMetricsModal(true)} 
            onSelectExercise={(ex) => setSelectedExercise(ex)}
            userMetrics={userMetrics}
          />
        )}
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'stats' && (
          <div className="p-8 pt-12 space-y-8 animate-in slide-in-from-right">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Análisis</h1>
            <div className="bg-aura-surface p-8 rounded-[32px] border border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                    <p className="text-xs font-black uppercase text-gray-500 tracking-widest">Rendimiento Histórico</p>
                    <BarChart3 className="w-5 h-5 text-aura-blue" />
                </div>
                <p className="text-gray-500 italic text-sm">Pronto podrás comparar periodos completos de entrenamiento.</p>
            </div>
          </div>
        )}
        {activeTab === 'workouts' && (
           <div className="p-8 pt-12 animate-in slide-in-from-right">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-8">Logs</h1>
             <div className="space-y-4">
                <div className="bg-aura-surface p-6 rounded-[32px] border border-white/5 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-gray-600 font-black uppercase mb-1">Hoy • 18:30</p>
                    <p className="text-lg font-black italic uppercase leading-none">Fitness: Tirón</p>
                    <p className="text-[10px] text-aura-blue font-black uppercase mt-2">5 EJERCICIOS • 75 MIN</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-800" />
                </div>
             </div>
           </div>
        )}
      </main>

      {/* Navigation Bar High-End */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/5 px-8 pt-4 pb-10 z-40">
        <div className="max-w-md mx-auto flex justify-between items-center">
          {[
            { id: 'home', icon: Home, label: 'Feed' },
            { id: 'workouts', icon: Dumbbell, label: 'Log' },
            { id: 'stats', icon: BarChart3, label: 'Stats' },
            { id: 'profile', icon: User, label: 'Me' }
          ].map(tab => (
            <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'text-aura-blue scale-110' : 'text-gray-600'}`}
            >
                <tab.icon className={`w-6 h-6 ${activeTab === tab.id ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${activeTab === tab.id ? 'opacity-100' : 'opacity-0 transition-opacity'}`}>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Modals & Detail Views */}
      {showWorkoutModal && (
        <WorkoutFlow onCancel={() => setShowWorkoutModal(false)} />
      )}
      {showMetricsModal && (
        <BodyRegistration onCancel={() => {
            setShowMetricsModal(false);
            if (isFirstRun) handleFirstSetupComplete();
            else {
               const lastMetrics = localStorage.getItem('aura_last_metrics');
               if (lastMetrics) setUserMetrics(JSON.parse(lastMetrics));
            }
        }} />
      )}
      {selectedExercise && (
        <ExerciseDetail 
          exercise={selectedExercise} 
          onBack={() => setSelectedExercise(null)} 
        />
      )}
    </div>
  );
};

export default App;
