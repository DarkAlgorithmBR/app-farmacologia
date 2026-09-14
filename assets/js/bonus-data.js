/**
 * Farmacologia Conectada - 4 Super Bônus Exclusivos (PDFs Reais)
 * Caminhos exatos para os arquivos PDF presentes na pasta assets/images/maps/bonus/ e assets/pdfs/
 */

const BONUS_DATA = [
  {
    id: 'bonus-1',
    title: 'Bônus 1: Guia Top Fármacos para Estudantes',
    badge: 'Visão Panorâmica A-Z',
    icon: 'map',
    pdf: './assets/images/maps/bonus/Guia_Top_Farmacos_Estudantes.pdf',
    subtitle: 'Guia condensando os principais fármacos mais cobrados e utilizados na prática clínica.',
    summary: 'Estrutura completa para revisão rápida de classes e mecanismos antes de provas ou rounds hospitalares.'
  },
  {
    id: 'bonus-2',
    title: 'Bônus 2: Mapa dos Principais Receptores Farmacológicos',
    badge: 'Alvos & Receptores',
    icon: 'layers',
    pdf: './assets/images/maps/bonus/Bônus_Mapa_dos_Principais_Receptores.pdf',
    subtitle: 'Mapeamento visual e sistemático de Receptores GPCR (Gs, Gi, Gq), Canais Iônicos e Enzimas.',
    summary: 'Tabela comparativa direta dos alvos moleculares, agonistas, antagonistas e respostas teciduais.'
  },
  {
    id: 'bonus-3',
    title: 'Bônus 3: Comparativo de Classes que Mais Confundem',
    badge: 'Guia Anti-Confusão',
    icon: 'help-circle',
    pdf: './assets/images/maps/bonus/Bônus_Comparativo_Classes_que_Mais_Confundem.pdf',
    subtitle: 'Nomes parecidos, classes distintas ou efeitos opostos que mais causam dúvidas na prática.',
    summary: 'Diferenciações práticas lado a lado para eliminar erros de prescrição e pegadinhas de prova.'
  },
  {
    id: 'bonus-4',
    title: 'Bônus 4: Guia de Revisão Express de Farmacologia',
    badge: 'Revisão Express',
    icon: 'alert-triangle',
    pdf: './assets/images/maps/bonus/Bônus_Guia_de_Revisao_Express.pdf',
    subtitle: 'Revisão intensiva com os pontos-chave de alto rendimento para fixação rápida.',
    summary: 'Mapeamento de emergências farmacológicas, toxicologia clínica e antídotos obrigatórios.'
  }
];

// Exportação global
window.BONUS_DATA = BONUS_DATA;
