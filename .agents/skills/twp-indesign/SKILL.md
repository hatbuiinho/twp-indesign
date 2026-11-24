---
name: twp-indesign
description: Dựng cảnh minh họa như nhiếp ảnh gia, vẽ outline hoặc lên màu, rồi dàn chữ thật trên nền toàn trang hoặc ôm hình cục bộ trong InDesign. Dùng cho truyện minh họa theo kịch bản, dàn trang đơn hoặc trang đôi, cập nhật tạo hình và xuất INDD, IDML, PDF.
---

# TWP InDesign

1. **Chốt phạm vi.** “Cho phương án” → trình bày khoảnh khắc, góc máy và bố cục để xem trước. “Chụp outline” → dựng cảnh bằng nét đen, xuất PNG không chữ. “Dàn trang” → đặt hình và reflow chữ thật. Chỉnh profile và lên màu TTPQ Comic Blend theo yêu cầu, dùng profile và tài liệu phong cách đã duyệt của đúng dự án.
2. **Đọc nguồn.** Xác minh trang PDF, số trang in, đoạn kịch bản và khổ thật. Lấy chữ và định dạng từ INDD/IDML; đối chiếu PDF. Dùng chỉ dẫn và profile nhân vật của dự án hiện hành. Nếu có yêu cầu dựng lại, lấy kịch bản làm nguồn cho bố cục mới.
3. **Bố cục chữ và tranh từ đầu.** Ướm chữ thật theo khổ in, đánh dấu dòng cuối, gáy, mép cắt và số trang. Khi đề bài để mở, ưu tiên thử nền toàn trang hoặc trang đôi có vùng đọc tạo từ chính bối cảnh. Với trang đôi, chốt loại spread và áp dụng mục Quy định bắt buộc khi tạo outline trang đôi. Chọn wrap khi hình có dáng rõ và chữ còn đủ bề ngang. Dùng mảng riêng khi chữ dày, hình cần giữ nguyên khung hoặc đề bài yêu cầu. Khi lên phương án hoặc dựng nền, đọc [bố cục trang đôi minh họa](references/spread-composition.md).
4. **Dựng nền từ outline.** Dùng ImageGen theo quy định dự án và đưa quy định gáy của loại spread đã chọn vào prompt. Tạo ảnh không chữ theo đúng tỷ lệ trang hoặc trang đôi, chừa vùng đọc ngay trong phối cảnh. Tập trung nét vào chủ thể và mép cảnh, dùng trời, sương, mặt tường hoặc vùng bóng yên để dẫn nền qua vùng chữ. Soát outline theo quy định gáy và ướm chữ thật trước khi lên màu hoặc chốt file. Sửa outline nếu còn vi phạm.
5. **Dàn chữ thật.** Clone riêng spread đang làm vào một tài liệu InDesign mới, giữ chữ chỉnh sửa được và giữ nội dung, thứ tự, font, cỡ, giãn dòng. Đặt ảnh toàn trang dưới chữ. Tắt wrap trên khung ảnh nền và dùng đường bao riêng, chỉnh sửa được, khi chữ cần né một chi tiết. Nếu dòng quá ngắn hoặc chữ tràn, chỉnh đường bao hoặc vị trí hình trước. Có thể nới khung chữ khi còn chỗ. Xem [cách dàn và chọn script](references/job.md) khi thực thi.
6. **Soát trước khi giao.** Kiểm tra PDF ở kích thước in, độ đọc của chữ, đường cắt nền ngoài chủ ý, dòng cuối sau wrap, chữ tràn, gáy và số trang. Với story liên kết, đối chiếu nội dung từng khung để phát hiện chữ dồn sang trang kế. Khi giao INDD hoặc IDML, chỉ giao bản clone của spread đang làm. Mở lại file giao và xác nhận bảng Pages chỉ có spread đích với đúng số trang in. Khi giao bản dàn outline, dùng bộ bàn giao bên dưới. Với các đầu ra khác, giao theo yêu cầu. Ghi rõ nếu đã nới khung chữ, cắt hình ở mép hoặc dùng nguồn chữ tạm.

## Bàn giao bản dàn outline

- **PNG outline có chữ thật.** Xuất từ bản dàn cuối, cùng khung cắt với PDF xem trước, để đối chiếu vị trí chữ và tranh khi lên màu. Kèm PNG outline không chữ cùng kích thước để tô trực tiếp.
- **Nội dung kịch bản outline.** Ghi ngay trong câu trả lời, gồm bối cảnh, khoảnh khắc được minh họa và hành động hoặc biểu cảm chính. Bám đoạn kịch bản nguồn và nêu rõ chi tiết diễn xuất do người dựng chọn khi cần.
- **INDD.** Gửi bản clone chỉ chứa spread đang làm, với chữ và đường bao Text Wrap chỉnh sửa được.
- **PDF xem trước.** Xuất từ cùng bản INDD, có tranh outline, chữ thật và số trang theo bản dàn.

## Quy định bắt buộc khi tạo outline trang đôi

- **Spread một cảnh.** Một tranh liền phủ cả hai trang, nền vẽ và tô liên tục qua gáy. Thân, trang phục và đạo cụ cầm tay của mỗi nhân vật nằm trọn trong một trang. Giữ mặt và bàn tay đang thực hiện hành động chính ngoài dải 7% giữa spread, tương đương khoảng 30 pt mỗi bên gáy ở khổ spread 286 mm. Nếu có vật dài chạy qua gáy, đặt đoạn trơn của vật tại gáy, còn tay, dây buộc và mối nối nằm ngoài dải này.
- **Spread hai cảnh riêng.** Mỗi trang một cảnh, vẽ và tô từng cảnh tới sát gáy rồi dừng. Không hòa nền, tạo vùng chuyển tiếp hoặc chừa dải trắng giữa hai cảnh. Giữ mỗi nhân vật trọn trong trang của cảnh đó. Chọn một cảnh làm trọng tâm và hạ một bậc độ nhấn của cảnh còn lại.
- Kiểm tra quy định này trên outline và kiểm tra lại sau khi lên màu hoặc đặt tranh vào InDesign.

## Quy định dự án

- Thực hiện hình minh họa theo style Semi-Realistic Storybook Illustration dạng outline.
- Không được tự ý thay đổi font size, dãn dòng, vị trí dòng đầu tiên của chữ, chiều rộng của khung text
- Chỉ sử dụng skill ImageGen để tạo hình cho dàn trang.
- Profile nhân vật lấy từ thư mục `characters/`.
- Lưu mọi bản dàn theo spread, ảnh liên kết, outline và tệp bàn giao (INDD, IDML, PNG, PDF) trong `outputs/<layout-slug>/<spread>/`. Git bỏ qua `outputs/`. Đặt tài liệu nguồn trong `layouts/`.

## Chọn công cụ Adobe

- Mặc định dùng InDesign Desktop trên máy để mở tài liệu, chuyển đổi INDD/IDML và xuất PDF hoặc ảnh. Khi một bước không thực hiện được trên máy, dùng plugin Adobe nếu có trong phiên và hỗ trợ định dạng đầu vào, đầu ra và yêu cầu xử lý tệp. Với tệp cần giữ trên máy, thực hiện các bước xử lý tệp bằng InDesign Desktop.
- Đặt tranh vào spread, tạo Text Wrap và soát chữ tràn bằng script trong InDesign Desktop. Có thể dùng Computer Use để chạy script và kiểm tra bản dàn.
