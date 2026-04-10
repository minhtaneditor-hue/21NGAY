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
            const [action, phone] = data.split('_');

            const vnTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
            
            if (action === 'approve') {
                // 1. Phản hồi ngay lập tức để Telegram không hiện icon xoay (loading)
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ callback_query_id: callbackId, text: '⏳ Đang xử lý duyệt...' })
                });

                // 2. Gọi Google Sheet để cập nhật PAID
                const gSheetResponse = await fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'update-status', phone: phone })
                });
                
                const result = await gSheetResponse.json();

                if (result.status === 'updated') {
                    // 3. Gửi tin nhắn thông báo mới cho Tấn
                    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            chat_id: CHAT_ID, 
                            text: `✅ ĐÃ DUYỆT THANH TOÁN CHO KHÁCH: ${phone}\n📅 Thời gian: ${vnTime}\nHọc viên sẽ bắt đầu nhận bài học từ 8h sáng mai.` 
                        })
                    });
                }
            }

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
                    body: JSON.stringify({ action: 'cancel-status', phone: phone })
                });

                // 3. Thông báo cho Tấn
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        chat_id: CHAT_ID, 
                        text: `❌ ĐÃ HUỶ ĐƠN ĐĂNG KÝ: ${phone}\n📅 Thời gian: ${vnTime}` 
                    })
                });
            }
        }

        res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(200).json({ ok: true }); // Trả về 200 để Telegram không gửi lại payload
    }
}
