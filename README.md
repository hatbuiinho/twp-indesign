# TWP InDesign

Quy trình dùng Codex, ImageGen và Adobe InDesign để dựng minh họa theo kịch bản, dàn chữ thật trên trang đơn hoặc trang đôi và xuất bản duyệt. Repo có sẵn kịch bản, hồ sơ nhân vật và bản dàn mẫu của Tập 53 để bắt đầu.

## Chuẩn bị

- **Codex** để mở thư mục dự án và gọi skill `$twp-indesign` có sẵn trong repo.
- **Adobe InDesign Desktop** để mở INDD/IDML, dàn chữ, kiểm tra ảnh liên kết và xuất PDF. Cài qua Creative Cloud Desktop trên macOS hoặc Windows và chuẩn bị font cho bản dàn mẫu.
- **Node.js 18 trở lên và npm** nếu muốn điều khiển InDesign qua MCP. Xem [Cài InDesign MCP](#cài-indesign-mcp) theo hệ điều hành.
- **ImageGen trong phiên Codex** để dựng outline và lên màu. Bạn có thể đọc nguồn và đề xuất bố cục trước khi cần tạo ảnh.
- **Python 3 và ImageMagick (`magick`)** nếu dùng script tính đường bao Text Wrap. [Hướng dẫn chạy script trong InDesign](.agents/skills/twp-indesign/references/job.md)

## Tạo project trong Codex

### Bắt đầu bằng ZIP khi chưa có Git

1. Mở [repo TWP InDesign trên GitHub](https://github.com/hatbuiinho/twp-indesign), chọn **Code → Download ZIP**.
2. Giải nén và mở thư mục `twp-indesign-main` làm project trong Codex. Chọn đúng thư mục có `README.md`, `.agents/` và `layouts/`.
3. Nếu dùng MCP, làm theo phần **Cài InDesign MCP**, rồi tiếp tục đến **Dùng trên một spread**.

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
4. Làm theo mục Cài InDesign MCP trong README. Kiểm tra node và npm,
   build MCP từ mã nguồn, rồi cấu hình Codex trỏ đến bản build local
   theo hệ điều hành. Giữ các mục cấu hình MCP khác hiện có.
   Mở InDesign và gọi document_listOpen. Khi vừa thêm hoặc đổi cấu hình,
   mở lại Codex nếu phiên hiện tại chưa nhận bộ công cụ. Báo riêng kết quả
   kiểm tra MCP và bước nào còn cần thực hiện sau khi mở lại Codex.
5. Kiểm tra phiên có ImageGen để tạo minh họa hay không. Dùng công cụ
   ImageGen có sẵn trong Codex. Nếu phiên chưa cấp công cụ này, báo rõ
   vì bước tạo ảnh phụ thuộc vào quyền của phiên.

Tự chạy các bước có thể thực hiện và tiếp tục các bước độc lập khi một
bước cần tôi thao tác. Khi xong, cho tôi đường dẫn tuyệt đối của project,
kết quả kiểm tra Git, Python, ImageMagick, InDesign, MCP, font, ảnh liên kết
và ImageGen, cùng một prompt mẫu gọi $twp-indesign để đề xuất bố cục spread.
```

Nếu thao tác bằng Terminal, lần đầu chạy các lệnh sau từ thư mục cha bạn đã chọn.

```sh
git clone https://github.com/hatbuiinho/twp-indesign.git
cd twp-indesign
```

Ở các lần sau, trong thư mục gốc của repo, kiểm tra `git status --short --branch`. Khi đang ở nhánh `main` và thư mục làm việc sạch, chạy `git pull --ff-only origin main`.

## Cài InDesign MCP

MCP là tùy chọn để Codex điều khiển InDesign Desktop trên cùng máy. Repo MCP có checkout riêng trong thư mục `adobe-indesign-mcp/`, ngang hàng với `README.md` và `layouts/`. Dùng Git để tải và cập nhật checkout này.

### Tải và cập nhật mã nguồn

Nếu chưa có thư mục `adobe-indesign-mcp/`, mở Terminal hoặc PowerShell tại thư mục gốc dự án TWP InDesign và chạy:

```sh
git clone --branch main https://github.com/nutriandrea/adobe-indesign-mcp.git adobe-indesign-mcp
```

Nếu đã clone repo MCP, kiểm tra checkout từ thư mục gốc dự án:

```sh
git -C adobe-indesign-mcp remote -v
git -C adobe-indesign-mcp status --short --branch
```

Khi `origin` trỏ đến repo trên và cây làm việc sạch, chuyển sang `main` nếu trước đó đã checkout tag `v1.6.1` theo hướng dẫn cũ. Sau đó pull bản cập nhật:

```sh
git -C adobe-indesign-mcp switch main
git -C adobe-indesign-mcp pull --ff-only origin main
```

Sau khi clone hoặc pull, chạy các bước build cho hệ điều hành bên dưới. Sau khi cập nhật, mở lại Codex để nạp bản build mới. Trên macOS, khởi động lại cả bridge JXA.

Kiểm tra Node.js 18 trở lên và npm. Các lệnh `npm ci` bên dưới cài dependency theo `package-lock.json`, còn `npm run build` tạo entry point `dist/index.js` từ mã nguồn. Chạy lại hai lệnh này khi cập nhật mã nguồn.

Thêm hoặc sửa mục `[mcp_servers.indesign]` trong `~/.codex/config.toml` (trên Windows thường là `%USERPROFILE%\.codex\config.toml`). Nếu đã cấu hình MCP InDesign từ trước, cập nhật mục đó để trỏ đến bản build local. Thay các đường dẫn mẫu bằng đường dẫn tuyệt đối trên máy và giữ các mục MCP khác đã có.

### macOS với bridge JXA

Từ thư mục gốc dự án, chạy trong Terminal:

```sh
cd adobe-indesign-mcp
npm ci
npm run build
pwd
command -v node
```

Dùng kết quả của `command -v node` cho `command` và đường dẫn thư mục từ `pwd` để điền `args`.

```toml
[mcp_servers.indesign]
command = "/duong-dan/toi/node"
args = ["/Users/ten-ban/twp-indesign/adobe-indesign-mcp/dist/index.js"]
```

Mở Adobe InDesign và nạp cấu hình trong Codex. Khi Codex đã khởi động MCP server, chạy bridge từ cùng thư mục mã nguồn bằng đường dẫn tuyệt đối trong Terminal và giữ cửa sổ đó mở trong lúc làm việc.

```sh
node "/Users/ten-ban/twp-indesign/adobe-indesign-mcp/bridge-proxy.mjs"
```

Cặp cấu hình này dùng cổng mặc định `8120`. Nếu dùng cổng tùy chỉnh, đặt `BRIDGE_PORT` cho server và `BRIDGE_WS_URL` cho proxy về cùng cổng. Nếu tên ứng dụng khác `Adobe InDesign 2026`, đặt `INDESIGN_APP` khi chạy proxy. Khi macOS hỏi quyền Automation, cho phép ứng dụng khởi chạy proxy điều khiển InDesign.

### Windows với bridge COM

Từ thư mục gốc dự án, chạy trong PowerShell:

```powershell
Set-Location adobe-indesign-mcp
npm.cmd ci
npm.cmd run build
(Get-Location).Path
(Get-Command node.exe).Source
```

Dùng kết quả của `Get-Command` cho `command` và đường dẫn thư mục từ `Get-Location` để điền `args`. Mẫu TOML dùng dấu nháy đơn để giữ nguyên dấu gạch chéo ngược trong đường dẫn Windows.

```toml
[mcp_servers.indesign]
command = 'C:\Program Files\nodejs\node.exe'
args = ['C:\Users\ten-ban\twp-indesign\adobe-indesign-mcp\dist\index.js']

[mcp_servers.indesign.env]
COM_BRIDGE_ENABLED = "true"
```

Mở Adobe InDesign và nạp cấu hình trong Codex. Với cấu hình này, MCP server khởi động bridge COM qua `cscript`. macOS đã được thử với đường bao tùy chỉnh và xuất PDF trên trang 18–19. Trên Windows, chạy bài kiểm tra bên dưới trước khi dùng cho bản sản xuất.

### Kiểm tra kết nối

1. Mở chat trong Codex và yêu cầu gọi `document_listOpen` qua InDesign MCP. Danh sách tài liệu, kể cả `[]` khi chưa mở file, xác nhận InDesign đã phản hồi.
2. Nếu phiên chưa thấy bộ công cụ `indesign`, kiểm tra mục cấu hình và mở lại Codex. Nếu thấy `bridge_not_connected`, kiểm tra InDesign đã mở, rồi kiểm tra proxy và cổng trên macOS hoặc cấu hình COM trên Windows. Gọi lại `document_listOpen` sau khi xử lý.
3. Mở bản sao [trang 18–19](layouts/t53-part-1/18-19/) hoặc `layouts/t53-part-1.idml`. Kiểm tra chữ tiếng Việt, font và ảnh liên kết. Yêu cầu tạo một đường bao Text Wrap trên bản sao trang đôi, lưu INDD và xuất PDF vào `outputs/`. Mở lại bản INDD để kiểm tra đường bao còn chỉnh được, rồi soát chữ tràn, dòng đầu, gáy và số trang trên PDF.

Nếu MCP chưa kết nối, có thể tiếp tục dàn bằng InDesign Desktop và bảng Scripts. [Cách chạy script của dự án](.agents/skills/twp-indesign/references/job.md) · [Tài liệu mã nguồn InDesign MCP](adobe-indesign-mcp/README.md)

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
