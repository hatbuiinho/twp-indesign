---
name: twp-indesign
description: Dựng cảnh minh họa như nhiếp ảnh gia, vẽ outline hoặc lên màu, rồi dàn chữ thật trên nền toàn trang hoặc ôm hình cục bộ trong InDesign. Dùng cho truyện minh họa theo kịch bản, dàn trang đơn hoặc trang đôi, cập nhật tạo hình và xuất INDD, IDML, PDF.
---

# TWP InDesign

1. **Chốt phạm vi.** “Cho phương án” → trình bày khoảnh khắc, góc máy và bố cục để xem trước. “Chụp outline” → dựng cảnh bằng nét đen, xuất PNG không chữ. “Dàn trang” → đặt hình và reflow chữ thật. Chỉnh profile và lên màu TTPQ Comic Blend theo yêu cầu, dùng profile và tài liệu phong cách đã duyệt của đúng dự án.
2. **Đọc nguồn.** Xác minh trang PDF, số trang in, đoạn kịch bản và khổ thật. Lấy chữ và định dạng từ INDD/IDML; đối chiếu PDF. Dùng chỉ dẫn và profile nhân vật của dự án hiện hành. Nếu có yêu cầu dựng lại, lấy kịch bản làm nguồn cho bố cục mới.
3. **Chọn bố cục trước khi tạo ảnh.** Ướm chữ thật theo đúng khổ in, đánh dấu vùng đọc, gáy và số trang. Chọn nền toàn trang dưới chữ khi cảnh có khoảng nền thoáng, chữ ôm đường bao khi hình có dáng rõ, hoặc bố cục theo mảng riêng khi chữ dày hay cảnh nhiều chi tiết. Có thể phối hợp nền toàn trang và wrap cục bộ. Chọn khoảnh khắc, góc máy, hướng sáng và các lớp cảnh. Giữ mặt, tay và đạo cụ chính khỏi gáy.
4. **Dựng nền từ outline.** Dùng ImageGen theo quy định dự án. Với nền toàn trang, dựng đúng tỷ lệ trang hoặc trang đôi và chốt vùng đọc ngay trên outline. Dùng khoảng nền tự nhiên như trời, sương hay mặt tường để nối chữ và hình. Đặt mây, bóng đổ hoặc chất liệu ở rìa vùng đọc, giữ nền sau chữ sáng và ít biến thiên. Khi lên màu TTPQ Comic Blend, kiểm tra nền dưới chữ thật, kể cả chữ màu.
5. **Dàn chữ thật.** Dùng bản INDD riêng, giữ chữ chỉnh sửa được và giữ nội dung, thứ tự, font, cỡ, giãn dòng. Đặt ảnh toàn trang dưới chữ. Tắt wrap trên khung ảnh nền và dùng đường bao riêng, chỉnh sửa được, khi chữ cần né một chi tiết. Nếu dòng quá ngắn hoặc chữ tràn, chỉnh đường bao hoặc vị trí hình trước. Có thể nới khung chữ khi còn chỗ. Xem [cách dàn và chọn script](references/job.md) khi thực thi.
6. **Soát trước khi giao.** Kiểm tra PDF ở kích thước in, độ đọc của chữ, đường cắt nền ngoài chủ ý, dòng cuối sau wrap, chữ tràn, gáy và số trang. Với story liên kết, đối chiếu nội dung từng khung để phát hiện chữ dồn sang trang kế. Giao PNG, INDD/IDML và PDF theo yêu cầu. Ghi rõ nếu đã nới khung chữ, cắt hình ở mép hoặc dùng nguồn chữ tạm.

## Quy định dự án

- Thực hiện hình minh họa theo style Semi-Realistic Storybook Illustration dạng outline.
- Không được tự ý thay đổi font size, dãn dòng, vị trí dòng đầu tiên của chữ.
- Chỉ sử dụng skill ImageGen để tạo hình cho dàn trang.
- Profile nhân vật lấy từ thư mục `characters/`.
- File output (PDF xuất/preview từ InDesign) đặt trong `outputs/<layout-slug>/<spread>/`, không để trong `layouts/`. Thư mục `outputs/` đã được git ignore.

## Chọn công cụ Adobe

- Mặc định dùng InDesign Desktop trên máy để mở tài liệu, chuyển đổi INDD/IDML và xuất PDF hoặc ảnh. Khi một bước không thực hiện được trên máy, dùng plugin Adobe nếu có trong phiên và hỗ trợ định dạng đầu vào, đầu ra và yêu cầu xử lý tệp. Với tệp cần giữ trên máy, thực hiện các bước xử lý tệp bằng InDesign Desktop.
- Đặt tranh vào spread, tạo Text Wrap và soát chữ tràn bằng script trong InDesign Desktop. Có thể dùng Computer Use để chạy script và kiểm tra bản dàn.
