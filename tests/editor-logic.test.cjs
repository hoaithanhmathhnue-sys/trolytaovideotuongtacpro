'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { loadTfLogic } = require('./helpers.cjs');

test('tfProblems: thiếu câu dẫn → chưa có nội dung', () => {
  const { tfProblems } = loadTfLogic();
  const p = tfProblems({ kind: 'tf', text: '  ', statements: [{ text: 'a', ok: true }, { text: 'b', ok: false }] }, 'Mốc 1: ');
  assert.ok(p.some(x => /chưa có nội dung/.test(x)));
});

test('tfProblems: chỉ 1 ý có chữ → cần ít nhất 2 ý', () => {
  const { tfProblems } = loadTfLogic();
  const p = tfProblems({ kind: 'tf', text: 'Câu', statements: [{ text: 'a', ok: true }, { text: '', ok: false }] }, 'Mốc 1: ');
  assert.ok(p.some(x => /cần ít nhất 2 ý/.test(x)));
});

test('tfProblems: hợp lệ kể cả khi cả 4 ý đều Sai', () => {
  const { tfProblems } = loadTfLogic();
  const st = [1, 2, 3, 4].map(k => ({ text: 'Ý ' + k, ok: false }));
  assert.deepStrictEqual(tfProblems({ kind: 'tf', text: 'Câu', statements: st }, 't: '), []);
});

test('tfProblems: có ý trống khi vẫn còn ≥2 ý có chữ → cảnh báo ý trống', () => {
  const { tfProblems } = loadTfLogic();
  const st = [{ text: 'a', ok: true }, { text: 'b', ok: false }, { text: '', ok: false }];
  assert.ok(tfProblems({ kind: 'tf', text: 'Câu', statements: st }, 't: ').some(x => /ý đang để trống/.test(x)));
});

test('partsOf: nhóm theo phần và đếm số câu được chọn', () => {
  const { partsOf } = loadTfLogic();
  const r = partsOf([{ part: 'PHẦN I', sel: true }, { part: 'PHẦN I', sel: false }, { part: 'PHẦN II', sel: true }, { part: '', sel: true }]);
  assert.deepStrictEqual(r, [
    { part: 'PHẦN I', total: 2, selected: 1 },
    { part: 'PHẦN II', total: 1, selected: 1 }
  ]);
});
