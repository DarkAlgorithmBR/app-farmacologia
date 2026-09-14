# 📁 Como Adicionar Seus Arquivos PNG e PDF no Farmacologia Conectada

A aplicação está **100% pronta como um leitor e visualizador interativo nativo** dos seus arquivos de imagem PNG e documentos PDF originais.

---

## 🗺️ 1. Adicionando Mapas Mentais (Imagens PNG)

1. Salve suas imagens PNG na pasta:
   `c:\Users\delgi\Documents\app-farmacologia\assets\images\maps\`

2. Nomes recomendados por módulo (ou qualquer nome de sua preferência):
   - `map-sna-01.png`, `map-sna-02.png`, ...
   - `map-anti-01.png`, `map-anti-02.png`, ...
   - `map-cardio-01.png`, `map-cardio-02.png`, ...
   - `map-inflam-01.png`, `map-inflam-02.png`, ...
   - `map-snc-01.png`, `map-snc-02.png`, ...
   - `map-endo-01.png`, `map-endo-02.png`, ...
   - `map-pk-01.png`, `map-pk-02.png`, ...
   - `map-resp-01.png`, `map-resp-02.png`, ...

3. Para adicionar novos mapas ou alterar títulos, basta abrir o arquivo [maps-data.js](file:///c:/Users/delgi/Documents/app-farmacologia/assets/js/maps-data.js) e incluir o item:
   ```javascript
   {
     id: 'map-sna-07',
     category: 'sna',
     title: 'Título do Seu Mapa',
     subtitle: 'Breve descrição do conteúdo',
     image: './assets/images/maps/seu-arquivo.png',
     pdf: './assets/pdfs/seu-arquivo.pdf', // opcional para download direto
     tags: ['Tag1', 'Tag2']
   }
   ```

---

## 🎁 2. Adicionando os 4 Super Bônus (Arquivos PDF)

1. Salve os seus 4 PDFs na pasta:
   `c:\Users\delgi\Documents\app-farmacologia\assets\pdfs\`

2. Nomes padrão configurados no app:
   - **Bônus 1:** `bonus-1-mapa-mestre.pdf` *(Mapa Mestre dos Fármacos A-Z)*
   - **Bônus 2:** `bonus-2-quem-age-onde.pdf` *(Tabela Comparativa Quem Age Onde?)*
   - **Bônus 3:** `bonus-3-medicamentos-confundem.pdf` *(Medicamentos que Mais Confundem)*
   - **Bônus 4:** `bonus-4-efeitos-adversos.pdf` *(Mapa de Mecanismos e Efeitos Adversos)*

Ao clicar em **"Abrir Leitor de PDF"** ou **"Baixar"**, a aplicação carrega seu PDF original embutido com barra de ferramentas e download instantâneo.
