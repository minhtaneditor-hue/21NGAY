export default async function handler(req, res) {
    // Chỉ cho phép POST request từ Sepay
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

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
        const telegramMessage = `✅ TIỀN ĐÃ VỀ! (XÁC THỰC AUTO)\n` +
                                `📅 Thời gian: ${vnTime}\n` +
                                `----------------------------\n` +
                                `💰 Số tiền: ${amountFormatted}\n` +
                                `🆔 Mã đơn: ${orderId}\n` +
                                `🏦 Ngân hàng: ${body.gateway} (${body.accountNumber})\n` +
                                `📝 Nội dung: ${content}\n` +
                                `----------------------------\n` +
                                `🚀 Tấn ơi, check Skool và mời học viên ngay nhé!`;

        // Gửi Telegram cho Tấn
        const telegramUrl = `https://api.telegram.org/bot8711452465:AAE6iG51e8yUBn0Fbt09EeMTckWLpRxN0vs/sendMessage`;
        await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                chat_id: '7384174497', 
                text: telegramMessage,
                parse_mode: 'HTML' // Tùy chọn nếu muốn format bold/italic
            })
        });

        // (Tùy chọn) Ghi log vào Google Sheet hoặc Database tại đây nếu cần
        // ... logic Google Sheet ...

        // Sepay yêu cầu trả về success: true và status 200/201
        return res.status(200).json({ success: true, message: 'Webhook processed' });

    } catch (error) {
        console.error('Sepay Webhook Error:', error);
        // Luôn trả về 200 để Sepay không retry liên tục nếu lỗi logic nhỏ, 
        // nhưng vẫn log ra để debug
        return res.status(200).json({ success: false, error: 'Internal Error' });
    }
}
