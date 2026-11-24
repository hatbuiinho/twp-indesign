# Dàn một trang hoặc spread

## Nền toàn trang và Text Wrap cục bộ

Clone spread đích thành một tài liệu InDesign riêng. Giữ khổ trang, số trang in, chữ và định dạng có thể chỉnh sửa, liên kết ảnh và đường bao Text Wrap.

Khi chữ thuộc story liên kết với các spread khác, dùng tài liệu nguồn hoặc bản làm việc đầy đủ để xác định phạm vi chữ của từng khung và kiểm tra điểm ngắt với spread kế. Trong bản clone, chỉ giữ phần chữ thuộc spread đích. Xuất INDD/IDML từ bản clone và mở lại để xác nhận số spread, số trang in, liên kết ảnh và chữ tràn.

1. Trên bản INDD riêng, xác nhận khổ in và đối chiếu chữ trong từng khung đích. Ướm chữ thật để xác định vùng nền nhẹ, khoảng gáy và số trang. Với nền phủ tới mép cắt, dùng tỉ lệ đúng khổ và tính bleed theo tài liệu khi đầu ra cần bleed.
2. Đặt ảnh đã dựng toàn trang ở dưới lớp chữ, giữ tỉ lệ khi fit. Đặt Text Wrap của khung ảnh thành **No Text Wrap**. Kiểm tra ở bản màu xem nền có liền mạch đi qua vùng chữ hay còn mép ảnh tạo đường chia ngang.
3. Khi hình lấn vào vùng đọc, vẽ một path riêng không tô, không viền và không in. Bật **Wrap Around Object Shape** trên path, chọn phía chữ chạy và chỉnh khoảng hở theo hình. Kiểm tra khung chữ đích có nhận wrap. Có thể giữ chữ chạy trực tiếp trên nền ở những vùng đủ thoáng.
4. Soát các dòng bị tác động. Nếu một từ đứng lẻ hoặc dòng quá ngắn, thử chỉnh đường bao, khoảng hở hoặc vị trí hình. Nếu cần thêm một dòng và bố cục còn chỗ, nới khung thay vì đổi cỡ chữ hay giãn dòng. Với story liên kết, so sánh nội dung khung đích và khung kế trước và sau khi dàn.
5. Xuất PDF, kiểm tra từng dòng ở kích thước in, số trang trên nền tranh và các chi tiết sát gáy. Mở lại IDML để kiểm tra liên kết ảnh nếu bàn giao định dạng này.

**Ví dụ trang 32–33, Part 1.** Ảnh TTPQ Blend phủ toàn trang đôi. Trời tím nhạt làm nền đọc ở cả hai trang. Path riêng quanh chóp khăn Nalini cho các dòng cuối trang 32 chạy về bên phải. Chữ trang 33 nằm trực tiếp trên trời. Bản này nới khung chữ trái 22 pt để chứa dòng phát sinh. Đo lại theo từng bố cục khi áp dụng cho trang khác.

## Chạy script tính đường bao tự động

Dùng Python 3, ImageMagick (`magick`) và InDesign Desktop. `prepare.py` chạy local để tính đường bao từ PNG. Tệp JSX tạo ra chạy trong InDesign qua bảng **Window → Utilities → Scripts**. InDesign cần chạy; tùy chọn `showWindow` chỉ điều khiển cửa sổ tài liệu kết quả.

1. Đo khổ và khung trang đôi từ nguồn, kiểm tra số in và xác định khung chữ đích. Tạo JSON như dưới. Đường dẫn tương đối tính từ thư mục JSON.
2. Chạy `python3 scripts/prepare.py /đường/dẫn/job.json` từ thư mục skill. Tạm đưa tệp `*-run.jsx` được in ra vào thư mục **Scripts Panel**, chạy rồi lấy tệp launcher ra. Đọc log cùng tên trong `work`. Khi thử lại, dùng tên mới hoặc dời launcher và kết quả thử đi trước.
3. Render PDF, soát chữ và hình trực quan ở gáy, folio, mép cắt. Đối chiếu nội dung PDF theo từng cột và mở lại IDML nếu bàn giao. Log `SUCCESS` xác nhận script đã xuất; `reflow` cho biết bố cục dòng có đổi. Chất lượng chữ ôm hình cần xem render.

```json
{
  "name": "p012-013-ban-01",
  "source": "nguon.idml",
  "artwork": "outline.png",
  "output": "outputs",
  "work": "work",
  "pages": [12, 13],
  "pageSizePt": [405.354, 575.433],
  "columns": [
    {"boundsPt": [65.197, 48.189, 521, 364], "sourcePage": 12, "prefix": "Chiếc xe ngựa"},
    {"boundsPt": [65.197, 449, 521, 762.52], "sourcePage": 13, "prefix": "Chiếc xe ngựa"}
  ],
  "folios": [
    {"boundsPt": [539, 45.5, 560, 64.5], "font": "Minion Pro\tRegular", "sizePt": 13},
    {"boundsPt": [539, 747, 560, 766], "font": "Minion Pro\tRegular", "sizePt": 13}
  ],
  "gapPt": 7,
  "shiftPt": [55, 73, 91, 109, 118],
  "showWindow": false
}
```

- Hệ tọa độ theo cả spread, gốc trên trái; `boundsPt` là `[trên, trái, dưới, phải]` tính bằng pt. Mỗi cột lấy một khung trên trang tương ứng theo mặc định. Dùng `label` hoặc `prefix` nếu trang có nhiều khung. `take: "story"` lấy toàn bộ story khi đã đối chiếu; mặc định `"frame"` lấy phần của khung. Dùng `sourcePage` khác trang đích chỉ khi đã xác nhận văn bản dùng chung. `keepTogether` có thể nhận danh sách cụm từ cần giữ trên cùng dòng.
- Script hỗ trợ một spread hai trang liên tiếp bắt đầu bằng số chẵn, một khung thân bài mỗi bên và một ảnh phủ spread. Ảnh nên đúng tỷ lệ khổ trang đôi; script đặt tỷ lệ đồng đều và cắt giữa nếu khác tỷ lệ. `shiftPt` thử dịch hình xuống theo thứ tự tăng dần; xem lại chi tiết ở mép dưới. `gapPt` là khoảng hở chân chữ quanh nét. `inkBelowPercent` mặc định 73, chỉ dùng để đo nét. `folios` để trống nếu thiết kế bỏ số trang.
- Script dừng khi nguồn mơ hồ, font thiếu, chữ tràn hoặc tên đích đã tồn tại. Dùng bố cục InDesign trực tiếp cho spread có nhiều khung mỗi trang, trang lẻ hoặc chữ cần chảy qua nhiều khung.
