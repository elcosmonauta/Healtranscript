import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { generateReportText } from '../services/templateRenderer';
import { Download, ArrowLeft, Printer } from 'lucide-react';

const ReportPreview: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recentEvaluations, templates, loadInitialData } = useStore();
  const [reportText, setReportText] = useState('');

  useEffect(() => {
    // Ensure data is loaded if we came directly here
    if (recentEvaluations.length === 0) {
        loadInitialData();
    }
  }, []);

  const evaluation = recentEvaluations.find(e => e.evaluationId === id);
  const template = evaluation ? templates.find(t => t.templateId === evaluation.templateId) : null;

  useEffect(() => {
    if (evaluation && template) {
        setReportText(generateReportText(evaluation, template));
    }
  }, [evaluation, template]);

  if (!evaluation || !template) return <div className="p-8">Cargando informe...</div>;

  const handleDownloadTxt = () => {
      const element = document.createElement("a");
      const file = new Blob([reportText], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `Informe_${evaluation.meta.patientAlias || 'Paciente'}.txt`;
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
                <ArrowLeft size={20} /> Volver al Dashboard
            </button>
            <div className="flex gap-3">
                <button onClick={handleDownloadTxt} className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-white text-slate-700 font-medium">
                    <Download size={18} /> Exportar TXT
                </button>
                <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium">
                    <Printer size={18} /> Imprimir / PDF
                </button>
            </div>
       </div>

       <div className="bg-white p-8 md:p-12 shadow-sm border border-slate-200 rounded-xl min-h-[600px] font-mono whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
            {reportText}
       </div>
    </div>
  );
};

export default ReportPreview;