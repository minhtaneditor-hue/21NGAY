export default async function handler(req, res) {
    // Chỉ cho phép POST request từ Sepay
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // ===== CENTRALIZED CONFIG =====
    const BOT_TOKEN = '8753662126:AAHjqwCiSyn50oxIg7ABgebgh_B1tiWNX0E';
    const CHAT_ID = '7384174497';
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwX0yiwRqL9GGWuzFBiufuEoa5VyZDNYahnWhyVhwGxlFWqulWwrioOq8MV8Q95-mUFdw/exec';

    try {
        const body = req.body;
        
        // Cấu trúc payload từ Sepay:
        // { id, gateway, transactionDate, accountNumber, content, transferType, transferAmount, ... }
        
        // Chỉ xử lý các giao dịch TIỀN VÀO (in)
        if (body.transferType !== 'in') {
            return res.status(200).json({ success: true, message: 'Not an incoming transaction' });
        }

        const content = body.content || '';
        const amount = body.transferAmount || 0;
        const amountFormatted = new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';

        // Tìm Mã đơn hàng trong nội dung chuyển khoản (Regex cho định dạng TANxxxx)
        const orderIdMatch = content.match(/TAN\d+/i);
        const orderId = orderIdMatch ? orderIdMatch[0].toUpperCase() : 'KHÔNG RÕ MÃ';

        const vnTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

        // NỘI DUNG THÔNG BÁO SIÊU NỔI BẬT CHO TẤN
        const telegramMessage = `🔥 TING TING! TIỀN VỀ SẾP ƠI!\n` +
                                `📅 Thời gian: ${vnTime}\n` +
                                `----------------------------\n` +
                                `💰 Số tiền: ${amountFormatted}\n` +
                                `🆔 Mã đơn: ${orderId}\n` +
                                `🏦 Ngân hàng: ${body.gateway || 'N/A'} (${body.accountNumber || 'N/A'})\n` +
                                `📝 Nội dung: ${content}\n` +
                                `----------------------------\n` +
                                `🚀 Tấn ơi, check Skool và mời học viên ngay nhé!`;

        // GỬI SONG SONG: Telegram + Cập nhật Google Sheet
        const telegramPromise = fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                chat_id: CHAT_ID, 
                text: telegramMessage,
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "✅ DUYỆT (PAID)", callback_data: `approve_${orderId}` },
                            { text: "❌ CHƯA KHỚP LỆNH", callback_data: `reject_${orderId}` }
                        ]
                    ]
                }
            })
        }).catch(err => console.error('Telegram Error:', err));

        // Cập nhật trạng thái trong Google Sheet
        const sheetPromise = fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'payment-received',
                orderId: orderId,
                amount: amount,
                gateway: body.gateway,
                content: content,
                timestamp: vnTime
            })
        }).catch(err => console.error('Sheet Error:', err));

        await Promise.allSettled([telegramPromise, sheetPromise]);

        // Sepay yêu cầu trả về success: true và status 200/201
        return res.status(200).json({ success: true, message: 'Webhook processed' });

    } catch (error) {
        console.error('Sepay Webhook Error:', error);
        // Luôn trả về 200 để Sepay không retry liên tục nếu lỗi logic nhỏ, 
        // nhưng vẫn log ra để debug
        return res.status(200).json({ success: false, error: 'Internal Error' });
    }
}
