'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const { loadLauncher } = require('./helpers.cjs');

const winOnly = { skip: process.platform !== 'win32' ? 'chỉ chạy trên Windows' : false };

test('launcher: file .bat gọi đúng file .ps1 và chỉ chứa ASCII', () => {
  const { LAUNCHER_PS1, LAUNCHER_BAT } = loadLauncher();
  assert.ok(/chay-bai-giang\.ps1/.test(LAUNCHER_BAT));
  assert.ok(/^[\x00-\x7F]*$/.test(LAUNCHER_BAT), 'bat phải thuần ASCII');
  assert.ok(/^[\x00-\x7F]*$/.test(LAUNCHER_PS1), 'ps1 phải thuần ASCII (PowerShell 5 đọc sai UTF-8 không BOM)');
});

test('launcher: phục vụ baigiang.html qua localhost, chặn thoát thư mục', winOnly, async () => {
  const { LAUNCHER_PS1 } = loadLauncher();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'launcher-'));
  fs.writeFileSync(path.join(dir, 'chay-bai-giang.ps1'), LAUNCHER_PS1);
  fs.writeFileSync(path.join(dir, 'baigiang.html'), '<p>xin chao</p>');
  fs.writeFileSync(path.join(path.dirname(dir), 'bi-mat.txt'), 'khong duoc lo');
  const port = 18123;
  const ps = spawn('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(dir, 'chay-bai-giang.ps1'), '-Port', String(port), '-NoBrowser'], { stdio: 'ignore' });
  try {
    let res;
    for (let i = 0; i < 40 && !res; i++) {
      await new Promise(r => setTimeout(r, 250));
      try { res = await fetch(`http://localhost:${port}/baigiang.html`); } catch (e) { /* chưa sẵn sàng */ }
    }
    assert.ok(res, 'máy chủ phải chạy');
    assert.strictEqual(res.status, 200);
    assert.ok((await res.text()).includes('xin chao'));
    const root = await fetch(`http://localhost:${port}/`);
    assert.strictEqual(root.status, 200, 'đường dẫn gốc mở baigiang.html');
    const esc = await fetch(`http://localhost:${port}/..%2fbi-mat.txt`);
    assert.ok([400, 403, 404].includes(esc.status), 'không được phục vụ file ngoài thư mục (nhận ' + esc.status + ')');
    assert.ok(!(await esc.text()).includes('khong duoc lo'));
    const miss = await fetch(`http://localhost:${port}/khong-co.html`);
    assert.strictEqual(miss.status, 404);
  } finally {
    spawn('taskkill', ['/pid', String(ps.pid), '/f', '/t'], { stdio: 'ignore' });
  }
});
