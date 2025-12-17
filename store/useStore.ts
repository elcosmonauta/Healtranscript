import { create } from 'zustand';
import { db, seedDatabase } from '../services/db';
import { Evaluation, Template } from '../types';

interface AppState {
  templates: Template[];
  recentEvaluations: Evaluation[];
  isLoading: boolean;
  loadInitialData: () => Promise<void>;
  addEvaluation: (evalData: Evaluation) => Promise<void>;
  updateEvaluation: (evalData: Evaluation) => Promise<void>;
  deleteEvaluation: (id: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  templates: [],
  recentEvaluations: [],
  isLoading: true,
  loadInitialData: async () => {
    set({ isLoading: true });
    try {
      await seedDatabase();
      const templates = await db.templates.toArray();
      const recentEvaluations = await db.evaluations
        .orderBy('createdAt')
        .reverse()
        .limit(10)
        .toArray();
      set({ templates, recentEvaluations, isLoading: false });
    } catch (error) {
      console.error('Failed to load data', error);
      set({ isLoading: false });
    }
  },
  addEvaluation: async (evalData) => {
    await db.evaluations.add(evalData);
    const recent = await db.evaluations.orderBy('createdAt').reverse().limit(10).toArray();
    set({ recentEvaluations: recent });
  },
  updateEvaluation: async (evalData) => {
    await db.evaluations.put(evalData);
    const recent = await db.evaluations.orderBy('createdAt').reverse().limit(10).toArray();
    set({ recentEvaluations: recent });
  },
  deleteEvaluation: async (id) => {
    await db.evaluations.delete(id);
    const recent = await db.evaluations.orderBy('createdAt').reverse().limit(10).toArray();
    set({ recentEvaluations: recent });
  }
}));