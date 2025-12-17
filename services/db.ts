import Dexie, { Table } from 'dexie';
import { Evaluation, Template } from '../types';
import { SEED_TEMPLATES } from '../constants';

class ClinicalDB extends Dexie {
  evaluations!: Table<Evaluation>;
  templates!: Table<Template>;

  constructor() {
    super('ClinicalDictateDB');
    (this as any).version(1).stores({
      evaluations: 'evaluationId, createdAt, status, templateId',
      templates: 'templateId, name'
    });
  }
}

export const db = new ClinicalDB();

export const seedDatabase = async () => {
  const count = await db.templates.count();
  if (count === 0) {
    await db.templates.bulkAdd(SEED_TEMPLATES);
    console.log('Database seeded with default templates.');
  }
};