import { v4 as uuidv4 } from 'uuid';
import { EvaluationItem } from '../types';

export interface ParseResult {
  item: EvaluationItem | null;
  command: 'none' | 'finish_evaluation' | 'undo_last';
}

export const parseTranscript = (text: string): ParseResult => {
  const lower = text.toLowerCase().trim();

  // Commands
  if (lower.includes('fin de evaluación') || lower.includes('finalizar evaluación')) {
    return { item: null, command: 'finish_evaluation' };
  }
  
  if (lower.includes('corregir último') || lower.includes('eliminar último')) {
    return { item: null, command: 'undo_last' };
  }

  const baseItem: EvaluationItem = {
    itemId: uuidv4(),
    createdAt: new Date().toISOString(),
    confidence: 1.0,
    source: 'voice',
    type: 'free_text',
    text: text
  };

  // 1. "Prueba X, resultado Y"
  // Regex: prueba (.*) resultado (.*)
  const testRegex = /prueba\s+(.+?)\s+resultado\s+(.+)/i;
  const testMatch = lower.match(testRegex);
  if (testMatch) {
    return {
      command: 'none',
      item: {
        ...baseItem,
        type: 'test_result',
        testName: testMatch[1].trim(),
        resultValue: testMatch[2].trim(),
        text: undefined
      }
    };
  }

  // 2. "Observación: ..."
  if (lower.startsWith('observación') || lower.startsWith('observacion')) {
    const cleanText = text.replace(/^observaci[óo]n[:\s]*/i, '').trim();
    return {
      command: 'none',
      item: {
        ...baseItem,
        type: 'observation',
        text: cleanText
      }
    };
  }

  // 3. "Plan: ..."
  if (lower.startsWith('plan')) {
    const cleanText = text.replace(/^plan[:\s]*/i, '').trim();
    return {
      command: 'none',
      item: {
        ...baseItem,
        type: 'plan',
        text: cleanText
      }
    };
  }

  // 4. "Diagnóstico: ..."
  if (lower.startsWith('diagnóstico') || lower.startsWith('diagnostico')) {
    const cleanText = text.replace(/^diagn[óo]stico[:\s]*/i, '').trim();
    return {
      command: 'none',
      item: {
        ...baseItem,
        type: 'diagnosis',
        text: cleanText
      }
    };
  }

  // Default: free text
  return {
    command: 'none',
    item: baseItem
  };
};