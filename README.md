# Academic OS

Academic OS é um painel acadêmico em português para organizar disciplinas, acompanhar notas e frequência e planejar atividades do semestre. O site usa HTML, CSS e JavaScript e roda no navegador, sem servidor de aplicação, conta ou etapa de build.

## Recursos

- Visão geral com indicadores acadêmicos, evolução das notas e alertas de desempenho.
- Cadastro de disciplinas e avaliações, cálculo de médias ponderadas e registro de presença e faltas.
- Tarefas com prioridades, prazos e subtarefas, com visualização em lista ou quadro.
- Calendário de compromissos, avaliações e tarefas.
- Relatórios com exportação CSV e importação e exportação de backups em JSON.
- Temas claro e escuro e dados de demonstração para explorar o painel.

## Executar localmente

Com o Python 3 instalado, execute o comando abaixo na raiz do projeto e abra [http://localhost:8000](http://localhost:8000) no navegador.

```sh
python -m http.server 8000 --directory academic-os
```

Os dados ficam no `localStorage` do navegador. Para levar seus registros da versão local para a versão publicada ou para outro navegador, exporte um backup JSON em **Configurações** e importe-o no destino. A importação substitui os dados atuais do destino.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie os arquivos do projeto para a branch padrão.
2. Nas configurações do repositório, abra **Settings → Pages** e selecione **GitHub Actions** como fonte de publicação em **Build and deployment**.
3. Na aba **Actions**, abra o workflow **Publicar no GitHub Pages**, clique em **Run workflow** e selecione a branch padrão. Após a execução, o endereço do site aparece em **Settings → Pages**.

Depois da configuração, cada push na branch padrão publica automaticamente o conteúdo de `academic-os/`. A página `index.html` fica na raiz do site publicado. [Documentação do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Estrutura

| Arquivo | Função |
| --- | --- |
| `academic-os/index.html` | Página de entrada |
| `academic-os/styles.css` | Layout, componentes e temas |
| `academic-os/script.js` | Interface, cálculos e armazenamento local |
| `.github/workflows/pages.yml` | Publicação do site no GitHub Pages |
