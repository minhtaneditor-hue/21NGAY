export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const update = req.body;
    const BOT_TOKEN = '8711452465:AAE6iG51e8yUBn0Fbt09EeMTckWLpRxN0vs';
    const CHAT_ID = '7384174497';
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxKOFrsrF6AsmHGzXxYDWqEZ0BoOMtfh5aU4tGjbX6Ama_6tL8mIpzFv5rNRMExIv4U/exec';

    const RESEND_API_KEY = 're_Gq7KcaeK_2ar8XM8RhiQxeyNMgnjpEr2o';
    const SKOOL_LINK = 'https://www.skool.com/tan-lab-6821/about';

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

        // Helper to get user info from message text
        const getEmail = (text) => text.match(/📧\s+([^\n]+)/)?.[1]?.trim();
        const getName = (text) => text.match(/👤\s+([^\n]+)/)?.[1]?.trim();

        // ========== DUYỆT ĐƠN ==========
        if (action === 'approve') {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    callback_query_id: callbackId, 
                    text: '✅ Đã duyệt thông tin! Bạn có thể chọn kích hoạt ngay nếu đã thấy tiền về.',
                    show_alert: true 
                })
            });

            await fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                redirect: 'follow',
                body: JSON.stringify({ action: 'update-status', phone: identifier, status: 'APPROVED' })
            }).catch(() => {});

            const newText = originalText
                .replace('⏳ Trạng thái: CHỜ DUYỆT', `✅ ĐÃ DUYỆT INFO - ${vnTime}\n💳 Chờ SePay xác nhận thanh toán...`)
                .replace('🔔 CÓ KHÁCH MỚI ĐĂNG KÝ!', '✅ KHÁCH ĐÃ ĐƯỢC DUYỆT!');

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    message_id: messageId,
                    text: newText,
                    reply_markup: {
                        inline_keyboard: [[
                            { text: "🚀 KÍCH HOẠT NGAY (BỎ QUA SEPAY)", callback_data: `fullactivate_${identifier}` }
                        ]]
                    }
                })
            });
        }

        // ========== KÍCH HOẠT TOÀN DIỆN (Bypass SePay) ==========
        if (action === 'fullactivate') {
            const email = getEmail(originalText);
            const name = getName(originalText);

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ callback_query_id: callbackId, text: '🚀 Đang kích hoạt & gửi Skool...' })
            });

            // 1. Sheet PAID
            await fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                redirect: 'follow',
                body: JSON.stringify({ action: 'update-status', phone: identifier, status: 'PAID' })
            }).catch(() => {});

            // 2. Email Skool
            if (email) {
                await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
                    body: JSON.stringify({
                        from: 'Minh Tấn <challenge@minhtanacademy.com>',
                        to: email,
                        subject: '🎉 [QUAN TRỌNG] Link kích hoạt khóa học 21 Ngày Biến Video Thành Tài Sản',
                        html: `<div style="font-family:sans-serif;max-width:600px;line-height:1.6;color:#111;">
                            <h2>Chào ${name || 'bạn'}! Chúc mừng bạn đã chính thức gia nhập!</h2>
                            <p>Tấn đã xác nhận thanh toán thành công cho đơn hàng của bạn.</p>
                            <p style="background:#fff9c4;padding:15px;border-left:5px solid #fbc02d;">
                                <b>👉 Link tham gia Cộng đồng & Khóa học (Skool Pro):</b><br>
                                <a href="${SKOOL_LINK}" style="font-size:1.2rem;color:#f5bc1b;font-weight:bold;">BẤM VÀO ĐÂY ĐỂ THAM GIA NGAY</a>
                            </p>
                            <p><b>Lưu ý:</b> Nếu sau 24h bạn gặp khó khăn khi truy cập, hãy phản hồi lại email này hoặc nhắn tin qua Fanpage để được hỗ trợ kỹ thuật 24/7.</p>
                            <p>Hẹn gặp lại bạn trong hành trình 21 ngày sắp tới!</p>
                            <p>--<br><b>Minh Tấn | Tanlab Founder</b></p>
                        </div>`
                    })
                }).catch(() => {});
            }

            // 3. Update Tele
            const finalText = originalText
                .replace('⏳ Trạng thái: CHỜ DUYỆT', `✅ ĐÃ HOÀN TẤT - ${vnTime}`)
                .replace('✅ ĐÃ DUYỆT INFO', `✅ ĐÃ HOÀN TẤT - ${vnTime}`)
                .replace('💳 Chờ SePay xác nhận thanh toán...', '✨ Đã gửi link Skool cho khách!')
                .replace('🔔 CÓ KHÁCH MỚI ĐĂNG KÝ!', '🎉 ĐƠN HÀNG THÀNH CÔNG')
                .replace('✅ KHÁCH ĐÃ ĐƯỢC DUYỆT!', '🎉 ĐƠN HÀNG THÀNH CÔNG');

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, message_id: messageId, text: finalText })
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
                body: JSON.stringify({ chat_id: CHAT_ID, message_id: messageId, text: newText })
            });
        }

        // ========== XÁC NHẬN ĐÃ NHẬN TIỀN (từ SePay hoặc từ Tin nhắn SePay) ==========
        if (action === 'payok') {
            const email = getEmail(originalText);
            const name = getName(originalText);

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ callback_query_id: callbackId, text: '✅ Đã khớp lệnh & Gửi Skool!' })
            });

            // 1. Sheet PAID
            await fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                redirect: 'follow',
                body: JSON.stringify({ action: 'update-status', orderId: identifier, status: 'PAID' })
            }).catch(() => {});

            // 2. Email Skool
            if (email) {
                await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
                    body: JSON.stringify({
                        from: 'Minh Tấn <challenge@minhtanacademy.com>',
                        to: email,
                        subject: '🎉 [CHÀO MỪNG] Link tham gia khóa học 21 Ngày Biến Video Thành Tài Sản',
                        html: `<p>Chào ${name || 'bạn'}, thanh toán của bạn đã khớp lệnh thành công!</p><p>👉 Link Skool: <a href="${SKOOL_LINK}">${SKOOL_LINK}</a></p>`
                    })
                }).catch(() => {});
            }

            const newText = originalText
                .replace('⏳ Chờ admin xác nhận...', `✅ ĐÃ XÁC NHẬN KHỚP LỆNH - ${vnTime}\n✨ Đã gửi link khóa học cho khách!`);

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, message_id: messageId, text: newText })
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
                body: JSON.stringify({ chat_id: CHAT_ID, message_id: messageId, text: newText })
            });
        }

        res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(200).json({ ok: true });
    }
}

        res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(200).json({ ok: true });
    }
}
