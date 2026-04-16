export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const BOT_TOKEN = '8711452465:AAE6iG51e8yUBn0Fbt09EeMTckWLpRxN0vs';
    const CHAT_ID = '7384174497';
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwmVkwXNM3ohKMk9exR0ht7l9TwTOBdnueTbbKoXmksDGv4vFsMOn0-OYCfN8Z1Zmw1/exec';

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

        // Tìm teleMessageId từ Sheet để GOM BOX (Reply vào tin nhắn Lead)
        let teleMessageId = null;
        try {
            const sheetRes = await fetch(GOOGLE_SHEET_URL, { method: 'GET', redirect: 'follow' });
            const sheetData = await sheetRes.json();
            if (sheetData.status === 'ok' && sheetData.data) {
                const row = sheetData.data.find(r => r.orderId === orderId);
                teleMessageId = row?.teleMessageId;
            }
        } catch (e) { console.error('Sheet Fetch Error:', e); }

        const promises = [];

        // 1 TIN NHẮN DUY NHẤT với nút xác nhận (GOM BẰNG REPLY)
        promises.push(
            fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: telegramMessage,
                    reply_to_message_id: teleMessageId, // GOM THEO LEAD
                    reply_markup: {
                        inline_keyboard: [[
                            { text: "✅ KHỚP LỆNH", callback_data: `payok_${orderId}` },
                            { text: "❌ KHÔNG KHỚP", callback_data: `payno_${orderId}` }
                        ]]
                    }
                })
            }).catch(err => console.error('Telegram Error:', err))
        );

        // Ghi vào Sheet
        promises.push(
            fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                redirect: 'follow',
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
        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Sepay Error:', error);
        return res.status(200).json({ success: false });
    }
}
