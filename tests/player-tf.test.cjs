'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { loadPlayer } = require('./helpers.cjs');

const P = loadPlayer();
const tfQ = (oks, extra = {}) => Object.assign({
  kind: 'tf', text: 'Cho hàm số $y=x^2$.', explain: '', images: [], vars: '',
  statements: oks.map((ok, k) => ({ text: 'Nhận định ' + (k + 1), ok }))
}, extra);

test('tf: wrongCount đếm ý sai và ý chưa chọn', () => {
  const inst = P.instantiate(tfQ([true, false, false, true]), 's', true);
  assert.strictEqual(inst.kind, 'tf');
  assert.strictEqual(inst.wrongCount([true, false, false, true]), 0);
  assert.strictEqual(inst.wrongCount([true, true, false, true]), 1);
  assert.strictEqual(inst.wrongCount([null, null, null, null]), 4);
});

test('tf: không xáo thứ tự ý và correct liệt kê Đúng/Sai', () => {
  const inst = P.instantiate(tfQ([true, false, false, true]), 'seed-khac', true);
  assert.deepStrictEqual(inst.answers, [true, false, false, true]);
  assert.ok(/a\) Đúng/.test(inst.correct) && /b\) Sai/.test(inst.correct));
  assert.strictEqual(inst.statements.length, 4);
});

test('tf: công thức trong ý được giữ để MathJax xử lý', () => {
  const q = tfQ([true, false], { statements: [{ text: 'Giá trị $x^2$ luôn dương', ok: true }, { text: 'Khác', ok: false }] });
  const inst = P.instantiate(q, 's', true);
  assert.ok(inst.statements[0].includes('x^2'));
  assert.ok(P.hasMath(inst.statements[0]));
});

test('tf: dưới 2 ý có chữ thì báo lỗi', () => {
  const q = tfQ([true], { statements: [{ text: 'Chỉ một ý', ok: true }, { text: '   ', ok: false }] });
  assert.throws(() => P.instantiate(q, 's', true), /Cần ít nhất 2 ý/);
});

test('short: đáp án 22,4 nhận cả 22.4 và 22,4', () => {
  const inst = P.instantiate({ kind: 'short', text: 'Tính', answer: '22,4', tol: 0, explain: '', images: [], vars: '' }, 's', true);
  assert.strictEqual(inst.check('22.4'), true);
  assert.strictEqual(inst.check('22,4'), true);
  assert.strictEqual(inst.check('22,5'), false);
});
