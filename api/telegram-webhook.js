export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const update = req.body;
    const BOT_TOKEN = '8753662126:AAHjqwCiSyn50oxIg7ABgebgh_B1tiWNX0E';
    const CHAT_ID = '7384174497';
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwX0yiwRqL9GGWuzFBiufuEoa5VyZDNYahnWhyVhwGxlFWqulWwrioOq8MV8Q95-mUFdw/exec';

    try {
        // Kiểm tra nếu là hành động bấm nút (Callback Query)
        if (update.callback_query) {
            const { id, data, message } = update.callback_query;
            const callbackId = id;
            
            // Parse callback_data: format là "action_identifier"
            // Ví dụ: approve_0962255861, reject_0962255861, payok_TAN58617956, payno_TAN58617956
            const underscoreIndex = data.indexOf('_');
            const action = data.substring(0, underscoreIndex);
            const identifier = data.substring(underscoreIndex + 1);

            const vnTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
            
            // ========== DUYỆT ĐƠN ĐĂNG KÝ (approve) ==========
            if (action === 'approve') {
                // 1. Phản hồi ngay lập tức để Telegram không hiện icon xoay (loading)
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ callback_query_id: callbackId, text: '⏳ Đang xử lý duyệt...' })
                });

                // 2. Gọi Google Sheet để cập nhật PAID
                let sheetResult;
                try {
                    const gSheetResponse = await fetch(GOOGLE_SHEET_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'update-status', phone: identifier, status: 'PAID' })
                    });
                    sheetResult = await gSheetResponse.json();
                } catch(e) {
                    console.error('Google Sheet update failed:', e);
                    sheetResult = { status: 'error' };
                }

                // 3. Gửi tin nhắn thông báo mới cho Tấn
                const statusText = sheetResult.status === 'updated' 
                    ? '✅ Đã cập nhật Sheet & Gửi Email link Skool!' 
                    : '⚠️ Cập nhật Sheet thất bại, cần check thủ công!';

                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        chat_id: CHAT_ID, 
                        text: `🔥 TING TING! TIỀN VỀ SẾP ƠI!\n` +
                              `👤 Khách hàng: \n` +
                              `💵 Số tiền:  VNĐ\n` +
                              `📦 Gói học: \n` +
                              `${statusText}` 
                    })
                });

                // 4. Xóa nút bấm cũ (tránh bấm lại nhiều lần)
                if (message && message.message_id) {
                    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageReplyMarkup`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: CHAT_ID,
                            message_id: message.message_id,
                            reply_markup: { inline_keyboard: [] }
                        })
                    }).catch(() => {}); // Ignore errors if message already edited
                }
            }

            // ========== HUỶ ĐƠN (reject) ==========
            if (action === 'reject') {
                // 1. Phản hồi ngay lập tức
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ callback_query_id: callbackId, text: '❌ Đang thực hiện huỷ đơn...' })
                });

                // 2. Gọi Google Sheet để cập nhật CANCELLED
                await fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'cancel-status', phone: identifier, status: 'CANCELLED' })
                }).catch(e => console.error('Sheet cancel failed:', e));

                // 3. Thông báo cho Tấn
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        chat_id: CHAT_ID, 
                        text: `❌ ĐÃ HUỶ ĐƠN ĐĂNG KÝ: ${identifier}\n📅 Thời gian: ${vnTime}` 
                    })
                });

                // 4. Xóa nút bấm
                if (message && message.message_id) {
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

            // ========== XÁC NHẬN ĐÃ NHẬN TIỀN (payok) ==========
            if (action === 'payok') {
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ callback_query_id: callbackId, text: '✅ Đã xác nhận nhận tiền!' })
                });

                // Cập nhật Google Sheet
                await fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'update-status', orderId: identifier, status: 'PAID' })
                }).catch(e => console.error('Sheet update failed:', e));

                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        chat_id: CHAT_ID, 
                        text: `✅ ĐÃ XÁC NHẬN NHẬN TIỀN!\n🆔 Mã đơn: ${identifier}\n📅 Thời gian: ${vnTime}\n\n👉 Hãy mời học viên vào Skool Pro ngay!` 
                    })
                });

                // Xóa nút bấm
                if (message && message.message_id) {
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

            // ========== CHƯA NHẬN ĐƯỢC TIỀN (payno) ==========
            if (action === 'payno') {
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ callback_query_id: callbackId, text: '⚠️ Đã ghi nhận chưa nhận tiền!' })
                });

                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        chat_id: CHAT_ID, 
                        text: `⚠️ CHƯA NHẬN ĐƯỢC TIỀN!\n🆔 Mã đơn: ${identifier}\n📅 Thời gian: ${vnTime}\n\n🔍 Cần kiểm tra lại ngân hàng hoặc liên hệ khách hàng.` 
                    })
                });

                // Xóa nút bấm
                if (message && message.message_id) {
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
        }

        res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(200).json({ ok: true }); // Trả về 200 để Telegram không gửi lại payload
    }
}
