import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Plus, FileText, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const { recentEvaluations, isLoading, loadInitialData } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Mock data for chart
  const chartData = [
    { name: 'Mon', count: 4 },
    { name: 'Tue', count: 3 },
    { name: 'Wed', count: 6 },
    { name: 'Thu', count: 2 },
    { name: 'Fri', count: 5 },
    { name: 'Sat', count: 1 },
    { name: 'Sun', count: 0 },
  ];

  const handleNewEvaluation = () => {
    // For simplicity, pick first template or go to a selection screen. 
    // We'll go to a setup screen, but for this prototype, let's just create a new one.
    navigate('/session/new');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Cargando...</div>;
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Hola, Doctor</h1>
          <p className="text-slate-500">Aquí está el resumen de sus evaluaciones recientes.</p>
        </div>
        <button
          onClick={handleNewEvaluation}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
        >
          <Plus size={20} />
          Nueva Evaluación
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Evaluaciones hoy</p>
              <h3 className="text-2xl font-bold text-slate-900">3</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Total este mes</p>
              <h3 className="text-2xl font-bold text-slate-900">{recentEvaluations.length + 12}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm col-span-1">
             <div className="h-24 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" hide />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="count" fill="#0f766e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
             </div>
        </div>
      </div>

      {/* Recent List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Evaluaciones Recientes</h2>
        </div>
        {recentEvaluations.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No hay evaluaciones recientes. Inicie una nueva.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentEvaluations.map((ev) => (
              <div key={ev.evaluationId} className="p-4 hover:bg-slate-50 flex items-center justify-between group">
                <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                        {ev.meta.patientAlias ? ev.meta.patientAlias.substring(0,2).toUpperCase() : 'NN'}
                    </div>
                    <div>
                        <h4 className="font-medium text-slate-900">{ev.meta.patientAlias || 'Paciente Sin Nombre'}</h4>
                        <div className="flex gap-2 text-xs text-slate-500">
                            <span>{new Date(ev.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className={ev.status === 'final' ? "text-green-600" : "text-amber-600"}>
                                {ev.status === 'final' ? 'Finalizado' : 'Borrador'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                     <Link to={`/report/${ev.evaluationId}`} className="px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded hover:bg-white hover:text-primary transition-colors">
                        Ver Informe
                     </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;