import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { v4 as uuidv4 } from 'uuid';
import { sttService } from '../services/sttService';
import { parseTranscript } from '../services/commandParser';
import { Evaluation, EvaluationItem } from '../types';
import EvaluationItemCard from '../components/EvaluationItemCard';
import { Mic, MicOff, StopCircle, ArrowLeft, Save } from 'lucide-react';
import { clsx } from 'clsx';

const EvaluationSession: React.FC = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { templates, addEvaluation } = useStore();
  
  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [items, setItems] = useState<EvaluationItem[]>([]);
  const [patientAlias, setPatientAlias] = useState('');
  
  // Create evaluation ID on mount
  const evalIdRef = useRef(uuidv4());
  const template = templates.find(t => t.templateId === templateId) || templates[0];

  useEffect(() => {
    // Cleanup on unmount
    return () => {
        sttService.stop();
    };
  }, []);

  const handleToggleRecord = () => {
    if (isRecording) {
      sttService.stop();
      setIsRecording(false);
      setInterimText('');
    } else {
      setIsRecording(true);
      sttService.start((event) => {
        if (event.isFinal) {
          setInterimText('');
          const result = parseTranscript(event.text);
          
          if (result.command === 'finish_evaluation') {
            handleFinish();
            return;
          }
          if (result.command === 'undo_last') {
            setItems(prev => prev.slice(0, -1));
            return;
          }
          
          if (result.item) {
            setItems(prev => [...prev, result.item!]);
          }
        } else {
          setInterimText(event.text);
        }
      });
    }
  };

  const handleFinish = async () => {
    sttService.stop();
    setIsRecording(false);
    
    if (!template) return;

    const newEvaluation: Evaluation = {
      evaluationId: evalIdRef.current,
      createdAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
      status: 'final',
      templateId: template.templateId,
      meta: {
        professionalRole: template.profession,
        patientAlias: patientAlias || 'Paciente Anónimo'
      },
      transcript: '', // We could reconstruct it from items if needed
      items: items
    };

    await addEvaluation(newEvaluation);
    navigate(`/report/${newEvaluation.evaluationId}`);
  };

  const handleDeleteItem = (id: string) => {
      setItems(prev => prev.filter(i => i.itemId !== id));
  };

  // Pre-flight check: if no template found (direct link issue), go back
  if (!template && templates.length > 0) {
      return <div>Template not found</div>;
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full">
                <ArrowLeft size={20} />
            </button>
            <div>
                <h2 className="font-bold text-slate-900">Nueva Evaluación</h2>
                <p className="text-xs text-slate-500">{template?.name || 'Plantilla General'}</p>
            </div>
        </div>
        
        <input 
            type="text" 
            placeholder="Nombre / Alias del Paciente" 
            className="border border-slate-300 rounded-md px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={patientAlias}
            onChange={(e) => setPatientAlias(e.target.value)}
        />
        
        <div className="flex gap-2">
            <button 
                onClick={handleFinish}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-medium"
            >
                <Save size={18} />
                Guardar
            </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left: Items Stream */}
        <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <span className="font-semibold text-slate-700">Registros ({items.length})</span>
                {isRecording && (
                    <span className="flex items-center gap-2 text-red-600 text-xs font-bold animate-pulse">
                        <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                        GRABANDO
                    </span>
                )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                {items.length === 0 && !interimText && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <Mic size={48} className="mb-4 opacity-20" />
                        <p>Presione el micrófono y comience a dictar.</p>
                        <p className="text-xs mt-2">Ej: "Prueba Flexión, resultado 90 grados"</p>
                    </div>
                )}
                
                {items.map(item => (
                    <EvaluationItemCard key={item.itemId} item={item} onDelete={handleDeleteItem} />
                ))}

                {/* Interim Result Bubble */}
                {interimText && (
                    <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg animate-pulse">
                        <p className="text-primary font-medium">{interimText}...</p>
                    </div>
                )}
                
                {/* Scroll Anchor */}
                <div style={{ float:"left", clear: "both" }}
                     ref={(el) => { el?.scrollIntoView({ behavior: "smooth" }); }}>
                </div>
            </div>

            {/* Controls */}
            <div className="p-6 border-t border-slate-100 bg-white flex justify-center">
                <button
                    onClick={handleToggleRecord}
                    className={clsx(
                        "w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl",
                        isRecording 
                            ? "bg-red-500 hover:bg-red-600 ring-4 ring-red-200" 
                            : "bg-primary hover:bg-primary/90 ring-4 ring-primary/20"
                    )}
                >
                    {isRecording ? <StopCircle size={32} className="text-white" /> : <Mic size={32} className="text-white" />}
                </button>
            </div>
        </div>

        {/* Right: Cheatsheet / Context */}
        <div className="w-80 bg-white rounded-xl border border-slate-200 shadow-sm p-4 hidden lg:block overflow-y-auto">
            <h3 className="font-bold text-slate-800 mb-4">Comandos de Voz</h3>
            <ul className="space-y-4 text-sm text-slate-600">
                <li className="bg-slate-50 p-3 rounded border border-slate-100">
                    <strong className="text-primary block mb-1">Registrar Prueba</strong>
                    "Prueba [nombre], resultado [valor]"
                </li>
                <li className="bg-slate-50 p-3 rounded border border-slate-100">
                    <strong className="text-primary block mb-1">Observación</strong>
                    "Observación: [texto]"
                </li>
                <li className="bg-slate-50 p-3 rounded border border-slate-100">
                    <strong className="text-primary block mb-1">Plan</strong>
                    "Plan: [texto]"
                </li>
                <li className="bg-slate-50 p-3 rounded border border-slate-100">
                    <strong className="text-primary block mb-1">Control</strong>
                    "Corregir último"<br/>
                    "Fin de evaluación"
                </li>
            </ul>
        </div>
      </div>
    </div>
  );
};

export default EvaluationSession;