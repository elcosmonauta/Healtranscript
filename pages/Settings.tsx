import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Configuración</h1>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div>
            <h3 className="font-semibold text-lg mb-4">Reconocimiento de Voz</h3>
            <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer bg-slate-50 border-primary/30">
                    <input type="radio" name="stt" defaultChecked className="text-primary focus:ring-primary" />
                    <div>
                        <span className="font-medium block">Web Speech API (Navegador)</span>
                        <span className="text-xs text-slate-500">Requiere conexión en algunos navegadores.</span>
                    </div>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg opacity-50 cursor-not-allowed">
                    <input type="radio" name="stt" disabled />
                    <div>
                        <span className="font-medium block">Whisper (Local/Offline)</span>
                        <span className="text-xs text-slate-500">Disponible solo en versión de escritorio.</span>
                    </div>
                </label>
            </div>
        </div>

        <div>
            <h3 className="font-semibold text-lg mb-4">Datos</h3>
            <button className="text-red-600 font-medium text-sm hover:underline">
                Borrar todos los datos locales
            </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;