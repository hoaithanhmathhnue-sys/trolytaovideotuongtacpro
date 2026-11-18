# 🎬 Trợ lý Video tương tác

Web app giúp giáo viên biến một video thành **bài giảng tương tác**: video tự dừng ở các mốc thời gian, hiện câu hỏi, học sinh **trả lời đúng mới được xem tiếp**.

Chỉ cần mở `index.html` bằng trình duyệt (Chrome/Edge/Safari) – không cần cài đặt, không cần máy chủ. Giữ thư mục `js/` nằm cạnh `index.html`.

## Cách dùng (giáo viên)

1. **Chọn video**: file MP4 của bạn, hoặc dán link YouTube.
2. Phát video đến đoạn cần dừng → bấm **＋ Thêm câu hỏi tại đây**.
3. Soạn câu hỏi, hoặc bấm **📄 Nhập câu hỏi từ Word (.docx)** (xem mục bên dưới). Mỗi mốc có thể có nhiều **câu biến thể**; mỗi học sinh được bốc ngẫu nhiên một câu.
4. Bấm **▶ Xem thử như học sinh** để chạy thử.
5. **Xuất bài giảng**:
   - **ZIP (HTML + video)**: giải nén rồi bấm đúp `baigiang.html`; chạy cả khi không có mạng.
   - **1 file HTML (nhúng video)**: tiện gửi, chỉ nên dùng cho video ngắn (dưới ~50 MB).
- **ZIP YouTube (có file mở nhanh)** / **HTML (YouTube)**: YouTube báo “Lỗi 153” nếu bấm đúp file HTML mở từ ổ đĩa. Với ZIP YouTube: giải nén rồi bấm đúp `MO-BAI-GIANG.bat` (Windows; chạy một máy chủ nhỏ tại `http://localhost` và mở trình duyệt, giữ cửa sổ đen mở trong lúc xem). Gửi cho học sinh thì đưa cả thư mục lên địa chỉ `https://` (GitHub Pages, Netlify…).
6. Học sinh làm xong sẽ có **mã kết quả** (`VT1:…`). Dán các mã vào tab **Bảng kết quả** để xem bảng và tải CSV.

> Video MP4 xuất ra dạng `.mp4` thuần **không** giữ được tương tác (MP4 chỉ chứa hình và tiếng). Tương tác nằm trong file HTML đi kèm.

## Nhập câu hỏi từ file Word

File Word được đọc ngay trong trình duyệt, không gửi đi đâu.

| Nội dung trong Word | Cách nhận diện |
|---|---|
| Câu hỏi | Dòng bắt đầu bằng `Câu 1.`, `Câu 2:`, `Bài 3)`… (gõ tay hoặc đánh số tự động) |
| Đáp án | `A.` `B.` `C.` `D.` – mỗi đáp án một dòng, hoặc nhiều đáp án trên một dòng cách nhau bằng Tab, hoặc nằm trong bảng |
| Đáp án đúng | **gạch chân**, **tô nền**, **tô màu chữ**, dấu `*` trước chữ cái, dòng `Chọn B` / `Đáp án: B` trong lời giải, hoặc **bảng đáp án** cuối đề (`1.A 2.B…` hoặc bảng 2 hàng số–chữ) |
| Câu Đúng/Sai (a, b, c, d) | Nhập thành **một câu Đúng/Sai nhóm**: học sinh chọn Đúng/Sai cho từng ý và phải đúng cả các ý mới xem tiếp. Ý đúng nhận theo **gạch chân / tô nền / tô màu** (cả 4 ý cùng gạch chân = cả 4 đúng), hoặc dòng `a) Đúng b) Sai…` trong lời giải; không nhận ra thì bấm chọn tay trong cửa sổ nhập |
| Câu trả lời ngắn | Không có A/B/C/D; đáp án là dòng `A. 22,4` ngay dưới câu (mẫu TN MIX, trong phần “trả lời ngắn”) hoặc dòng `Đáp án: …` |
| Lời giải | Phần sau `Lời giải`/`Hướng dẫn giải` → hiện cho học sinh khi trả lời đúng |
| Công thức | **Equation của Word (OMML)** và **MathType** (MTEF v3/v5, gồm cả Equation Editor 3.0) → LaTeX, hiển thị bằng **MathJax** |
| Hình ảnh | PNG/JPG/GIF/SVG được giữ lại (ảnh EMF/WMF không hiển thị được trên web nên bị bỏ qua) |

Sau khi đọc, cửa sổ nhập cho phép: xem trước từng câu (có công thức), bấm vào đáp án để sửa đáp án đúng, bỏ chọn câu không dùng, chọn nhanh **theo Phần I/II/III**, chọn **số câu mỗi mốc** (lớn hơn 1 thì thành câu biến thể – mỗi học sinh bốc 1 câu), **chia đều các mốc** theo thời lượng video hoặc tự sửa thời gian từng mốc.

> Lưu ý: file `.doc` cũ cần mở bằng Word rồi “Lưu thành” `.docx`. Luôn bấm **Xem thử như học sinh** để soát lại vài câu trước khi dùng.

## Công thức toán

- Viết công thức trong `$...$` (ví dụ `$\frac{1}{2}$`), hiển thị bằng MathJax ở trình soạn và bài giảng.
- Câu thay số dùng được biến trong công thức: `$x^{n}$`, `$\frac{a}{b}$` với `n`, `a`, `b` là biến đã khai báo.
- Bài giảng xuất ra có công thức sẽ kèm MathJax: **ZIP** có thư mục `mathjax/` (chạy không cần mạng), **1 file HTML** nhúng sẵn MathJax, **bản YouTube** tải MathJax từ mạng.

## Chống chép bài

| Cơ chế | Mô tả |
|---|---|
| Câu thay số | Viết khuôn câu + công thức, app tự sinh số khác nhau cho từng em. Ví dụ `n = randint(10, 255)`, đáp án `bin(n)` |
| Ngân hàng câu | Mỗi mốc có nhiều câu biến thể, bốc ngẫu nhiên |
| Xáo đáp án | Thứ tự A/B/C/D khác nhau giữa các em, và đổi lại sau mỗi lần làm sai |
| Hạt giống theo tên | Tên + lớp → mỗi em luôn nhận đúng một bộ đề (tải lại trang không đổi) |

### Cú pháp câu thay số

- Biến (mỗi dòng một biến, được dùng biến khai báo trước): `w = pick(800, 1024)`, `kb = w*h*b/8/1024`
- Chèn vào câu hỏi: `{w}` (giá trị biến) hoặc `{=w*h}` (kết quả biểu thức)
- Hàm có sẵn: `randint(a,b)`, `pick(...)`, `floor`, `ceil`, `round`, `abs`, `min`, `max`, `sqrt`, `pow`, `log2`, `log10`, `bin(n)`, `hex(n)`, `oct(n)`, `pad(s,n)`, `len(s)`, `parseBin(s)`, `parseHex(s)`
- Biểu thức được kiểm tra chặt: chỉ dùng tên đã khai báo, không chuỗi, không `a.b`, không gán.

## Giới hạn cần biết

- **Chấm điểm phía trình duyệt**: đáp án nằm trong mã của file HTML nên học sinh biết xem mã nguồn (F12) vẫn tìm được. Mức này đủ để bắt học sinh xem kỹ video; nếu cần chấm điểm nghiêm túc thì phải chấm ở máy chủ (ví dụ Firebase).
- **Mã kết quả** do trình duyệt học sinh tạo, chưa có chữ ký chống làm giả.
- **YouTube** không nhúng được khi mở file trực tiếp từ ổ đĩa (`file://`, lỗi 153) – dùng `MO-BAI-GIANG.bat` trong ZIP YouTube hoặc mở qua https.
- **Máy chủ phải hỗ trợ tải theo đoạn (HTTP Range)** nếu phát file MP4 qua web để tua được (GitHub Pages, Netlify, Firebase Hosting đều hỗ trợ).
- Học sinh không tua vượt qua câu hỏi chưa trả lời được (đã kiểm thử), nhưng người dùng rành kỹ thuật vẫn có thể bỏ qua bằng công cụ lập trình.

## Đưa lên web bằng GitHub Pages

`Settings → Pages → Deploy from a branch → main / (root)`. Sau đó mở `https://<tên-tài-khoản>.github.io/trolyvideotuongtac/`.

## Cấu trúc

- `index.html`: trình soạn (giáo viên) và trình phát (học sinh). Trình phát được chép nguyên văn vào mỗi bài giảng xuất ra, nên file xuất ra tự chạy độc lập.
- `js/docx-import.js`: đọc file Word – giải nén DOCX, đọc đối tượng OLE của MathType, chuyển MTEF/OMML sang LaTeX, tách câu hỏi và đáp án.

---

Tác giả: Trần Hoài Thanh · Zalo liên hệ: 0348296773
Mọi tool AI dành cho giáo viên có tại: https://giaovienai.vercel.app/
