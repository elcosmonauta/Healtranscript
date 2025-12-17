import { Evaluation, Template, EvaluationItem } from '../types';

export const generateReportText = (evaluation: Evaluation, template: Template): string => {
  let report = `INFORME CLÍNICO - ${template.profession.toUpperCase()}\n`;
  report += `=================================================\n\n`;
  
  // Header
  report += `Fecha: ${new Date(evaluation.createdAt).toLocaleDateString()}\n`;
  report += `Paciente: ${evaluation.meta.patientAlias || 'N/A'}\n\n`;

  // Sections
  template.sections.forEach(section => {
    let sectionContent = '';
    
    section.blocks.forEach(block => {
      // Logic to pull data based on block config
      if (block.type === 'static_text') {
        sectionContent += `${block.config.text}\n`;
      } 
      else if (block.type === 'items_list' && block.config.filterTypes) {
        const filtered = evaluation.items.filter(i => block.config.filterTypes?.includes(i.type));
        if (filtered.length > 0) {
            sectionContent += `${block.label}:\n`;
            filtered.forEach(item => {
                sectionContent += `- ${item.text || item.resultValue}\n`;
            });
            sectionContent += '\n';
        }
      }
      else if (block.type === 'items_grouped' && block.config.filterTypes) {
          const filtered = evaluation.items.filter(i => block.config.filterTypes?.includes(i.type));
          if (filtered.length > 0) {
             sectionContent += `${block.label}:\n`;
             filtered.forEach(item => {
                 sectionContent += `- ${item.testName || 'Prueba'}: ${item.resultValue}\n`;
             });
             sectionContent += '\n';
          }
      }
    });

    if (sectionContent.trim()) {
        report += `${section.title.toUpperCase()}\n`;
        report += `-------------------\n`;
        report += sectionContent + '\n';
    }
  });

  report += `\nGenerado por ClinicalDictate Offline`;
  return report;
};