import { Template } from './types';

export const SEED_TEMPLATES: Template[] = [
  {
    templateId: 'kin-v1',
    name: 'Kinesiología General',
    profession: 'Kinesiología',
    version: '1.0',
    sections: [
      {
        sectionId: 'sec-id',
        title: 'Identificación',
        blocks: [
          { blockId: 'b1', type: 'field', label: 'Paciente', config: { fieldKey: 'meta.patientAlias' } },
          { blockId: 'b2', type: 'field', label: 'Fecha', config: { fieldKey: 'createdAt' } }
        ]
      },
      {
        sectionId: 'sec-obs',
        title: 'Observaciones',
        blocks: [
          { blockId: 'b3', type: 'items_list', label: 'Observaciones', config: { filterTypes: ['observation', 'free_text'] } }
        ]
      },
      {
        sectionId: 'sec-eval',
        title: 'Evaluación',
        blocks: [
          { blockId: 'b4', type: 'items_grouped', label: 'Pruebas', config: { filterTypes: ['test_result'], groupBy: 'testName' } }
        ]
      },
      {
        sectionId: 'sec-plan',
        title: 'Plan de Tratamiento',
        blocks: [
          { blockId: 'b5', type: 'items_list', label: 'Plan', config: { filterTypes: ['plan'] } }
        ]
      }
    ]
  },
  {
    templateId: 'fono-v1',
    name: 'Fonoaudiología Voz',
    profession: 'Fonoaudiología',
    version: '1.0',
    sections: [
      {
        sectionId: 'sec-id-fono',
        title: 'Antecedentes',
        blocks: [
          { blockId: 'b1f', type: 'field', label: 'Paciente', config: { fieldKey: 'meta.patientAlias' } }
        ]
      },
      {
        sectionId: 'sec-diag',
        title: 'Diagnóstico',
        blocks: [
          { blockId: 'b2f', type: 'items_list', label: 'Diagnósticos', config: { filterTypes: ['diagnosis'] } }
        ]
      }
    ]
  }
];
