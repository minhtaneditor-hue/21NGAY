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
            const message = `🔔 CÓ KHÁCH MỚI ĐĂNG KÝ!\n` +
                          `📅 Thời gian: ${vnTime}\n` +
                          `----------------------------\n` +
                          `👤 Họ tên: ${data.fullname || 'Không có'}\n` +
                          `📞 SĐT: ${data.phone || 'Không có'}\n` +
                          `📧 Email: ${data.email || 'Không có'}\n\n` +
                          `👉 Check Google Sheet ngay!`;

            // 1. Gửi Telegram phê duyệt (DÀNH CHO TẤN)
            const telegramUrl = `https://api.telegram.org/bot8753662126:AAHjqwCiSyn50oxIg7ABgebgh_B1tiWNX0E/sendMessage`;
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
                    subject: '🎉 Chào mừng bạn đến với Thử thách 7 Ngày Lên Tay Phó Nháy Cho Người Yêu!',
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                            <h2>Xin chào ${data.fullname || 'bạn'}!</h2>
                            <p>Chúc mừng bạn đã chính thức tham gia vào hành trình biến chiếc điện thoại thành "vũ khí" chụp ảnh đỉnh cao.</p>
                            <p><strong>Ngày hôm nay (Day 0):</strong> Hãy chuẩn bị tâm lý và kiểm tra thiết bị của bạn. Bài học chính thức đầu tiên sẽ được gửi vào sáng mai nhé!</p>
                            <p>Hẹn gặp lại bạn vào sáng mai!</p>
                            <p>-- <br><strong>Minh Tấn</strong></p>
                        </div>
                    `
                })
            });

            return res.status(200).json({ success: true, message: 'Lead captured' });
        }

        // 2. KHÁCH XÁC NHẬN ĐÃ CHUYỂN TIỀN (CONFIRM)
        if (action === 'confirm-payment') {
            const vnTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
            const message = `💰 XÁC NHẬN CHUYỂN TIỀN!\n` +
                          `📅 Thời gian: ${vnTime}\n` +
                          `----------------------------\n` +
                          `👤 Khách: ${data.fullname || 'Không rõ'}\n` +
                          `📞 SĐT: ${data.phone}\n` +
                          `💵 Số tiền: 199.000đ\n\n` +
                          `🔥 Tấn ơi, check ngân hàng ngay nhé!`;

            await fetch(`https://api.telegram.org/bot8753662126:AAHjqwCiSyn50oxIg7ABgebgh_B1tiWNX0E/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: '7384174497', text: message })
            });

            return res.status(200).json({ success: true, message: 'Payment confirmation sent' });
        }

    } catch (error) {
        console.error('Submission Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
