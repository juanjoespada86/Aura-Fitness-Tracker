
import React from 'react';
import { Settings, LogOut, Download, Map as MapIcon, ChevronRight, Award, User } from 'lucide-react';
import { generateHeatmapData } from '../utils';

const Profile: React.FC = () => {
  const heatmapData = generateHeatmapData();

  const exportCSV = () => {
    alert("Exportando datos a CSV...");
    // Logic to generate CSV would go here
  };

  return (
    <div className="p-4 pb-32 animate-in fade-in duration-500">
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-3xl font-bold">Perfil</h1>
        <button className="p-2 bg-white/5 rounded-full"><Settings className="w-6 h-6"/></button>
      </div>

      {/* User Card */}
      <div className="bg-aura-surface rounded-ios p-6 border border-white/5 mb-8 flex items-center gap-6">
        <div className="relative">
          <img src="https://picsum.photos/seed/user/200" alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-aura-blue/30" />
          <div className="absolute -bottom-1 -right-1 bg-aura-blue p-1.5 rounded-full">
            <Award className="w-4 h-4 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold">Alex Rivera</h2>
          <p className="text-sm text-gray-500">Miembro Pro desde 2024</p>
          <div className="flex gap-4 mt-2">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Altura</p>
              <p className="text-sm font-bold">180 cm</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Edad</p>
              <p className="text-sm font-bold">28</p>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="mb-8">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <MapIcon className="w-5 h-5 text-aura-green" />
          Consistencia Anual
        </h3>
        <div className="bg-aura-surface p-4 rounded-2xl border border-white/5 overflow-hidden">
          <div className="flex flex-wrap gap-1">
            {heatmapData.map((d, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-[2px] ${d.count === 0 ? 'bg-white/5' : d.count < 2 ? 'bg-aura-blue/30' : d.count < 4 ? 'bg-aura-blue/60' : 'bg-aura-blue'}`}
                title={`${d.date}: ${d.count} actividades`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-3 text-[10px] text-gray-500 font-bold uppercase">
            <span>Menos</span>
            <span>Más</span>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="bg-aura-surface rounded-ios border border-white/5 divide-y divide-white/5">
        <button className="w-full p-4 flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-aura-blue" />
            <span className="font-medium">Editar Perfil</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-600 group-active:translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={exportCSV}
          className="w-full p-4 flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-aura-green" />
            <span className="font-medium">Exportar Datos (CSV)</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-600 group-active:translate-x-1 transition-transform" />
        </button>
        <button className="w-full p-4 flex items-center justify-between group text-red-500">
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Profile;
