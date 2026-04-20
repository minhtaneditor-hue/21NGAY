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
- Dùng công cụ đọc file (`view_file`) để xem file khung mẫu của người dùng, ĐẶC BIỆT chú ý phần tử ảnh (assets) TRÁNH DÙNG SAI ẢNH LỊCH SỬ.

### Bước 3: Bắt tay vào Viết Code (Implementation)
- Tạo ra thư mục và những file cốt lõi: `index.html`, `style.css`, và `/assets`.
- Viết mã HTML bằng HTML5 Semantic.
- **[BẮT BUỘC] TÍCH HỢP HIỆU ỨNG (MOTION ENGINE)**: Chèn luôn đoạn mã JS `IntersectionObserver` cho Scroll Reveal vào cuối trang web. Gán sẵn các class `.reveal, .reveal-left, .reveal-scale, .stagger-1...` vào bố cục để tạo cảm giác Premium lập tức.
- **[BẮT BUỘC] QUY TẮC CSS (MOBILE-FIRST & AESTHETICS)**:
  - Cấm sử dụng padding container = `0px` trên mobile. Mặc định `padding: 0 16px`.
  - Phục hồi & fix lỗi Tràn kích thước: `.hero-title` font-size phải giảm mạnh trên Mobile (vd: `2.3rem`), ảnh hero (`hero-right`) phải limit width/max-width tránh đẩy ngang khung nền.
  - Ngăn iOS zoom: Mọi tag `<input>`, `<select>` phải áp dụng `font-size: 16px !important`.
  - Nút bấm (Touch targets) trên Mobile: `min-height: 44px`, padding rộng rãi.
  - Box Layout: Đối với giá cả (Pricing) / Timeline / Feedback, khi `< 768px` phải lập tức chuyển thành stack (box dọc), flex-direction: column.

### Bước 4: Tích hợp Hệ thống Tracking & CSDL (Theo Checklist đã học)
- Mặc định phải chuẩn bị sẵn khung `api/submit.js` nếu web có thu phễu. 
- **[LỖI THƯỜNG GẶP - VỀ CAPI FB]**: Đừng bao giờ dính test data hardcode. Gửi qua Conversion API (graph.facebook.com) BẮT BUỘC bỏ dòng `test_event_code` khi đưa vào Live, nếu không sẽ bị miss track quảng cáo thực tế. Dữ liệu đính kèm event phải hash chuẩn SHA256 (cho email, phone).
- **[LỖI THƯỜNG GẶP - VỀ APP SCRIPT]**: Tuyệt đối không tự sửa URL Script của user trong file ẩn nếu không phải yêu cầu chủ động (Gắn qua `.env` mặc định, nếu User yêu cầu "just do it" thì hardcode trực tiếp vào API file để live nhanh nhất có thể).

### Bước 5: Hoàn thiện & Khởi chạy (Review)
- Sau khi viết mã xong, hiển thị kết quả cho người dùng.
- Nêu rõ các thay đổi và hỏi người dùng có muốn chỉnh màu sắc hay khoảng cách độ lớn của thành phần quan trọng nào không. Dặn họ test kỹ độ mượt mà trên Mobile (màn hình nhỏ).
