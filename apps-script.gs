/**
 * Painel de Parada – backend na Planilha Google.
 * Cole este código em Extensões > Apps Script da planilha e implante como App da Web.
 * Aba "Status": situação atual de cada OS. Aba "Historico": cada alteração feita no painel.
 */
const ABA_STATUS = 'Status';
const ABA_HIST = 'Historico';
const CAB_STATUS = ['Boletim','Unidade','Data','Frota','Frente','Descrição','H.H','Status','Atualizado por','Atualizado em'];
const CAB_HIST = ['Data/hora','Boletim','Unidade','Frota','Status','Por'];
const ROTULO = { pd: 'Pendente', ex: 'Executada', nx: 'Não executada' };
const CODIGO = { 'Pendente': 'pd', 'Executada': 'ex', 'Não executada': 'nx' };

function aba_(nome, cab) {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(nome);
  if (!sh) {
    sh = ss.insertSheet(nome);
    sh.appendRow(cab);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, cab.length).setFontWeight('bold');
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Evita que um texto digitado vire fórmula na planilha.
function texto_(v, max) {
  let t = String(v == null ? '' : v).slice(0, max || 200);
  if (/^[=+\-@]/.test(t)) t = "'" + t;
  return t;
}

function doGet() {
  const sh = aba_(ABA_STATUS, CAB_STATUS);
  const v = sh.getDataRange().getValues();
  const tz = Session.getScriptTimeZone();
  const status = {};
  for (let i = 1; i < v.length; i++) {
    const b = String(v[i][0]);
    if (!b) continue;
    const at = v[i][9] instanceof Date ? Utilities.formatDate(v[i][9], tz, 'dd/MM HH:mm') : String(v[i][9] || '');
    status[b] = { s: CODIGO[v[i][7]] || 'pd', by: String(v[i][8] || ''), at: at };
  }
  return json_({ ok: true, status: status });
}

function doPost(e) {
  let p;
  try { p = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'json inválido' }); }
  const b = String(p.b || '');
  if (!/^\d{3,10}$/.test(b)) return json_({ ok: false, error: 'boletim inválido' });
  if (!ROTULO[p.s]) return json_({ ok: false, error: 'status inválido' });

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sh = aba_(ABA_STATUS, CAB_STATUS);
    const agora = new Date();
    const por = texto_(p.by, 40);
    const linha = [b, texto_(p.u, 20), texto_(p.d, 10), texto_(p.fr, 10), texto_(p.fe, 80), texto_(p.ds, 200),
                   Number(p.hh) || 0, ROTULO[p.s], por, agora];
    const achou = sh.getRange('A:A').createTextFinder(b).matchEntireCell(true).findNext();
    if (achou && achou.getRow() > 1) sh.getRange(achou.getRow(), 1, 1, linha.length).setValues([linha]);
    else sh.appendRow(linha);
    aba_(ABA_HIST, CAB_HIST).appendRow([agora, b, texto_(p.u, 20), texto_(p.fr, 10), ROTULO[p.s], por]);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}
