# 21 Ngày Biến Video Thành Tài Sản - VPS Deployment Guide

Dự án này đã được cấu hình để có thể chạy trực tiếp trên VPS Linux thông qua Node.js và Express.

## 1. Yêu cầu hệ thống
- **Node.js**: v18.0.0 trở lên.
- **NPM**: Đi kèm với Node.js.
- **PM2**: (Khuyên dùng) Để chạy ứng dụng dưới nền.

## 2. Cài đặt nhanh trên VPS
1. **Clone dự án**:
   ```bash
   git clone <link-github-cua-ban>
   cd 21NGAY
   ```
2. **Cài đặt thư viện**:
   ```bash
   npm install
   ```
3. **Cấu hình môi trường**:
   - Copy file mẫu: `cp .env.example api/.env`
   - Chỉnh sửa file mật: `nano api/.env`
   - Điền đầy đủ các KEY (Telegram, Resend, FB CAPI, Google Sheet).

## 3. Khởi chạy
### Cách 1: Chạy trực tiếp (để test)
```bash
node server.js
```
### Cách 2: Chạy chuyên nghiệp với PM2
```bash
sudo npm install -g pm2
pm2 start server.js --name "video-advisor"
pm2 save
pm2 startup
```

## 4. Cấu hình Nginx (Reverse Proxy)
Nếu bạn dùng Domain, hãy tạo file config Nginx trỏ vào cổng `3000`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 5. Lưu ý bảo mật
- Tuyệt đối không xóa `.gitignore`.
- Tuyệt đối không push file `api/.env` lên GitHub.
- Thay đổi `PORT` trong file `.env` nếu cần.
