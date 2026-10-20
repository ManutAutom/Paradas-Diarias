# Painel de Parada · Preventiva Condicional

Painel de gestão à vista da parada preventiva condicional das unidades Clementina e Queiroz.
A liderança marca cada OS como **Executada** ou **Não executada** pelo celular ou computador,
e o status fica gravado numa Planilha Google, visível para todos que abrirem o link.

| Arquivo | Para que serve |
|---|---|
| `index.html` | O painel |
| `dados.js` | Programação da semana (datas e OS). Troque este arquivo a cada nova semana |
| `config.js` | Endereço da planilha (URL do Apps Script) |
| `apps-script.gs` | Código que vai dentro da Planilha Google |

## 1. Criar a planilha que guarda os status (5 minutos)

1. Crie uma Planilha Google nova, por exemplo "Status Parada Preventiva".
2. Menu **Extensões › Apps Script**. Apague o que estiver lá e cole todo o conteúdo de `apps-script.gs`. Salve.
3. Clique em **Implantar › Nova implantação**. Em tipo, escolha **App da Web**.
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
4. Autorize o acesso quando o Google pedir e copie a **URL do app da Web** (termina em `/exec`).
5. Abra `config.js` e cole a URL entre as aspas: `const API_URL = "https://script.google.com/macros/s/.../exec";`

As abas **Status** e **Historico** são criadas sozinhas na primeira marcação.

## 2. Publicar no GitHub Pages

1. Crie um repositório no GitHub (por exemplo `painel-parada`) e envie os arquivos desta pasta.
2. No repositório: **Settings › Pages › Build and deployment** → Source: **Deploy from a branch**, Branch: **main**, pasta **/ (root)** → Save.
3. Em um ou dois minutos o painel fica em `https://SEU-USUARIO.github.io/painel-parada/`.
4. Mande esse link para a liderança.

## 3. Nova semana de parada

Edite `dados.js`: troque `SEMANA`, `DAYS` e as linhas de cada unidade (formato `data|frente|boletim|frota|prioridade|descrição|H.H`).
Os status antigos continuam na planilha. Se quiser zerar, limpe as linhas da aba **Status** (mantenha o cabeçalho).

## Observações

- Qualquer pessoa com o link do painel consegue alterar o status. A aba **Historico** registra cada alteração com data, hora e o nome digitado no campo "Seu nome".
- O painel busca os status da planilha a cada 20 segundos e quando a tela volta a ficar ativa.
- O botão **Exportar PDF** gera o quadro em A3 paisagem com o status do momento, para impressão.
- Se você alterar o `apps-script.gs` depois, use **Implantar › Gerenciar implantações › Editar › Nova versão** para manter a mesma URL.
