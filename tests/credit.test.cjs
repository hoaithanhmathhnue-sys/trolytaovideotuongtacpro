'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const player = html.match(/<script id="player-js">([\s\S]*?)<\/script>/)[1];
const editorCredit = html.match(/<div class="ed-credit">([\s\S]*?)<\/div>/);

const NEED = ['Trần Hoài Thanh', '0348296773', 'https://giaovienai.vercel.app/'];

test('trình phát (có trong mọi file xuất) KHÔNG ghi tác giả, chỉ trình soạn ghi', () => {
  NEED.forEach(s => assert.ok(!player.includes(s), 'trình phát không được chứa: ' + s));
  assert.ok(!/vp-credit/.test(html), 'không còn lớp vp-credit');
});

test('trình soạn ghi tác giả, Zalo và link công cụ ở GIỮA thanh tiêu đề và Soạn bài / Bảng kết quả', () => {
  assert.ok(editorCredit, 'thiếu <div class="ed-credit">');
  NEED.forEach(s => assert.ok(editorCredit[1].includes(s), 'thiếu: ' + s));
  const iHead = html.indexOf('<header class="ed-head">'), iCred = html.indexOf('class="ed-credit"'), iTabs = html.indexOf('<nav class="ed-tabs">');
  assert.ok(iHead < iCred && iCred < iTabs, 'phải nằm giữa thanh tiêu đề và thanh Soạn bài / Bảng kết quả');
  assert.ok(!/<footer class="ed-foot">/.test(html), 'không còn chân trang');
});
