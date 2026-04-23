import templates from './emails.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL;

    try {
        const body = req.body;

        if (body.transferType !== 'in') {
            return res.status(200).json({ success: true });
        }

        const content = body.content || '';
        const amount = body.transferAmount || 0;
        const amountFormatted = new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
        const orderIdMatch = content.match(/TAN\d+/i);
        const orderId = orderIdMatch ? orderIdMatch[0].toUpperCase() : 'KHÔNG RÕ MÃ';
        const vnTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

        // 1 TIN NHẮN DUY NHẤT với nút xác nhận
        const telegramMessage = `💰 TIỀN ĐÃ VỀ TỰ ĐỘNG!\n` +
            `📅 ${vnTime}\n` +
            `----------------------------\n` +
            `💵 ${amountFormatted}\n` +
            `🆔 ${orderId}\n` +
            `🏦 ${body.gateway || 'N/A'} (${body.accountNumber || 'N/A'})\n` +
            `📝 Nội dung: ${content}\n` +
            `----------------------------\n` +
            `⏳ Chờ admin xác nhận...`;

        // 1. Tìm thông tin khách từ Sheet để tự động kích hoạt
        let customer = null;
        try {
            const sheetRes = await fetch(GOOGLE_SHEET_URL, { method: 'GET', redirect: 'follow' });
            const sheetData = await sheetRes.json();
            if (sheetData.status === 'ok' && sheetData.data) {
                customer = sheetData.data.find(r => r.orderId === orderId);
            }
        } catch (e) { console.error('Sheet Fetch Error:', e); }

        const promises = [];
        const RESEND_API_KEY = process.env.RESEND_API_KEY;

        if (customer && customer.email) {
            // ======== LUỒNG TỰ ĐỘNG CHUẨN ELITE ========
            
            // 1. Gửi Email Kích hoạt Skool Pro ngay lập tức
            if (RESEND_API_KEY) {
                const emailData = templates.skoolInvite(customer.fullname);
                promises.push(
                    fetch('https://api.resend.com/emails', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${RESEND_API_KEY}`
                        },
                        body: JSON.stringify({
                            from: 'Minh Tấn <challenge@minhtanacademy.com>',
                            to: customer.email,
                            subject: emailData.subject,
                            html: emailData.html
                        })
                    }).catch(err => console.error('Auto Activation Email Error:', err))
                );
            }

            // 2. Cập nhật Google Sheet sang trạng thái PAID
            promises.push(
                fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    redirect: 'follow',
                    body: JSON.stringify({
                        action: 'update-status',
                        orderId: orderId,
                        status: 'PAID'
                    })
                }).catch(err => console.error('Auto Sheet Update Error:', err))
            );

            // 3. Thông báo Telegram: ĐÃ XỬ LÝ XONG (Không cần Admin bấm nút)
            const successMsg = `✅ HỆ THỐNG ĐÃ TỰ ĐỘNG KÍCH HOẠT!\n` +
                `📅 ${vnTime}\n` +
                `----------------------------\n` +
                `👤 Khách hàng: ${customer.fullname}\n` +
                `📧 Email: ${customer.email}\n` +
                `💵 Số tiền: ${amountFormatted}\n` +
                `🆔 Mã đơn: ${orderId}\n` +
                `✨ Trạng thái: Đã gửi Link Skool & Cập nhật Sheet.`;

            promises.push(
                fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        text: successMsg,
                        reply_to_message_id: customer.teleMessageId
                    })
                }).catch(err => console.error('Telegram Success Notice Error:', err))
            );

        } else {
            // ======== TRƯỜNG HỢP KHÔNG TÌM THẤY DỮ LIỆU ĐƠN HÀNG ========
            const errorMsg = `⚠️ CÓ TIỀN VỀ NHƯNG KHÔNG RÕ THÔNG TIN KHÁCH!\n` +
                `📅 ${vnTime}\n` +
                `----------------------------\n` +
                `💵 Số tiền: ${amountFormatted}\n` +
                `🆔 Mã đơn nhận diện: ${orderId}\n` +
                `📝 Nội dung: ${content}\n` +
                `----------------------------\n` +
                `🔍 Admin hãy kiểm tra lại Sheet thủ công!`;

            promises.push(
                fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        text: errorMsg
                    })
                }).catch(err => console.error('Telegram Error Notice Error:', err))
            );
        }

        await Promise.allSettled(promises);
        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Sepay Error:', error);
        return res.status(200).json({ success: false });
    }
}
