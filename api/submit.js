export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const body = req.body;
        const { action, ...data } = body;

        // 1. NGƯỜI DÙNG ĐĂNG KÍ (LEAD)
        if (!action || action === 'submit-lead') {
            const vnTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
            
            // Format package name for readability
            const packageName = data.package === 'COACHING21DAY' ? '💎 PREMIUM COACHING 1:1' : '📚 KHÓA HỌC 21 NGÀY';
            const amountFormatted = data.amount > 0 ? new Intl.NumberFormat('vi-VN').format(data.amount) + ' VNĐ' : 'Liên hệ tư vấn';

            const message = `🔔 CÓ KHÁCH MỚI ĐĂNG KÝ!\n` +
                          `📅 Thời gian: ${vnTime}\n` +
                          `----------------------------\n` +
                          `👤 Họ tên: ${data.fullname || 'Không có'}\n` +
                          `📞 SĐT: ${data.phone || 'Không có'}\n` +
                          `📧 Email: ${data.email || 'Không có'}\n` +
                          `📦 Gói chọn: ${packageName}\n` +
                          `💰 Giá: ${amountFormatted}\n` +
                          `🎟️ Mã ưu đãi: ${data.promoCode || 'Không có'}\n` +
                          `📝 Kinh nghiệm: ${data.experience || 'Chưa rõ'}\n` +
                          `🎯 Mục tiêu: ${data.goal || 'Chưa rõ'}\n` +
                          `🆔 Mã đơn: ${data.orderId || 'N/A'}\n\n` +
                          `👉 Check Google Sheet & LH khách ngay!`;

            // 1. Gửi Telegram phê duyệt (DÀNH CHO TẤN)
            const telegramUrl = `https://api.telegram.org/bot8711452465:AAE6iG51e8yUBn0Fbt09EeMTckWLpRxN0vs/sendMessage`;
            await fetch(telegramUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    chat_id: '7384174497', 
                    text: message,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "✅ DUYỆT (PAID)", callback_data: `approve_${data.phone}` },
                                { text: "❌ HUỶ ĐƠN", callback_data: `reject_${data.phone}` }
                            ]
                        ]
                    }
                })
            });

            // Google Sheet
            const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwX0yiwRqL9GGWuzFBiufuEoa5VyZDNYahnWhyVhwGxlFWqulWwrioOq8MV8Q95-mUFdw/exec';
            await fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            // GỬI EMAIL CHÀO MỪNG (DAY 0) QUA RESEND
            const RESEND_API_KEY = 're_Gq7KcaeK_2ar8XM8RhiQxeyNMgnjpEr2o';
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: 'Minh Tấn <challenge@minhtanacademy.com>',
                    to: data.email,
                    subject: '🎉 Chào mừng bạn đến với Khóa học 21 Ngày Biến Video Thành Tài Sản!',
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333;">
                            <h2 style="color: #f5bc1b;">Xin chào ${data.fullname || 'bạn'}!</h2>
                            <p>Chúc mừng bạn đã hành động để gia nhập hành trình <b>21 Ngày Biến Video Thành Tài Sản</b> tại Tanlab.</p>
                            <p>Đây là bước đệm để sở hữu kỹ năng xây dựng cỗ máy thu nhập tự động từ Video nhắn.</p>
                            <p><b>Lưu ý quan trọng:</b> Hãy hoàn tất thanh toán theo hướng dẫn trên website để được kích hoạt tài khoản Skool Pro sớm nhất.</p>
                            <p>Hẹn gặp lại bạn bên trong!</p>
                            <p>-- <br><b>Minh Tấn | Tanlab Advisor</b></p>
                        </div>
                    `
                })
            });

            return res.status(200).json({ success: true, message: 'Lead captured' });
        }

        // 2. KHÁCH XÁC NHẬN ĐÃ CHUYỂN TIỀN (CONFIRM)
        if (action === 'confirm-payment') {
            const vnTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
            const amountFormatted = new Intl.NumberFormat('vi-VN').format(data.amount) + ' VNĐ';
            
            const message = `💰 XÁC NHẬN CHUYỂN TIỀN!\n` +
                          `📅 Thời gian: ${vnTime}\n` +
                          `----------------------------\n` +
                          `👤 Khách: ${data.fullname || 'Không rõ'}\n` +
                          `📞 SĐT: ${data.phone}\n` +
                          `💵 Số tiền: ${amountFormatted}\n` +
                          `🆔 Mã đơn: ${data.orderId}\n` +
                          `----------------------------\n` +
                          `🔥 Tấn ơi, check ngân hàng ngay nhé!`;

            await fetch(`https://api.telegram.org/bot8711452465:AAE6iG51e8yUBn0Fbt09EeMTckWLpRxN0vs/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    chat_id: '7384174497', 
                    text: message,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "✅ ĐÃ NHẬN TIỀN", callback_data: `payok_${data.orderId}` },
                                { text: "❌ CHƯA NHẬN ĐƯỢC", callback_data: `payno_${data.orderId}` }
                            ]
                        ]
                    }
                })
            });

            // GỬI EMAIL XÁC NHẬN ĐÃ GỬI BÁO CÁO (EMAIL SỐ 2)
            const RESEND_API_KEY = 're_Gq7KcaeK_2ar8XM8RhiQxeyNMgnjpEr2o';
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: 'Minh Tấn <challenge@minhtanacademy.com>',
                    to: data.email,
                    subject: '📩 Chúng tôi đã nhận được thông báo thanh toán của bạn!',
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333;">
                            <h2 style="color: #2e7d32;">Xác nhận nhận thông báo thanh toán!</h2>
                            <p>Chào <b>${data.fullname || 'bạn'}</b>,</p>
                            <p>Tanlab đã nhận được thông báo chuyển khoản của bạn cho đơn hàng <b>${data.orderId}</b>.</p>
                            <p><b>Quy trình tiếp theo:</b></p>
                            <ol>
                                <li>Admin (Minh Tấn) sẽ đối soát giao dịch với ngân hàng (thông thường từ 15 phút đến 4 tiếng làm việc).</li>
                                <li>Sau khi xác nhận khớp lệnh, một email mời tham gia vào cộng đồng <b>Skool Pro</b> sẽ được gửi trực tiếp đến hộp thư này.</li>
                                <li>Bạn chỉ cần nhấn vào link trong email đó để bắt đầu học tập ngay.</li>
                            </ol>
                            <p>Nếu quá 24h bạn vẫn chưa nhận được link mời, vui lòng liên hệ Zalo 0962255861 để được hỗ trợ gấp.</p>
                            <p>Cảm ơn sự kiên nhẫn của bạn!</p>
                            <p>-- <br><b>Minh Tấn | Tanlab Advisor</b></p>
                        </div>
                    `
                })
            });

            return res.status(200).json({ success: true, message: 'Payment confirmation sent' });
        }

    } catch (error) {
        console.error('Submission Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
