export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // ===== CONFIG DUY NHẤT =====
    const BOT_TOKEN = '8711452465:AAE6iG51e8yUBn0Fbt09EeMTckWLpRxN0vs';
    const CHAT_ID = '7384174497';
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwX0yiwRqL9GGWuzFBiufuEoa5VyZDNYahnWhyVhwGxlFWqulWwrioOq8MV8Q95-mUFdw/exec';
    const RESEND_API_KEY = 're_Gq7KcaeK_2ar8XM8RhiQxeyNMgnjpEr2o';

    try {
        const body = req.body;
        const { action, ...data } = body;

        // ========== 1. ĐĂNG KÝ MỚI (LEAD) ==========
        if (!action || action === 'submit-lead') {
            const vnTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
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
                `🎟️ Mã ưu đãi: ${data.promoCode || 'None'}\n` +
                `📝 Kinh nghiệm: ${data.experience || 'Chưa rõ'}\n` +
                `🎯 Mục tiêu: ${data.goal || 'Chưa rõ'}\n` +
                `🆔 Mã đơn: ${data.orderId || 'N/A'}\n\n` +
                `👉 Check Google Sheet & LH khách ngay!`;

            // GỬI SONG SONG
            const promises = [];

            // Telegram
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

            // Google Sheet
            promises.push(
                fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'add-lead',
                        fullname: data.fullname,
                        phone: data.phone,
                        email: data.email,
                        package: data.package,
                        amount: data.amount,
                        promoCode: data.promoCode,
                        orderId: data.orderId,
                        experience: data.experience,
                        goal: data.goal,
                        timestamp: vnTime
                    })
                }).catch(err => console.error('Google Sheet Error:', err))
            );

            // Email
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
                            <p>Chúc mừng bạn đã hành động để gia nhập hành trình <b>21 Ngày Biến Video Thành Tài Sản</b> tại Tanlab.</p>
                            <p><b>Lưu ý:</b> Hãy hoàn tất thanh toán theo hướng dẫn trên website để được kích hoạt tài khoản Skool Pro sớm nhất.</p>
                            <p>Hẹn gặp lại bạn bên trong!</p>
                            <p>-- <br><b>Minh Tấn | Tanlab Advisor</b></p>
                        </div>`
                    })
                }).catch(err => console.error('Email Error:', err))
            );

            await Promise.allSettled(promises);
            return res.status(200).json({ success: true, message: 'Lead captured' });
        }

        // ========== 2. XÁC NHẬN ĐÃ CHUYỂN TIỀN ==========
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

            const promises = [];

            promises.push(
                fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        text: message,
                        reply_markup: {
                            inline_keyboard: [[
                                { text: "✅ ĐÃ NHẬN TIỀN", callback_data: `payok_${data.orderId}` },
                                { text: "❌ CHƯA NHẬN ĐƯỢC", callback_data: `payno_${data.orderId}` }
                            ]]
                        }
                    })
                }).catch(err => console.error('Telegram Error:', err))
            );

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
                        subject: '📩 Chúng tôi đã nhận được thông báo thanh toán của bạn!',
                        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;line-height:1.6;color:#333;">
                            <h2 style="color:#2e7d32;">Xác nhận nhận thông báo thanh toán!</h2>
                            <p>Chào <b>${data.fullname || 'bạn'}</b>,</p>
                            <p>Tanlab đã nhận được thông báo chuyển khoản của bạn cho đơn hàng <b>${data.orderId}</b>.</p>
                            <p><b>Quy trình tiếp theo:</b></p>
                            <ol>
                                <li>Admin sẽ đối soát giao dịch (15 phút - 4 tiếng).</li>
                                <li>Email mời tham gia <b>Skool Pro</b> sẽ được gửi sau khi xác nhận.</li>
                            </ol>
                            <p>Nếu quá 24h chưa nhận link, liên hệ Zalo 0962255861.</p>
                            <p>-- <br><b>Minh Tấn | Tanlab Advisor</b></p>
                        </div>`
                    })
                }).catch(err => console.error('Email Error:', err))
            );

            await Promise.allSettled(promises);
            return res.status(200).json({ success: true, message: 'Payment confirmation sent' });
        }

    } catch (error) {
        console.error('Submission Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
