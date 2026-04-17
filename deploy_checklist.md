# 🚀 Deploy VPS Linux Checklist

Dự án: **21 Ngày Biến Video Thành Tài Sản**

## 1. Phân tích hiện trạng
- **Ngôn ngữ**: Node.js (Backend) + HTML/CSS/JS (Frontend).
- **Framework**: Express.js wrap Vercel-style Serverless Functions. 
- **Cấu trúc**: Phục vụ Frontend dưới dạng static files và Backend qua API Express.

## 2. Danh sách cần chuẩn bị (ĐÃ FIX XONG)
- [x] **Bảo mật**: Đã tách toàn bộ API Keys, Bot Token ra file `.env`.
- [x] **Quản lý package**: Đã tạo file `package.json` với đầy đủ các thư viện cần thiết.
- [x] **Server VPS**: Đã tạo file `server.js` (Express) để chạy code trên môi trường Linux thay vì Vercel.
- [x] **Hướng dẫn**: Đã tạo file `README.md` hướng dẫn các lệnh cài đặt trên Linux.
- [x] **Cấu hình Git**: Cập nhật `.gitignore` để không đẩy file mật lên GitHub.
- [x] **Hướng dẫn**: Đã tạo file `README.md` với các bước chi tiết.

## 3. Thông tin bí mật (Đã được bảo mật)
Các giá trị sau đã được chuyển vào biến môi trường:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `RESEND_API_KEY`
- `FB_PIXEL_ID`
- `FB_ACCESS_TOKEN`
- `GOOGLE_SHEET_URL`

## 4. Các bước Deploy thực tế cho ngày mai
1. **Cài đặt môi trường**:
   - Cài Node.js (v18+): `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs`
   - Cài PM2: `sudo npm install -g pm2`
2. **Setup Code**:
   - Clone repo: `git clone <your-repo-url>`
   - Cài thư viện: `npm install`
   - Tạo file `.env`: `cp .env.example .env` (Sau đó `nano .env` để điền thông tin thật).
3. **Chạy ứng dụng**:
   - Chạy nền: `pm2 start server.js --name "video-advisor"`
   - Lưu trạng thái: `pm2 save`
   - Tự khởi động cùng hệ thống: `pm2 startup`
4. **Proxy ngược (Nginx)**:
   - Trỏ domain về IP VPS.
   - Dùng Nginx để map port 80/443 vào port 3000.
