'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const player = html.match(/<script id="player-js">([\s\S]*?)<\/script>/)[1];
const editorFoot = html.match(/<footer class="ed-foot">([\s\S]*?)<\/footer>/);

const NEED = ['Trần Hoài Thanh', '0348296773', 'https://giaovienai.vercel.app/'];

test('trình phát (có trong mọi file xuất) KHÔNG ghi tác giả, chỉ trình soạn ghi', () => {
  NEED.forEach(s => assert.ok(!player.includes(s), 'trình phát không được chứa: ' + s));
  assert.ok(!/vp-credit/.test(html), 'không còn lớp vp-credit');
});

test('trình soạn có chân trang ghi tác giả, Zalo và link công cụ', () => {
  assert.ok(editorFoot, 'thiếu <footer class="ed-foot">');
  NEED.forEach(s => assert.ok(editorFoot[1].includes(s), 'thiếu: ' + s));
});
