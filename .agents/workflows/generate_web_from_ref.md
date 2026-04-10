---
description: Tạo web mới cực nhanh dựa trên Ref và Khung Mẫu đã có
---
Quy trình này giúp bạn tự động sinh ra một trang web/landing page hoàn chỉnh bằng cách dựa trên một tài liệu tham khảo (Ref) và một khung mẫu (Template structural) mà bạn cung cấp.

**HƯỚNG DẪN DÀNH CHO AI (AGENT):** Khi người dùng kích hoạt workflow này, bạn (AI) hãy tuân thủ chính xác các bước dưới đây.

### Bước 1: Thu thập thông tin đầu vào (Input)
Ngay lập tức, bạn hãy gửi cho người dùng bảng form dưới đây và chờ họ điền thông tin:

Vui lòng cung cấp các thông tin sau để mình tiến hành tạo web:
- **[1] Link tham khảo (Ref):** URL hoặc ảnh của trang web bạn thấy đẹp để mình học hỏi phong cách (Layout, Màu sắc).
- **[2] Khung mẫu (Template):** Đường dẫn tới file thiết kế (HTML/CSS cũ) hoặc mô tả cấu trúc các Section.
- **[3] Nội dung Text:** Tiêu đề chính, Tên sản phẩm, Tên chuyên gia, và nội dung các phần.
- **[4] Form & Nút bấm (CTA):** Yêu cầu cho nút bấm và form đăng ký (Ví dụ: Dữ liệu gửi về đâu?).

*(Dừng lại và chờ người dùng trả lời Bước 1 trước khi tiến hành).*

### Bước 2: Phân tích Dữ liệu tham khảo (Research)
- Tự động sử dụng công cụ đọc URL hoặc mở trình duyệt (browser tool / read_url_content) để đọc nội dung từ link Ref của người dùng.
- Trích xuất được cấu trúc: Màu sắc chủ đạo, Typography, Hiệu ứng (Animations/Hover) và cách bố trí thông tin.
- Dùng công cụ đọc file (`view_file`) để xem file khung mẫu của người dùng.

### Bước 3: Bắt tay vào Viết Code (Implementation)
- Tạo ra thư mục và những file cốt lõi: `index.html`, `style.css`, và `/assets`.
- Viết mã HTML bằng HTML5 Sementic dựa theo nội dung văn bản mà người dùng đã cung cấp ở Bước 1.
- Viết CSS hoàn chỉnh (không dùng CSS inline, dùng design system với vars nếu được). Áp dụng phong cách thị giác đã học hỏi được từ Bước 2. Cần đặc biệt chú ý đến:
  - Giao diện phải mang tính "Premium", Responsive (Mobile / Desktop).
  - Thêm các Micro-animations.

### Bước 4: Hoàn thiện & Khởi chạy (Review)
- Sau khi viết mã xong, hiển thị kết quả cho người dùng.
- Nêu rõ các thay đổi và hỏi người dùng có muốn chỉnh màu sắc hay khoảng cách (padding/margin) chỗ nào không.
