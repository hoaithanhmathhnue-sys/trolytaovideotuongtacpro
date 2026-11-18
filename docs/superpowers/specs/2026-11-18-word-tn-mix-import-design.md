# Nhập câu hỏi từ file Word chuẩn "TN MIX" vào mốc video — thiết kế (đã duyệt 2026-11-18)

## Mục đích
Giáo viên tải file Word theo mẫu "Cấu trúc File Đề mẫu TN MIX.docx" (3 phần: I nhiều lựa chọn, II đúng/sai, III trả lời ngắn). App đọc câu hỏi, giáo viên chọn câu nào đặt ở giây nào của video. Cách nhận diện đáp án theo cùng quy ước với tính năng trộn đề (`taodethi2026-main/services/docxExamMixer.ts`).

## Hiện trạng (đã chạy thử `js/docx-import.js` trên file mẫu)
- Phần I: đọc đúng (đáp án tô đỏ / gạch chân).
- Phần II: không nhận ý đúng (chỉ tìm chữ "Đúng/Sai" trong lời giải, chưa đọc gạch chân); câu dẫn bị lặp vào từng ý; tách thành 4 câu rời.
- Phần III: dòng `A. 22,4` bị coi là một phần của đề, đáp án rỗng.

## Mục tiêu / Không làm
- Làm: đọc đúng cả 3 phần của file mẫu; loại câu mới `tf` chạy trong trình phát; chọn câu theo phần.
- Không làm: đề sai quy ước, đề scan/OCR, tự giải tìm đáp án.
- Chống thất bại: mất công thức/hình; học sinh được qua mốc khi chưa đúng đủ 4 ý.

## Cách làm (duy nhất hợp lý)
Các câu cùng mốc là *câu biến thể* (bốc 1 câu/học sinh) nên không thể dồn 4 câu Đúng/Sai rời vào một mốc → cần loại câu mới.

1. **Trình phát (`index.html`, `player-js`)**: kind `tf` = `{text, statements:[{text, ok}]}`. Hiện câu dẫn + 4 dòng a–d, mỗi dòng nút Đúng/Sai, nút "Kiểm tra". Cả 4 đúng → qua mốc, hiện lời giải. Sai → "còn N ý chưa đúng" (không chỉ ý nào), quay lại xem video. Không xáo thứ tự a–d. Dùng ở trình soạn, xem thử và cả 3 kiểu xuất.
2. **Bộ đọc (`js/docx-import.js`)**: Phần II — ý có gạch chân/tô nền/tô màu (/in đậm như mcq) = Đúng, còn lại Sai; cả 4 ý cùng đánh dấu → cả 4 Đúng; không ý nào → cảnh báo để chọn tay; vẫn nhận dòng `a) Đúng` trong lời giải làm dự phòng. Phần III — dòng đơn `A. x` là đáp án (số có dấu phẩy/âm). Dòng hướng dẫn đầu file bị bỏ qua. Công thức/hình giữ nguyên.
3. **Cửa sổ nhập**: thẻ `tf` bấm từng ý để đổi Đúng/Sai; ô chọn nhanh theo Phần I/II/III (lựa chọn của tôi); giữ nguyên chọn giây và "số câu mỗi mốc".

## Việc để người làm quyết
Giao diện chi tiết của hàng a–d; cách đếm điểm "đúng ngay lần đầu" giữ như các loại câu khác (1 mốc = 1 câu).

## Kiểm thử
Chạy bộ đọc trên file mẫu: 4 câu Phần I có đáp án; 2 câu `tf` mỗi câu 4 ý có đáp án; 4 câu trả lời ngắn có đáp án. Trình phát: đúng hết, sai một ý, xem lại video; xuất ZIP/1 file vẫn chạy.
