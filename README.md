# 💊 Farmacologia Conectada — Plataforma Web App & PWA de Estudos Interativos

> **Área de Membros e Plataforma de Entrega 100% Estática** voltada para estudantes e profissionais da área da saúde (Medicina, Farmácia, Enfermagem e Biomedicina).

---

## 🌟 Visão Geral

O **Farmacologia Conectada** é uma aplicação web moderna, ultra leve e responsiva (Mobile First), projetada para proporcionar a melhor experiência de leitura visual, fixação mnemônica e consulta clínica de farmacologia.

A plataforma é **100% estática** (HTML5, Tailwind CSS CDN, Lucide Icons e Vanilla JavaScript moderno), funcionando diretamente sem dependência de banco de dados ou backend. Todo o progresso do aluno (mapas estudados, favoritos, histórico de quiz e flashcards dominados) é persistido localmente via `localStorage`.

---

## 🚀 Módulos & Recursos Integrados

### 1. 🗺️ Biblioteca de Mapas Mentais em Alta Definição (88 Mapas PNG)
- **Leitor HD Inteligente:** Visualizador nativo com suporte a arrastar (**Pan**), zoom por scroll/botões/pinça touch (**Pinch-to-zoom**), ajuste automático à tela e tela cheia.
- **Categorização Farmacológica:** 8 grandes módulos (Sistema Nervoso Autônomo, Cardiovascular e Renal, SNC e Psiquiatria, Antimicrobianos e Antiparasitários, Anti-inflamatórios e Analgésicos, Sistema Respiratório e Digestório, Farmacologia Endócrina e Metabólica, Princípios Gerais e Farmacocinética).
- **Ações Rápidas:** Marcar como estudado ✓, favoritar ⭐, download direto do arquivo PNG em alta resolução.
- **Filtros e Busca Textual:** Filtragem instantânea por status (Todos, Favoritos, Estudados, Pendentes) e busca em tempo real.

### 2. 🎁 Super Bônus Exclusivos (4 Guias Completos em PDF)
1. **Guia Top Fármacos Mais Prescritos:** Doses usuais, indicações clínicas e alertas de segurança.
2. **Mapa dos Principais Receptores:** Agonistas, antagonistas, localização e vias de sinalização celular.
3. **Quadro Comparativo das Classes que Mais Confundem:** Diagnóstico diferencial entre classes farmacológicas.
4. **Guia de Revisão Express:** Resumos ultracompactos e tabelas mnemônicas para provas e concursos.
- *Visualizador de PDF embutido + botão de download direto e abertura em nova aba.*

### 3. 📖 Guia Rápido & Dicionário de Fármacos (+80 Medicamentos)
- Mecanismos de ação detalhados, nomes comerciais comuns, principais indicações clínicas, reações adversas críticas e dicas exclusivas para provas de residência/concurso (*High-Yield*).
- Botão de **Copiar Resumo** e filtro instantâneo por sistemas.

### 4. 🧠 Quiz de Fixação Clínica & Flashcards 3D
- **Simulado de Questões:** Casos clínicos no formato de múltipla escolha com justificativa comentada detalhada e notas de alto rendimento.
- **Flashcards com Efeito 3D:** Cartões interativos com rotação fluida para revisão ativa e autoavaliação (Dominado vs. Preciso Revisar).

### 5. 🧮 Calculadoras Farmacométricas & Clínicas (5 Ferramentas)
1. **Gotejamento de Infusão:** Cálculo de macrogotas/min e microgotas/min para soluções parenterais.
2. **Regra de Três / Diluição de Ampolas:** Conversão precisa de mg para mL com apresentação comercial.
3. **Dosagem Pediátrica e por Peso (mg/kg):** Posologia adaptada com volume por tomada.
4. **Infusão Contínua de Drogas Vasoativas (mcg/kg/min):** Taxa de bomba de infusão (mL/h) para Noradrenalina, Dopamina, Dobutamina, etc.
5. **Clearance de Creatinina (Cockcroft-Gault):** Estimativa de função renal e ajuste de dose com base na idade, peso e creatinina sérica.

### 6. 📊 Painel de Desempenho (Dashboard)
- Acompanhamento do percentual de conclusão dos 88 mapas, acurácia no simulado, flashcards dominados e gerenciamento de dados locais.

### 7. 🔍 Busca Global Instantânea (`Ctrl + K`)
- Localize instantaneamente mapas mentais, medicamentos, bônus e tópicos a partir de qualquer tela.

---

## 📱 Suporte a PWA & Experiência Mobile

O aplicativo é um **Progressive Web App (PWA)** completo:
- **Offline First:** Registrado via `service-worker.js` com cache inteligente para carregamento instantâneo mesmo sem conexão à internet.
- **Instalação no Celular (iOS / Android):**
  - **No iPhone / iPad (Safari):** Toque no botão de Compartilhar (ícone com seta para cima) e selecione **"Adicionar à Tela de Início"**.
  - **No Android (Chrome):** Toque no botão **"Instalar App"** no topo da tela ou no menu de 3 pontinhos > **"Instalar aplicativo"**.
- **Touch Otimizado:** Gestos de toque com isolamento de eventos (`touch-action: none`) para evitar conflito com rolagem da página ao dar zoom nos mapas mentais, e suporte a áreas seguras (Notch / Safe Area).

---

## 💻 Como Executar Localmente

Como a aplicação é 100% estática, você tem duas opções:

### Opção 1: Abertura Direta
Basta dar **duplo clique no arquivo `index.html`** no seu computador para abrir no seu navegador padrão.

### Opção 2: Servidor Local (Recomendado para testar Service Worker)
Se tiver o Node.js instalado:
```bash
# Iniciar servidor local na pasta do projeto
npm start
# ou
npx serve .
```
Acesse `http://localhost:3000` no seu navegador.

---

## 🐙 Como Subir para o GitHub e Publicar no GitHub Pages

Siga os passos abaixo no seu terminal para enviar o projeto ao seu repositório:

### 1. Inicializar o Git e Fazer o Commit Inicial
```bash
# Na pasta do projeto:
git init
git add .
git commit -m "feat: Farmacologia Conectada - Web App & PWA completo"
git branch -M main
```

### 2. Vincular ao seu Repositório do GitHub
Crie um novo repositório no seu GitHub (ex: `app-farmacologia`) e rode:
```bash
# Substitua pelo link do seu repositório:
git remote add origin https://github.com/SEU-USUARIO/app-farmacologia.git
git push -u origin main
```

### 3. Ativar o GitHub Pages Grátis
O repositório já inclui um fluxo automatizado do **GitHub Actions** (`.github/workflows/deploy.yml`):
1. No seu repositório no GitHub, clique em **Settings** > **Pages**.
2. Em **Build and deployment** > **Source**, selecione **GitHub Actions**.
3. O deploy será feito automaticamente em segundos e você receberá o link público (ex: `https://SEU-USUARIO.github.io/app-farmacologia/`).

---

## 🌐 Deploy no Vercel ou Netlify (1 Clique)

### No Vercel:
1. Acesse [vercel.com](https://vercel.com) e importe o repositório do GitHub.
2. Como o projeto é estático com `vercel.json` configurado, basta clicar em **Deploy**.

---

## 📁 Estrutura de Arquivos

```
app-farmacologia/
├── index.html                   # Página principal SPA (Design System + UI)
├── manifest.json                # Manifesto PWA com ícones e cores de tema
├── service-worker.js            # Cache offline do PWA
├── package.json                 # Metadados e scripts de execução
├── vercel.json                  # Configuração de headers e cache para Vercel
├── .gitignore                   # Arquivos ignorados pelo Git
├── .github/
│   └── workflows/
│       └── deploy.yml           # Workflow do GitHub Actions para GitHub Pages
├── assets/
│   ├── css/
│   │   └── styles.css           # Estilos customizados, safe areas e animações
│   ├── js/
│   │   ├── storage.js           # Gerenciador do localStorage
│   │   ├── maps-data.js         # Catálogo dos 88 Mapas Mentais (1 a 88)
│   │   ├── bonus-data.js        # Catálogo dos 4 Super Bônus em PDF
│   │   ├── dictionary-data.js   # Catálogo de +80 fármacos
│   │   ├── quiz-data.js         # Banco de questões e flashcards
│   │   ├── calculator.js        # 5 calculadoras farmacológicas
│   │   ├── viewer.js            # Motor Pan & Zoom HD touch/mouse
│   │   └── app.js               # Controlador principal SPA e PWA
│   ├── images/
│   │   ├── icons/               # Ícones PWA (icon-192.svg, icon-512.svg)
│   │   └── maps/
│   │       ├── entregavel/      # 88 Imagens PNG dos Mapas Mentais [1 (1).png ... 1 (88).png]
│   │       └── bonus/           # 4 Arquivos PDF dos Super Bônus
│   └── pdfs/                    # Cópia direta dos 4 PDFs de bônus
└── README.md                    # Documentação do projeto
```

---

## 📄 Licença
Distribuído sob a licença MIT. Desenvolvido para transformar o aprendizado de farmacologia.
