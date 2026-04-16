export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const update = req.body;
    const BOT_TOKEN = '8711452465:AAE6iG51e8yUBn0Fbt09EeMTckWLpRxN0vs';
    const CHAT_ID = '7384174497';
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwX0yiwRqL9GGWuzFBiufuEoa5VyZDNYahnWhyVhwGxlFWqulWwrioOq8MV8Q95-mUFdw/exec';

    try {
        if (!update.callback_query) {
            return res.status(200).json({ ok: true });
        }

        const { id: callbackId, data, message } = update.callback_query;
        const underscoreIndex = data.indexOf('_');
        const action = data.substring(0, underscoreIndex);
        const identifier = data.substring(underscoreIndex + 1);
        const vnTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

        // ===== TRÍCH XUẤT DỮ LIỆU TỪ TIN NHẮN GỐC =====
        // Khi bấm nút, Telegram gửi kèm message gốc (text chứa thông tin khách)
        const originalText = message?.text || '';
        
        // Parse các trường từ message gốc
        function extractField(text, prefix) {
            const regex = new RegExp(prefix + '\\s*(.+)');
            const match = text.match(regex);
            return match ? match[1].trim() : '';
        }

        const customerName = extractField(originalText, '👤 Họ tên:') || extractField(originalText, '👤 Khách:');
        const customerPhone = extractField(originalText, '📞 SĐT:');
        const customerEmail = extractField(originalText, '📧 Email:');
        const packageInfo = extractField(originalText, '📦 Gói chọn:');
        const priceInfo = extractField(originalText, '💰 Giá:') || extractField(originalText, '💵 Số tiền:');
        const orderId = extractField(originalText, '🆔 Mã đơn:');

        // Hàm xoá nút bấm (tránh bấm lại)
        async function removeButtons() {
            if (message?.message_id) {
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageReplyMarkup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        message_id: message.message_id,
                        reply_markup: { inline_keyboard: [] }
                    })
                }).catch(() => {});
            }
        }

        // ========== DUYỆT ĐƠN ĐĂNG KÝ ==========
        if (action === 'approve') {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ callback_query_id: callbackId, text: '⏳ Đang xử lý duyệt...' })
            });

            // Cập nhật Google Sheet
            let sheetOk = false;
            try {
                const gRes = await fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'update-status', phone: identifier, status: 'PAID' })
                });
                const gData = await gRes.json();
                sheetOk = gData.status === 'updated';
            } catch (e) {
                console.error('Sheet error:', e);
            }

            const statusIcon = sheetOk ? '✅' : '⚠️';
            const statusText = sheetOk
                ? 'Đã cập nhật Sheet & Gửi Email link Skool!'
                : 'Cập nhật Sheet thất bại, cần check thủ công!';

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: `🔥 TING TING! TIỀN VỀ SẾP ƠI!\n` +
                        `👤 Khách hàng: ${customerName}\n` +
                        `📞 SĐT: ${customerPhone}\n` +
                        `📧 Email: ${customerEmail}\n` +
                        `💵 Số tiền: ${priceInfo}\n` +
                        `📦 Gói học: ${packageInfo}\n` +
                        `🆔 Mã đơn: ${orderId}\n` +
                        `${statusIcon} Trạng thái: ${statusText}`
                })
            });

            await removeButtons();
        }

        // ========== HUỶ ĐƠN ==========
        if (action === 'reject') {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ callback_query_id: callbackId, text: '❌ Đang huỷ đơn...' })
            });

            await fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'cancel-status', phone: identifier, status: 'CANCELLED' })
            }).catch(e => console.error('Sheet cancel error:', e));

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: `❌ ĐÃ HUỶ ĐƠN ĐĂNG KÝ!\n` +
                        `👤 Khách: ${customerName}\n` +
                        `📞 SĐT: ${customerPhone}\n` +
                        `📅 Thời gian: ${vnTime}`
                })
            });

            await removeButtons();
        }

        // ========== ĐÃ NHẬN TIỀN ==========
        if (action === 'payok') {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ callback_query_id: callbackId, text: '✅ Đã xác nhận!' })
            });

            await fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'update-status', orderId: identifier, status: 'PAID' })
            }).catch(e => console.error('Sheet error:', e));

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: `✅ ĐÃ XÁC NHẬN NHẬN TIỀN!\n` +
                        `👤 Khách: ${customerName}\n` +
                        `📞 SĐT: ${customerPhone}\n` +
                        `💵 Số tiền: ${priceInfo}\n` +
                        `🆔 Mã đơn: ${orderId || identifier}\n` +
                        `📅 Thời gian: ${vnTime}\n\n` +
                        `👉 Mời học viên vào Skool Pro ngay!`
                })
            });

            await removeButtons();
        }

        // ========== CHƯA NHẬN TIỀN ==========
        if (action === 'payno') {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ callback_query_id: callbackId, text: '⚠️ Ghi nhận!' })
            });

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: `⚠️ CHƯA NHẬN ĐƯỢC TIỀN!\n` +
                        `👤 Khách: ${customerName}\n` +
                        `📞 SĐT: ${customerPhone}\n` +
                        `🆔 Mã đơn: ${orderId || identifier}\n` +
                        `📅 Thời gian: ${vnTime}\n\n` +
                        `🔍 Cần kiểm tra lại ngân hàng.`
                })
            });

            await removeButtons();
        }

        res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(200).json({ ok: true });
    }
}
