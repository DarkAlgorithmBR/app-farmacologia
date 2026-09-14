/**
 * Farmacologia Conectada - Calculadora Farmacométrica e Diluições
 * 5 Ferramentas Clínicas Essenciais para Medicina, Enfermagem e Farmácia
 */

const FarmacoCalculator = {
  // 1. CÁLCULO DE GOTEJAMENTO
  calcGotejamento({ volumeMl, timeValue, timeUnit }) {
    const vol = parseFloat(volumeMl);
    const time = parseFloat(timeValue);

    if (isNaN(vol) || isNaN(time) || vol <= 0 || time <= 0) {
      throw new Error('Por favor, informe valores válidos e maiores que zero.');
    }

    let hours = timeUnit === 'hours' ? time : time / 60;
    let minutes = timeUnit === 'minutes' ? time : time * 60;

    const gotasPorMin = (vol * 20) / minutes;
    const microgotasPorMin = (vol * 60) / minutes;
    const mlPorHora = vol / hours;

    return {
      gotasPorMin: Math.round(gotasPorMin * 10) / 10,
      gotasPorMinInt: Math.round(gotasPorMin),
      microgotasPorMin: Math.round(microgotasPorMin * 10) / 10,
      microgotasPorMinInt: Math.round(microgotasPorMin),
      mlPorHora: Math.round(mlPorHora * 10) / 10,
      tempoTotalFormatado: timeUnit === 'hours' ? `${time} hora(s)` : `${time} minuto(s)`
    };
  },

  // 2. REGRA DE TRÊS E DILUIÇÃO DE AMPOLAS
  calcDiluicao({ ampolaMg, ampolaMl, prescritoMg, diluenteAdicionalMl = 0 }) {
    const mgDisponivel = parseFloat(ampolaMg);
    const mlDisponivel = parseFloat(ampolaMl);
    const mgDesejado = parseFloat(prescritoMg);
    const dilAdicional = parseFloat(diluenteAdicionalMl) || 0;

    if (isNaN(mgDisponivel) || isNaN(mlDisponivel) || isNaN(mgDesejado) || mgDisponivel <= 0 || mlDisponivel <= 0 || mgDesejado <= 0) {
      throw new Error('Preencha os valores da ampola e da prescrição corretamente.');
    }

    // Concentração da ampola pura
    const concentracaoPuraMgMl = mgDisponivel / mlDisponivel;
    // Volume a aspirar da ampola pura
    const volumeAspirarMl = mgDesejado / concentracaoPuraMgMl;

    // Se houver rediluição (ex: aspirar e completar com SF para X mL)
    let volumeFinal = volumeAspirarMl;
    let concentracaoFinal = concentracaoPuraMgMl;

    if (dilAdicional > 0) {
      volumeFinal = volumeAspirarMl + dilAdicional;
      concentracaoFinal = mgDesejado / volumeFinal;
    }

    return {
      volumeAspirarMl: Math.round(volumeAspirarMl * 100) / 100,
      concentracaoPuraMgMl: Math.round(concentracaoPuraMgMl * 100) / 100,
      volumeFinal: Math.round(volumeFinal * 100) / 100,
      concentracaoFinal: Math.round(concentracaoFinal * 100) / 100,
      explicacao: `Aspirar exatamente ${Math.round(volumeAspirarMl * 100) / 100} mL da ampola original (${mgDisponivel}mg/${mlDisponivel}mL) para obter os ${mgDesejado}mg prescritos.`
    };
  },

  // 3. DOSE PEDIÁTRICA E POR PESO
  calcPediatrico({ pesoKg, dosePorKg, frequenciaVezesDia, suspensaoMg, suspensaoMl }) {
    const peso = parseFloat(pesoKg);
    const doseKg = parseFloat(dosePorKg);
    const freq = parseInt(frequenciaVezesDia, 10) || 1;
    const sMg = parseFloat(suspensaoMg);
    const sMl = parseFloat(suspensaoMl);

    if (isNaN(peso) || isNaN(doseKg) || peso <= 0 || doseKg <= 0) {
      throw new Error('Informe o peso da criança e a dose por kg.');
    }

    const doseTotalDiaMg = peso * doseKg;
    const dosePorTomadaMg = doseTotalDiaMg / freq;

    let mlPorTomada = null;
    let mlTotalDia = null;

    if (!isNaN(sMg) && !isNaN(sMl) && sMg > 0 && sMl > 0) {
      const concMgMl = sMg / sMl;
      mlPorTomada = Math.round((dosePorTomadaMg / concMgMl) * 100) / 100;
      mlTotalDia = Math.round((doseTotalDiaMg / concMgMl) * 100) / 100;
    }

    let intervaloTexto = '1x ao dia';
    if (freq === 2) intervaloTexto = 'de 12 em 12 horas (2x/dia)';
    if (freq === 3) intervaloTexto = 'de 8 em 8 horas (3x/dia)';
    if (freq === 4) intervaloTexto = 'de 6 em 6 horas (4x/dia)';

    return {
      peso,
      doseTotalDiaMg: Math.round(doseTotalDiaMg * 10) / 10,
      dosePorTomadaMg: Math.round(dosePorTomadaMg * 10) / 10,
      mlPorTomada,
      mlTotalDia,
      intervaloTexto,
      frequenciaVezesDia: freq
    };
  },

  // 4. DROGAS VASOATIVAS (mcg/kg/min <-> mL/h)
  calcVasoativa({ pesoKg, totalDrogaMg, volumeSolucaoMl, taxaMlHora, doseMcgKgMin, modoCalculo }) {
    const peso = parseFloat(pesoKg);
    const drogaMg = parseFloat(totalDrogaMg);
    const volMl = parseFloat(volumeSolucaoMl);

    if (isNaN(peso) || isNaN(drogaMg) || isNaN(volMl) || peso <= 0 || drogaMg <= 0 || volMl <= 0) {
      throw new Error('Preencha peso do paciente e composição da solução.');
    }

    // Concentração em mcg/mL (1 mg = 1000 mcg)
    const concentracaoMcgMl = (drogaMg * 1000) / volMl;

    if (modoCalculo === 'mlToDose') {
      const mlH = parseFloat(taxaMlHora);
      if (isNaN(mlH) || mlH < 0) throw new Error('Informe a vazão em mL/h.');
      // mcg/min = (mlH * concentracaoMcgMl) / 60
      // mcg/kg/min = mcg/min / peso
      const doseCalculada = (mlH * concentracaoMcgMl) / (60 * peso);
      return {
        concentracaoMcgMl: Math.round(concentracaoMcgMl * 100) / 100,
        doseMcgKgMin: Math.round(doseCalculada * 1000) / 1000,
        taxaMlHora: mlH
      };
    } else {
      const dose = parseFloat(doseMcgKgMin);
      if (isNaN(dose) || dose < 0) throw new Error('Informe a dose desejada em mcg/kg/min.');
      // mlH = (dose * peso * 60) / concentracaoMcgMl
      const vazaoCalculada = (dose * peso * 60) / concentracaoMcgMl;
      return {
        concentracaoMcgMl: Math.round(concentracaoMcgMl * 100) / 100,
        taxaMlHora: Math.round(vazaoCalculada * 10) / 10,
        doseMcgKgMin: dose
      };
    }
  },

  // 5. CLEARANCE DE CREATININA (COCKCROFT-GAULT)
  calcClearanceCreatinina({ idadeAnos, pesoKg, creatininaSerica, sexo }) {
    const idade = parseFloat(idadeAnos);
    const peso = parseFloat(pesoKg);
    const cr = parseFloat(creatininaSerica);

    if (isNaN(idade) || isNaN(peso) || isNaN(cr) || idade <= 0 || peso <= 0 || cr <= 0) {
      throw new Error('Informe idade, peso e creatinina sérica corretamente.');
    }

    // Cockcroft-Gault: ((140 - idade) * peso) / (72 * Cr)
    let clcr = ((140 - idade) * peso) / (72 * cr);
    if (sexo === 'feminino') {
      clcr = clcr * 0.85;
    }

    const clcrFinal = Math.round(clcr * 10) / 10;

    let estagioDrc = '';
    let recomendacao = '';
    let badgeColor = '';

    if (clcrFinal >= 90) {
      estagioDrc = 'Estágio G1 (Função Renal Normal ou Alta)';
      recomendacao = 'Função renal preservada. Doses padrão na maioria dos fármacos.';
      badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    } else if (clcrFinal >= 60) {
      estagioDrc = 'Estágio G2 (Redução Leve)';
      recomendacao = 'Geralmente não necessita de ajuste de dose, monitorar hidratação e nefrotóxicos.';
      badgeColor = 'bg-teal-100 text-teal-800 border-teal-300';
    } else if (clcrFinal >= 30) {
      estagioDrc = 'Estágio G3 (Redução Moderada a Severa)';
      recomendacao = 'Ajuste de dose recomendado para fármacos de excreção renal (ex: Enoxaparina, Aminoglicosídeos, Vancomicina). Metformina: dose máxima de 1000mg/dia se > 30 mL/min.';
      badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
    } else if (clcrFinal >= 15) {
      estagioDrc = 'Estágio G4 (Redução Grave)';
      recomendacao = 'Ajuste posológico obrigatório e redução de frequência. Contraindicar Metformina, AINEs e DOACs conforme bula.';
      badgeColor = 'bg-orange-100 text-orange-800 border-orange-300';
    } else {
      estagioDrc = 'Estágio G5 (Falência Renal Terminal)';
      recomendacao = 'Insuficiência renal terminal. Evitar medicamentos de depuração renal ou utilizar esquemas especiais pós-diálise.';
      badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
    }

    return {
      clcr: clcrFinal,
      estagioDrc,
      recomendacao,
      badgeColor,
      sexo,
      idade,
      peso,
      creatininaSerica: cr
    };
  }
};

// Exportação global
window.FarmacoCalculator = FarmacoCalculator;
