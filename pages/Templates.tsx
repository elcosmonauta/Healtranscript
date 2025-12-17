import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { FileText, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Templates: React.FC = () => {
  const { templates, loadInitialData } = useStore();

  useEffect(() => {
    loadInitialData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Plantillas</h1>
        <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
          <Plus size={20} />
          Nueva Plantilla
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
            <div key={template.templateId} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                    <FileText size={24} />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">{template.name}</h3>
                <p className="text-slate-500 text-sm mb-4">{template.profession}</p>
                
                <div className="flex gap-2 border-t border-slate-100 pt-4 mt-2">
                    <Link 
                        to={`/session/new/${template.templateId}`}
                        className="flex-1 text-center bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 rounded font-medium text-sm border border-slate-200"
                    >
                        Usar
                    </Link>
                    <button className="flex-1 text-center text-slate-500 hover:text-primary py-2 text-sm">
                        Editar
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;