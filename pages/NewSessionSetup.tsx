import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { clsx } from 'clsx';

const NewSessionSetup: React.FC = () => {
  const { templates, loadInitialData } = useStore();
  const navigate = useNavigate();
  const { templateId } = useParams(); // Optional pre-selection

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
      // If templateId provided via URL, skip this screen
      if (templateId) {
          navigate(`/session/run/${templateId}`);
      }
  }, [templateId, navigate]);

  return (
    <div className="max-w-2xl mx-auto py-8">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800">
            <ArrowLeft size={18} /> Cancelar
        </button>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Seleccionar Plantilla</h1>
        <p className="text-slate-500 mb-8">Elija el formato para su nueva evaluación clínica.</p>
        
        <div className="space-y-3">
            {templates.map(t => (
                <button
                    key={t.templateId}
                    onClick={() => navigate(`/session/run/${t.templateId}`)}
                    className="w-full text-left bg-white p-5 rounded-xl border border-slate-200 hover:border-primary hover:shadow-md transition-all flex items-center justify-between group"
                >
                    <div>
                        <h3 className="font-bold text-slate-800">{t.name}</h3>
                        <p className="text-slate-500 text-sm">{t.profession} • v{t.version}</p>
                    </div>
                    <ArrowRight className="text-slate-300 group-hover:text-primary transition-colors" />
                </button>
            ))}
        </div>
    </div>
  );
};

export default NewSessionSetup;