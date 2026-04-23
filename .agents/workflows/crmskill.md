---
description: Khởi tạo toàn bộ giao diện và hệ thống Admin CRM (Mobile-first, Google Sheet Backend)
---
Quy trình này giúp bạn tự động triển khai một hệ thống CRM Dashboard chuẩn chuyên gia, bao gồm cả Frontend (Giao diện Admin), Backend (API CAPI, Telegram, Resend) và CSDL (Google Apps Script).

**HƯỚNG DẪN DÀNH CHO AI (AGENT):** Khi người dùng kích hoạt lệnh `/crmskill`, bạn hãy thực hiện NGAY LẬP TỨC theo thứ tự các bước dưới đây để thiết lập hệ thống.

### Bước 1: Khảo sát thông tin dự án
Gửi cho người dùng yêu cầu sau để cấu hình:
1. **Mật khẩu Admin mong muốn:** (Mặc định: \`admin123\`)
2. **Loại sản phẩm/gói dịch vụ:** (Ví dụ: E-learning, Coaching)
3. **Màu sắc chủ đạo Dashboard:** (Ví dụ: Đen - Vàng Gold)
4. **Các trường dữ liệu cần lưu:** (Họ tên, SĐT, Email, Số Tiền, Mã GG, ...)

*(Dừng lại chờ người dùng cung cấp thông tin. Nếu họ nói "Cứ dùng chuẩn cũ", lấy tiêu chuẩn của dự án 21 Ngày).*

### Bước 2: Thiết lập Database (Google Apps Script)
1. Tự động viết file \`google-apps-script.js\` theo chuẩn mạnh nhất:
   - Tham số \`action\` hỗ trợ: \`add-lead\`, \`update-status\`, \`update-fields\`, \`delete-lead\`.
   - Các cột tiêu chuẩn: \`timestamp | fullname | phone | email | package | amount | promoCode | orderId | status | teleMessageId | type | mail_welcome | mail_payment\`.
   - Định dạng output luôn là JSON chuẩn.
2. Báo cho người dùng đem file \`google-apps-script.js\` này qua Google Sheet Deploy thành Web App và lấy URL về thay vào các file API.

### Bước 3: Triển khai Backend API (Nếu dùng Vercel/Node.js)
Tạo ra thư mục \`/api\` với các file sau:
1. **\`api/submit.js\`**: 
   - Hứng data form -> Gắn Telegram Bot báo khách mới -> Đẩy vào FB CAPI (Conversions API xử lý SHA256) -> Lưu về Sheet.
2. **\`api/admin.js\`**: 
   - Kiểm tra Token/Password và Fetch data GET từ Apps Script về để hiển thị lên bảng.
3. **\`api/admin-actions.js\`**:
   - Xử lý các logic gửi manual Email (Resend), Cập nhật trạng thái Payment, Đổi phân loại Gói và Xóa Lead.

### Bước 4: Triển khai Frontend Admin (admin.html)
Xây dựng trang \`admin.html\` hoàn chỉnh với các đặc tả MỚI NHẤT:
- **UI/UX Cơ bản:** Dark theme, Topbar dính trên cùng với 4 thông số (Tổng, Đã thu, Đợi duyệt, Doanh thu).
- **Desktop Table:** Hiển thị lưới bảng truyền thống, rõ ràng, trạng thái màu sắc chuẩn (PAID = xanh, PENDING = vàng, CANCEL = đỏ).
- **Mobile-first (Card View):** Trên màn hình `< 600px`, ẩn Table đi thay bằng dạng Thẻ (Card). Tối gọn các nút thao tác thành icon.
- **Tính năng bắt buộc:** 
  - Nút **Welcome Email**, **Nhắc Payment** (gửi qua Resend).
  - Nút **Delete Lead** (xóa thẳng từ Sheet).
  - Tự động check JS: Cảnh báo `⚠️ Quá 30p chưa thanh toán` bằng chữ đỏ chớp nháy ở row đối với trạng thái PENDING.

### Bước 5: Kiểm tra và Bàn Giao
1. Nhắc người dùng thêm biến môi trường (Environment Variables) vào Vercel (nếu có dùng): `TELEGRAM_BOT_TOKEN`, `RESEND_API_KEY`, `FB_PIXEL_ID`, `FB_ACCESS_TOKEN`, `ADMIN_PASSWORD`.
2. Hướng dẫn người truy cập vào `/admin.html` để kiểm tra.
