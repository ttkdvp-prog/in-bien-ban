# HƯỚNG DẪN TOÀN TẬP: CHẾ TẠO HỆ THỐNG IN ẤN TÙY CHỈNH CHO APPSHEET QUA API

Phương pháp sử dụng Google Apps Script (làm API) kết hợp với Vercel (làm Hosting HTML tĩnh) là giải pháp **miễn phí 100%**, cực kỳ mạnh mẽ, giúp bạn tạo ra những mẫu in ấn hành chính phức tạp (A4, Header/Footer, Khung chữ ký chéo, viền bảng) mà tính năng mặc định của AppSheet không thể làm đẹp được.

Dưới đây là trọn bộ quy trình "từ A đến Z" để bạn có thể tự mình tái tạo lại hệ thống này cho bất cứ App nào khác trong tương lai.

---

## BƯỚC 1: Xây dựng Cỗ máy API (Google Apps Script)
*Mục đích: Biến file Google Sheets của bạn thành một kho dữ liệu mở, sẵn sàng nhả dữ liệu (dưới dạng JSON) ra ngoài Internet khi có người đưa đúng ID.*

1. **Mở Google Sheets** chứa dữ liệu AppSheet của app mới.
2. Từ menu, chọn **Tiện ích mở rộng (Extensions)** -> **Apps Script**.
3. Xóa hết code cũ, viết hàm `doGet(e)` như sau (Bạn có thể copy form mẫu ở dưới):
   ```javascript
   function doGet(e) {
     var id = e.parameter.id;
     if (!id) return ContentService.createTextOutput("Lỗi thiếu ID");
     
     var ss = SpreadsheetApp.getActiveSpreadsheet();
     var dataParent = ss.getSheetByName("Tên_Bảng_Cha").getDataRange().getValues();
     
     var parentRecord = {};
     // Quét vòng lặp tìm dòng có chứa ID trùng khớp, sau đó map Tên Cột với Dữ liệu
     // ... (Xem lại file schema_appscript.gs của tôi để copy đoạn code quyét quét siêu chuẩn) ...
     
     // Làm tương tự với bảng con (Ví dụ: ChiTietVatTu) để tóm cổ các bản ghi con.
     
     var result = {
       PhieuChinh: parentRecord,
       DanhSachCon: childRecords
     };
     
     // Trả kết quả ra màn hình dưới dạng chuẩn JSON
     return ContentService.createTextOutput(JSON.stringify(result))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```
4. **Triển khai (Deploy):**
   - Góc phải trên, bấm **Deploy** -> **New deployment**.
   - Cắm biểu tượng răng cưa chọn **Web App**.
   - Cấu hình bắt buộc: `Execute as: Me` và `Who has access: Anyone`.
   - Bấm **Deploy**. Copy lấy cái **Web app URL** (Lưu ra Notepad).

---

## BƯỚC 2: Thiết kế giao diện In ấn (HTML/CSS/JS)
*Mục đích: Thiết kế tờ giấy A4 trên nền web, nơi sẽ hứng dữ liệu chạy về từ cái link API bên trên.*

1. Tạo một thư mục trên máy tính, tạo file `form_in.html`.
2. **Dựng khung CSS chuẩn A4 Hành chính:**
   ```css
   @page { size: A4; margin: 0; } /* Triệt tiêu dòng ngày tháng & số trang của trình duyệt */
   .a4-page {
       width: 210mm;
       min-height: 297mm; /* Chiều cao A4 */
       padding: 20mm; /* Lề 20mm chuẩn nhà nước */
       box-sizing: border-box;
       background: white;
   }
   ```
3. **Tạo khung gắn thẻ (HTML):**
   Chỗ nào cần điền chữ trên tờ giấy, bạn thả thẻ `<span>` có `id` tương ứng vào đó.
   *Ví dụ: `Hôm nay, ông <span id="TenNhanVien">...</span> đã đi sửa trạm...`*

4. **Nối đường cáp dữ liệu (JavaScript):**
   Viết script móc lấy cái ID từ Thanh địa chỉ của trình duyệt, gọi điện tới đường link API (Bước 1), lấy data về và chèn vào các ID tương ứng.
   ```javascript
   window.onload = function() {
       // 1. Lấy ID trên URL (VD: form_in.html?id=123A)
       const params = new URLSearchParams(window.location.search);
       const id = params.get('id');

       // 2. Châm ngòi lấy dữ liệu từ Google Sheets
       const GAS_URL = "DÁN_LINK_WEB_APP_URL_Ở_BƯỚC_1_VÀO_ĐÂY";
       
       fetch(GAS_URL + "?id=" + id)
           .then(response => response.json())
           .then(data => {
               // 3. Tưới dữ liệu vào các ô trống trên trang
               document.getElementById("TenNhanVien").innerText = data.PhieuChinh.TenNhanVien;
               // Dùng vòng lặp forEach để tạo dòng <tr> cho Bảng dữ liệu con...
           });
   }
   ```

---

## BƯỚC 3: Đưa Trang In lên Vũ Trụ (GitHub & Vercel)
*Mục đích: Ném file HTML trên ổ cứng máy bạn lên thành 1 trang web công cộng.*

1. **GitHub:** Đẩy thư mục code của bạn (có file `form_in.html`) lên GitHub bằng lệnh:
   ```bash
   git init
   git add .
   git commit -m "Khoi tao"
   git push origin main
   ```
2. **Vercel:** Đăng nhập Vercel (bằng acc GitHub). Bấm **Add New Project**. Chọn mỏ code bạn vừa đẩy lên. Bấm Deploy.
3. Chờ 30 giây, Vercel sẽ vứt cho bạn một cái link miễn phí xịn xò (VD: `https://in-phieu.vercel.app`).
4. **Link cuối cùng** để gọi được tờ giấy in sẽ có dạng: `https://in-phieu.vercel.app/form_in.html?id=`

---

## BƯỚC 4: Lắp Cò súng vào AppSheet (Thao tác cuối cùng)
*Mục đích: Tạo 1 nút bấm lơ lửng, hễ nhân viên bấm vào là AppSheet lập tức đẩy cái mã Phiếu đang xem móc vào sau cái "Link cuối cùng" kia rồi mở tab trình duyệt.*

1. Mở editor AppSheet -> Tab **Actions**.
2. Ấn **New Action**:
   - `For a record of this table`: Chọn bảng cha (VD: `BienBanSuCo`).
   - `Do this`: Chọn **External: go to a website**.
   - `Target`: Gõ chính xác công thức sau:
     ```
     CONCATENATE("https://in-phieu.vercel.app/form_in.html?id=", [Tên_Cột_Khoá_Chính])
     ```
   - *Lưu ý quan trọng: AppSheet bắt buộc phải bao bọc bằng hàm `CONCATENATE` để nối được chuỗi Web của Vercel với giá trị thực của cái cột khóa chỉnh.*
3. Tuỳ chỉnh biểu tượng (Icon) thành hình cái Máy In (Print) cho đẹp mắt.
4. Bấm **Save** trên AppSheet.

### 🎉 CHÚC MỪNG! HỆ THỐNG CỦA BẠN ĐÃ HOÀN TẤT
Từ giờ, luồng đi sẽ như sau:
`Nhân viên tạo phiếu` -> `Ấn Save` -> `Đợi AppSheet cuộn mũi tên đồng bộ Data lên Google Sheets` -> `Nhân viên bấm nút In báo cáo` -> `AppSheet búng mã ID sang Vercel` -> `Vercel chạy ra lệnh cho Apps Script` -> `Apps Script lục tìm Google Sheets rồi nhổ data ném lại cho Vercel` -> `Vercel trổ các ký tự vào khung HTML A4 và ném vào mặt nhân viên trên trình duyệt điện thoại/máy tính`. Toàn bộ hành trình chỉ mất khoảng 2-3 giây.
