export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const BOT_TOKEN = '8711452465:AAE6iG51e8yUBn0Fbt09EeMTckWLpRxN0vs';
    const CHAT_ID = '7384174497';
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwX0yiwRqL9GGWuzFBiufuEoa5VyZDNYahnWhyVhwGxlFWqulWwrioOq8MV8Q95-mUFdw/exec';

    try {
        const body = req.body;

        if (body.transferType !== 'in') {
            return res.status(200).json({ success: true, message: 'Not an incoming transaction' });
        }

        const content = body.content || '';
        const amount = body.transferAmount || 0;
        const amountFormatted = new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
        const orderIdMatch = content.match(/TAN\d+/i);
        const orderId = orderIdMatch ? orderIdMatch[0].toUpperCase() : 'KHÔNG RÕ MÃ';
        const vnTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

        const telegramMessage = `✅ TIỀN ĐÃ VỀ! (XÁC THỰC AUTO)\n` +
            `📅 Thời gian: ${vnTime}\n` +
            `----------------------------\n` +
            `💰 Số tiền: ${amountFormatted}\n` +
            `🆔 Mã đơn: ${orderId}\n` +
            `🏦 Ngân hàng: ${body.gateway || 'N/A'} (${body.accountNumber || 'N/A'})\n` +
            `📝 Nội dung: ${content}\n` +
            `----------------------------\n` +
            `🚀 Tấn ơi, check Skool và mời học viên ngay nhé!`;

        const promises = [];

        // Telegram
        promises.push(
            fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: telegramMessage
                })
            }).catch(err => console.error('Telegram Error:', err))
        );

        // Ghi vào Google Sheet
        promises.push(
            fetch(GOOGLE_SHEET_URL, {
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
            }).catch(err => console.error('Sheet Error:', err))
        );

        await Promise.allSettled(promises);
        return res.status(200).json({ success: true, message: 'Webhook processed' });

    } catch (error) {
        console.error('Sepay Webhook Error:', error);
        return res.status(200).json({ success: false, error: 'Internal Error' });
    }
}
