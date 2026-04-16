export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const BOT_TOKEN = '8711452465:AAE6iG51e8yUBn0Fbt09EeMTckWLpRxN0vs';
    const CHAT_ID = '7384174497';
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwX0yiwRqL9GGWuzFBiufuEoa5VyZDNYahnWhyVhwGxlFWqulWwrioOq8MV8Q95-mUFdw/exec';
    const RESEND_API_KEY = 're_Gq7KcaeK_2ar8XM8RhiQxeyNMgnjpEr2o';

    try {
        const body = req.body;
        const { action, ...data } = body;

        // ========== 1. ĐĂNG KÝ MỚI ==========
        if (!action || action === 'submit-lead') {
            const vnTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
            const packageName = data.package === 'COACHING21DAY' ? '💎 PREMIUM COACHING 1:1' : '📚 KHÓA HỌC 21 NGÀY';
            const amountFormatted = data.amount > 0 ? new Intl.NumberFormat('vi-VN').format(data.amount) + ' VNĐ' : 'Liên hệ tư vấn';

            // CHỈ GỬI 1 TIN NHẮN DUY NHẤT
            const message = `🔔 CÓ KHÁCH MỚI ĐĂNG KÝ!\n` +
                `📅 Thời gian: ${vnTime}\n` +
                `----------------------------\n` +
                `👤 ${data.fullname || 'Không có'}\n` +
                `📞 ${data.phone || 'Không có'}\n` +
                `📧 ${data.email || 'Không có'}\n` +
                `📦 ${packageName}\n` +
                `💰 ${amountFormatted}\n` +
                `🎟️ Mã ưu đãi: ${data.promoCode || 'None'}\n` +
                `📝 Kinh nghiệm: ${data.experience || 'Chưa rõ'}\n` +
                `🎯 Mục tiêu: ${data.goal || 'Chưa rõ'}\n` +
                `🆔 ${data.orderId || 'N/A'}\n` +
                `----------------------------\n` +
                `⏳ Trạng thái: CHỜ DUYỆT`;

            const promises = [];

            // Telegram - 1 tin nhắn duy nhất
            promises.push(
                fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        text: message,
                        reply_markup: {
                            inline_keyboard: [[
                                { text: "✅ DUYỆT (PAID)", callback_data: `approve_${data.phone}` },
                                { text: "❌ HUỶ ĐƠN", callback_data: `reject_${data.phone}` }
                            ]]
                        }
                    })
                }).catch(err => console.error('Telegram Error:', err))
            );

            // Google Sheet - Gửi data KHÔNG có action (Apps Script tự thêm dòng)
            promises.push(
                fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    redirect: 'follow',
                    body: JSON.stringify({
                        fullname: data.fullname,
                        phone: data.phone,
                        email: data.email,
                        package: data.package,
                        amount: data.amount,
                        promoCode: data.promoCode,
                        orderId: data.orderId,
                        experience: data.experience,
                        goal: data.goal,
                        timestamp: vnTime,
                        status: 'PENDING'
                    })
                }).catch(err => console.error('Sheet Error:', err))
            );

            // Email chào mừng
            promises.push(
                fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${RESEND_API_KEY}`
                    },
                    body: JSON.stringify({
                        from: 'Minh Tấn <challenge@minhtanacademy.com>',
                        to: data.email,
                        subject: '🎉 Chào mừng bạn đến với Khóa học 21 Ngày Biến Video Thành Tài Sản!',
                        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;line-height:1.6;color:#333;">
                            <h2 style="color:#f5bc1b;">Xin chào ${data.fullname || 'bạn'}!</h2>
                            <p>Chúc mừng bạn đã gia nhập hành trình <b>21 Ngày Biến Video Thành Tài Sản</b> tại Tanlab.</p>
                            <p><b>Lưu ý:</b> Hoàn tất thanh toán trên website để được kích hoạt Skool Pro.</p>
                            <p>-- <br><b>Minh Tấn | Tanlab Advisor</b></p>
                        </div>`
                    })
                }).catch(err => console.error('Email Error:', err))
            );

            await Promise.allSettled(promises);
            return res.status(200).json({ success: true, message: 'Lead captured' });
        }

        // ========== 2. XÁC NHẬN ĐÃ CHUYỂN TIỀN ==========
        // KHÔNG GỬI TIN NHẮN MỚI - chỉ gửi email cho khách
        if (action === 'confirm-payment') {
            // Chỉ gửi email xác nhận cho khách hàng
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: 'Minh Tấn <challenge@minhtanacademy.com>',
                    to: data.email,
                    subject: '📩 Đã nhận thông báo thanh toán - Đang xử lý!',
                    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;line-height:1.6;color:#333;">
                        <h2 style="color:#2e7d32;">Xác nhận nhận thông báo!</h2>
                        <p>Chào <b>${data.fullname || 'bạn'}</b>,</p>
                        <p>Tanlab đã nhận thông báo chuyển khoản đơn <b>${data.orderId}</b>.</p>
                        <p>Admin sẽ đối soát và gửi link Skool Pro qua email này (15 phút - 4h).</p>
                        <p>Nếu quá 24h chưa nhận, liên hệ Zalo 0962255861.</p>
                        <p>-- <br><b>Minh Tấn | Tanlab Advisor</b></p>
                    </div>`
                })
            }).catch(err => console.error('Email Error:', err));

            return res.status(200).json({ success: true, message: 'Email sent' });
        }

    } catch (error) {
        console.error('Submission Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
