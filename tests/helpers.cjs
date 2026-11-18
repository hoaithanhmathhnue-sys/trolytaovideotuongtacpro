'use strict';
/* Khung kiểm thử: nạp js/docx-import.js trong Node (dùng xmldom chỉ để chạy test). */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
/* xmldom chỉ để chạy test: ưu tiên bản cài bằng npm install, không có thì dùng bản trong thư mục tham khảo */
let DOMParser;
try { ({ DOMParser } = require('@xmldom/xmldom')); }
catch (e) { ({ DOMParser } = require(path.join(root, 'taodethi2026-main', 'node_modules', '@xmldom', 'xmldom'))); }

function loadImporter() {
  global.window = global;
  global.DOMParser = DOMParser;
  require(path.join(root, 'js', 'docx-import.js'));
  return global.DocxImport;
}

async function importFixture(name) {
  const D = loadImporter();
  const buf = fs.readFileSync(path.join(__dirname, 'fixtures', name));
  return D.importDocx(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
}

/* Trích <script id="player-js"> từ index.html và tạo PlayerModule() */
function loadPlayer() {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const m = html.match(/<script id="player-js">([\s\S]*?)<\/script>/);
  if (!m) throw new Error('Không thấy player-js');
  return new Function(m[1] + ';return PlayerModule();')();
}

/* Trích khối logic thuần giữa hai dấu /* tf-logic:start *\/ và /* tf-logic:end *\/ */
function loadTfLogic() {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const m = html.match(/\/\* tf-logic:start \*\/([\s\S]*?)\/\* tf-logic:end \*\//);
  if (!m) throw new Error('Không thấy khối tf-logic');
  return new Function(m[1] + ';return {tfProblems,partsOf};')();
}

/* Trích khối launcher (file mở nhanh bản YouTube) giữa /* launcher:start *\/ và /* launcher:end *\/ */
function loadLauncher() {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const m = html.match(/\/\* launcher:start \*\/([\s\S]*?)\/\* launcher:end \*\//);
  if (!m) throw new Error('Không thấy khối launcher');
  return new Function(m[1] + ';return {LAUNCHER_PS1,LAUNCHER_BAT};')();
}

module.exports = { loadImporter, importFixture, loadPlayer, loadTfLogic, loadLauncher };
