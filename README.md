# Hướng dẫn trọn bộ: Cấu hình AppSheet & Deploy Dự án lên Vercel

Dự án này cung cấp Giải pháp in ấn Báo cáo Sự Cố Hạ tầng bằng HTML tĩnh. Để hệ thống hoạt động xuyên suốt từ Ứng dụng điện thoại (Appsheet) lên trình duyệt Web không lo bị sập mạng, vui lòng làm theo hướng dẫn 3 bước sau:

---

## Bước 1: Viết công thức Action trên AppSheet

Để nút bấm trên AppSheet tự động nhảy sang trang Web In của bạn và truyền dữ liệu thông qua ID, tiến hành cấu hình tại menu Action:

1. Vào AppSheet > Trình đơn **Actions** (nằm bên tay trái).
2. Tại bảng **BienBanSuCo**, tạo một Action mới (Add Action).
3. Điền các thuộc tính như sau:
   - **Action Name:** In Báo Cáo.
   - **For a record of this table:** `BienBanSuCo`.
   - **Do this:** Chọn `App: Go to a website`.
   - **Target:** Sử dụng bộ Formula gộp chuỗi chuẩn như sau:
     ```text
     CONCATENATE("https://hd-tram.vercel.app/form_in.html?id=", [Id_BienBan])
     ```
     *(Lưu ý: Domain thực tế có dạng `hd-tram.vercel.app`, nhớ giữ nguyên đuôi `/form_in.html?id=`).*
   - **Appearance:** Chọn icon dạng máy in (Print). Display in Overlay hoặc Prominently tuỳ ý bạn.

---

## Bước 2: Đẩy Source Code này lên GitHub

Do Vercel triển khai mã nguồn qua nền tảng Git, bạn cần đưa toàn bộ thư mục thư mục `d:\OneDrive - VNPT\AI\new` (chứa file Html, json, gs) lên một kho lưu trữ (Repository) trên GitHub bằng các lệnh Terminal/CMD:

```bash
# 1. Khởi tạo kho lưu trữ Git cục bộ
git init

# 2. Đổi nhánh chính sang main (chuẩn của GitHub)
git branch -M main

# 3. Thêm các file form_in.html, schema.json, appscript theo dõi
git add .
git commit -m "Khoi tao he thong form in Bien ban Su co"

# 4. Trỏ URL về Kho GitHub của bạn (Nhớ phải tạo trước 1 repo trống trên github.com)
git remote add origin https://github.com/<ten_user_cua_ban>/<ten_repo_cua_ban>.git

# 5. Bắn mã nguồn lên Server
git push -u origin main
```

---

## Bước 3: Deploy lên Vercel không dính lỗi (Build Error)

Vì đây là dự án dùng **HTML/JS tĩnh 100%** (Vanilla Web) chứ không sử dụng các Framework yêu cầu Node.js (như ReactJS, Vue, Next...), nên nếu cấu hình sai trình dịch, Vercel sẽ báo lỗi `Error: npm build failed`. Thực hiện cấu hình đúng chuẩn thiết lập nội dung tĩnh:

1. Đăng nhập vào [Vercel Dashboard](https://vercel.com/dashboard) và nhấn **Add New Project**.
2. Tại mục **Import Git Repository**, chọn Repositoty chứa form bạn vừa push ở Bước 2.
3. Khi ở màn hình **Configure Project** trước nút Deploy, cực kỳ lưu ý các điểm sau để **chống lỗi cấu hình Build**:
   - **Framework Preset**: Bắt buộc sổ xuống và chọn **`Other`** (Tuyệt đối không chọn Next.js/Vite, khi chọn Other, Vercel tự động nhận diện đây là Static Deployment).
   - **Build Command**: Tắt ghi đè (Để trống).
   - **Output Directory**: Tắt ghi đè (Để trống).
   - **Install Command**: Tắt ghi đè (Để trống).
4. Nhấn **Deploy**. Quá trình sẽ diễn ra chỉ trong vòng 3 đến 5 giây lập tức hoàn thành.
5. Copy đường dẫn kết quả (Ví dụ: `https://my-app-nine-eta.vercel.app`) rồi mang dán thay thế vào công thức ở **Bước 1**.

Chúc mừng bạn đã sở hữu một Server in ấn báo cáo sự cố miễn phí hoàn toàn trọn đời với tốc độ nhanh nhất!
