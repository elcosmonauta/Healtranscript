import React from 'react';
import { EvaluationItem } from '../types';
import { Edit2, Trash2 } from 'lucide-react';

interface Props {
  item: EvaluationItem;
  onEdit?: (item: EvaluationItem) => void;
  onDelete?: (id: string) => void;
}

const EvaluationItemCard: React.FC<Props> = ({ item, onDelete }) => {
  const getLabel = () => {
    switch (item.type) {
      case 'test_result': return 'Prueba';
      case 'observation': return 'Observación';
      case 'plan': return 'Plan';
      case 'diagnosis': return 'Diagnóstico';
      default: return 'Nota';
    }
  };

  const getColor = () => {
    switch (item.type) {
      case 'test_result': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'observation': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'plan': return 'bg-green-100 text-green-800 border-green-200';
      case 'diagnosis': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex justify-between items-start group hover:border-primary/30 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${getColor()}`}>
            {getLabel()}
          </span>
          <span className="text-xs text-slate-400">
            {new Date(item.createdAt).toLocaleTimeString()}
          </span>
        </div>
        
        <div className="text-slate-800">
          {item.type === 'test_result' ? (
            <div>
              <span className="font-semibold">{item.testName}:</span> {item.resultValue}
            </div>
          ) : (
            <p>{item.text}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {onDelete && (
            <button 
                onClick={() => onDelete(item.itemId)}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
            >
                <Trash2 size={16} />
            </button>
        )}
      </div>
    </div>
  );
};

export default EvaluationItemCard;