'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { loadImporter, importFixture } = require('./helpers.cjs');

const seg = (text, fmt = 0) => ({ text, fmt });
const L = (...segs) => segs;

test('mẫu TN MIX: tổng 10 câu, không lẫn dòng hướng dẫn đầu file', async () => {
  const r = await importFixture('tn-mix-mau.docx');
  assert.strictEqual(r.questions.length, 10);
  assert.ok(!r.questions.some(q => /bôi đỏ/.test(q.text)));
});

test('Phần I giữ nguyên: 4 câu mcq, đáp án A,B,C,D', async () => {
  const r = await importFixture('tn-mix-mau.docx');
  const mcq = r.questions.filter(q => q.kind === 'mcq');
  assert.strictEqual(mcq.length, 4);
  assert.deepStrictEqual(mcq.map(q => q.options.findIndex(o => o.ok)), [0, 1, 2, 3]);
});

test('Phần III: dòng A. x là đáp án', async () => {
  const r = await importFixture('tn-mix-mau.docx');
  const sh = r.questions.filter(q => q.kind === 'short');
  assert.strictEqual(sh.length, 4);
  assert.deepStrictEqual(sh.map(q => q.answer), ['22,4', '-6,5', '2025', '-86']);
  sh.forEach(q => {
    assert.ok(!/A\./.test(q.text), 'câu dẫn không chứa dòng A.');
    assert.ok(!q.warnings.some(w => /chưa có đáp án/.test(w)));
  });
});

test('dòng A. đơn lẻ ngoài Phần III giữ hành vi cũ (không đáp án)', () => {
  const D = loadImporter();
  const qs = D.splitQuestions({ lines: [L(seg('Câu 1. Chọn đáp án đúng')), L(seg('A. 5'))] });
  assert.strictEqual(qs.length, 1);
  assert.strictEqual(qs[0].kind, 'short');
  assert.strictEqual(qs[0].answer, '');
});

test('dòng A. đơn lẻ trong Phần III là đáp án', () => {
  const D = loadImporter();
  const qs = D.splitQuestions({ lines: [L(seg('PHẦN III. Câu trắc nghiệm trả lời ngắn.')), L(seg('Câu 1. Tính 2+3')), L(seg('A. 5'))] });
  assert.strictEqual(qs[0].answer, '5');
});

/* ---- Task 2: Phần II → một câu tf ---- */
const part2 = (fmts, extra = []) => [
  L(seg('PHẦN II. Câu trắc nghiệm đúng sai.')),
  L(seg('Câu 1. Nội dung câu hỏi')),
  ...['a', 'b', 'c', 'd'].map((c, k) => L(seg(c + ') Nhận định ' + (k + 1), fmts[k]))),
  ...extra
];

test('Phần II mẫu: mỗi câu là 1 câu tf với 4 ý, đáp án theo gạch chân', async () => {
  const r = await importFixture('tn-mix-mau.docx');
  const tf = r.questions.filter(q => q.kind === 'tf');
  assert.strictEqual(tf.length, 2);
  assert.deepStrictEqual(tf[0].statements.map(s => s.ok), [true, false, false, true]);
  assert.deepStrictEqual(tf[1].statements.map(s => s.ok), [false, true, false, true]);
  assert.strictEqual(tf[0].text, 'Nội dung câu hỏi 1');
  assert.strictEqual(tf[1].text, 'Nội dung câu hỏi 2');
  assert.strictEqual(tf[0].how, 'gạch chân');
  assert.deepStrictEqual(tf[0].warnings, []);
  assert.ok(tf[0].statements.every(s => !/^[a-d]\)/.test(s.text)));
});

test('Phần II: không ý nào được đánh dấu → cảnh báo chưa xác định', () => {
  const D = loadImporter();
  const qs = D.splitQuestions({ lines: part2([0, 0, 0, 0]) });
  assert.strictEqual(qs[0].kind, 'tf');
  assert.ok(qs[0].warnings.some(w => /chưa xác định/.test(w)));
});

test('Phần II: cả 4 ý gạch chân → cả 4 Đúng', () => {
  const D = loadImporter();
  const qs = D.splitQuestions({ lines: part2([1, 1, 1, 1]) });
  assert.deepStrictEqual(qs[0].statements.map(s => s.ok), [true, true, true, true]);
  assert.deepStrictEqual(qs[0].warnings, []);
});

test('Phần II: cả 4 ý chỉ tô màu chữ → bỏ qua dấu đó, cảnh báo', () => {
  const D = loadImporter();
  const qs = D.splitQuestions({ lines: part2([4, 4, 4, 4]) });
  assert.ok(qs[0].warnings.some(w => /chưa xác định/.test(w)));
});

test('Phần II: dự phòng theo lời giải a) Đúng b) Sai', () => {
  const D = loadImporter();
  const qs = D.splitQuestions({ lines: part2([0, 0, 0, 0], [L(seg('Lời giải: a) Đúng b) Sai c) Sai d) Đúng'))]) });
  assert.deepStrictEqual(qs[0].statements.map(s => s.ok), [true, false, false, true]);
  assert.strictEqual(qs[0].how, 'lời giải');
});
