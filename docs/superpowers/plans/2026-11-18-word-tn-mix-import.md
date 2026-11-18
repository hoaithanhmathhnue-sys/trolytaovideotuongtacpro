# Nhập Word chuẩn TN MIX + câu Đúng/Sai nhóm — Kế hoạch triển khai

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Đọc đúng file Word mẫu TN MIX (Phần I/II/III) và cho giáo viên đặt câu vào các mốc video, gồm loại câu Đúng/Sai nhóm (4 ý trong 1 mốc).

**Architecture:** Sửa `js/docx-import.js` (đọc Phần II/III, xuất kind `tf`); thêm kind `tf` vào trình phát trong `index.html` (`<script id="player-js">`, được chép nguyên vào file xuất); cập nhật trình soạn và cửa sổ nhập trong `index.html`. Kiểm thử bằng `node --test` (không cần trình duyệt) cho bộ đọc và `instantiate` của trình phát, rồi kiểm tay trên trình duyệt cho giao diện.

**Tech Stack:** JavaScript thuần (không build), Node 22 `node:test`, `@xmldom/xmldom` lấy từ `taodethi2026-main/node_modules` chỉ để chạy test.

**Spec:** `docs/superpowers/specs/2026-11-18-word-tn-mix-import-design.md`

## Global Constraints

- Thư mục dự án **không phải git repo**: không có bước commit; mỗi task kết thúc bằng chạy test.
- Không thêm thư viện vào ứng dụng; app vẫn mở được bằng `index.html` + `js/` cạnh nhau, chạy offline.
- Chuỗi giao diện bằng tiếng Việt có dấu, câu đầu viết hoa (không Title Case).
- Fixture: `tests/fixtures/tn-mix-mau.docx` (đã chép từ file mẫu). Kết quả mong đợi: 10 câu = 4 `mcq` (đáp án A,B,C,D theo thứ tự câu 1–4) + 2 `tf` (câu 1: Đ,S,S,Đ; câu 2: S,Đ,S,Đ) + 4 `short` (đáp án `22,4`, `-6,5`, `2025`, `-86`).
- Loại câu cũ (`mcq`, `short`, `param`) và file dự án cũ phải chạy y như trước.
- Cách tính điểm không đổi: 1 mốc = 1 câu "đúng ngay lần đầu".

## Review Focus

- Phần II không ý nào được đánh dấu → cảnh báo “chưa xác định”, không âm thầm coi cả 4 là Sai (Task 2).
- Cả 4 ý cùng gạch chân/tô nền → cả 4 Đúng; cả 4 chỉ cùng tô màu chữ hoặc in đậm → bỏ qua dấu đó vì là trang trí (Task 2).
- Ý Đúng/Sai có công thức `$…$` → vẫn hiện công thức và bản xuất tự kèm MathJax (Task 3, 4).
- Học sinh gõ `22.4` khi đáp án là `22,4` vẫn đúng; bấm “Kiểm tra” khi chưa chọn đủ 4 ý thì không nộp được (Task 1, 3).
- Mở file dự án cũ và câu MCQ có đúng một dòng `A.` trong đề không bị nhầm thành câu trả lời ngắn (Task 1, 4).

---

### Task 1: Bộ đọc — Phần III (trả lời ngắn) và khung kiểm thử

**Files:**
- Create: `tests/helpers.cjs`, `tests/docx-import.test.cjs`
- Modify: `js/docx-import.js` (`analyze` ~678–731, nhánh `short` trong `splitQuestions` ~783–792)

**Interfaces:**
- Produces: `tests/helpers.cjs` xuất `loadImporter() -> DocxImport` (nạp `js/docx-import.js` trong Node với `DOMParser` của xmldom) và `importFixture(name: string) -> Promise<{questions, warnings, stats}>`; Task 2 dùng lại.
- Produces: `analyze()` trả thêm `res.shortAns: string|null` (đáp án lấy từ dòng `A. x`).

- [ ] **Step 1: Viết helper và test thất bại** — `helpers.cjs` đặt `global.window=global; global.DOMParser=require('../taodethi2026-main/node_modules/@xmldom/xmldom').DOMParser`, `require('../js/docx-import.js')`, đọc `tests/fixtures/<name>` thành ArrayBuffer. Test `docx-import.test.cjs`:
  - `'mẫu TN MIX: tổng 10 câu, không lẫn dòng hướng dẫn đầu file'`: `questions.length===10` và không câu nào có `text` chứa `bôi đỏ`.
  - `'Phần III: dòng A. x là đáp án'`: 4 câu `kind==='short'` có `answer` lần lượt `['22,4','-6,5','2025','-86']`, `text` không chứa `A.`, không có cảnh báo “chưa có đáp án”.
  - `'Phần I giữ nguyên'`: 4 câu `mcq`, chỉ số đáp án đúng `[0,1,2,3]`.
  - `'MCQ chỉ có một dòng A. không bị coi là trả lời ngắn'`: dùng `DocxImport.splitQuestions({lines:[[{text:'Câu 1. Chọn đáp án đúng',fmt:0}],[{text:'A. 5',fmt:0}]]})` và khẳng định kết quả là `short` có `answer==='5'` **chỉ khi** nằm trong Phần III; ngoài phần III (không có dòng `PHẦN III`) giữ hành vi cũ (`answer===''`).

- [ ] **Step 2: Chạy `node --test tests/docx-import.test.cjs`** — kỳ vọng: test Phần III và test cuối FAIL, test 10 câu và Phần I PASS.

- [ ] **Step 3: Cài đặt** — trong `analyze(block,A,M,isShortPart)` thêm tham số `isShortPart`; ở nhánh cuối (không `options`, không `tf`): nếu `isShortPart` và dòng không rỗng cuối cùng của `qT` khớp `/^[ \t]*\*?A[ \t]*[.:)][ \t]*(\S.*?)[ \t]*$/` thì `res.shortAns` = nhóm 1 (đã `cleanText`), `res.stem` = phần còn lại phía trước dòng đó. `splitQuestions` truyền `isShortPart = /trả\s*lời\s*ngắn/i.test(q.part)`; ở nhánh `short`, ưu tiên `r.shortAns` trước khi dò `Đáp án:` trong lời giải, đặt `how='dòng A.'`; giữ quy tắc rút `$số$` thành số.

- [ ] **Step 4: Chạy lại test** — kỳ vọng: tất cả PASS.

### Task 2: Bộ đọc — Phần II thành một câu `tf`

**Files:**
- Modify: `js/docx-import.js` (nhánh Đúng/Sai trong `analyze` ~719–728; phần phát câu `tf` trong `splitQuestions` ~779–782)
- Test: `tests/docx-import.test.cjs`

**Interfaces:**
- Consumes: `importFixture` (Task 1).
- Produces: câu hỏi đọc ra có dạng `{kind:'tf', num:number, part:string, text:string /*câu dẫn*/, statements:[{text:string, ok:boolean}], how:string, explain:string, images:number[]|string[], warnings:string[]}`. Task 4 dùng đúng các trường này.

- [ ] **Step 1: Viết test thất bại**
  - `'Phần II: mỗi câu là 1 câu tf với 4 ý, đáp án theo gạch chân'`: lọc `kind==='tf'` → 2 câu; `statements.map(s=>s.ok)` lần lượt `[true,false,false,true]` và `[false,true,false,true]`; `text` là `Nội dung câu hỏi 1` / `…2` (không chứa `a)`); `how==='gạch chân'`; không cảnh báo.
  - `'Phần II: không ý nào được đánh dấu → cảnh báo'`: dựng `lines` bằng `splitQuestions` với 4 ý không định dạng (`fmt:0`) và không có lời giải; khẳng định `warnings` có chuỗi chứa `chưa xác định`.
  - `'Phần II: cả 4 ý gạch chân → cả 4 Đúng'` (`fmt:1` = FMT.U) và `'cả 4 ý chỉ tô màu chữ → bỏ qua, cảnh báo'` (`fmt:4` = FMT.C).
  - `'Phần II: dự phòng theo lời giải a) Đúng b) Sai'`: không định dạng nhưng có dòng `Lời giải` kèm `a) Đúng b) Sai c) Sai d) Đúng` → `[true,false,false,true]`, `how==='lời giải'`.

- [ ] **Step 2: Chạy test** — kỳ vọng FAIL (hiện đang tách thành 8 câu `mcq`).

- [ ] **Step 3: Cài đặt** — trong `analyze`: với mỗi ý `tfc[k]` tính `marked(bit)` như nhánh MCQ (ký tự nhãn `a)` có bit, hoặc ≥60% ký tự nội dung có bit). Duyệt bit theo thứ tự `U, H, C, B`: lấy bit đầu tiên có ít nhất một ý được đánh dấu; nếu **tất cả** ý đều được đánh dấu thì chỉ chấp nhận khi bit là `U` hoặc `H` (cả 4 Đúng), còn `C`/`B` thì bỏ qua và thử bit tiếp. Có dấu → `ok = marked`, `how = tên bit`; không có dấu nào → dùng lời giải `a) Đúng` (logic cũ); vẫn không có → `ok=null`. `splitQuestions` phát **một** câu `tf` thay cho vòng `forEach` cũ; `statements[k].ok = ok===true`; nếu có ý `ok===null` thì thêm cảnh báo `Câu Đúng/Sai: ý a, c chưa xác định – hãy bấm chọn Đúng hoặc Sai.` (liệt kê nhãn).

- [ ] **Step 4: Chạy toàn bộ `node --test tests/`** — kỳ vọng PASS, kể cả test Task 1.

### Task 3: Trình phát — loại câu `tf`

**Files:**
- Modify: `index.html` — `instantiate` (~305–324), `openQuiz` (~412–458), khối CSS cạnh `.vp-ans` (~63)
- Create: `tests/player-tf.test.cjs`

**Interfaces:**
- Produces: `PlayerModule().instantiate(q, seed, shuffle)` với `q.kind==='tf'`, `q.statements=[{text,ok}]` trả `{kind:'tf', html, statements:string[] /*HTML từng ý*/, answers:boolean[], wrongCount:(picks:(boolean|null)[])=>number, correct:string /*vd 'a) Đúng · b) Sai · …'*/ , explain, images, long}`; `wrongCount` tính ý chưa chọn (`null`) là sai. Ném `Error('Cần ít nhất 2 ý')` nếu `statements` có dưới 2 ý có chữ.

- [ ] **Step 1: Viết test thất bại** — helper trong file test trích `<script id="player-js">…</script>` từ `index.html`, chạy `new Function(src+';return PlayerModule();')()`; nếu nó đòi `document` thì thêm stub tối thiểu cho tới khi tạo được. Test:
  - `wrongCount([true,false,false,true])===0` với ý `[T,F,F,T]`; `[true,true,false,true]` → 1; `[null,null,null,null]` → 4.
  - `correct` chứa `a) Đúng` và `b) Sai`.
  - Ý có công thức `$x^2$` → `statements[0]` chứa `$x^2$` (để MathJax xử lý); `hasMath(statements)` đúng.
  - `Error` khi chỉ có 1 ý có chữ.
  - Số thập phân: câu `short` đáp án `22,4`, `check('22.4')===true` và `check('22,4')===true` (khoá hành vi hiện có cho Review Focus 4).

- [ ] **Step 2: Chạy `node --test tests/player-tf.test.cjs`** — kỳ vọng FAIL (kind `tf` rơi vào nhánh MCQ).

- [ ] **Step 3: Cài đặt `instantiate` cho `tf`** — không xáo thứ tự ý; ý rỗng bị loại; tính `answers`, `wrongCount`, `correct` như Interfaces.

- [ ] **Step 4: Chạy lại test** — kỳ vọng PASS.

- [ ] **Step 5: `openQuiz` + CSS cho `tf`** — thân câu hỏi: `qHead(inst)` rồi mỗi ý một hàng `.vp-tfrow` gồm nhãn a–d, nội dung ý, hai nút `.vp-tfb` (Đúng / Sai, đã chọn thì đổi màu); nút `.vp-submit` “Kiểm tra” **bị khoá** tới khi chọn đủ mọi ý. Bấm: `wrongCount(picks)===0` → gọi `good()`; ngược lại gọi `bad()` với thông báo `Còn N ý chưa đúng.` (không nói ý nào) — để làm vậy cho `bad(msg)` nhận tham số tuỳ chọn thay cho chuỗi `Chưa chính xác.`. Sau khi nộp khoá các nút. CSS: hàng xếp dọc, chữ ≥15px, một cột ở màn hình ≤560px.

- [ ] **Step 6: Kiểm tra tay** — mở `index.html` trong trình duyệt; qua `window.__app.project = {…}` nạp một dự án có 1 mốc `tf` (video YouTube giả hoặc file ngắn), bấm “Xem thử như học sinh”, kiểm: nút Kiểm tra khoá khi chưa đủ; chọn sai 1 ý → báo “Còn 1 ý chưa đúng.” và phải xem lại video; chọn đúng hết → “Chính xác”, hiện lời giải, xem tiếp được; công thức hiện bằng MathJax.

### Task 4: Trình soạn + cửa sổ nhập + chọn theo phần

**Files:**
- Modify: `index.html` — `qCard` (~612–640), `previewHtml` (~653–661), `validate` (~694–719), `lessonObj` (~721–727), `lessonUsesMath` (~737), `KIND_LABEL` (~851), `iqHtml`/`renderImport` (~887–916), `addImported` (~917–931), bộ nghe `change`/`click` (~947–956, ~979–985, ~1010–1012)
- Modify: `README.md` (bảng “Nhập câu hỏi từ file Word”)

**Interfaces:**
- Consumes: câu `tf` từ Task 2; `instantiate` kind `tf` từ Task 3.
- Produces: `project.checkpoints[i].items[j]` có thể là `{kind:'tf', text, statements:[{text,ok}], explain, images, vars:'', options:[], answer:'', tol:0}`; `window.__app.validate()` báo lỗi cho `tf`.

- [ ] **Step 1: Viết test thất bại cho phần logic thuần** — đưa hai hàm thuần ra trong `index.html` và gắn vào `window.__app`: `tfProblems(q:object, tag:string) -> string[]` (lỗi: thiếu câu dẫn, dưới 2 ý có chữ, ý trống) và `partsOf(qs:object[]) -> {part:string, total:number, selected:number}[]`. Test `tests/editor-logic.test.cjs` trích hai hàm bằng cách tách khối `/* tf-logic:start */ … /* tf-logic:end */` trong `index.html` rồi chạy trong Node; khẳng định: `tfProblems` báo `chưa có nội dung` khi `text` rỗng, `cần ít nhất 2 ý` khi chỉ 1 ý, trả `[]` khi hợp lệ kể cả khi cả 4 ý đều `ok:false`; `partsOf` nhóm đúng theo `q.part` và đếm `sel`.

- [ ] **Step 2: Chạy test** — kỳ vọng FAIL (chưa có hàm).

- [ ] **Step 3: Cài đặt hai hàm** trong khối `tf-logic`, rồi nối: `validate()` gọi `tfProblems` cho `kind==='tf'`; `lessonObj()` bỏ ý có `text` rỗng của câu `tf`; `lessonUsesMath` thêm `statements[].text`.

- [ ] **Step 4: Chạy lại test** — kỳ vọng PASS.

- [ ] **Step 5: Giao diện soạn** — thêm `['tf','Đúng/Sai (nhiều ý a–d)']` vào `<select>` kind; thân `tf` trong `qCard`: mỗi ý một hàng gồm nhãn a–d, ô nhập `data-path="${p}.statements.${k}.text"`, hộp tích `data-path="${p}.statements.${k}.ok"` ghi chú “Ý đúng”, nút xoá ý (`data-act="tfdel"`, tối thiểu 2 ý) và nút “＋ Thêm ý” (`data-act="tfadd"`, tối đa 6). Khi đổi kind sang `tf` mà chưa có `statements` thì tạo 4 ý trống (bộ nghe `change` ~982). `previewHtml` thêm nhánh `tf` liệt kê a)–d) kèm ✓/✗. `qtest` không cần đổi.

- [ ] **Step 6: Cửa sổ nhập** — `KIND_LABEL.tf='Đúng/Sai'`; `iqHtml` cho `tf`: câu dẫn rồi 4 hàng, mỗi hàng hai nút `data-iq="tf" data-q data-k data-v` để đặt Đúng/Sai (đổi xong xoá cảnh báo “chưa xác định” và đặt `how='bạn chọn'`); `addImported` sao chép `statements` (sâu) cho câu `tf`; dòng tóm tắt trong `renderImport` đếm riêng số câu Đúng/Sai. Thêm hàng ô tích theo phần từ `partsOf` (`data-iact="part" data-part`): tích/bỏ tích đặt `sel` cho mọi câu thuộc phần đó rồi `spreadImport(false); renderImport()`.

- [ ] **Step 7: README** — cập nhật bảng: Phần II dùng gạch chân/tô nền cho ý đúng và được nhập thành **một câu Đúng/Sai nhóm**; Phần III dòng `A. đáp án`.

- [ ] **Step 8: Chạy `node --test tests/`** — kỳ vọng tất cả PASS.

### Task 5: Chạy thử trọn luồng với file mẫu

**Files:**
- Test: `tests/e2e-notes.md` (chỉ ghi kết quả kiểm tay; không phải mã)

- [ ] **Step 1: Trong trình duyệt** mở `index.html`, nạp một video MP4 ngắn, bấm “Nhập câu hỏi từ Word” và chọn file mẫu. Kỳ vọng: cửa sổ báo 10 câu (4 trắc nghiệm, 2 Đúng/Sai, 4 trả lời ngắn), câu Đúng/Sai hiện 4 ý đúng như bảng ở Global Constraints, không còn cảnh báo.
- [ ] **Step 2:** bỏ tích Phần I bằng ô chọn theo phần; chọn “Số câu mỗi mốc = 1”, “Chia đều các mốc”, sửa tay giây của một mốc, bấm thêm vào bài. Kỳ vọng: số mốc = số câu còn chọn, giây sắp tăng dần, mục “3. Xuất bài giảng” không báo lỗi.
- [ ] **Step 3:** “Xem thử như học sinh”, đi qua một câu mỗi loại (đúng, sai rồi đúng). Xuất “1 file HTML”, mở file xuất ra, lặp lại một câu `tf`. Kỳ vọng: chạy như bản xem thử.
- [ ] **Step 4:** mở lại một file dự án cũ (nếu có) và một file Word MCQ có công thức MathType; kỳ vọng không lỗi mới.
- [ ] **Step 5:** ghi kết quả từng bước (đạt/không) vào `tests/e2e-notes.md`; báo lại những gì chưa kiểm được.
