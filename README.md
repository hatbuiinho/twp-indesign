# TWP InDesign

Quy trình dùng Codex, ImageGen và Adobe InDesign để dựng minh họa theo kịch bản, dàn chữ thật trên trang đơn hoặc trang đôi và xuất bản duyệt. Repo có sẵn kịch bản, hồ sơ nhân vật và bản dàn mẫu của Tập 53 để bắt đầu.

## Chuẩn bị

- **Codex** để mở thư mục dự án và gọi skill `$twp-indesign` có sẵn trong repo.
- **Adobe InDesign Desktop** để mở INDD/IDML, dàn chữ, kiểm tra ảnh liên kết và xuất PDF. Prompt thiết lập sẽ kiểm tra InDesign và chuẩn bị font cho bản dàn mẫu.
- **ImageGen trong phiên Codex** để dựng outline và lên màu. Bạn có thể đọc nguồn và đề xuất bố cục trước khi cần tạo ảnh.
- **Python 3 và ImageMagick (`magick`)** nếu dùng script tính đường bao Text Wrap. [Hướng dẫn chạy script trong InDesign](.agents/skills/twp-indesign/references/job.md)

## Tạo project trong Codex

### Bắt đầu bằng ZIP khi chưa có Git

1. Mở [repo TWP InDesign trên GitHub](https://github.com/hatbuiinho/twp-indesign), chọn **Code → Download ZIP**.
2. Giải nén và mở thư mục `twp-indesign-main` làm project trong Codex. Chọn đúng thư mục có `README.md`, `.agents/` và `layouts/`.
3. Chuyển đến phần **Dùng trên một spread** để sao chép prompt sử dụng skill.

ZIP là bản chụp của repo tại thời điểm tải. Để lấy bản mới bằng ZIP, giải nén vào một thư mục riêng để giữ các chỉnh sửa trong bản cũ. Nếu muốn cập nhật bằng `git pull`, dùng cách clone bên dưới. [Hướng dẫn tải ZIP của GitHub](https://docs.github.com/en/repositories/working-with-files/using-files/downloading-source-code-archives)

### Clone bằng Git để cập nhật về sau

Prompt bên dưới sẽ tải repo, chủ động cài công cụ còn thiếu và kiểm tra môi trường dàn trang. Nếu muốn tự kiểm tra, mở Terminal và chạy `git --version`. Nếu lệnh chưa chạy được, cài Git theo hệ điều hành, mở lại Terminal và kiểm tra lại. [Hướng dẫn cài Git](https://git-scm.com/install/)

1. Mở thư mục cha nơi bạn muốn lưu repo, ví dụ `Documents`, làm workspace tạm trong Codex.
2. Mở một chat trong workspace đó và dán prompt bên dưới để tải dự án.
3. Mở thư mục `twp-indesign` vừa tải làm project trong Codex. Bắt đầu chat từ thư mục gốc này để Codex nhận skill đi kèm repo.

### Prompt tải repo và thiết lập môi trường

Sao chép nguyên khối này vào Codex chạy trên máy bạn dùng để dàn trang. Đổi vị trí đích trong prompt nếu bạn muốn lưu repo ở nơi khác.

```text
Hãy chuẩn bị repo https://github.com/hatbuiinho/twp-indesign.git để tôi
dùng với Codex và Adobe InDesign. Dùng thư mục twp-indesign bên trong
workspace hiện tại làm đích. Nếu workspace hiện tại đã là checkout
của chính repo đó thì dùng luôn workspace hiện tại.

Trước tiên chạy git --version. Nếu Git chưa dùng được, hãy xác định
hệ điều hành của workspace và trực tiếp chạy lệnh cài phù hợp:

- macOS có Homebrew: chạy brew install git. Nếu máy chưa có Homebrew,
  chạy xcode-select --install để mở trình cài của Apple.
- Windows có WinGet: chạy winget install --id Git.Git -e --source winget.
- Linux: dùng trình quản lý gói của hệ điều hành để cài gói git,
  ví dụ apt trên Ubuntu/Debian hoặc dnf trên Fedora.

Nếu hệ điều hành yêu cầu tôi bấm xác nhận hoặc cấp quyền, hãy cho tôi
biết thao tác cụ thể cần làm. Khi cài xong, kiểm tra lại bằng git --version
và tự tiếp tục. Nếu Git vừa cài chưa có trong PATH, thử dùng shell mới
hoặc đường dẫn tới Git vừa cài. Nếu môi trường chặn việc cài đặt, báo
lỗi cụ thể và chỉ cách dùng Download ZIP để mở project ngay.

Khi Git dùng được và chưa có thư mục đích, clone repo. Nếu đã có checkout đúng remote,
kiểm tra git status và nhánh trước khi cập nhật. Chỉ chạy git pull
--ff-only origin main khi checkout đang ở nhánh main và sạch. Nếu có
thay đổi cục bộ, đang ở nhánh khác hoặc thư mục đích thuộc repo khác,
hãy giữ nguyên dữ liệu và báo tình trạng.

Sau đó đọc AGENTS.md nếu có, README.md và
.agents/skills/twp-indesign/SKILL.md trong checkout. Đọc thêm
.agents/skills/twp-indesign/references/job.md để xác định công cụ cần
cho script Text Wrap. Kiểm tra các thư mục story/t53, characters và layouts.

Hãy trực tiếp chuẩn bị môi trường theo các bước sau:

1. Kiểm tra Python 3 bằng python3 --version (trên Windows có thể dùng
   py -3 --version) và ImageMagick bằng magick -version. Nếu thiếu,
   cài bằng trình quản lý gói có sẵn hoặc bộ cài chính thức từ
   https://www.python.org/downloads/ và https://imagemagick.org/download/.
   Kiểm tra lại cả hai lệnh sau khi cài. Nếu gói ImageMagick của hệ điều
   hành chỉ có convert, tìm bản chính thức có magick để chạy script.
2. Trên macOS hoặc Windows, kiểm tra InDesign Desktop. Nếu thiếu, dùng
   công cụ điều khiển giao diện nếu có để mở Creative Cloud Desktop và
   cài InDesign bằng tài khoản Adobe hiện có. Nếu Creative Cloud Desktop
   cũng thiếu, tải và chạy bộ cài từ Adobe rồi tiếp tục cài InDesign.
   Chỉ nhờ tôi thao tác khi cần đăng nhập, xác thực, cấp quyền hệ điều
   hành hoặc xác nhận một giao dịch. Nếu phiên đang chạy trên Linux
   hay máy từ xa không có InDesign Desktop, hoàn tất phần thiết lập có
   thể thực hiện và báo rõ bước dàn trang cần máy macOS hoặc Windows.
3. Thử mở layouts/t53-part-1.idml trong InDesign mà không ghi đè nguồn.
   Kiểm tra Missing Fonts và ảnh liên kết. Kích hoạt đúng font được báo
   thiếu qua Adobe Fonts nếu tài khoản có quyền, hoặc cài từ tệp font
   hợp lệ đã có sẵn. Báo tên font hoặc đường dẫn ảnh còn thiếu để tôi
   có thể cung cấp đúng tài nguyên.
4. Kiểm tra phiên có ImageGen để tạo minh họa hay không. Dùng công cụ
   ImageGen có sẵn trong Codex. Nếu phiên chưa cấp công cụ này, báo rõ
   vì bước tạo ảnh phụ thuộc vào quyền của phiên.

Tự chạy các bước có thể thực hiện và tiếp tục các bước độc lập khi một
bước cần tôi thao tác. Khi xong, cho tôi đường dẫn tuyệt đối của project,
kết quả kiểm tra Git, Python, ImageMagick, InDesign, font, ảnh liên kết và
ImageGen, cùng một prompt mẫu gọi $twp-indesign để đề xuất bố cục spread.
```

Nếu thao tác bằng Terminal, lần đầu chạy các lệnh sau từ thư mục cha bạn đã chọn.

```sh
git clone https://github.com/hatbuiinho/twp-indesign.git
cd twp-indesign
```

Ở các lần sau, trong thư mục gốc của repo, kiểm tra `git status --short --branch`. Khi đang ở nhánh `main` và thư mục làm việc sạch, chạy `git pull --ff-only origin main`.

## Dùng trên một spread

Trong chat mở từ project `twp-indesign`, dán prompt dưới đây. Thay tên file và số trang in theo spread bạn muốn làm.

```text
Dùng $twp-indesign để cho phương án minh họa và bố cục spread có
số trang in 32–33 trong layouts/t53-part-1.pdf. Xác minh trang PDF
tương ứng, khổ in và đoạn kịch bản. Đối chiếu chữ trong IDML cùng tên,
đọc hồ sơ nhân vật liên quan rồi đề xuất khoảnh khắc, góc máy, hướng sáng,
vị trí tranh, vùng đọc, gáy và số trang. Chỉ trình bày phương án để tôi duyệt.
```

Sau khi duyệt, tiếp tục trong cùng chat theo công việc bạn cần.

1. **Chụp outline.** “Dùng `$twp-indesign` chụp outline theo phương án đã duyệt. Xuất PNG nét đen, không chữ, đúng tỷ lệ spread và chừa vùng đọc.”
2. **Lên màu.** “Lên màu outline đã duyệt theo TTPQ Comic Blend trong `ttpq-blend.md`. Giữ vùng sau chữ sáng và ít chi tiết.”
3. **Dàn trang.** “Dùng `$twp-indesign` đặt ảnh đã duyệt vào bản INDD riêng, giữ chữ thật có thể chỉnh sửa. Giữ nội dung, font, cỡ chữ, giãn dòng và vị trí dòng đầu. Kiểm tra chữ tràn, gáy và số trang, rồi xuất INDD, IDML và PDF vào `outputs/t53-part-1/p032-033/`.”

Khi giao việc, ghi rõ bạn đang nói tới **số trang in** hay **thứ tự trang trong PDF**. Trong bộ layout Tập 53, mỗi trang PDF là một spread. Kiểm tra cả hai bên trên chính bản nguồn vì một số phần vẫn dùng tiếng Việt ở trang phải.

## Dùng cho tập truyện mới

1. Tạo `story/<ma-tap>/` theo mẫu [Tập 53](story/t53). Đặt kịch bản trong `script.md`, quy ước bối cảnh và tính nhất quán trong `bible.md`, danh sách cảnh trong `scenes.md`.
2. Thêm hồ sơ và ảnh tham chiếu cho từng nhân vật theo mẫu trong [characters/](characters/README.md).
3. Đặt PDF nguồn và INDD hoặc IDML tương ứng trong `layouts/`. Dùng chung tên gốc không dấu, ví dụ `tap-moi-part-1.pdf` và `tap-moi-part-1.idml`. Chuẩn bị cả ảnh liên kết và font cần thiết để mở bản dàn trong InDesign. [Quy ước layout](layouts/README.md)
4. Gọi `$twp-indesign` với đường dẫn kịch bản mới, tên file layout và số trang cần làm. Lưu bản xuất vào `outputs/<layout-slug>/<spread>/`, trong đó `<layout-slug>` là tên file layout bỏ phần đuôi. Git bỏ qua thư mục `outputs/`.

[Xem quy trình đầy đủ của skill twp-indesign](.agents/skills/twp-indesign/SKILL.md)
