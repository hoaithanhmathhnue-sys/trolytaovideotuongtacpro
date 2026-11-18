/* =====================================================================
 *  Đọc file Word (.docx) bài tập → danh sách câu hỏi có công thức LaTeX
 *  - Công thức Word (OMML)            → LaTeX
 *  - Công thức MathType (OLE / MTEF)  → LaTeX (MTEF v3 và v5)
 *  - Hình ảnh PNG/JPG/GIF/SVG          → giữ lại
 *  Chạy hoàn toàn trên trình duyệt, không gửi file đi đâu.
 * ===================================================================== */
(function (root) {
'use strict';

/* ---------------------------------------------------------------------
 * 1. Bảng ký hiệu Unicode → LaTeX (dùng chung cho OMML và MathType)
 * ------------------------------------------------------------------- */
const UNI = {
  0x3B1:'\\alpha',0x3B2:'\\beta',0x3B3:'\\gamma',0x3B4:'\\delta',0x3B5:'\\varepsilon',0x3B6:'\\zeta',0x3B7:'\\eta',0x3B8:'\\theta',
  0x3B9:'\\iota',0x3BA:'\\kappa',0x3BB:'\\lambda',0x3BC:'\\mu',0x3BD:'\\nu',0x3BE:'\\xi',0x3BF:'o',0x3C0:'\\pi',0x3C1:'\\rho',
  0x3C2:'\\varsigma',0x3C3:'\\sigma',0x3C4:'\\tau',0x3C5:'\\upsilon',0x3C6:'\\varphi',0x3C7:'\\chi',0x3C8:'\\psi',0x3C9:'\\omega',
  0x3D1:'\\vartheta',0x3D5:'\\phi',0x3D6:'\\varpi',0x3F5:'\\epsilon',0x3F1:'\\varrho',
  0x393:'\\Gamma',0x394:'\\Delta',0x398:'\\Theta',0x39B:'\\Lambda',0x39E:'\\Xi',0x3A0:'\\Pi',0x3A3:'\\Sigma',0x3A5:'\\Upsilon',
  0x3A6:'\\Phi',0x3A8:'\\Psi',0x3A9:'\\Omega',0x391:'A',0x392:'B',0x395:'E',0x396:'Z',0x397:'H',0x399:'I',0x39A:'K',0x39C:'M',
  0x39D:'N',0x39F:'O',0x3A1:'P',0x3A4:'T',0x3A7:'X',0x2126:'\\Omega',0x2206:'\\Delta',0x220F:'\\prod',0x2211:'\\sum',
  0xB1:'\\pm',0x2213:'\\mp',0xD7:'\\times',0xF7:'\\div',0xB7:'\\cdot',0x22C5:'\\cdot',0x2219:'\\cdot',0x2218:'\\circ',0x2022:'\\bullet',
  0x2212:'-',0x2010:'-',0x2013:'-',0x2217:'*',0x2215:'/',0x2044:'/',
  0x2264:'\\le',0x2265:'\\ge',0x2A7D:'\\le',0x2A7E:'\\ge',0x2260:'\\ne',0x2248:'\\approx',0x2261:'\\equiv',0x223C:'\\sim',0x2243:'\\simeq',
  0x2245:'\\cong',0x221D:'\\propto',0x226A:'\\ll',0x226B:'\\gg',0x2272:'\\lesssim',0x2273:'\\gtrsim',0x227A:'\\prec',0x227B:'\\succ',
  0x221E:'\\infty',0x2202:'\\partial',0x2207:'\\nabla',0x2200:'\\forall',0x2203:'\\exists',0x2204:'\\nexists',0x2208:'\\in',0x2209:'\\notin',
  0x220B:'\\ni',0x2282:'\\subset',0x2283:'\\supset',0x2286:'\\subseteq',0x2287:'\\supseteq',0x2284:'\\not\\subset',0x2288:'\\nsubseteq',
  0x222A:'\\cup',0x2229:'\\cap',0x2205:'\\varnothing',0x2216:'\\setminus',0x2223:'\\mid',0x2224:'\\nmid',0x2225:'\\parallel',0x2016:'\\|',
  0x22A5:'\\perp',0x2220:'\\angle',0x2221:'\\measuredangle',0x25B3:'\\triangle',0x2206:'\\Delta',0x25A1:'\\square',
  0x2192:'\\to',0x2190:'\\leftarrow',0x2194:'\\leftrightarrow',0x21D2:'\\Rightarrow',0x21D0:'\\Leftarrow',0x21D4:'\\Leftrightarrow',
  0x2191:'\\uparrow',0x2193:'\\downarrow',0x21A6:'\\mapsto',0x27F9:'\\Longrightarrow',0x27FA:'\\Longleftrightarrow',0x27F6:'\\longrightarrow',
  0x21C4:'\\rightleftarrows',0x21CC:'\\rightleftharpoons',0x21C0:'\\rightharpoonup',0x21BD:'\\leftharpoondown',
  0x2026:'\\ldots',0x22EF:'\\cdots',0x22EE:'\\vdots',0x22F1:'\\ddots',0xB0:'^{\\circ}',0x2032:"'",0x2033:"''",0x2034:"'''",
  0x221A:'\\surd',0x222B:'\\int',0x222C:'\\iint',0x222D:'\\iiint',0x222E:'\\oint',0xAC:'\\neg',0x2227:'\\wedge',0x2228:'\\vee',
  0x2295:'\\oplus',0x2297:'\\otimes',0x2299:'\\odot',0x27E8:'\\langle',0x27E9:'\\rangle',0x2329:'\\langle',0x232A:'\\rangle',
  0x230A:'\\lfloor',0x230B:'\\rfloor',0x2308:'\\lceil',0x2309:'\\rceil',0x2113:'\\ell',0x210F:'\\hbar',0x2118:'\\wp',
  0x211D:'\\mathbb{R}',0x2115:'\\mathbb{N}',0x2124:'\\mathbb{Z}',0x211A:'\\mathbb{Q}',0x2102:'\\mathbb{C}',
  0x2234:'\\therefore',0x2235:'\\because',0x22C2:'\\bigcap',0x22C3:'\\bigcup',0x2210:'\\coprod',0x2032:"'",0x2035:'\\backprime',
  0x2322:'\\frown',0x2323:'\\smile',0x2135:'\\aleph',0x2111:'\\Im',0x211C:'\\Re',0x2020:'\\dagger',0x2021:'\\ddagger',
  0x2227:'\\wedge',0x22C0:'\\bigwedge',0x22C1:'\\bigvee',0x2A00:'\\bigodot',0x2A01:'\\bigoplus',0x2A02:'\\bigotimes',
  0x2192:'\\to',0x21C6:'\\leftrightarrows',0x2196:'\\nwarrow',0x2197:'\\nearrow',0x2198:'\\searrow',0x2199:'\\swarrow',
  0x2016:'\\|',0x2225:'\\parallel',0x2AFD:'\\parallel',0x226E:'\\nless',0x226F:'\\ngtr',0x2270:'\\nleq',0x2271:'\\ngeq',
  0x2262:'\\not\\equiv',0x2209:'\\notin',0x20AC:'\\text{€}',0xA0:'~',0x2009:'\\,',0x200A:'\\,',0x2002:'\\enspace',0x2003:'\\quad',
  0x2005:'\\:',0x2006:'\\,',0x2007:'\\enspace',0x200B:'',0x2061:'',0x2062:'',0x2063:'',0x2064:'',0xFEFF:''
};
const ASCII_ESC = { 0x7B:'\\{', 0x7D:'\\}', 0x25:'\\%', 0x23:'\\#', 0x26:'\\&', 0x24:'\\$', 0x5F:'\\_', 0x5C:'\\backslash', 0x7E:'\\sim', 0x5E:'\\hat{}' };
/* Font Symbol (Equation Editor 3.0 và ký tự w:sym) → Unicode */
const SYMBOL_FONT = {
  0x61:0x3B1,0x62:0x3B2,0x63:0x3C7,0x64:0x3B4,0x65:0x3B5,0x66:0x3C6,0x67:0x3B3,0x68:0x3B7,0x69:0x3B9,0x6A:0x3D5,0x6B:0x3BA,0x6C:0x3BB,
  0x6D:0x3BC,0x6E:0x3BD,0x6F:0x3BF,0x70:0x3C0,0x71:0x3B8,0x72:0x3C1,0x73:0x3C3,0x74:0x3C4,0x75:0x3C5,0x76:0x3D6,0x77:0x3C9,0x78:0x3BE,
  0x79:0x3C8,0x7A:0x3B6,0x41:0x391,0x42:0x392,0x43:0x3A7,0x44:0x394,0x45:0x395,0x46:0x3A6,0x47:0x393,0x48:0x397,0x49:0x399,0x4A:0x3D1,
  0x4B:0x39A,0x4C:0x39B,0x4D:0x39C,0x4E:0x39D,0x4F:0x39F,0x50:0x3A0,0x51:0x398,0x52:0x3A1,0x53:0x3A3,0x54:0x3A4,0x55:0x3A5,0x56:0x3C2,
  0x57:0x3A9,0x58:0x39E,0x59:0x3A8,0x5A:0x396,0x22:0x2200,0x24:0x2203,0x27:0x220B,0x2D:0x2212,0x40:0x2245,0x5E:0x22A5,0x60:0xF8E5,
  0xA2:0x2032,0xA3:0x2264,0xA5:0x221E,0xAB:0x2194,0xAC:0x2190,0xAD:0x2191,0xAE:0x2192,0xAF:0x2193,0xB0:0xB0,0xB1:0xB1,0xB2:0x2033,
  0xB3:0x2265,0xB4:0xD7,0xB5:0x221D,0xB6:0x2202,0xB7:0x2022,0xB8:0xF7,0xB9:0x2260,0xBA:0x2261,0xBB:0x2248,0xBC:0x2026,0xC0:0x2135,
  0xC4:0x2297,0xC5:0x2295,0xC6:0x2205,0xC7:0x2229,0xC8:0x222A,0xC9:0x2283,0xCA:0x2287,0xCB:0x2284,0xCC:0x2282,0xCD:0x2286,0xCE:0x2208,
  0xCF:0x2209,0xD0:0x2220,0xD1:0x2207,0xD5:0x220F,0xD6:0x221A,0xD7:0x22C5,0xD8:0xAC,0xD9:0x2227,0xDA:0x2228,0xDB:0x21D4,0xDC:0x21D0,
  0xDD:0x21D1,0xDE:0x21D2,0xDF:0x21D3,0xE1:0x2329,0xE5:0x2211,0xF1:0x232A,0xF2:0x222B
};
const FUNCS = new Set(['sin','cos','tan','cot','sec','csc','arcsin','arccos','arctan','sinh','cosh','tanh','coth','log','ln','lg','exp',
  'lim','max','min','sup','inf','det','gcd','deg','dim','ker','arg','hom','Pr','limsup','liminf']);

function texCode(code) {
  if (code == null) return '';
  if (code >= 0xF020 && code <= 0xF0FF) code = SYMBOL_FONT[code - 0xF000] || (code - 0xF000);   // ký tự font Symbol/Wingdings lưu ở vùng F0xx
  if (UNI[code] !== undefined) return UNI[code];
  if (ASCII_ESC[code]) return ASCII_ESC[code];
  if (code >= 0xE000 && code <= 0xF8FF) return '';          // vùng riêng (MT Extra…) – bỏ qua
  if (code < 0x20) return code === 9 ? '\\quad ' : '';
  return String.fromCodePoint(code);
}
function texStr(s) {
  let out = '';
  for (const ch of String(s)) {
    const t = texCode(ch.codePointAt(0));
    out += /^\\[A-Za-z]+$/.test(t) ? t + ' ' : t;
  }
  return out;
}
const tidy = s => String(s).replace(/\s+/g, ' ').replace(/\s+([_^}])/g, '$1').replace(/\{\s+/g, '{').trim();
const escText = s => String(s).replace(/[\\{}$%#&_^~]/g, c => ({ '\\':'\\backslash ', '~':'\\sim ', '^':'\\hat{}' }[c] || '\\' + c));
const wrap = s => (s.length === 1 || /^\\[A-Za-z]+\s*$/.test(s)) ? s : '{' + s + '}';

/* ---------------------------------------------------------------------
 * 2. Đọc ZIP (DOCX) bằng DecompressionStream
 * ------------------------------------------------------------------- */
async function inflateRaw(data) {
  if (typeof DecompressionStream === 'undefined') throw new Error('Trình duyệt quá cũ, hãy dùng Chrome/Edge/Firefox/Safari bản mới.');
  const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}
function openZip(buf) {
  const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  let eocd = -1;
  for (let i = u8.length - 22; i >= Math.max(0, u8.length - 65557); i--) if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  if (eocd < 0) {
    if (u8[0] === 0xD0 && u8[1] === 0xCF) throw new Error('Đây là file Word cũ (.doc). Hãy mở bằng Word rồi “Lưu thành” .docx.');
    throw new Error('Không đọc được file. Hãy chọn đúng file Word .docx.');
  }
  const n = dv.getUint16(eocd + 10, true); let p = dv.getUint32(eocd + 16, true);
  const entries = {}; const dec = new TextDecoder();
  for (let k = 0; k < n && p + 46 <= u8.length; k++) {
    if (dv.getUint32(p, true) !== 0x02014b50) break;
    const nl = dv.getUint16(p + 28, true), el = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true);
    entries[dec.decode(u8.subarray(p + 46, p + 46 + nl))] = { method: dv.getUint16(p + 10, true), csize: dv.getUint32(p + 20, true), off: dv.getUint32(p + 42, true) };
    p += 46 + nl + el + cl;
  }
  return {
    names: Object.keys(entries),
    async bytes(name) {
      const e = entries[name]; if (!e) return null;
      const start = e.off + 30 + dv.getUint16(e.off + 26, true) + dv.getUint16(e.off + 28, true);
      const raw = u8.subarray(start, start + e.csize);
      if (e.method === 0) return raw.slice();
      if (e.method === 8) return inflateRaw(raw);
      throw new Error('Kiểu nén không hỗ trợ: ' + e.method);
    },
    async text(name) { const b = await this.bytes(name); return b ? new TextDecoder().decode(b) : null; }
  };
}

/* ---------------------------------------------------------------------
 * 3. Đọc OLE (Compound File) → luồng "Equation Native" của MathType
 * ------------------------------------------------------------------- */
function cfbStream(u8, wantName) {
  if (!u8 || u8.length < 512) return null;
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  if (dv.getUint32(0, true) !== 0xE011CFD0 || dv.getUint32(4, true) !== 0xE11AB1A1) return null;
  const ss = 1 << dv.getUint16(30, true), mss = 1 << dv.getUint16(32, true);
  const nFat = dv.getUint32(44, true), dirStart = dv.getUint32(48, true), cutoff = dv.getUint32(56, true);
  const mfStart = dv.getUint32(60, true), difStart = dv.getUint32(68, true);
  const END = 0xFFFFFFFA, off = s => (s + 1) * ss;
  const u32 = o => o + 4 <= u8.length ? dv.getUint32(o, true) : 0xFFFFFFFE;
  const fatSecs = [];
  for (let i = 0; i < 109 && fatSecs.length < nFat; i++) { const s = u32(76 + i * 4); if (s >= END) break; fatSecs.push(s); }
  for (let d = difStart, g = 0; fatSecs.length < nFat && d < END && g < 10000; g++) {
    const per = ss / 4 - 1;
    for (let i = 0; i < per && fatSecs.length < nFat; i++) { const s = u32(off(d) + i * 4); if (s >= END) break; fatSecs.push(s); }
    d = u32(off(d) + per * 4);
  }
  const fat = []; fatSecs.forEach(s => { for (let i = 0; i < ss / 4; i++) fat.push(u32(off(s) + i * 4)); });
  const chain = (start, table) => { const out = []; for (let s = start, g = 0; s < END && s < table.length && g < 1e6; g++) { out.push(s); s = table[s]; } return out; };
  const readBig = (start, size) => {
    const secs = chain(start, fat), out = new Uint8Array(secs.length * ss);
    secs.forEach((s, i) => out.set(u8.subarray(off(s), Math.min(off(s) + ss, u8.length)), i * ss));
    return size != null ? out.subarray(0, size) : out;
  };
  const dir = readBig(dirStart), entries = [];
  for (let i = 0; i + 128 <= dir.length; i += 128) {
    const nl = dir[i + 64] | (dir[i + 65] << 8); let name = '';
    for (let k = 0; k + 1 < nl - 2; k += 2) name += String.fromCharCode(dir[i + k] | (dir[i + k + 1] << 8));
    const d2 = new DataView(dir.buffer, dir.byteOffset + i, 128);
    entries.push({ name, type: dir[i + 66], start: d2.getUint32(116, true), size: d2.getUint32(120, true) });
  }
  const e = entries.find(x => x.type === 2 && x.name === wantName);
  if (!e) return null;
  if (e.size < cutoff) {
    const mini = readBig(entries[0].start), mfb = mfStart < END ? readBig(mfStart) : new Uint8Array(0), mfat = [];
    for (let i = 0; i + 4 <= mfb.length; i += 4) mfat.push(mfb[i] | (mfb[i + 1] << 8) | (mfb[i + 2] << 16) | (mfb[i + 3] << 24) >>> 0);
    const secs = chain(e.start, mfat.map(x => x >>> 0)), out = new Uint8Array(secs.length * mss);
    secs.forEach((s, i) => out.set(mini.subarray(s * mss, s * mss + mss), i * mss));
    return out.subarray(0, e.size);
  }
  return readBig(e.start, e.size);
}

/* ---------------------------------------------------------------------
 * 4. MTEF (MathType Equation Format) v3 / v5 → cây → LaTeX
 * ------------------------------------------------------------------- */
function parseMTEF(stream) {
  const hdr = stream[0] | (stream[1] << 8);
  const u8 = stream.subarray(hdr >= 8 && hdr < 64 ? hdr : 28);
  let p = 0;
  const left = () => u8.length - p;
  const b = () => { if (p >= u8.length) throw new Error('MTEF: hết dữ liệu'); return u8[p++]; };
  const w = () => b() | (b() << 8);
  const str = () => { let s = ''; for (let c = b(); c !== 0; c = b()) s += String.fromCharCode(c); return s; };
  const mtuint = () => { const x = b(); if (x < 255) return x; const lo = b(), hi = b(); return (hi << 8) | lo; };
  const nudge = () => { const x = b(), y = b(); if (x === 0x80 && y === 0x80) { w(); w(); } };
  const ruler = () => { const n = b(); p += n * 3; };
  const ver = b(); b(); b(); b(); b();               // version, platform, product, product version, subversion
  if (ver >= 4) { str(); b(); }                       // application key, equation options
  if (ver !== 3 && ver !== 4 && ver !== 5) throw new Error('MTEF phiên bản ' + ver + ' chưa hỗ trợ');
  const END = { t: 'end' };
  const dims = () => {                                // mảng kích thước dạng nibble (EQN_PREFS)
    const n = b(); let half = -1;
    const nib = () => { if (half >= 0) { const h = half; half = -1; return h; } const x = b(); half = x & 15; return x >> 4; };
    for (let i = 0; i < n; i++) { nib(); let g = 0; while (nib() !== 15 && g++ < 64); }
  };
  function list() {
    const out = [];
    while (left() > 0) { const r = rec(); if (r === END) break; if (r) out.push(r); }
    return out;
  }
  function rec() {
    const tag = b();
    if (ver === 3) {
      const type = tag & 15, o = tag >> 4;
      switch (type) {
        case 0: return END;
        case 1: if (o & 8) nudge(); if (o & 4) w(); if (o & 2) ruler(); return { t: 'line', items: (o & 1) ? [] : list() };
        case 2: { if (o & 8) nudge(); const tf = (b() + 128) & 255, code = w(); const emb = (o & 2) ? list() : [];
          return { t: 'char', tf, code: (tf >= 4 && tf <= 6 && code < 256 && SYMBOL_FONT[code]) ? SYMBOL_FONT[code] : code, emb, fn: !!(o & 1), v3: true }; }
        case 3: { if (o & 8) nudge(); const sel = b(), v = b(); b(); return v3tmpl(sel, v, list()); }
        case 4: { if (o & 8) nudge(); const ha = b(); b(); if (o & 2) ruler(); return { t: 'pile', ha, lines: list() }; }
        case 5: { if (o & 8) nudge(); b(); const hj = b(); b(); const rows = b(), cols = b();
          p += Math.floor((rows + 4) / 4) + Math.floor((cols + 4) / 4); return { t: 'matrix', rows, cols, hj, cells: list() }; }
        case 6: { if (o & 8) nudge(); const ty = b(); b(); return { t: 'emb', type: ty }; }   // v3: thêm 1 byte sau mã trang trí
        case 7: ruler(); return null;
        case 8: b(); b(); str(); return null;
        case 9: size(); return null;
        default: return null;                            // FULL, SUB, SUB2, SYM, SUBSYM
      }
    }
    switch (tag) {
      case 0: return END;
      case 1: { const o = b(); if (o & 8) nudge(); if (o & 4) w(); if (o & 2) ruler(); return { t: 'line', items: (o & 1) ? [] : list() }; }
      case 2: { const o = b(); if (o & 8) nudge(); const tf = (b() + 128) & 255;
        let code = (o & 0x20) ? null : w(); if (o & 4) { const f = b(); if (code == null) code = f; } if (o & 0x10) { const f = w(); if (code == null) code = f; }
        return { t: 'char', tf, code, emb: (o & 1) ? list() : [], fn: !!(o & 2) }; }
      case 3: { const o = b(); if (o & 8) nudge(); const sel = b(); let v = b(); if (v & 0x80) v = (v & 0x7F) | (b() << 8); b();
        return { t: 'tmpl', sel, v, slots: list() }; }
      case 4: { const o = b(); if (o & 8) nudge(); const ha = b(); b(); if (o & 2) ruler(); return { t: 'pile', ha, lines: list() }; }
      case 5: { const o = b(); if (o & 8) nudge(); b(); const hj = b(); b(); const rows = b(), cols = b();
        p += Math.floor((rows + 4) / 4) + Math.floor((cols + 4) / 4); return { t: 'matrix', rows, cols, hj, cells: list() }; }
      case 6: { const o = b(); if (o & 8) nudge(); return { t: 'emb', type: b() }; }
      case 7: ruler(); return null;
      case 8: mtuint(); b(); return null;
      case 9: size(); return null;
      case 15: mtuint(); return null;
      case 16: { const o = b(); p += (o & 1) ? 8 : 6; if (o & 4) str(); return null; }
      case 17: mtuint(); str(); return null;
      case 18: { b(); dims(); dims(); const n = b(); for (let i = 0; i < n; i++) { if (b() !== 0) b(); } return null; }
      case 19: str(); return null;
      case 102: mtuint(); str(); str(); return null;
      default:
        if (tag >= 10 && tag <= 14) return null;
        if (tag >= 100) { const n = b(); p += n; return null; }
        throw new Error('MTEF: bản ghi lạ ' + tag);
    }
  }
  function size() { const s = b(); if (s === 101) w(); else if (s === 100) { b(); w(); } else b(); }
  /* Đổi số hiệu khuôn mẫu của Equation Editor 3 sang số hiệu MTEF v5 */
  function v3tmpl(sel, v, slots) {
    let s = sel, vv = v;
    if (sel <= 7) { vv = v === 0 ? 3 : v; }
    else if (sel <= 12) { s = 9; }
    else if (sel === 13) { s = 10; }
    else if (sel === 14) { s = 11; vv = v ? 1 : 0; }
    else if (sel === 41) { s = 11; vv = 2; }
    else if (sel === 15 || sel === 44) { s = [28, 27, 29][v] || 29; vv = sel === 44 ? 1 : 0; }
    else if (sel === 16 || sel === 17) { s = sel - 4; }
    else if (sel >= 18 && sel <= 20) { s = 14; vv = sel === 18 ? 0x10 : 0x20; }
    else if (sel >= 21 && sel <= 26) { s = 15; vv = ((sel - 21) % 3) + 1 + (sel >= 24 ? 0x40 : 0); }
    else if (sel === 27 || sel === 28) { s = 24; vv = sel === 27 ? 1 : 0; }
    else if (sel >= 29 && sel <= 38) { s = 16 + Math.floor((sel - 29) / 2); vv = (sel % 2 === 1) ? 0x40 : 0; }
    else if (sel === 39) s = 23; else if (sel === 40) s = 26; else if (sel === 42) s = 21; else if (sel === 43) s = 22;
    else if (sel === 45) { s = 30; vv = 3; } else if (sel === 46 || sel === 47) { s = 31; vv = sel === 46 ? 1 : 2; } else if (sel === 48) s = 37;
    return { t: 'tmpl', sel: s, v: vv, slots, v3: true };
  }
  return list();
}

/* --- Cây MTEF → LaTeX --- */
const TEXT_TF = new Set([1, 9, 10, 12]);
function embTex(s, type) {
  const m = {
    2:'\\dot{#}',3:'\\ddot{#}',4:'\\dddot{#}',24:'\\ddddot{#}',5:"#'",6:"#''",18:"#'''",7:'{}^{\\backprime}#',8:'\\tilde{#}',9:'\\hat{#}',
    10:'\\not{#}',11:'\\vec{#}',12:'\\overleftarrow{#}',13:'\\overleftrightarrow{#}',14:'\\vec{#}',15:'\\overleftarrow{#}',16:'\\bcancel{#}',
    17:'\\bar{#}',19:'\\overset{\\frown}{#}',20:'\\overset{\\smile}{#}',21:'\\xcancel{#}',22:'\\cancel{#}',23:'\\bcancel{#}',
    25:'\\underset{\\cdot}{#}',26:'\\underset{\\cdot\\cdot}{#}',27:'\\underset{\\cdots}{#}',28:'\\underset{\\cdots}{#}',29:'\\underline{#}',
    30:'\\underline{\\underline{#}}',31:'\\underset{\\sim}{#}',32:'\\underset{\\frown}{#}',33:'\\underrightarrow{#}',34:'\\underleftarrow{#}',
    35:'\\underleftrightarrow{#}',36:'\\underrightarrow{#}',37:'\\underleftarrow{#}'
  }[type];
  if (!m) return s;
  if (type === 10 && s === '=') return '\\ne ';
  return m.replace('#', s.trim());
}
function charTex(c) {
  let s;
  if (c.tf === 24 || (c.code >= 0xEF00 && c.code <= 0xEF0F)) s = [' ', '\\,', '\\;', '\\,', '\\quad ', '\\qquad '][c.code & 15] || '\\ ';
  else if (c.tf === 7 && /[A-Za-z]/.test(String.fromCharCode(c.code))) s = '\\mathbf{' + String.fromCharCode(c.code) + '}';
  else { s = texCode(c.code); if (/^\\[A-Za-z]+$/.test(s)) s += ' '; }
  for (const e of c.emb || []) if (e.t === 'emb') s = embTex(s, e.type) + ' ';
  return s;
}
const FENCE = {
  0x28:'(',0x29:')',0x5B:'[',0x5D:']',0x7B:'\\{',0x7D:'\\}',0x7C:'|',0x2016:'\\|',0x2225:'\\|',0x2329:'\\langle',0x232A:'\\rangle',
  0x27E8:'\\langle',0x27E9:'\\rangle',0x3008:'\\langle',0x3009:'\\rangle',0x230A:'\\lfloor',0x230B:'\\rfloor',0x2308:'\\lceil',
  0x2309:'\\rceil',0x27E6:'[',0x27E7:']',0x2223:'|',0x2E:'.'
};
const FENCE_DEF = [['\\langle','\\rangle'],['(',')'],['\\{','\\}'],['[',']'],['|','|'],['\\|','\\|'],['\\lfloor','\\rfloor'],['\\lceil','\\rceil'],['[',']'],['(',')']];
const BIGOP = { 16:'\\sum', 17:'\\prod', 18:'\\coprod', 19:'\\bigcup', 20:'\\bigcap', 21:'\\int', 22:'\\sum' };
const BIGOP_CHAR = { 0x222B:'\\int',0x222C:'\\iint',0x222D:'\\iiint',0x222E:'\\oint',0x222F:'\\oint',0x2211:'\\sum',0x220F:'\\prod',0x2210:'\\coprod',
  0x22C3:'\\bigcup',0x22C2:'\\bigcap',0x222A:'\\bigcup',0x2229:'\\bigcap',0x2A01:'\\bigoplus',0x2A02:'\\bigotimes',0x22C0:'\\bigwedge',0x22C1:'\\bigvee' };

function nodeTex(n) {
  if (!n) return '';
  switch (n.t) {
    case 'line': return lineTex(n.items);
    case 'char': return charTex(n);
    case 'tmpl': return tmplTex(n);
    case 'pile': {
      const lines = n.lines.filter(x => x.t !== 'char' && x.t !== 'emb').map(nodeTex);
      if (lines.length <= 1) return lines[0] || '';
      const al = { 1: 'l', 2: 'c', 3: 'r' }[n.ha] || 'l';
      return '\\begin{array}{' + al + '} ' + lines.join(' \\\\ ') + ' \\end{array}';
    }
    case 'matrix': {
      const cells = n.cells.filter(x => x.t !== 'char' && x.t !== 'emb').map(nodeTex), rows = [];
      for (let r = 0; r < n.rows; r++) rows.push(cells.slice(r * n.cols, (r + 1) * n.cols).join(' & '));
      const al = ({ 1: 'l', 2: 'c', 3: 'r' }[n.hj] || 'c').repeat(Math.max(1, n.cols));
      return '\\begin{array}{' + al + '} ' + rows.join(' \\\\ ') + ' \\end{array}';
    }
    default: return '';
  }
}
function lineTex(items) {
  let out = '';
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (it.t === 'char' && TEXT_TF.has(it.tf) && !(it.emb && it.emb.length)) {           // chữ thường (text)
      let s = ''; while (i < items.length && items[i].t === 'char' && TEXT_TF.has(items[i].tf) && !(items[i].emb && items[i].emb.length)) s += String.fromCodePoint(items[i++].code || 32);
      i--; out += /^[\d.,\s]+$/.test(s) ? s.trim() : '\\text{' + escText(s) + '}'; continue;
    }
    if (it.t === 'char' && it.tf === 2 && /[A-Za-z]/.test(String.fromCharCode(it.code))) { // tên hàm (sin, log…)
      let s = ''; const start = i;
      while (i < items.length && items[i].t === 'char' && items[i].tf === 2 && /[A-Za-z]/.test(String.fromCharCode(items[i].code)) && (i === start || !items[i].fn || items[i].v3)) s += String.fromCharCode(items[i++].code);
      i--; out += (FUNCS.has(s) ? '\\' + s : '\\operatorname{' + s + '}') + ' '; continue;
    }
    if (it.t === 'tmpl' && it.sel >= 27 && it.sel <= 29) {                              // chỉ số trên/dưới gắn vào ký tự trước
      const sl = it.slots.filter(x => x.t !== 'char');
      let sub = nodeTex(sl[0]).trim(), sup = nodeTex(sl[1]).trim();
      if (it.v3 && it.sel === 28 && !sup && sub) { sup = sub; sub = ''; }
      const sc = (sub ? '_{' + sub + '}' : '') + (sup ? '^{' + sup + '}' : '');
      if (!sc) continue;
      out = out.replace(/\s+$/, '');
      if ((it.v & 1) || !out || /(\{|&|\\\\)$/.test(out)) out += '{}';
      out += sc + ' '; continue;
    }
    out += nodeTex(it);
  }
  return out;
}
function tmplTex(n) {
  const slots = n.slots.filter(x => x.t !== 'char'), chars = n.slots.filter(x => x.t === 'char');
  const S = i => nodeTex(slots[i]).trim();
  const v = n.v, sel = n.sel;
  if (sel <= 9) {
    let L, R;
    if (chars.length >= 2) { L = FENCE[chars[0].code]; R = FENCE[chars[1].code]; }
    else if (chars.length === 1) { const f = FENCE[chars[0].code]; if (sel !== 9 && (v & 3) === 2) R = f; else L = f; }
    const d = FENCE_DEF[sel];
    if (L === undefined) L = (sel === 9 || (v & 1)) ? d[0] : '.';
    if (R === undefined) R = (sel === 9 || (v & 2)) ? d[1] : '.';
    if (!(v & 3) && sel !== 9 && !chars.length) { L = d[0]; R = d[1]; }
    return '\\left' + L + ' ' + S(0) + ' \\right' + R + ' ';
  }
  switch (sel) {
    case 10: { const idx = S(1); return (idx && (v & 1 || n.v3) ? '\\sqrt[' + idx + ']{' : '\\sqrt{') + S(0) + '} '; }
    case 11: return (v & 2) ? wrap(S(0)) + '/' + wrap(S(1)) + ' ' : '\\frac{' + S(0) + '}{' + S(1) + '} ';
    case 12: return ((v & 1) ? '\\underline{\\underline{' + S(0) + '}}' : '\\underline{' + S(0) + '}') + ' ';
    case 13: return ((v & 1) ? '\\overline{\\overline{' + S(0) + '}}' : '\\overline{' + S(0) + '}') + ' ';
    case 14: { const top = S(0), bot = S(1); const cmd = (v & 1) ? '\\xrightleftharpoons' : ((v & 0x30) === 0x10 ? '\\xleftarrow' : '\\xrightarrow');
      return cmd + (bot ? '[' + bot + ']' : '') + '{' + top + '} '; }
    case 15: case 16: case 17: case 18: case 19: case 20: case 21: case 22: {
      const cc = chars.length ? chars[chars.length - 1].code : 0;
      let op;
      if (sel === 15) op = (cc >= 0x222C && cc <= 0x2233) ? BIGOP_CHAR[cc] || '\\oint' : (v & 0xC) ? '\\oint' : ['\\int', '\\int', '\\iint', '\\iiint'][v & 3];
      else op = BIGOP_CHAR[cc] || BIGOP[sel];
      const lo = S(1), up = S(2);
      return op + ((v & 0x40) && sel === 15 ? '\\limits' : '') + (lo ? '_{' + lo + '}' : '') + (up ? '^{' + up + '}' : '') + ' ' + S(0) + ' ';
    }
    case 23: { const lo = S(1), up = S(2); return S(0) + (lo ? '_{' + lo + '}' : '') + (up ? '^{' + up + '}' : '') + ' '; }
    case 24: case 25: return (v & 1) ? '\\overbrace{' + S(0) + '}^{' + S(1) + '} ' : '\\underbrace{' + S(0) + '}_{' + S(1) + '} ';
    case 26: return '\\enclose{longdiv}{' + S(0) + '} ';
    case 30: return '\\left\\langle ' + S(0) + ' \\middle| ' + S(1) + ' \\right\\rangle ';
    case 31: { const cmd = (v & 4) ? ((v & 3) === 3 ? '\\underleftrightarrow' : (v & 1) ? '\\underleftarrow' : '\\underrightarrow')
                                   : ((v & 3) === 3 ? '\\overleftrightarrow' : (v & 1) && !(v & 2) ? '\\overleftarrow' : '\\overrightarrow');
      return cmd + '{' + S(0) + '} '; }
    case 32: return '\\widetilde{' + S(0) + '} ';
    case 33: return '\\widehat{' + S(0) + '} ';
    case 34: return '\\overset{\\frown}{' + S(0) + '} ';
    case 35: return '\\left.' + S(0) + '\\right| ';
    case 36: return '\\cancel{' + S(0) + '} ';
    case 37: return '\\boxed{' + S(0) + '} ';
    default: return slots.map(nodeTex).join(' ');
  }
}
function mtefToLatex(streamBytes) { return tidy(parseMTEF(streamBytes).map(nodeTex).join(' ')); }
function oleToLatex(binBytes) {
  const s = cfbStream(binBytes, 'Equation Native');
  if (!s) throw new Error('Không tìm thấy dữ liệu MathType trong đối tượng');
  return mtefToLatex(s);
}

/* ---------------------------------------------------------------------
 * 5. OMML (công thức của Word) → LaTeX
 * ------------------------------------------------------------------- */
const kids = el => { const a = []; for (let c = el.firstChild; c; c = c.nextSibling) if (c.nodeType === 1) a.push(c); return a; };
const child = (el, name) => { if (!el) return null; for (let c = el.firstChild; c; c = c.nextSibling) if (c.nodeType === 1 && c.nodeName === name) return c; return null; };
const childs = (el, name) => kids(el).filter(c => c.nodeName === name);
const attr = (el, name) => el ? (el.getAttribute(name) || el.getAttribute(name.replace(/^\w+:/, '')) || null) : null;
const prop = (el, prName, key) => { const pr = child(el, prName); const k = child(pr, key); return k ? (attr(k, 'm:val') ?? '') : null; };
const ACC = { 0x302:'\\hat', 0x303:'\\tilde', 0x304:'\\bar', 0x305:'\\overline', 0x20D7:'\\vec', 0x20D6:'\\overleftarrow', 0x20E1:'\\overleftrightarrow',
  0x307:'\\dot', 0x308:'\\ddot', 0x20DB:'\\dddot', 0x30C:'\\check', 0x306:'\\breve', 0x2C6:'\\hat', 0x2DC:'\\tilde', 0xAF:'\\bar', 0x2192:'\\overrightarrow',
  0x2190:'\\overleftarrow', 0x2194:'\\overleftrightarrow', 0x311:'\\overset{\\frown}', 0x2322:'\\overset{\\frown}' };
const plainText = el => { let s = ''; (function walk(n) { for (let c = n.firstChild; c; c = c.nextSibling) { if (c.nodeType === 1) { if (c.nodeName === 'm:t' || c.nodeName === 'w:t') s += c.textContent; else walk(c); } } })(el); return s; };

function omml(el) {
  if (!el) return '';
  const K = e => kids(e).map(omml).join('');
  const E = name => omml(child(el, name));
  switch (el.nodeName) {
    case 'm:oMathPara': return childs(el, 'm:oMath').map(omml).join(' \\\\ ');
    case 'm:oMath': case 'm:e': case 'm:num': case 'm:den': case 'm:sub': case 'm:sup': case 'm:deg': case 'm:lim': case 'm:fName':
    case 'm:box': case 'w:ins': case 'w:smartTag': case 'w:hyperlink': return K(el);
    case 'm:r': {
      const t = childs(el, 'm:t').map(x => x.textContent).join('') + childs(el, 'w:t').map(x => x.textContent).join('');
      const rpr = child(el, 'm:rPr'), normal = !!child(rpr, 'm:nor') || attr(child(rpr, 'm:sty'), 'm:val') === 'p';
      if (normal && /[A-Za-zÀ-ỹ]{2,}|\s/.test(t) && !FUNCS.has(t.trim())) return '\\text{' + escText(t) + '}';
      if (normal && FUNCS.has(t.trim())) return '\\' + t.trim() + ' ';
      return texStr(t);
    }
    case 'm:f': {
      const type = prop(el, 'm:fPr', 'm:type'), n = E('m:num'), d = E('m:den');
      if (type === 'lin') return wrap(n) + '/' + wrap(d);
      if (type === 'noBar') return '\\genfrac{}{}{0pt}{}{' + n + '}{' + d + '}';
      return '\\frac{' + n + '}{' + d + '}';
    }
    case 'm:rad': { const hide = prop(el, 'm:radPr', 'm:degHide'), deg = E('m:deg').trim();
      return (hide === '1' || hide === 'on' || hide === 'true' || !deg) ? '\\sqrt{' + E('m:e') + '}' : '\\sqrt[' + deg + ']{' + E('m:e') + '}'; }
    case 'm:sSup': return wrap(E('m:e')) + '^{' + E('m:sup') + '}';
    case 'm:sSub': return wrap(E('m:e')) + '_{' + E('m:sub') + '}';
    case 'm:sSubSup': return wrap(E('m:e')) + '_{' + E('m:sub') + '}^{' + E('m:sup') + '}';
    case 'm:sPre': return '{}_{' + E('m:sub') + '}^{' + E('m:sup') + '}' + E('m:e');
    case 'm:nary': {
      const chr = prop(el, 'm:naryPr', 'm:chr'), loc = prop(el, 'm:naryPr', 'm:limLoc');
      const code = chr ? chr.codePointAt(0) : 0x222B, op = BIGOP_CHAR[code] || texCode(code);
      const sub = E('m:sub'), sup = E('m:sup');
      return op + (loc === 'undOvr' && /int/.test(op) ? '\\limits' : '') + (sub ? '_{' + sub + '}' : '') + (sup ? '^{' + sup + '}' : '') + ' ' + E('m:e');
    }
    case 'm:d': {
      const pr = child(el, 'm:dPr');
      const g = (k, def) => { const x = child(pr, k); return x ? (attr(x, 'm:val') ?? '') : def; };
      const fen = c => { if (!c) return '.'; const f = FENCE[c.codePointAt(0)]; return f || texCode(c.codePointAt(0)) || '.'; };
      const sep = g('m:sepChr', '|'), es = childs(el, 'm:e').map(omml);
      return '\\left' + fen(g('m:begChr', '(')) + ' ' + es.join(sep === '|' ? ' \\mid ' : ' ' + texStr(sep) + ' ') + ' \\right' + fen(g('m:endChr', ')')) + ' ';
    }
    case 'm:m': {
      const rows = childs(el, 'm:mr').map(r => childs(r, 'm:e').map(omml).join(' & '));
      const cols = Math.max(1, ...childs(el, 'm:mr').map(r => childs(r, 'm:e').length));
      return '\\begin{array}{' + 'c'.repeat(cols) + '} ' + rows.join(' \\\\ ') + ' \\end{array}';
    }
    case 'm:eqArr': return '\\begin{array}{l} ' + childs(el, 'm:e').map(omml).join(' \\\\ ') + ' \\end{array}';
    case 'm:acc': { const chr = prop(el, 'm:accPr', 'm:chr'); const cmd = ACC[chr ? chr.codePointAt(0) : 0x302] || '\\hat';
      const body = E('m:e'); return (cmd === '\\vec' && body.replace(/\s/g, '').length > 1 ? '\\overrightarrow' : cmd) + '{' + body + '}'; }
    case 'm:bar': { const pos = prop(el, 'm:barPr', 'm:pos'); return (pos === 'top' ? '\\overline{' : '\\underline{') + E('m:e') + '}'; }
    case 'm:borderBox': return '\\boxed{' + E('m:e') + '}';
    case 'm:groupChr': {
      const chr = prop(el, 'm:groupChrPr', 'm:chr'), pos = prop(el, 'm:groupChrPr', 'm:pos');
      const c = chr ? chr.codePointAt(0) : 0x23DF, e = E('m:e');
      if (c === 0x23DF || c === 0x23DE) return (pos === 'top' || c === 0x23DE) ? '\\overbrace{' + e + '}' : '\\underbrace{' + e + '}';
      return (pos === 'top' ? '\\overset{' : '\\underset{') + texCode(c) + '}{' + e + '}';
    }
    case 'm:limLow': { const e = E('m:e').trim(), lim = E('m:lim');
      return (/^\\(lim|max|min|sup|inf)\s*$/.test(e) || FUNCS.has(e)) ? (e.startsWith('\\') ? e : '\\' + e) + '_{' + lim + '} ' : '\\underset{' + lim + '}{' + e + '}'; }
    case 'm:limUpp': return '\\overset{' + E('m:lim') + '}{' + E('m:e') + '}';
    case 'm:func': {
      const fn = child(el, 'm:fName'), name = plainText(fn).trim();
      const head = FUNCS.has(name) ? '\\' + name + ' ' : (/^[A-Za-z]+$/.test(name) ? '\\operatorname{' + name + '} ' : omml(fn));
      return head + E('m:e');
    }
    case 'm:phant': return '';
    default:
      if (/Pr$/.test(el.nodeName) || el.nodeName === 'm:ctrlPr') return '';
      return K(el);
  }
}
const ommlToLatex = el => tidy(omml(el));

/* ---------------------------------------------------------------------
 * 6. Duyệt document.xml → các dòng gồm đoạn văn bản có định dạng
 * ------------------------------------------------------------------- */
const FMT = { U: 1, B: 2, C: 4, H: 8 };
const IMG_MIME = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', bmp: 'image/bmp', webp: 'image/webp', svg: 'image/svg+xml' };

function runFmt(rPr) {
  if (!rPr) return 0;
  let f = 0;
  const u = child(rPr, 'w:u'); if (u && (attr(u, 'w:val') || 'single') !== 'none') f |= FMT.U;
  const bb = child(rPr, 'w:b'); if (bb && !/^(0|false|off)$/.test(attr(bb, 'w:val') || '')) f |= FMT.B;
  const c = child(rPr, 'w:color'); const cv = (attr(c, 'w:val') || '').toLowerCase(); if (c && cv && cv !== 'auto' && cv !== '000000') f |= FMT.C;
  const h = child(rPr, 'w:highlight'); if (h && (attr(h, 'w:val') || 'none') !== 'none') f |= FMT.H;
  const s = child(rPr, 'w:shd'); const sf = (attr(s, 'w:fill') || '').toLowerCase(); if (s && sf && sf !== 'auto' && sf !== 'ffffff') f |= FMT.H;
  return f;
}

async function readDocx(arrayBuffer) {
  const zip = openZip(arrayBuffer);
  const docXml = await zip.text('word/document.xml');
  if (!docXml) throw new Error('File không có nội dung Word (thiếu word/document.xml).');
  const parser = new (root.DOMParser || DOMParser)();
  const parse = s => parser.parseFromString(s, 'application/xml');
  const doc = parse(docXml);
  const rels = {};
  const relXml = await zip.text('word/_rels/document.xml.rels');
  if (relXml) for (const r of Array.from(parse(relXml).getElementsByTagName('Relationship'))) {
    let t = r.getAttribute('Target') || ''; if (r.getAttribute('TargetMode') === 'External') continue;
    t = t.replace(/^\//, ''); if (!t.startsWith('word/')) t = 'word/' + t;
    rels[r.getAttribute('Id')] = t.replace(/\/[^/]+\/\.\.\//g, '/');
  }
  /* --- đánh số tự động (numbering.xml + styles.xml) --- */
  const numbering = {}, absNum = {}, styleNum = {};
  const numXml = await zip.text('word/numbering.xml');
  if (numXml) {
    const nd = parse(numXml);
    for (const a of Array.from(nd.getElementsByTagName('w:abstractNum'))) {
      const lv = {};
      for (const l of childs(a, 'w:lvl')) {
        const il = +attr(l, 'w:ilvl') || 0;
        lv[il] = { start: +(attr(child(l, 'w:start'), 'w:val') || 1), fmt: attr(child(l, 'w:numFmt'), 'w:val') || 'decimal', text: attr(child(l, 'w:lvlText'), 'w:val') || '' };
      }
      absNum[attr(a, 'w:abstractNumId')] = lv;
    }
    for (const n of Array.from(nd.getElementsByTagName('w:num'))) {
      const id = attr(n, 'w:numId'), abs = absNum[attr(child(n, 'w:abstractNumId'), 'w:val')] || {};
      const lv = JSON.parse(JSON.stringify(abs));
      for (const o of childs(n, 'w:lvlOverride')) { const il = +attr(o, 'w:ilvl') || 0, so = child(o, 'w:startOverride'); if (so && lv[il]) lv[il].start = +attr(so, 'w:val'); }
      numbering[id] = { lv, cnt: [] };
    }
  }
  const stXml = await zip.text('word/styles.xml');
  if (stXml) for (const s of Array.from(parse(stXml).getElementsByTagName('w:style'))) {
    const np = child(child(s, 'w:pPr'), 'w:numPr');
    if (np) styleNum[attr(s, 'w:styleId')] = { numId: attr(child(np, 'w:numId'), 'w:val'), ilvl: +(attr(child(np, 'w:ilvl'), 'w:val') || 0) };
  }
  const roman = n => { const m = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]; let s = ''; for (const [v, r] of m) while (n >= v) { s += r; n -= v; } return s; };
  const fmtNum = (n, f) => f === 'upperLetter' ? String.fromCharCode(64 + ((n - 1) % 26) + 1) : f === 'lowerLetter' ? String.fromCharCode(96 + ((n - 1) % 26) + 1)
    : f === 'upperRoman' ? roman(n) : f === 'lowerRoman' ? roman(n).toLowerCase() : f === 'bullet' || f === 'none' ? '' : String(n);
  function numLabel(pPr) {
    let np = child(pPr, 'w:numPr'), numId, ilvl;
    if (np) { numId = attr(child(np, 'w:numId'), 'w:val'); ilvl = +(attr(child(np, 'w:ilvl'), 'w:val') || 0); }
    else { const st = attr(child(pPr, 'w:pStyle'), 'w:val'); if (st && styleNum[st]) ({ numId, ilvl } = styleNum[st]); }
    const N = numbering[numId]; if (!N || !N.lv[ilvl]) return '';
    for (let i = 0; i <= ilvl; i++) if (N.cnt[i] == null) N.cnt[i] = (N.lv[i] ? N.lv[i].start : 1) - (i === ilvl ? 1 : 0);
    N.cnt[ilvl]++; N.cnt.length = ilvl + 1;
    const L = N.lv[ilvl]; if (L.fmt === 'bullet') return '';
    return L.text.replace(/%(\d)/g, (_, k) => { const i = +k - 1; return fmtNum(N.cnt[i] || 1, (N.lv[i] || L).fmt); });
  }

  const images = [], warnings = [], stats = { omml: 0, mathtype: 0, mathtypeFail: 0, images: 0, skippedImages: 0 };
  const imgCache = {}, oleCache = {};
  async function addImage(rid) {
    const path = rels[rid]; if (!path) return null;
    if (imgCache[path] !== undefined) return imgCache[path];
    const ext = (path.split('.').pop() || '').toLowerCase();
    if (!IMG_MIME[ext]) { stats.skippedImages++; imgCache[path] = null; return null; }
    const bytes = await zip.bytes(path); if (!bytes) { imgCache[path] = null; return null; }
    images.push({ mime: IMG_MIME[ext], bytes, name: path.split('/').pop() }); stats.images++;
    return imgCache[path] = images.length - 1;
  }
  async function mathType(rid) {
    if (oleCache[rid] !== undefined) return oleCache[rid];
    try {
      const bin = await zip.bytes(rels[rid]); const tex = oleToLatex(bin);
      stats.mathtype++; return oleCache[rid] = { tex };
    } catch (e) { stats.mathtypeFail++; return oleCache[rid] = { tex: null, err: e.message }; }
  }

  const lines = [];
  let cur = null;
  const push = (seg) => { if (cur) cur.push(seg); };
  async function walkRunChildren(r, fmt) {
    for (const c of kids(r)) {
      switch (c.nodeName) {
        case 'w:t': push({ text: c.textContent, fmt }); break;
        case 'w:tab': case 'w:ptab': push({ text: '\t', fmt: 0 }); break;
        case 'w:br': case 'w:cr': push({ text: '\n', fmt: 0 }); break;
        case 'w:noBreakHyphen': push({ text: '-', fmt }); break;
        case 'w:sym': { const ch = parseInt(attr(c, 'w:char') || '0', 16) & 0xFF, font = attr(c, 'w:font') || '';
          const code = /symbol/i.test(font) && SYMBOL_FONT[ch] ? SYMBOL_FONT[ch] : (parseInt(attr(c, 'w:char') || '0', 16) >= 0xF000 ? ch : parseInt(attr(c, 'w:char'), 16));
          push({ text: String.fromCodePoint(code || 32), fmt }); break; }
        case 'w:object': {
          const ole = c.getElementsByTagName('o:OLEObject')[0];
          const prog = ole ? (ole.getAttribute('ProgID') || '') : '';
          const rid = ole ? (ole.getAttribute('r:id') || ole.getAttribute('id')) : null;
          if (ole && /^Equation|MathType|DSMT/i.test(prog) && rid) {
            const m = await mathType(rid);
            push({ math: m.tex, err: m.err, fmt });
          } else {
            const im = c.getElementsByTagName('v:imagedata')[0];
            const id = im && (im.getAttribute('r:id') || im.getAttribute('r:pict'));
            if (id) { const k = await addImage(id); if (k != null) push({ img: k, fmt: 0 }); }
          }
          break;
        }
        case 'w:drawing': case 'w:pict': {
          const blips = [...Array.from(c.getElementsByTagName('a:blip')), ...Array.from(c.getElementsByTagName('v:imagedata'))];
          for (const bl of blips) { const id = bl.getAttribute('r:embed') || bl.getAttribute('r:id'); if (id) { const k = await addImage(id); if (k != null) push({ img: k, fmt: 0 }); } }
          break;
        }
        case 'mc:AlternateContent': { const ch = child(c, 'mc:Choice') || child(c, 'mc:Fallback'); if (ch) await walkRunChildren(ch, fmt); break; }
        default: break;
      }
    }
  }
  async function walkInline(el) {
    for (const c of kids(el)) {
      switch (c.nodeName) {
        case 'w:r': await walkRunChildren(c, runFmt(child(c, 'w:rPr'))); break;
        case 'm:oMath': case 'm:oMathPara': { const tex = ommlToLatex(c); stats.omml++;
          const r0 = c.getElementsByTagName('w:rPr')[0]; push({ math: tex, fmt: runFmt(r0) }); break; }
        case 'w:hyperlink': case 'w:ins': case 'w:smartTag': case 'w:fldSimple': case 'w:customXml': case 'w:dir': case 'w:bdo': await walkInline(c); break;
        case 'w:sdt': await walkInline(child(c, 'w:sdtContent') || c); break;
        case 'mc:AlternateContent': { const ch = child(c, 'mc:Choice') || child(c, 'mc:Fallback'); if (ch) await walkInline(ch); break; }
        default: break;
      }
    }
  }
  async function walkBlock(el, sink) {
    for (const c of kids(el)) {
      if (c.nodeName === 'w:p') {
        const line = []; cur = line;
        const lab = numLabel(child(c, 'w:pPr')); if (lab) line.push({ text: lab + ' ', fmt: 0 });
        await walkInline(c); cur = null;
        sink(line);
      } else if (c.nodeName === 'w:tbl') {
        for (const tr of childs(c, 'w:tr')) {
          const row = [];
          for (const tc of childs(tr, 'w:tc')) {
            if (row.length) row.push({ text: '\t', fmt: 0 });
            let first = true;
            await walkBlock(tc, l => { if (!first) row.push({ text: '\n', fmt: 0 }); first = false; row.push(...l); });
          }
          sink(row);
        }
      } else if (c.nodeName === 'w:sdt') { await walkBlock(child(c, 'w:sdtContent') || c, sink); }
      else if (c.nodeName === 'mc:AlternateContent') { const ch = child(c, 'mc:Choice'); if (ch) await walkBlock(ch, sink); }
    }
  }
  const body = doc.getElementsByTagName('w:body')[0];
  if (!body) throw new Error('Không đọc được nội dung Word.');
  await walkBlock(body, l => lines.push(l));
  if (stats.skippedImages) warnings.push(stats.skippedImages + ' hình dạng EMF/WMF không hiển thị được trên web đã bị bỏ qua.');
  if (stats.mathtypeFail) warnings.push(stats.mathtypeFail + ' công thức MathType không đọc được (hiện là ⟨công thức lỗi⟩).');
  return { lines, images, stats, warnings };
}

/* ---------------------------------------------------------------------
 * 7. Tách câu hỏi: "Câu n", đáp án A/B/C/D, đáp án đúng, lời giải
 * ------------------------------------------------------------------- */
const IMG0 = 0xE000;
function flatten(lines) {
  let T = '', M = '', A = [];
  const add = (s, f, mask) => { T += s; M += mask == null ? s : mask; for (let i = 0; i < s.length; i++) A.push(f); };
  lines.forEach((line, li) => {
    for (const s of line) {
      if (s.img != null) add(String.fromCharCode(IMG0 + s.img), 0, '§');
      else if (s.math !== undefined) { const t = s.math == null ? '⟨công thức lỗi⟩' : (s.math ? '$' + s.math + '$' : ''); add(t, s.fmt || 0, '§'.repeat(t.length)); }
      else add(s.text, s.fmt || 0);
    }
    add('\n', 0);
  });
  return { T, M, A };
}
const RE_Q = /^[ \t]*(?:Câu|Bài|Question|Câu hỏi)[ \t]*(\d{1,3})[ \t]*(?:\([^)\n]{0,40}\))?[ \t]*[.:)\-–]?/gimu;
const RE_PART = /^[ \t]*(?:PHẦN|Phần)[ \t]+(?:[IVX]+|\d+)\b[^\n]*$/gmu;
const RE_KEY = /^[ \t]*(?:(?:BẢNG|Bảng)[ \t]+)?(?:ĐÁP ÁN|Đáp án|LỜI GIẢI|Lời giải|HƯỚNG DẪN GIẢI|Hướng dẫn giải|HƯỚNG DẪN CHẤM)(?:[ \t][^\n]{0,60})?[ \t]*:?[ \t]*$/gmu;
const RE_SOL = /^[ \t]*(?:Lời giải|LỜI GIẢI|Hướng dẫn(?: giải)?|HƯỚNG DẪN|Giải[ \t]*[:.]|Đáp án|ĐÁP ÁN|Đáp số|ĐS[ \t]*[:.]|Chọn[ \t]*(?:đáp án)?[ \t]*[:.]?[ \t]*[A-F]\b|Trả lời[ \t]*[:.]|Phương pháp)/mu;

function cleanText(s) {
  return s.replace(/[-]/g, '').split('\n').map(l => l.replace(/\t+/g, ' ').replace(/[  ]{2,}/g, ' ').trim()).filter((l, i, a) => l || (i > 0 && a[i - 1])).join('\n').trim();
}
const imgsIn = s => Array.from(s.matchAll(/[-]/g)).map(m => m[0].charCodeAt(0) - IMG0);

function analyze(block, A, M) {
  /* block: chuỗi; A: định dạng từng ký tự; M: chuỗi đã che công thức */
  const solM = M.match(RE_SOL);
  const qEnd = solM ? solM.index : block.length;
  const qT = block.slice(0, qEnd), qM = M.slice(0, qEnd), sol = block.slice(qEnd);
  const res = { stem: '', options: null, correct: -1, how: '', sol, tf: null };
  /* --- tìm chuỗi đáp án A. B. C. D. --- */
  const tok = []; const re = /(^|[\s\t(\[§])(\*?)([A-F])[ \t]*[.)][ \t]*/gu; let m;
  while ((m = re.exec(qM))) { tok.push({ L: m[3].charCodeAt(0) - 65, star: !!m[2], at: m.index + m[1].length, letter: m.index + m[1].length + m[2].length, body: m.index + m[0].length }); re.lastIndex = m.index + m[0].length; }
  let chain = null;
  for (let n = 6; n >= 2 && !chain; n--) {
    const pick = []; let lim = Infinity, ok = true;
    for (let L = n - 1; L >= 0; L--) {
      const cand = tok.filter(t => t.L === L && t.at < lim); if (!cand.length) { ok = false; break; }
      const t = cand[cand.length - 1]; pick.unshift(t); lim = t.at;
    }
    if (!ok) continue;
    if (tok.some(t => t.L === n && t.at > pick[n - 1].at)) continue;
    if (n === 2 && !pick.every(t => t.at === 0 || /[\n\t]/.test(qM[t.at - 1]) || /\s{2}$/.test(qM.slice(0, t.at)))) continue;
    chain = pick;
  }
  if (chain) {
    res.stem = qT.slice(0, chain[0].at);
    res.options = chain.map((t, k) => ({ t: qT.slice(t.body, k + 1 < chain.length ? chain[k + 1].at : qT.length), s: t.body, e: k + 1 < chain.length ? chain[k + 1].at : qT.length, letter: t.letter, star: t.star }));
    /* đáp án đúng theo dấu * / gạch chân / tô màu / tô nền / in đậm */
    const stars = res.options.map((o, k) => o.star ? k : -1).filter(k => k >= 0);
    if (stars.length === 1) { res.correct = stars[0]; res.how = 'dấu *'; }
    else for (const [bit, name] of [[FMT.U, 'gạch chân'], [FMT.H, 'tô nền'], [FMT.C, 'tô màu'], [FMT.B, 'in đậm']]) {
      const marked = res.options.map((o, k) => {
        if (A[o.letter] & bit) return k;
        let tot = 0, on = 0; for (let i = o.s; i < o.e; i++) if (!/\s/.test(block[i])) { tot++; if (A[i] & bit) on++; }
        return tot && on / tot >= 0.6 ? k : -1;
      }).filter(k => k >= 0);
      if (marked.length === 1) { res.correct = marked[0]; res.how = name; break; }
    }
    if (res.correct < 0) {
      const c = sol.match(/(?:Chọn|Đáp án|ĐÁP ÁN|đáp án đúng(?: là)?)[ \t]*(?:đáp án)?[ \t]*[:.]?[ \t]*([A-F])\b/u);
      if (c && c[1].charCodeAt(0) - 65 < res.options.length) { res.correct = c[1].charCodeAt(0) - 65; res.how = 'lời giải'; }
    }
    return res;
  }
  /* --- câu Đúng/Sai: a) b) c) d) --- */
  const t2 = []; const re2 = /(^|[\n\t])[ \t]*([a-f])[ \t]*\)[ \t]*/gu;
  while ((m = re2.exec(qM))) t2.push({ L: m[2].charCodeAt(0) - 97, at: m.index + m[1].length, body: m.index + m[0].length });
  const tfc = []; for (let L = 0; ; L++) { const t = t2.find(x => x.L === L && (!tfc.length || x.at > tfc[tfc.length - 1].at)); if (!t) break; tfc.push(t); }
  if (tfc.length >= 2) {
    res.stem = qT.slice(0, tfc[0].at);
    res.tf = tfc.map((t, k) => ({ label: String.fromCharCode(97 + k), t: qT.slice(t.body, k + 1 < tfc.length ? tfc[k + 1].at : qT.length), ok: null }));
    res.tf.forEach(st => { const r = new RegExp('(?:^|[\\s,;(])' + st.label + '[ \\t]*\\)?[ \\t]*[:\\-–]?[ \\t]*(Đúng|Sai|Đ|S)\\b', 'u'); const mm = sol.match(r); if (mm) st.ok = /^Đ/.test(mm[1]); });
    return res;
  }
  res.stem = qT;
  return res;
}

function parseKey(text) {
  const key = {};
  const lines = text.split('\n');
  for (let i = 0; i + 1 < lines.length; i++) {
    const a = lines[i].split('\t').map(s => s.trim()).filter(Boolean), b = lines[i + 1].split('\t').map(s => s.trim()).filter(Boolean);
    if (a.length >= 2 && a.length === b.length && a.every(x => /^(?:Câu\s*)?\d{1,3}$/i.test(x)) && b.every(x => /^[A-F]$/.test(x)))
      a.forEach((x, k) => { key[+x.replace(/\D/g, '')] = b[k]; });
  }
  for (const m of text.matchAll(/(?:Câu[ \t]*)?(\d{1,3})[ \t]*[.\-:)]?[ \t]*([A-F])(?![A-Za-zÀ-ỹ])/gu)) if (!key[+m[1]]) key[+m[1]] = m[2];
  return key;
}

function splitQuestions(parsed) {
  const { T, M, A } = flatten(parsed.lines);
  const marks = [];
  for (const m of M.matchAll(RE_Q)) marks.push({ type: 'q', at: m.index, body: m.index + m[0].length, num: +m[1] });
  for (const m of M.matchAll(RE_PART)) marks.push({ type: 'part', at: m.index, body: m.index + m[0].length, title: m[0].trim() });
  for (const m of M.matchAll(RE_KEY)) if (!marks.some(x => x.at === m.index)) marks.push({ type: 'key', at: m.index, body: m.index + m[0].length });
  marks.sort((a, b) => a.at - b.at);
  const questions = [], sols = {}; let inKey = false, keyText = '', part = '', partNo = 0;
  marks.forEach((mk, i) => {
    const end = i + 1 < marks.length ? marks[i + 1].at : T.length;
    if (mk.type === 'part') { part = mk.title; partNo++; inKey = false; return; }
    if (mk.type === 'key') { inKey = true; keyText += T.slice(mk.body, end) + '\n'; return; }
    const blk = T.slice(mk.body, end), am = A.slice(mk.body, end), mm = M.slice(mk.body, end);
    if (inKey) { (sols[mk.num] = sols[mk.num] || []).push(blk); keyText += blk + '\n'; return; }
    const r = analyze(blk, am, mm);
    questions.push({ num: mk.num, part, partNo, r, raw: blk });
  });
  const key = parseKey(keyText);
  const out = [];
  for (const q of questions) {
    const r = q.r, warn = [];
    const solExtra = (sols[q.num] && questions.filter(x => x.num === q.num).length === 1) ? sols[q.num].join('\n') : '';
    const solText = (r.sol + '\n' + solExtra);
    const explain = cleanText(solText.replace(/^[ \t]*(?:Lời giải|LỜI GIẢI|Hướng dẫn(?: giải)?|HƯỚNG DẪN(?: GIẢI)?)[ \t]*[:.]?[ \t]*/mu, ''));
    const images = imgsIn(r.stem).concat(r.options ? r.options.flatMap(o => imgsIn(o.t)) : []);
    if (r.options && r.options.some(o => imgsIn(o.t).length)) warn.push('Có hình trong đáp án – hình được chuyển lên phần câu hỏi.');
    if (/⟨công thức lỗi⟩/.test(q.raw)) warn.push('Có công thức MathType không đọc được, hãy sửa tay.');
    const base = { num: q.num, part: q.part, images, warnings: warn };
    if (r.options) {
      let correct = r.correct, how = r.how;
      if (correct < 0) { const k = (solExtra.match(/(?:Chọn|Đáp án)[ \t]*[:.]?[ \t]*([A-F])\b/u) || [])[1] || (q.partNo <= 1 || !q.part ? key[q.num] : null);
        if (k && k.charCodeAt(0) - 65 < r.options.length) { correct = k.charCodeAt(0) - 65; how = 'bảng đáp án'; } }
      if (correct < 0) warn.push('Chưa xác định được đáp án đúng – hãy bấm chọn.');
      out.push(Object.assign(base, { kind: 'mcq', text: cleanText(r.stem), options: r.options.map((o, k) => ({ text: cleanText(o.t), ok: k === correct })), how, explain }));
    } else if (r.tf) {
      const stem = cleanText(r.stem);
      r.tf.forEach(st => out.push(Object.assign({}, base, { num: q.num + st.label, kind: 'mcq', warnings: st.ok == null ? warn.concat('Câu Đúng/Sai: hãy bấm chọn Đúng hoặc Sai.') : warn.slice(),
        text: (stem ? stem + '\n' : '') + st.label + ') ' + cleanText(st.t), options: [{ text: 'Đúng', ok: st.ok === true }, { text: 'Sai', ok: st.ok === false }], how: st.ok == null ? '' : 'lời giải', explain })));
    } else {
      let ans = '';
      const am = solText.match(/(?:Đáp án|ĐÁP ÁN|Đáp số|ĐS|Trả lời|Kết quả)[ \t]*[:.]?[ \t]*([^\n]+)/u);
      if (am) ans = cleanText(am[1]).replace(/[.;]$/, '');
      if (/^[.…_\s]*$/.test(ans)) ans = '';
      const mm = ans.match(/^\$([^$]+)\$$/); if (mm && /^[-+]?[\d.,]+$/.test(mm[1].trim())) ans = mm[1].trim();
      if (!ans) warn.push('Câu trả lời ngắn chưa có đáp án – hãy nhập đáp án.');
      const ex2 = explain.split('\n').filter(l => !/^(?:Đáp án|ĐÁP ÁN|Đáp số|ĐS|Trả lời|Kết quả)[ \t]*[:.]?/u.test(l)).join('\n').trim();
      out.push(Object.assign(base, { kind: 'short', text: cleanText(r.stem), options: [], answer: ans, tol: 0, how: ans ? 'lời giải' : '', explain: ex2 }));
    }
  }
  return out;
}

async function importDocx(arrayBuffer) {
  const parsed = await readDocx(arrayBuffer);
  const questions = splitQuestions(parsed);
  if (!questions.length) parsed.warnings.unshift('Không tìm thấy câu hỏi. Mỗi câu cần bắt đầu bằng “Câu 1.”, “Câu 2:”…');
  return { questions, images: parsed.images, stats: parsed.stats, warnings: parsed.warnings };
}

root.DocxImport = { importDocx, readDocx, splitQuestions, oleToLatex, mtefToLatex, cfbStream, ommlToLatex, openZip, texStr };
})(typeof window !== 'undefined' ? window : globalThis);
