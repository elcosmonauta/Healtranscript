export type ItemType = 'test_result' | 'observation' | 'free_text' | 'plan' | 'diagnosis';

export interface EvaluationItem {
  itemId: string;
  type: ItemType;
  testName?: string;
  resultValue?: string;
  side?: 'left' | 'right' | 'bilateral' | null;
  area?: string;
  text?: string;
  createdAt: string; // ISO date
  confidence: number;
  source: 'voice' | 'manual';
}

export type EvaluationStatus = 'draft' | 'final';

export interface Evaluation {
  evaluationId: string;
  createdAt: string;
  endedAt?: string;
  status: EvaluationStatus;
  templateId: string;
  meta: {
    professionalRole?: string;
    patientAlias?: string; // Anonymized identifier
    context?: string;
  };
  transcript: string;
  items: EvaluationItem[];
}

// Template Definitions
export type BlockType = 'static_text' | 'field' | 'items_list' | 'items_grouped';

export interface TemplateBlock {
  blockId: string;
  type: BlockType;
  label: string;
  config: {
    text?: string;
    fieldKey?: string; // e.g., 'meta.patientAlias'
    groupBy?: 'area' | 'testName' | 'side' | null;
    filterTypes?: ItemType[];
  };
}

export interface TemplateSection {
  sectionId: string;
  title: string;
  blocks: TemplateBlock[];
}

export interface Template {
  templateId: string;
  name: string;
  profession: string;
  version: string;
  sections: TemplateSection[];
}