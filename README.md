# Convite Digital — Marcella 15 anos

Projeto estático para GitHub Pages, com abertura, página principal e telas de Presentes, Dress Code e Manual do Convidado.

## Dados do evento
- Aniversariante: Marcella
- Data: 27/02/2027
- Horário: 20h
- WhatsApp configurado: `5511930389976`
- Localização: link do Google Maps configurado em `config.js`

## Estrutura
- `index.html`: telas, metadados Open Graph/Twitter e estrutura do editor.
- `styles.css`: responsividade, tela cheia e aparência do editor.
- `app.js`: navegação, confirmação WhatsApp, localização e editor de áreas.
- `config.js`: dados do evento, links, mensagens, posições e visibilidade dos hotspots.
- `assets/opening.webp`: abertura vertical.
- `assets/principal.webp`: convite principal.
- `assets/presentes.webp`: sugestões de presentes.
- `assets/dresscode.webp`: traje esporte fino; evitar azul-marinho e rosa.
- `assets/manual.webp`: manual do convidado com início às 20h.
- `assets/preview-whatsapp.jpg`: imagem horizontal Open Graph em 1200 × 630.

## Editor
Abra o endereço com `?editor=1`:
`https://premium-invites.github.io/Convite-Marcella-15-anos/?editor=1`

- Selecione um botão no menu ou toque na marcação sobre a arte.
- Arraste para mover; arraste a alça no canto para redimensionar.
- Altere posição, tamanho, rótulo e visibilidade no painel.
- “Salvar neste navegador” guarda apenas no navegador atual.
- “Copiar configuração” copia o objeto completo para substituir `hotspots` em `config.js`.
- Botões ocultos continuam selecionáveis no editor para que possam ser reativados.

## Publicação no GitHub Pages
1. Extraia o ZIP.
2. Envie `index.html`, `styles.css`, `app.js`, `config.js`, `.nojekyll` e a pasta `assets/` para a raiz do repositório `premium-invites/Convite-Marcella-15-anos`.
3. Em Settings → Pages, mantenha a publicação pela branch `main`, pasta `/ (root)`.
4. Aguarde o deploy e teste o endereço público em celular e computador.

## WhatsApp
A confirmação abre `https://wa.me/` com o número e a mensagem configurados em `config.js`. O texto é codificado por `encodeURIComponent`, evitando que acentos e espaços sejam perdidos.

## Prévia do WhatsApp
As tags `og:title`, `og:description`, `og:url`, `og:image` e Twitter Card já usam a URL do projeto Marcella e `assets/preview-whatsapp.jpg`. A imagem deve estar pública no GitHub Pages. O WhatsApp pode manter uma prévia antiga em cache por algum tempo; teste novamente após a publicação.

## Nota sobre mídia original
Esta reconstrução usa abertura estática em imagem e não inclui os arquivos de vídeo/áudio do ZIP original. Caso queira preservar uma abertura em vídeo ou música de fundo, esses arquivos precisam ser reintegrados à pasta `assets/` e a navegação deve ser ajustada para eles.
