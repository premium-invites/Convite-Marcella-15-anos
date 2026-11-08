# Engine V4 Modular — Convite Premium

Esta versão mantém a correção de áudio para iPhone/Safari e permite ativar ou desativar cada recurso pelo `config.js`.

## Recursos modulares

```js
telas: {
  video: true,
  whatsapp: true,
  localizacao: true,
  presentes: true,
  dresscode: true,
  contagem: true
}
```

Use `false` para remover um recurso. A Engine remove automaticamente:

- a área clicável invisível;
- a tela relacionada;
- a opção correspondente do editor;
- qualquer posição antiga salva no navegador para aquele recurso.

Exemplo de convite somente com localização e contagem:

```js
telas: {
  video: true,
  whatsapp: false,
  localizacao: true,
  presentes: false,
  dresscode: false,
  contagem: true
}
```

## Arquivos de arte

- `assets/opening.webp`
- `assets/principal.webp`
- `assets/presentes.webp`, quando Presentes estiver ativo
- `assets/dresscode.webp`, quando Dress Code estiver ativo
- `assets/contagem.webp`, quando Contagem estiver ativa
- `assets/video.mp4`, quando Vídeo estiver ativo
- `assets/musica.mp3`
- `assets/preview-whatsapp.jpg`

## Editor

Abra o convite com `?editor=1` no final do endereço. O editor mostra somente os recursos ligados no `config.js`.

Na tela de contagem existem duas áreas editáveis:

- `Contagem (botão)`: hotspot da tela principal;
- `Contador (na tela)`: posição e tamanho do contador sobre `contagem.webp`.

## Música no iPhone

A V4 preserva o desbloqueio de áudio da V3. Caso o Safari bloqueie o MP3, aparece o botão **Ativar música** sem reiniciar o convite.

## Botões de voltar móveis
No editor `?editor=1`, selecione **Voltar — Presentes**, **Voltar — Dress Code** ou **Voltar — Contagem** para mover e redimensionar cada área.
A opção **Mostrar texto “Voltar”** pode ser desmarcada. O texto e o visual do botão somem, mas a área continua clicável sobre a arte.


## Manual do Convidado

Para usar esta tela, coloque sua arte em `assets/manual.webp` e deixe `manual: true` dentro de `telas` no `config.js`. A área do botão e o botão Voltar podem ser ajustados em `?editor=1`.

## Ajustes da contagem regressiva

- O botão da contagem usa o hotspot `countdown`.
- A Engine também aceita `contagem` por compatibilidade.
- A cor dos números é alterada em `contagem.corNumero` no `config.js`.
- A cor das legendas é alterada em `contagem.corLegenda`.
- O contador redimensiona números, legendas e espaçamentos proporcionalmente ao bloco, evitando sobreposição.
