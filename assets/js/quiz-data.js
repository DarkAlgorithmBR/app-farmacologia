/**
 * Farmacologia Conectada - Banco de Questões de Quiz e Flashcards
 * Abrange as 8 grandes áreas com feedback detalhado para cada alternativa.
 */

const QUIZ_QUESTIONS = [
  // ==========================================
  // SNA
  // ==========================================
  {
    id: 'q-sna-01',
    category: 'sna',
    categoryName: 'Sistema Nervoso Autônomo',
    question: 'Um paciente de 45 anos com glaucoma de ângulo aberto necessita de um colírio para reduzir a pressão intraocular através do aumento da drenagem do humor aquoso pelo canal de Schlemm. Qual dos seguintes agonistas colinérgicos atua estimulando o músculo ciliar para essa finalidade?',
    options: [
      { id: 'A', text: 'Atropina' },
      { id: 'B', text: 'Pilocarpina' },
      { id: 'C', text: 'Tropicamida' },
      { id: 'D', text: 'Escopolamina' }
    ],
    correctAnswer: 'B',
    explanation: 'A **Pilocarpina** é um agonista muscarínico direto que promove contração do músculo ciliar e do esfíncter pupilar (miose), tracionando o esporão escleral e abrindo a malha trabecular para drenagem do humor aquoso. Atropina, Tropicamida e Escopolamina são antagonistas muscarínicos que causam midríase e cicloplegia, sendo contraindicados no glaucoma de ângulo fechado.',
    highYieldNote: 'Pilocarpina = Miose + contração do músculo ciliar → Drenagem no canal de Schlemm.'
  },
  {
    id: 'q-sna-02',
    category: 'sna',
    categoryName: 'Sistema Nervoso Autônomo',
    question: 'Durante uma anestesia geral para cirurgia de emergência, foi administrada Succinilcolina para intubação orotraqueal. O paciente evoluiu rapidamente com espasmo muscular, taquicardia severa, hipertermia (41°C) e acidose respiratória refratária. Qual o diagnóstico e o antídoto farmacológico imediato?',
    options: [
      { id: 'A', text: 'Síndrome Neuroléptica Maligna — Biperideno' },
      { id: 'B', text: 'Hipertermia Maligna — Dantroleno' },
      { id: 'C', text: 'Crise Colinérgica — Pralidoxima' },
      { id: 'D', text: 'Síndrome Serotoninérgica — Flumazenil' }
    ],
    correctAnswer: 'B',
    explanation: 'Trata-se de **Hipertermia Maligna**, uma emergência anestésica deflagrada pela associação de Succinilcolina e anestésicos inalatórios halogenados em indivíduos com mutação no receptor de Rianodina (RYR1). O tratamento específico e mandatório é o **Dantroleno sódico**, que bloqueia a liberação excessiva de cálcio pelo retículo sarcoplasmático.',
    highYieldNote: 'Succinilcolina + Halogenado → Rianodina descontrolada → Dantroleno IV!'
  },
  {
    id: 'q-sna-03',
    category: 'sna',
    categoryName: 'Sistema Nervoso Autônomo',
    question: 'Um homem de 68 anos com diagnóstico de Hiperplasia Prostática Benigna (HPB) e sintomas urinários obstrutivos é tratado com Tansulosina. Qual o mecanismo molecular de seletividade desse fármaco que reduz os episódios de hipotensão ortostática?',
    options: [
      { id: 'A', text: 'Antagonismo seletivo dos receptores Alfa-1A no colo vesical e próstata' },
      { id: 'B', text: 'Bloqueio seletivo dos receptores Beta-1 no miocárdio' },
      { id: 'C', text: 'Agonismo seletivo dos receptores Alfa-2 pré-sinápticos centrais' },
      { id: 'D', text: 'Inibição seletiva da recaptação de noradrenalina' }
    ],
    correctAnswer: 'A',
    explanation: 'A **Tansulosina** é um antagonista seletivo dos receptores **Alfa-1A**, subtipo predominante na musculatura lisa da próstata e colo vesical. Diferente da Doxazosina e Prazosina (que bloqueiam receptores Alfa-1B vasculares periféricos com hipotensão), a Tansulosina causa relaxamento do trato urinário com menor efeito na pressão arterial.',
    highYieldNote: 'Tansulosina = Seletivo Alfa-1A prostático (menos hipotensão que bloqueadores alfa não seletivos).'
  },

  // ==========================================
  // ANTIMICROBIANOS
  // ==========================================
  {
    id: 'q-anti-01',
    category: 'antimicrobianos',
    categoryName: 'Antimicrobianos',
    question: 'Uma mulher de 32 anos no 1º trimestre de gestação apresenta diagnóstico confirmado de infecção por Treponema pallidum (Sífilis primária). Qual é o antibiótico de escolha absoluta recomendado pelo Ministério da Saúde e OMS?',
    options: [
      { id: 'A', text: 'Doxiciclina via oral' },
      { id: 'B', text: 'Penicilina G Benzatina intramuscular' },
      { id: 'C', text: 'Ciprofloxacino via oral' },
      { id: 'D', text: 'Sulfametoxazol-Trimetoprima' }
    ],
    correctAnswer: 'B',
    explanation: 'A **Penicilina G Benzatina (Benzetacil)** é a única medicação comprovadamente eficaz para tratar a sífilis materna e prevenir a transmissão vertical (sífilis congênita). Gestantes com história de alergia à penicilina devem ser dessensibilizadas e tratadas com Penicilina G.',
    highYieldNote: 'Sífilis na gestação: Penicilina G Benzatina é insubstituível. Se alérgica → Dessensibilização!'
  },
  {
    id: 'q-anti-02',
    category: 'antimicrobianos',
    categoryName: 'Antimicrobianos',
    question: 'Qual dos seguintes antimicrobianos atua ligando-se à extremidade terminal D-Alanil-D-Alanina da cadeia peptídica da parede bacteriana, sendo droga de escolha em infecções invasivas por Staphylococcus aureus resistente à meticilina (MRSA)?',
    options: [
      { id: 'A', text: 'Vancomicina' },
      { id: 'B', text: 'Meropenem' },
      { id: 'C', text: 'Ceftriaxona' },
      { id: 'D', text: 'Amicacina' }
    ],
    correctAnswer: 'A',
    explanation: 'A **Vancomicina** é um glicopeptídeo que se liga ao resíduo D-Ala-D-Ala impedindo a ação das transpeptidases e a polimerização do peptideoglicano. É o tratamento clássico para infecções graves por MRSA.',
    highYieldNote: 'Vancomicina = Liga-se ao D-Ala-D-Ala. Cuidado com Síndrome do Homem Vermelho (infusão lenta > 60 min).'
  },
  {
    id: 'q-anti-03',
    category: 'antimicrobianos',
    categoryName: 'Antimicrobianos',
    question: 'Um paciente internado em UTI desenvolve sepse por Enterococcus faecium resistente à vancomicina (VRE). Qual dos seguintes antibióticos inibe a formação do complexo de iniciação 70S ribossômico e é indicado nessa situação?',
    options: [
      { id: 'A', text: 'Linezolida' },
      { id: 'B', text: 'Azitromicina' },
      { id: 'C', text: 'Gentamicina' },
      { id: 'D', text: 'Cefepima' }
    ],
    correctAnswer: 'A',
    explanation: 'A **Linezolida** pertence à classe das oxazolidinonas. Liga-se à subunidade 50S no sítio 23S impedindo a montagem do complexo de iniciação funcional 70S. É ativa contra bactérias Gram-positivas multirresistentes como VRE e MRSA.',
    highYieldNote: 'Linezolida = Inibe complexo 70S. Trata VRE e MRSA. Risco de trombocitopenia e síndrome serotoninérgica.'
  },

  // ==========================================
  // CARDIOVASCULAR E RENAL
  // ==========================================
  {
    id: 'q-cardio-01',
    category: 'cardiovascular',
    categoryName: 'Cardiovascular e Renal',
    question: 'Um paciente hipertenso e diabético em uso de Enalapril relata tosse seca, irritativa e persistente há 3 semanas, sem febre ou sintomas respiratórios. Qual mediador inflamatório acumulado é responsável por esse efeito colateral?',
    options: [
      { id: 'A', text: 'Angiotensina II' },
      { id: 'B', text: 'Bradicinina' },
      { id: 'C', text: 'Endotelina-1' },
      { id: 'D', text: 'Aldosterona' }
    ],
    correctAnswer: 'B',
    explanation: 'A Enzima Conversora de Angiotensina (ECA) é idêntica à Quinase II, responsável por degradar a **Bradicinina** e a Substância P no parênquima pulmonar. A inibição da ECA leva ao acúmulo desses mediadores, deflagrando tosse seca em até 20% dos pacientes. A conduta é trocar o IECA por um BRA (como Losartana).',
    highYieldNote: 'Tosse por IECA = Acúmulo de Bradicinina pulmonar. Trocar por BRA!'
  },
  {
    id: 'q-cardio-02',
    category: 'cardiovascular',
    categoryName: 'Cardiovascular e Renal',
    question: 'Qual dos seguintes diuréticos inibe o cotransportador Na+/K+/2Cl- na porção espessa da alça de Henle e promove perda urinária acentuada de cálcio, sendo útil na hipercalcemia aguda?',
    options: [
      { id: 'A', text: 'Hidroclorotiazida' },
      { id: 'B', text: 'Espironolactona' },
      { id: 'C', text: 'Furosemida' },
      { id: 'D', text: 'Amilorida' }
    ],
    correctAnswer: 'C',
    explanation: 'A **Furosemida** bloqueia o cotransportador NKCC2 na alça de Henle, abolindo o gradiente transepitelial positivo e diminuindo a reabsorção paracelular de Cálcio e Magnésio (aumenta calciúria). Já os tiazídicos RETÊM cálcio no sangue.',
    highYieldNote: 'Furosemida = Alça = Perde Cálcio na urina. Tiazídico = Distal = Retém Cálcio no sangue.'
  },
  {
    id: 'q-cardio-03',
    category: 'cardiovascular',
    categoryName: 'Cardiovascular e Renal',
    question: 'Um paciente em pós-operatório imediato de cirurgia cardíaca apresenta quadro de choque cardiogênico com baixa fração de ejeção e congestão pulmonar. Qual fármaco inotrópico é agonista seletivo beta-1 adrenérgico e atua aumentando o débito cardíaco com discreta vasodilatação?',
    options: [
      { id: 'A', text: 'Noradrenalina' },
      { id: 'B', text: 'Dobutamina' },
      { id: 'C', text: 'Fenilefrina' },
      { id: 'D', text: 'Vasopressina' }
    ],
    correctAnswer: 'B',
    explanation: 'A **Dobutamina** é um inotrópico sintético que atua predominantemente nos receptores beta-1 miocárdicos (aumentando a contratilidade miocárdica) com ação discreta beta-2 (que promove vasodilatação leve e redução da pós-carga), sendo droga de escolha no choque cardiogênico.',
    highYieldNote: 'Dobutamina = Inotrópico Beta-1 de escolha no choque cardiogênico.'
  },

  // ==========================================
  // ANTI-INFLAMATÓRIOS E DOR
  // ==========================================
  {
    id: 'q-inflam-01',
    category: 'antiinflamatorios',
    categoryName: 'Anti-inflamatórios e Dor',
    question: 'Qual é o mecanismo farmacológico molecular que torna o Ácido Acetilsalicílico (AAS) o único antiagregante plaquetário de sua classe com ação irreversível que dura por toda a vida média da plaqueta (7 a 10 dias)?',
    options: [
      { id: 'A', text: 'Fosforilação alostérica do receptor P2Y12' },
      { id: 'B', text: 'Acetilação covalente irreversível da Serina 529 da enzima COX-1' },
      { id: 'C', text: 'Bloqueio competitivo reversível da Fosfolipase A2' },
      { id: 'D', text: 'Quelação do íon cálcio intraplaquetário' }
    ],
    correctAnswer: 'B',
    explanation: 'O **AAS** acetila covalentemente o resíduo de **Serina 529** no sítio ativo da ciclooxigenase-1 (COX-1). Como as plaquetas são anucleadas e não sintetizam novas proteínas, a inibição da síntese de Tromboxano A2 (TXA2) persiste por toda a sobrevida da plaqueta (7 a 10 dias).',
    highYieldNote: 'AAS = Acetilação irreversível da COX-1 na Serina 529 (plaquetas anucleadas não refazem enzima).'
  },
  {
    id: 'q-inflam-02',
    category: 'antiinflamatorios',
    categoryName: 'Anti-inflamatórios e Dor',
    question: 'Um paciente jovem chega ao pronto-socorro em coma profundo, com frequência respiratória de 6 irpm e pupilas puntiformes (miose severa). Há histórico de uso recreativo de substâncias injetáveis. Qual fármaco deve ser administrado imediatamente por via intravenosa?',
    options: [
      { id: 'A', text: 'Flumazenil' },
      { id: 'B', text: 'Naloxona' },
      { id: 'C', text: 'Atropina' },
      { id: 'D', text: 'Dantroleno' }
    ],
    correctAnswer: 'B',
    explanation: 'O quadro clínico clássico de intoxicação aguda por opioides é composto pela tríade: **Coma + Depressão Respiratória + Miose puntiforme**. O tratamento emergencial imediato é o antagonista puro dos receptores opioides Mu (μ), a **Naloxona IV**.',
    highYieldNote: 'Intoxicação por Opioides = Tríade Miose + Apneia + Coma → NALOXONA!'
  },

  // ==========================================
  // SISTEMA NERVOSO CENTRAL
  // ==========================================
  {
    id: 'q-snc-01',
    category: 'snc',
    categoryName: 'Sistema Nervoso Central',
    question: 'Qual é a diferença fundamental no mecanismo de ação sobre o canal GABA-A entre os Benzodiazepínicos e os Barbitúricos em altas doses?',
    options: [
      { id: 'A', text: 'Benzodiazepínicos aumentam a duração da abertura do canal; Barbitúricos aumentam a frequência de abertura.' },
      { id: 'B', text: 'Benzodiazepínicos aumentam a FREQUÊNCIA de abertura; Barbitúricos aumentam o TEMPO DE DURAÇÃO de abertura.' },
      { id: 'C', text: 'Benzodiazepínicos bloqueiam canais de sódio; Barbitúricos ativam receptores NMDA.' },
      { id: 'D', text: 'Benzodiazepínicos agem na medula espinhal; Barbitúricos atuam apenas no cerebelo.' }
    ],
    correctAnswer: 'B',
    explanation: 'Mnemônico de ouro: **B**enzodiazepínicos aumentam a **F**requência (**B**-**F** = "Best Friends"); **B**arbitúricos aumentam a **D**uração (**B**-**D** = "Barbi-Duração"). Por poderem abrir diretamente o canal em altas doses sem a presença de GABA, os barbitúricos são muito mais perigosos para parada respiratória.',
    highYieldNote: 'Benzodiazepínicos: ↑ FREQUÊNCIA | Barbitúricos: ↑ DURAÇÃO de abertura do canal de cloro GABA-A.'
  },
  {
    id: 'q-snc-02',
    category: 'snc',
    categoryName: 'Sistema Nervoso Central',
    question: 'Um paciente esquizofrênico em tratamento com Haloperidol há 2 dias apresenta contração espasmódica dolorosa da musculatura do pescoço (torcicolo agudo) e desvio ocular para cima (crise oculógira). Qual o diagnóstico do efeito adverso e qual a conduta farmacológica imediata?',
    options: [
      { id: 'A', text: 'Acatisia motora — Prescrever Propranolol' },
      { id: 'B', text: 'Distonia Aguda — Administrar Biperideno intramuscular' },
      { id: 'C', text: 'Discinesia Tardia — Aumentar dose de Haloperidol' },
      { id: 'D', text: 'Síndrome Neuroléptica Maligna — Administrar Dantroleno' }
    ],
    correctAnswer: 'B',
    explanation: 'A **Distonia Aguda** é um sintoma extrapiramidal precoce decorrente do bloqueio dopaminérgico D2 no estriado, gerando desbalanço colinérgico relativo. O tratamento de escolha é a administração de um anticolinérgico central como o **Biperideno** ou anti-histamínico com ação anticolinérgica (Difenidramina).',
    highYieldNote: 'Distonia Aguda precoce por antipsicótico = BIPERIDENO IM / IV.'
  },

  // ==========================================
  // ENDÓCRINO E METABÓLICO
  // ==========================================
  {
    id: 'q-endo-01',
    category: 'endocrino',
    categoryName: 'Endócrino e Metabólico',
    question: 'Qual dos seguintes antidiabéticos orais atua inibindo o cotransportador renal SGLT2, promovendo glicosúria e natriurese com comprovada redução de mortalidade em pacientes com insuficiência cardíaca e doença renal crônica?',
    options: [
      { id: 'A', text: 'Glibenclamida' },
      { id: 'B', text: 'Empagliflozina' },
      { id: 'C', text: 'Pioglitazona' },
      { id: 'D', text: 'Sitagliptina' }
    ],
    correctAnswer: 'B',
    explanation: 'A **Empagliflozina** (assim como a Dapagliflozina) é um inibidor do SGLT2 no túbulo proximal renal. Reduz a reabsorção de glicose e sódio, diminuindo a pré-carga e a pressão intraglomerular, com marcante proteção renal e cardiovascular.',
    highYieldNote: 'Inibidores SGLT2 (Gliflozinas) = Glicosúria + Proteção Cardiorrenal na ICFEr e DRC.'
  },
  {
    id: 'q-endo-02',
    category: 'endocrino',
    categoryName: 'Endócrino e Metabólico',
    question: 'Em um paciente admitido em pronto-socorro com Cetoacidose Diabética (CAD) grave com glicemia de 580 mg/dL e acidose metabólica com ânion gap elevado, qual é o ÚNICO tipo de insulina padronizado para infusão intravenosa contínua?',
    options: [
      { id: 'A', text: 'Insulina NPH' },
      { id: 'B', text: 'Insulina Regular' },
      { id: 'C', text: 'Insulina Glargina' },
      { id: 'D', text: 'Insulina Degludeca' }
    ],
    correctAnswer: 'B',
    explanation: 'A **Insulina Regular** (humana solúvel) é a única que pode ser administrada por VIA INTRAVENOSA em bomba de infusão contínua em emergências hiperglicêmicas como a Cetoacidose Diabética (CAD) e o Estado Hiperosmolar Hiperglicêmico (EHH). Insulinas de ação prolongada (NPH, Glargina) são de uso exclusivamente subcutâneo.',
    highYieldNote: 'Cetoacidose Diabética (CAD) = Insulina REGULAR por via INTRAVENOSA.'
  },

  // ==========================================
  // FARMACOCINÉTICA E DINÂMICA
  // ==========================================
  {
    id: 'q-pk-01',
    category: 'farmacocinetica',
    categoryName: 'Farmacocinética & Dinâmica',
    question: 'Um paciente em uso crônico de Varfarina inicia tratamento com Rifampicina para Tuberculose. Após 10 dias, seu RNI (INR) cai de 2,5 para 1,2 (subterapêutico). Qual é o mecanismo farmacocinético dessa grave interação?',
    options: [
      { id: 'A', text: 'Inibição competitiva da CYP2C9 pela rifampicina' },
      { id: 'B', text: 'Indução potente do citocromo CYP2C9 e CYP3A4 pela rifampicina, acelerando a depuração da varfarina' },
      { id: 'C', text: 'Redução da absorção intestinal da varfarina por quelação' },
      { id: 'D', text: 'Deslocamento da varfarina das proteínas plasmáticas' }
    ],
    correctAnswer: 'B',
    explanation: 'A **Rifampicina** é um dos mais potentes indutores enzimáticos conhecidos do sistema citocromo P450 (especialmente CYP2C9, CYP3A4 e P-glicoproteína). Ela acelera dramaticamente o metabolismo hepático da Varfarina, reduzindo sua concentração sérica e levando o INR para níveis subterapêuticos com alto risco de trombose.',
    highYieldNote: 'Rifampicina = Potente Indutor da CYP450 (reduz nível de varfarina, anticoncepcionais, antirretrovirais).'
  },
  {
    id: 'q-pk-02',
    category: 'farmacocinetica',
    categoryName: 'Farmacocinética & Dinâmica',
    question: 'Qual parâmetro farmacocinético quantifica o volume teórico aparente de fluido corporal necessário para conter a quantidade total de fármaco no organismo na mesma concentração presente no plasma sanguíneo?',
    options: [
      { id: 'A', text: 'Volume de Distribuição (Vd)' },
      { id: 'B', text: 'Clearance Renal (Cl)' },
      { id: 'C', text: 'Biodisponibilidade (F)' },
      { id: 'D', text: 'Área Sob a Curva (ASC)' }
    ],
    correctAnswer: 'A',
    explanation: 'O **Volume de Distribuição (Vd)** relaciona a dose total do fármaco no corpo com sua concentração plasmática inicial (Vd = Dose / C0). Drogas altamente lipofílicas que se acumulam nos tecidos (como a Cloroquina e a Digoxina) possuem Vd muito maior que a água corporal total.',
    highYieldNote: 'Vd alto (> 40 L) = Fármaco lipofílico com ampla penetração e acúmulo tecidual.'
  },

  // ==========================================
  // SANGUE, PULMÃO E TGI
  // ==========================================
  {
    id: 'q-sangue-01',
    category: 'sangue_pulmao_tgi',
    categoryName: 'Sangue, Pulmão e TGI',
    question: 'Qual é o antídoto específico de ação imediata para reverter a anticoagulação em um paciente com hemorragia intracraniana em uso de Dabigatrana (Pradaxa)?',
    options: [
      { id: 'A', text: 'Protamina' },
      { id: 'B', text: 'Idarucizumabe' },
      { id: 'C', text: 'Fitomenadiona (Vitamina K)' },
      { id: 'D', text: 'Flumazenil' }
    ],
    correctAnswer: 'B',
    explanation: 'O **Idarucizumabe (Praxbind)** é um fragmento de anticorpo monoclonal humanizado (Fab) que se liga à Dabigatrana livre e ligada com afinidade 350x superior à da trombina, neutralizando seu efeito anticoagulante em poucos minutos. Protamina reverte Heparina e Vitamina K reverte Varfarina.',
    highYieldNote: 'Dabigatrana (Inibidor IIa) = Antídoto específico: IDARUCIZUMABE.'
  },
  {
    id: 'q-sangue-02',
    category: 'sangue_pulmao_tgi',
    categoryName: 'Sangue, Pulmão e TGI',
    question: 'Por que os Inibidores da Bomba de Prótons (como Omeprazol e Pantoprazol) devem ser administrados obrigatoriamente de 30 a 60 minutos antes da primeira refeição matinal para atingirem eficácia máxima?',
    options: [
      { id: 'A', text: 'Porque o alimento inativa quimicamente o anel benzimidazólico' },
      { id: 'B', text: 'Porque eles são pró-fármacos que necessitam ser absorvidos e chegar aos canalículos no momento exato em que a alimentação estimula o maior número de bombas H+/K+ ATPase ativas' },
      { id: 'C', text: 'Porque o estômago cheio impede a passagem do comprimido pelo piloro' },
      { id: 'D', text: 'Porque eles atuam diretamente no lúmen gástrico sem necessidade de absorção sistêmica' }
    ],
    correctAnswer: 'B',
    explanation: 'Os **IBPs** são pró-fármacos absorvidos no intestino delgado e carreados pela corrente sanguínea até as células parietais. Eles inibem exclusivamente as bombas de prótons (H+/K+ ATPase) que estão ATIVAMENTE secretando ácido (o que ocorre em resposta ao estímulo alimentar do café da manhã). Tomar em jejum 30-60 min antes da refeição sincroniza o pico plasmático com a ativação máxima das bombas.',
    highYieldNote: 'IBP = Inibição irreversível da H+/K+ ATPase. Tomar 30-60 min ANTES da refeição!'
  }
];

const FLASHCARDS_DATABASE = [
  {
    id: 'fc-01',
    category: 'sna',
    categoryName: 'SNA',
    front: 'Qual é o antídoto de escolha para intoxicação aguda por Organofosforados / Inseticidas inibidores de AChE?',
    back: 'ATROPINA (antagonista muscarínico para broncorreia/bradicardia) + PRALIDOXIMA (reativador da enzima acetilcolinesterase se administrado precocemente).',
    tip: 'Lembre-se: Atropina seca as secreções brônquicas que sufocam o paciente!'
  },
  {
    id: 'fc-02',
    category: 'antimicrobianos',
    categoryName: 'Antimicrobianos',
    front: 'Por que a Daptomicina NUNCA deve ser utilizada no tratamento de Pneumonia bacteriana por MRSA?',
    back: 'Porque a Daptomicina é completamente INATIVADA pelo surfactante pulmonar alveolar humano, falhando no tratamento.',
    tip: 'Para MRSA pulmonar, use Vancomicina ou Linezolida!'
  },
  {
    id: 'fc-03',
    category: 'cardiovascular',
    categoryName: 'Cardiovascular',
    front: 'Qual a diferença clínica fundamental entre o efeito adverso de tosse do Captopril (IECA) e da Losartana (BRA)?',
    back: 'O Captopril inibe a degradação da Bradicinina pulmonar causando tosse seca em até 20% dos pacientes. A Losartana atua direto no receptor AT1 e NÃO eleva bradicinina (sem tosse seca).',
    tip: 'Tosse por IECA? Substitua por BRA!'
  },
  {
    id: 'fc-04',
    category: 'antiinflamatorios',
    categoryName: 'Anti-inflamatórios',
    front: 'Qual é a tríade clínica clássica da intoxicação por Opioides e qual seu antídoto imediato?',
    back: 'Tríade: MIOSE puntiforme + DEPRESSÃO RESPIRATÓRIA (bradipneia) + COMA. Antídoto: NALOXONA por via IV/IM/Intranasal.',
    tip: 'Ação rápida da naloxona reverte a apneia em 1 a 2 minutos.'
  },
  {
    id: 'fc-05',
    category: 'snc',
    categoryName: 'SNC',
    front: 'Qual é o antídoto específico para reversão de sedação e overdose por Benzodiazepínicos (Diazepam, Midazolam)?',
    back: 'FLUMAZENIL (antagonista competitivo no sítio benzodiazepínico do receptor GABA-A).',
    tip: 'Atenção: não usar em usuários crônicos de BZD com risco de crise convulsiva de abstinência.'
  },
  {
    id: 'fc-06',
    category: 'endocrino',
    categoryName: 'Endócrino',
    front: 'Qual é a principal contraindicação renal para o uso da Metformina no Diabetes Mellitus Tipo 2?',
    back: 'Taxa de Filtração Glomerular (TFG/ClCr) < 30 mL/min, devido ao risco aumentado de Acidose Lática grave.',
    tip: 'Entre 30-45 mL/min a dose máxima recomendada é de 1000mg/dia.'
  },
  {
    id: 'fc-07',
    category: 'farmacocinetica',
    categoryName: 'Farmacocinética',
    front: 'Quantas meias-vidas (t½) são necessárias para que um fármaco atinja o Estado de Equilíbrio Plasmático (Steady-State)?',
    back: 'Aproximadamente 4 a 5 meias-vidas (onde ~97% da concentração máxima de equilíbrio é alcançada).',
    tip: 'A mesma regra de 4 a 5 meias-vidas vale para a eliminação completa após a suspensão!'
  },
  {
    id: 'fc-08',
    category: 'sangue_pulmao_tgi',
    categoryName: 'Sangue & TGI',
    front: 'Qual é o antídoto específico para reversão urgente da anticoagulação por Heparina Não Fracionada (HNF)?',
    back: 'SULFATO DE PROTAMINA (1 mg de protamina neutraliza aproximadamente 100 unidades de Heparina).',
    tip: 'Reversão por quelação eletrostática direta (Protamina básica se liga à Heparina ácida).'
  },
  {
    id: 'fc-09',
    category: 'cardiovascular',
    categoryName: 'Cardiovascular',
    front: 'Qual é o antídoto de emergência de 1ª escolha para reversão da taquicardia ventricular polimórfica Torsades de Pointes?',
    back: 'SULFATO DE MAGNÉSIO 2g por via intravenosa (estabiliza as correntes elétricas de membrana).',
    tip: 'Torsades de Pointes = Sulfato de Magnésio IV imediato!'
  },
  {
    id: 'fc-10',
    category: 'antiinflamatorios',
    categoryName: 'Toxicologia',
    front: 'Qual é o antídoto de escolha na intoxicação aguda grave por Paracetamol (Acetaminofeno)?',
    back: 'N-ACETILCISTEÍNA (administrada via oral ou IV para restaurar os estoques hepáticos de glutationa).',
    tip: 'Deve ser iniciada idealmente nas primeiras 8 a 10 horas após a ingestão!'
  }
];

// Exportação global
window.QUIZ_QUESTIONS = QUIZ_QUESTIONS;
window.FLASHCARDS_DATABASE = FLASHCARDS_DATABASE;
