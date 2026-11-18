# Ghi chú kiểm tay (2026-11-18)

Chạy `index.html` qua máy chủ cục bộ, nạp `tests/fixtures/tn-mix-mau.docx`, video thử tạo bằng canvas.

| Bước | Kết quả |
|---|---|
| Nhập file mẫu | Đạt: 10 câu (4 mcq, 2 Đúng/Sai ĐSSĐ và SĐSĐ, 4 trả lời ngắn `22,4` `-6,5` `2025` `-86`), không cảnh báo |
| Chọn theo phần | Đạt: bỏ Phần I còn 6 câu → 6 mốc; `validate()` không lỗi |
| Xem thử: nút Kiểm tra | Đạt: khoá khi chưa chọn đủ 4 ý, mở khi đủ |
| Xem thử: trả lời sai | Đạt: báo "Còn 2 ý chưa đúng.", phải xem lại video |
| Xem thử: trả lời đúng | Đạt: "Chính xác", có nút Tiếp tục xem |
| Thẻ soạn + xem trước câu tf | Đạt: 4 ý, hộp "Ý đúng" khớp, xem trước ✓/✗ |
| Xuất HTML | Một phần: `buildHtml` có mã trình phát tf và dữ liệu `"kind":"tf"`; chưa mở file HTML xuất ra để làm bài |
| File Word có MathType, file dự án cũ | Chưa kiểm: chưa có file thật; bộ đọc công thức không bị sửa |
