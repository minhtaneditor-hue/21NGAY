export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const update = req.body;
    const BOT_TOKEN = '8711452465:AAE6iG51e8yUBn0Fbt09EeMTckWLpRxN0vs';
    const CHAT_ID = '7384174497';
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzJu2FbsEhfYEi969iFQoBaKs7ScA_oFdxzGjTynPqMaqa_tCbeNs1fDx7S8RM7qMdi/exec';

    const RESEND_API_KEY = 're_Gq7KcaeK_2ar8XM8RhiQxeyNMgnjpEr2o';
    const SKOOL_LINK = 'https://www.skool.com/tan-lab-6821/classroom';

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
        const getEmailFromText = (text) => text.match(/📧\s+([^\n]+)/)?.[1]?.trim();
        const getNameFromText = (text) => text.match(/👤\s+([^\n]+)/)?.[1]?.trim();

        // Helper to send the Premium Skool Link Email
        const sendSuccessEmail = async (email, name) => {
            if (!email) return;
            return fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
                body: JSON.stringify({
                    from: 'Minh Tấn <challenge@minhtanacademy.com>',
                    to: email,
                    subject: '🎉 [QUAN TRỌNG] Link kích hoạt khóa học 21 Ngày Biến Video Thành Tài Sản',
                    html: `<div style="font-family:sans-serif;max-width:600px;line-height:1.6;color:#111;margin:0 auto;border:1px solid #eee;padding:20px;border-radius:15px;">
                        <h2 style="color:#f5bc1b;">Chào ${name || 'bạn'}! Chúc mừng bạn đã sở hữu chiếc vé thành công!</h2>
                        <p>Tấn đã xác nhận thanh toán thành công cho đơn hàng của bạn. Rất vui vì bạn đã quyết tâm đầu tư vào bản thân.</p>
                        <div style="background:#fff9c4;padding:20px;border-radius:10px;text-align:center;margin:25px 0;border:2px dashed #fbc02d;">
                            <p style="margin-top:0;"><b>Bước tiếp theo: Bấm vào nút dưới đây để tham gia Cộng đồng & Khóa học (Skool Pro):</b></p>
                            <a href="${SKOOL_LINK}" style="background:#f5bc1b;color:#000;padding:15px 30px;text-decoration:none;font-weight:bold;border-radius:50px;display:inline-block;font-size:1.1rem;">TRUY CẬP SKOOL PRO NGAY</a>
                        </div>
                        <p style="font-size:0.9rem;color:#666;"><b>Lưu ý:</b> Nếu sau 24h bạn gặp khó khăn khi truy cập, hãy phản hồi lại email này hoặc nhắn tin qua Zalo 0962255861 để được hỗ trợ kỹ thuật 24/7.</p>
                        <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
                        <p style="text-align:center;font-weight:bold;color:#f5bc1b;">Hẹn gặp lại bạn trong hành trình 21 ngày sắp tới!<br>Minh Tấn | Tanlab Founder</p>
                    </div>`
                })
            }).catch(err => console.error('Resend Error:', err));
        };

        // Helper to find user data from Sheet
        const fetchUserFromSheet = async (matchId) => {
            try {
                const res = await fetch(GOOGLE_SHEET_URL, { method: 'GET', redirect: 'follow' });
                const result = await res.json();
                if (result.status === 'ok' && result.data) {
                    return result.data.find(row => row.orderId == matchId || row.phone == matchId);
                }
            } catch (e) {
                console.error('Fetch User Error:', e);
            }
            return null;
        };

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
                            { text: "🚀 KÍCH HOẠT NGAY (BỎ QUA SEPAY)", callback_data: `fullactivate_${identifier}` },
                            { text: "❌ HUỶ ĐƠN", callback_data: `reject_${identifier}` }
                        ]]
                    }
                })
            });
        }

        // ========== KÍCH HOẠT TOÀN DIỆN (Bypass SePay) ==========
        if (action === 'fullactivate') {
            let email = getEmailFromText(originalText);
            let name = getNameFromText(originalText);

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ callback_query_id: callbackId, text: '🚀 Đang kích hoạt & gửi Skool...' })
            });

            // Nếu thiếu thông tin (do bấm từ nguồn khác), tra cứu Sheet
            if (!email || !name) {
                const user = await fetchUserFromSheet(identifier);
                if (user) {
                    email = user.email;
                    name = user.fullname;
                }
            }

            // 1. Sheet PAID
            await fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                redirect: 'follow',
                body: JSON.stringify({ action: 'update-status', phone: identifier, status: 'PAID' })
            }).catch(() => {});

            // 2. Email Skool
            await sendSuccessEmail(email, name);

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
                .replace('🔔 CÓ KHÁCH MỚI ĐĂNG KÝ!', '❌ ĐƠN ĐÃ BỊ HUỶ')
                .replace('✅ KHÁCH ĐÃ ĐƯỢC DUYỆT!', '❌ ĐƠN ĐÃ BỊ HUỶ');

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, message_id: messageId, text: newText })
            });
        }

        // ========== XÁC NHẬN ĐÃ NHẬN TIỀN (từ SePay hoặc từ Tin nhắn SePay) ==========
        if (action === 'payok') {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ callback_query_id: callbackId, text: '✅ Đã khớp lệnh & Gửi Skool!' })
            });

            // Tra cứu Sheet để lấy thông tin khách theo OrderId
            const user = await fetchUserFromSheet(identifier);
            if (user) {
                // 1. Sheet PAID
                fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    redirect: 'follow',
                    body: JSON.stringify({ action: 'update-status', orderId: identifier, status: 'PAID' })
                }).catch(() => {});

                // 2. Email Skool
                await sendSuccessEmail(user.email, user.fullname);
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
