export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const update = req.body;
    const BOT_TOKEN = '8711452465:AAE6iG51e8yUBn0Fbt09EeMTckWLpRxN0vs';
    const CHAT_ID = '7384174497';
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxKOFrsrF6AsmHGzXxYDWqEZ0BoOMtfh5aU4tGjbX6Ama_6tL8mIpzFv5rNRMExIv4U/exec';

    try {
        if (!update.callback_query) {
            return res.status(200).json({ ok: true });
        }

        const { id: callbackId, data, message } = update.callback_query;
        const underscoreIndex = data.indexOf('_');
        const action = data.substring(0, underscoreIndex);
        const identifier = data.substring(underscoreIndex + 1);
        const vnTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        const originalText = message?.text || '';
        const messageId = message?.message_id;

        // ========== DUYỆT ĐƠN ==========
        if (action === 'approve') {
            // 1. Phản hồi nút bấm ngay với POPUP thông báo
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    callback_query_id: callbackId, 
                    text: 'Chúc mừng bạn đã sở hữu chiếc vé 21 ngày biến video thành tài sản. Mail của bạn sẽ được kích họat truy cập khóa học ở Skool. Lưu ý: Nếu sau 24h chưa được nhận email kích hoạt liên hệ page để được hỗ trợ',
                    show_alert: true 
                })
            });

            // 2. Cập nhật Sheet
            let sheetOk = false;
            try {
                const gRes = await fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    redirect: 'follow',
                    body: JSON.stringify({ action: 'update-status', phone: identifier, status: 'PAID' })
                });
                const gData = await gRes.json().catch(() => ({}));
                sheetOk = true;
            } catch (e) {
                console.error('Sheet error:', e);
            }

            // 3. EDIT NGAY TRÊN TIN NHẮN CŨ (không gửi mới)
            const newText = originalText
                .replace('⏳ Trạng thái: CHỜ DUYỆT', `✅ ĐÃ DUYỆT - ${vnTime}\n💳 Chờ SePay xác nhận thanh toán...`)
                .replace('🔔 CÓ KHÁCH MỚI ĐĂNG KÝ!', '✅ KHÁCH ĐÃ ĐƯỢC DUYỆT!');

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    message_id: messageId,
                    text: newText
                })
            });
        }

        // ========== HUỶ ĐƠN ==========
        if (action === 'reject') {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ callback_query_id: callbackId, text: '❌ Đã huỷ!' })
            });

            await fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                redirect: 'follow',
                body: JSON.stringify({ action: 'update-status', phone: identifier, status: 'CANCELLED' })
            }).catch(() => {});

            const newText = originalText
                .replace('⏳ Trạng thái: CHỜ DUYỆT', `❌ ĐÃ HUỶ - ${vnTime}`)
                .replace('🔔 CÓ KHÁCH MỚI ĐĂNG KÝ!', '❌ ĐƠN ĐÃ BỊ HUỶ');

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    message_id: messageId,
                    text: newText
                })
            });
        }

        // ========== XÁC NHẬN ĐÃ NHẬN TIỀN (từ SePay) ==========
        if (action === 'payok') {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ callback_query_id: callbackId, text: '✅ Xác nhận!' })
            });

            await fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                redirect: 'follow',
                body: JSON.stringify({ action: 'update-status', orderId: identifier, status: 'PAID' })
            }).catch(() => {});

            const newText = originalText
                .replace('⏳ Chờ admin xác nhận...', `✅ ĐÃ XÁC NHẬN KHỚP LỆNH - ${vnTime}\n👉 Mời học viên vào Skool Pro ngay!`);

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    message_id: messageId,
                    text: newText
                })
            });
        }

        // ========== CHƯA NHẬN TIỀN ==========
        if (action === 'payno') {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ callback_query_id: callbackId, text: '⚠️ Ghi nhận!' })
            });

            const newText = originalText
                .replace('⏳ Chờ admin xác nhận...', `⚠️ CHƯA NHẬN ĐƯỢC TIỀN - ${vnTime}\n🔍 Cần kiểm tra lại ngân hàng.`);

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    message_id: messageId,
                    text: newText
                })
            });
        }

        res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(200).json({ ok: true });
    }
}
