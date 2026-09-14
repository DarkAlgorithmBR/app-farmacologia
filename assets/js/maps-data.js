/**
 * Farmacologia Conectada - Catálogo Oficial de Mapas Mentais (88 Mapas PNG)
 * Mapeamento direto dos 88 arquivos presentes em assets/images/maps/entregavel/
 */

const MAPS_CATEGORIES = [
  {
    id: 'sna',
    name: 'Sistema Nervoso Autônomo',
    icon: 'activity',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    accentColor: '#059669',
    description: 'Colinérgicos, Anticolinérgicos, Adrenérgicos, Simpatolíticos e Bloqueadores Neuromusculares.'
  },
  {
    id: 'antimicrobianos',
    name: 'Antimicrobianos',
    icon: 'shield-alert',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    accentColor: '#0D9488',
    description: 'Beta-lactâmicos, Macrolídeos, Fluoroquinolonas, Aminoglicosídeos, Glicopeptídeos e Antifúngicos.'
  },
  {
    id: 'cardiovascular',
    name: 'Cardiovascular e Renal',
    icon: 'heart-pulse',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    accentColor: '#E11D48',
    description: 'Anti-hipertensivos, Diuréticos, Antiarrítmicos, Inotrópicos e Vasodilatadores.'
  },
  {
    id: 'antiinflamatorios',
    name: 'Anti-inflamatórios e Dor',
    icon: 'flame',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    accentColor: '#D97706',
    description: 'AINEs seletivos/não seletivos, Corticosteroides, Opioides e Analgésicos centrais.'
  },
  {
    id: 'snc',
    name: 'Sistema Nervoso Central',
    icon: 'brain',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    accentColor: '#4F46E5',
    description: 'Ansiolíticos, Antidepressivos (ISRS, Tricíclicos), Antipsicóticos, Anticonvulsivantes e Parkinson.'
  },
  {
    id: 'endocrino',
    name: 'Endócrino e Metabólico',
    icon: 'sparkles',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    accentColor: '#9333EA',
    description: 'Antidiabéticos orais, Insulinas, Hormônios Tireoidianos, Corticóides e Osteometabolismo.'
  },
  {
    id: 'farmacocinetica',
    name: 'Farmacocinética & Dinâmica',
    icon: 'sliders',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    accentColor: '#2563EB',
    description: 'Absorção, Volume de Distribuição (Vd), Metabolismo Hepático CYP450, Excreção e Curvas Dose-Resposta.'
  },
  {
    id: 'sangue_pulmao_tgi',
    name: 'Sangue, Pulmão e TGI',
    icon: 'droplet',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    accentColor: '#0891B2',
    description: 'Anticoagulantes, Antiagregantes, Broncodilatadores, Corticoides Inalatórios, IBP e Antieméticos.'
  }
];

// Helper gerador do banco de 88 mapas vinculados aos arquivos entregues
function buildMapsDatabase() {
  const titles = {
    // 1. SNA (1 a 11)
    1: 'SNA: Organização e Neurotransmissão Colinérgica vs Adrenérgica',
    2: 'Agonistas Muscarínicos Diretos e Indiretos (Pilocarpina, Neostigmina)',
    3: 'Antagonistas Muscarínicos (Atropina, Escopolamina, Ipratrópio)',
    4: 'Agonistas Adrenérgicos Alfa-1 e Alfa-2 (Noradrenalina, Clonidina)',
    5: 'Agonistas Adrenérgicos Beta-1, Beta-2 e Beta-3 (Adrenalina, Salbutamol)',
    6: 'Antagonistas Adrenérgicos: Betabloqueadores Não-Seletivos e Seletivos',
    7: 'Alfa-bloqueadores e Seletividade Prostática (Tansulosina, Doxazosina)',
    8: 'Bloqueadores Neuromusculares Despolarizantes (Succinilcolina)',
    9: 'Bloqueadores Neuromusculares Não-Despolarizantes (Rocurônio, Atracúrio)',
    10: 'Reversores do Bloqueio Neuromuscular (Sugamadex e Neostigmina)',
    11: 'Farmacologia das Glândulas e Junções Neuroefetoras do SNA',

    // 2. Antimicrobianos (12 a 22)
    12: 'Penicilinas Naturais, Aminopenicilinas e Antiestafilocócicas',
    13: 'Inibidores de Beta-lactamase (Clavulanato, Tazobactam, Sulbactam)',
    14: 'Cefalosporinas de 1ª e 2ª Geração (Cefazolina, Cefalexina, Cefuroxima)',
    15: 'Cefalosporinas de 3ª, 4ª e 5ª Geração (Ceftriaxona, Cefepima, Ceftarolina)',
    16: 'Carbapenêmicos e Monobactâmicos (Meropenem, Ertapenem, Aztreonam)',
    17: 'Macrolídeos e Lincosamidas (Azitromicina, Claritromicina, Clindamicina)',
    18: 'Aminoglicosídeos e Tetraciclinas (Gentamicina, Amicacina, Doxiciclina)',
    19: 'Fluoroquinolonas (Ciprofloxacino, Levofloxacino, Moxifloxacino)',
    20: 'Sulfas e Antifolatos (Sulfametoxazol-Trimetoprima / Bactrim)',
    21: 'Glicopeptídeos, Lipopeptídeos e Oxazolidinonas (Vancomicina, Linezolida, Daptomicina)',
    22: 'Antifúngicos e Antivirais Sistêmicos (Fluconazol, Anfotericina B, Aciclovir)',

    // 3. Cardiovascular e Renal (23 a 33)
    23: 'Sistema Renina-Angiotensina-Aldosterona: IECAs e BRAs',
    24: 'Diuréticos de Alça (Furosemida) e Mecanismos Tubulares',
    25: 'Diuréticos Tiazídicos e Poupadores de Potássio (HCTZ, Espironolactona)',
    26: 'Bloqueadores dos Canais de Cálcio Di-hidropiridínicos (Anlodipino)',
    27: 'Bloqueadores dos Canais de Cálcio Não Di-hidropiridínicos (Verapamil, Diltiazem)',
    28: 'Antiarrítmicos Classes I e II (Lidocaína, Propafenona, Betabloqueadores)',
    29: 'Antiarrítmicos Classes III e IV (Amiodarona, Sotalol, Adenosina)',
    30: 'Tratamento Otimizado da Insuficiência Cardíaca (ICFEr / Quarteto)',
    31: 'Inotrópicos e Vasopressores (Noradrenalina, Dobutamina, Vasopressina)',
    32: 'Vasodilatadores de Emergência e Nitratos (Nitroprussiato, Tridil)',
    33: 'Hipolipemiantes: Estatinas, Ezetimiba e Inibidores de PCSK9',

    // 4. Anti-inflamatórios e Dor (34 a 44)
    34: 'Cascata do Ácido Araquidônico e Enzimas COX-1 vs COX-2',
    35: 'AINEs Não-Seletivos (Ibuprofeno, Cetoprofeno, Diclofenaco, AAS)',
    36: 'Inibidores Seletivos da COX-2 (Celecoxibe, Etoricoxibe)',
    37: 'Corticosteroides Sistêmicos: Potência, Doses e Efeitos Genômicos',
    38: 'Corticoterapia Prolongada, Efeitos Adversos e Manejo do Desmame',
    39: 'Escada Analgésica da OMS e Analgésicos Não-Opioides (Dipirona, Paracetamol)',
    40: 'Opioides Fracos (Tramadol, Codeína) e Mecanismos Mistos',
    41: 'Opioides Fortes (Morfina, Fentanil, Oxicodona, Metadona)',
    42: 'Intoxicação por Opioides, Tolerância e Antagonistas (Naloxona)',
    43: 'Farmacoterapia da Gota Aguda e Crônica (Colchicina, Alopurinol)',
    44: 'Imunossupressores e DMARDs na Artrite Reumatoide (Metotrexato)',

    // 5. Sistema Nervoso Central (45 a 55)
    45: 'Receptor GABA-A e Benzodiazepínicos (Diazepam, Clonazepam, Midazolam)',
    46: 'Hipnóticos Não-Benzodiazepínicos (Zolpidem, Zopiclona)',
    47: 'Antidepressivos ISRS (Fluoxetina, Sertralina, Escitalopram)',
    48: 'Antidepressivos Duais IRSN e Tricíclicos (Venlafaxina, Duloxetina, Amitriptilina)',
    49: 'Antidepressivos Atípicos (Bupropiona, Mirtazapina, Trazodona)',
    50: 'Antipsicóticos Típicos de 1ª Geração (Haloperidol, Clorpromazina)',
    51: 'Antipsicóticos Atípicos de 2ª Geração (Risperidona, Quetiapina, Olanzapina, Clozapina)',
    52: 'Antiepilépticos Bloqueadores de Canais de Sódio (Carbamazepina, Fenitoína)',
    53: 'Antiepilépticos de Amplo Espectro (Ácido Valproico, Lamotrigina, Levetiracetam)',
    54: 'Estabilizadores de Humor e Farmacologia do Lítio',
    55: 'Farmacoterapia da Doença de Parkinson e Alzheimer (Levodopa, Donepezila)',

    // 6. Endócrino e Metabólico (56 a 66)
    56: 'Fisiologia das Células Beta e Fisiopatologia Terapêutica do DM2',
    57: 'Biguanidas (Metformina) e Sensibilizadores de Insulina',
    58: 'Inibidores de SGLT2 (Dapagliflozina, Empagliflozina) e Proteção Cardiorrenal',
    59: 'Análogos de GLP-1 e Inibidores de DPP-4 (Semaglutida, Sitagliptina)',
    60: 'Secretagogos de Insulina: Sulfonilureias e Glinidas (Gliclazida)',
    61: 'Insulinas Prandiais e Rápidas (Regular, Lispro, Aspart)',
    62: 'Insulinas Basais e Ultra-Longas (NPH, Glargina, Degludeca)',
    63: 'Farmacologia da Tireoide: Hipotireoidismo e Levotiroxina (T4)',
    64: 'Farmacologia da Tireoide: Hipertireoidismo (Metimazol e PTU)',
    65: 'Metabolismo Ósseo, Osteoporose e Bisfosfonatos (Alendronato)',
    66: 'Contracepção Hormonal e Terapia de Reposição Estrogênica/Progestagênica',

    // 7. Farmacocinética e Dinâmica (67 a 77)
    67: 'Princípios Gerais de ADME: Absorção e Vias de Administração',
    68: 'Biodisponibilidade (F), Efeito de 1ª Passagem e Barreira Hematoencefálica',
    69: 'Distribuição Fármaco-Tecidual e Ligação a Proteínas Plasmáticas (Albumina)',
    70: 'Metabolismo Hepático: Reações de Fase I (Oxidação/CYP450) e Fase II (Conjugação)',
    71: 'Principais Indutores e Inibidores do Sistema Citocromo P450',
    72: 'Excreção Renal e Depuração Plasmática (Clearance)',
    73: 'Cinética de Eliminação: 1ª Ordem vs Ordem Zero',
    74: 'Meia-vida Plasmática (t½) e Estado de Equilíbrio (Steady-State)',
    75: 'Farmacometria: Volume de Distribuição (Vd) e Doses de Ataque/Manutenção',
    76: 'Curvas Dose-Resposta: Eficácia Máxima (Emax) vs Potência (EC50)',
    77: 'Tipos de Receptores: Ionotrópicos, Metabotrópicos GPCR, Tirosina-quinase e Nucleares',

    // 8. Sangue, Pulmão e TGI (78 a 88)
    78: 'Anticoagulantes Orais Antagonistas da Vitamina K (Varfarina e RNI)',
    79: 'Heparinas: Não Fracionada (HNF) vs Baixo Peso Molecular (Enoxaparina)',
    80: 'Novos Anticoagulantes Orais Diretos (DOACs: Rivaroxabana, Apixabana, Dabigatrana)',
    81: 'Antiagregantes Plaquetários (AAS, Clopidogrel, Ticagrelor)',
    82: 'Trombolíticos / Fibrinolíticos (Alteplase / rt-PA)',
    83: 'Broncodilatadores Beta-2 Agonistas: SABA (Salbutamol) e LABA (Formoterol)',
    84: 'Corticosteroides Inalatórios e Antileucotrienos (Budesonida, Montelucaste)',
    85: 'Anticolinérgicos Respiratórios: SAMA (Ipratrópio) e LAMA (Tiotrópio na DPOC)',
    86: 'Inibidores da Bomba de Prótons (Omeprazol, Pantoprazol, Esomeprazol)',
    87: 'Antagonistas H2, Antiácidos e Protetores de Mucosa (Famotidina, Sucralfato)',
    88: 'Antieméticos, Procinéticos e Laxativos (Ondansetrona, Metoclopramida, Lactulose)'
  };

  const categoriesOrder = [
    { cat: 'sna', start: 1, end: 11 },
    { cat: 'antimicrobianos', start: 12, end: 22 },
    { cat: 'cardiovascular', start: 23, end: 33 },
    { cat: 'antiinflamatorios', start: 34, end: 44 },
    { cat: 'snc', start: 45, end: 55 },
    { cat: 'endocrino', start: 56, end: 66 },
    { cat: 'farmacocinetica', start: 67, end: 77 },
    { cat: 'sangue_pulmao_tgi', start: 78, end: 88 }
  ];

  const list = [];

  for (let i = 1; i <= 88; i++) {
    const catObj = categoriesOrder.find(c => i >= c.start && i <= c.end) || { cat: 'sna' };
    const title = titles[i] || `Mapa Mental de Farmacologia ${i}`;

    list.push({
      id: `map-${String(i).padStart(2, '0')}`,
      fileNumber: i,
      category: catObj.cat,
      title: `${String(i).padStart(2, '0')}. ${title}`,
      subtitle: `Mapa visual em alta definição (${catObj.cat.toUpperCase()})`,
      image: `./assets/images/maps/entregavel/1 (${i}).png`,
      pdf: `./assets/images/maps/entregavel/1 (${i}).png`,
      tags: [catObj.cat.toUpperCase(), `Mapa ${i}`, 'Visual HD']
    });
  }

  return list;
}

const MAPS_DATABASE = buildMapsDatabase();

// Exportação global
window.MAPS_CATEGORIES = MAPS_CATEGORIES;
window.MAPS_DATABASE = MAPS_DATABASE;
