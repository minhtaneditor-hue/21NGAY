# 🚀 Deploy VPS Linux Checklist

Dự án: **21 Ngày Biến Video Thành Tài Sản**

## 1. Phân tích hiện trạng (ĐÃ FIX XONG)
- [x] **Secured Secrets**: Chuyển API Keys sang biến môi trường (.env).
- [x] **Server Ready**: Đã tạo `server.js` để chạy trên Linux.
- [x] **Diagnostics**: Đã thêm mã đăng nhập lỗi chi tiết trong `server.js`.

## 2. HƯỚNG DẪN FIX LỖI TỪNG BƯỚC TRÊN VPS

Nếu Telegram hoặc Email không hoạt động, hãy làm đúng theo các bước sau:

### Bước 1: Kiểm tra phiên bản Node.js
Mở Terminal trên VPS và gõ:
```bash
node -v
```
- **Nếu hiện < v18.0.0**: Bạn phải nâng cấp Node.js. Chạy lệnh:
  `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs`

### Bước 2: Tạo file bí mật (.env)
Vì file này bị Git chặn, bạn phải tự tạo trên VPS:
```bash
cd /đường/dẫn/thư/mục/21NGAY
nano api/.env
```
- Dán nội dung các key (BOT_TOKEN, RESEND_API_KEY,...) vào.
- Ấn `Ctrl + O`, `Enter` để lưu.
- Ấn `Ctrl + X` để thoát.

### Bước 3: Cài đặt lại thư viện
Đảm bảo tất cả thư viện (như Dotenv, Express) đã được cài:
```bash
npm install
```

### Bước 4: Khởi động lại Server
Để Server nhận diện file `.env` mới và code mới:
```bash
pm2 restart all
# Hoặc nếu chạy trực tiếp để xem lỗi:
node server.js
```

### Bước 5: Xem nhật ký lỗi (Logs)
Nếu vẫn không chạy, hãy gõ lệnh này để xem Server đang báo lỗi gì:
```bash
pm2 logs
```

## 3. Thông tin cấu hình (Dành cho Nginx)
Tên miền: **srv-gulrj.server.tld**
Sử dụng file cấu hình: `nginx-video-advisor.conf` đã có sẵn trong dự án.
