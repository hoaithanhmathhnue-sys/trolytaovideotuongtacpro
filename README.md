# 🎬 Trợ lý Video tương tác

Web app giúp giáo viên biến một video thành **bài giảng tương tác**: video tự dừng ở các mốc thời gian, hiện câu hỏi, học sinh **trả lời đúng mới được xem tiếp**.

Chỉ cần mở `index.html` bằng trình duyệt (Chrome/Edge/Safari) – không cần cài đặt, không cần máy chủ.

## Cách dùng (giáo viên)

1. **Chọn video**: file MP4 của bạn, hoặc dán link YouTube.
2. Phát video đến đoạn cần dừng → bấm **＋ Thêm câu hỏi tại đây**.
3. Soạn câu hỏi. Mỗi mốc có thể có nhiều **câu biến thể**; mỗi học sinh được bốc ngẫu nhiên một câu.
4. Bấm **▶ Xem thử như học sinh** để chạy thử.
5. **Xuất bài giảng**:
   - **ZIP (HTML + video)**: giải nén rồi bấm đúp `baigiang.html`; chạy cả khi không có mạng.
   - **1 file HTML (nhúng video)**: tiện gửi, chỉ nên dùng cho video ngắn (dưới ~50 MB).
   - **HTML (YouTube)**: phải mở qua địa chỉ `https://` (ví dụ đưa lên GitHub Pages).
6. Học sinh làm xong sẽ có **mã kết quả** (`VT1:…`). Dán các mã vào tab **Bảng kết quả** để xem bảng và tải CSV.

> Video MP4 xuất ra dạng `.mp4` thuần **không** giữ được tương tác (MP4 chỉ chứa hình và tiếng). Tương tác nằm trong file HTML đi kèm.

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
- **YouTube** không nhúng được khi mở file trực tiếp từ ổ đĩa (`file://`) – cần mở qua https.
- **Máy chủ phải hỗ trợ tải theo đoạn (HTTP Range)** nếu phát file MP4 qua web để tua được (GitHub Pages, Netlify, Firebase Hosting đều hỗ trợ).
- Học sinh không tua vượt qua câu hỏi chưa trả lời được (đã kiểm thử), nhưng người dùng rành kỹ thuật vẫn có thể bỏ qua bằng công cụ lập trình.

## Đưa lên web bằng GitHub Pages

`Settings → Pages → Deploy from a branch → main / (root)`. Sau đó mở `https://<tên-tài-khoản>.github.io/trolyvideotuongtac/`.

## Cấu trúc

Toàn bộ ứng dụng nằm trong **một file `index.html`**: trình soạn (giáo viên) và trình phát (học sinh). Trình phát được chép nguyên văn vào mỗi bài giảng xuất ra, nên file xuất ra tự chạy độc lập.
