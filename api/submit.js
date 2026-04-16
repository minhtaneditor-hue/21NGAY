import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const BOT_TOKEN = '8711452465:AAE6iG51e8yUBn0Fbt09EeMTckWLpRxN0vs';
    const CHAT_ID = '7384174497';
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwmVkwXNM3ohKMk9exR0ht7l9TwTOBdnueTbbKoXmksDGv4vFsMOn0-OYCfN8Z1Zmw1/exec';
    const RESEND_API_KEY = 're_Gq7KcaeK_2ar8XM8RhiQxeyNMgnjpEr2o';
    
    // FACEBOOK CAPI CONFIG
    const FB_PIXEL_ID = '922937023887248';
    const FB_ACCESS_TOKEN = 'EAAWZABd207FoBROGHtHJXGZCBOgNchxuLs4azmIZByRRk2oo3mKPkbSjYpKyKgrwKZCFCZCmCxKrMiGjkgqOpSkJjzZCvbz03wHjagQBykddVRTtp6c9FIsLDoECZAqLRRtAye4dvWrmN3rGHIzIlPPtINQQmkzbY6sv9ZCSPJ6sI78paMAZA6LEQMXPi2DK4sQZDZD';

    const hash = (data) => {
        if (!data) return '';
        return crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
    };

    try {
        const body = req.body;
        const { action, ...data } = body;

        // ========== 1. ĐĂNG KÝ MỚI ==========
        if (!action || action === 'submit-lead') {
            const vnTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
            const packageName = data.package === 'COACHING21DAY' ? '💎 PREMIUM COACHING 1:1' : '📚 KHÓA HỌC 21 NGÀY';
            const amountFormatted = data.amount > 0 ? new Intl.NumberFormat('vi-VN').format(data.amount) + ' VNĐ' : 'Liên hệ tư vấn';

            const promises = [];

            // 1. Telegram (Gửi trước để lấy Message ID)
            const message = `🔔 CÓ KHÁCH MỚI ĐĂNG KÝ!\n` +
                `📅 Thời gian: ${vnTime}\n` +
                `----------------------------\n` +
                `👤 ${data.fullname || 'Không có'}\n` +
                `📞 ${data.phone || 'Không có'}\n` +
                `📧 ${data.email || 'Không có'}\n` +
                `📦 ${packageName}\n` +
                `💰 ${amountFormatted}\n` +
                `🎟️ Mã ưu đãi: ${data.promoCode || 'None'}\n` +
                `🆔 ${data.orderId || 'N/A'}\n` +
                `🚀 Source: ${data.utm?.utm_source || 'Direct'}\n` +
                `----------------------------\n` +
                `⏳ Trạng thái: CHỜ DUYỆT`;

            const teleRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    reply_markup: {
                        inline_keyboard: [[
                            { text: "✅ DUYỆT ĐƠN (GỬI LADI)", callback_data: `approve_${data.phone}` },
                            { text: "❌ HUỶ ĐƠN", callback_data: `reject_${data.phone}` }
                        ]]
                    }
                })
            });
            const teleData = await teleRes.json();
            const teleMessageId = teleData.result?.message_id;

            // 2. Google Sheet (Gửi sau cùng, bao gồm teleMessageId)
            promises.push(
                fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    redirect: 'follow',
                    body: JSON.stringify({
                        fullname: data.fullname,
                        phone: data.phone,
                        email: data.email,
                        package: data.package,
                        amount: data.amount,
                        promoCode: data.promoCode,
                        orderId: data.orderId,
                        timestamp: vnTime,
                        status: 'PENDING',
                        utm_source: data.utm?.utm_source || '',
                        utm_medium: data.utm?.utm_medium || '',
                        utm_campaign: data.utm?.utm_campaign || '',
                        utm_content: data.utm?.utm_content || '',
                        utm_term: data.utm?.utm_term || '',
                        teleMessageId: teleMessageId // Đưa xuống cuối để không lệch cột Sheet cũ
                    })
                }).catch(err => console.error('Sheet Error:', err))
            );

            // 3. Resend Welcome Email
            promises.push(
                fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${RESEND_API_KEY}`
                    },
                    body: JSON.stringify({
                        from: 'Minh Tấn <challenge@minhtanacademy.com>',
                        to: data.email,
                        subject: '🎉 Chào mừng bạn đến với Khóa học 21 Ngày!',
                        html: `<p>Chào ${data.fullname}, Tấn đã nhận được đăng ký của bạn. Hãy hoàn tất thanh toán để bắt đầu hành trình nhé!</p>`
                    })
                }).catch(err => console.error('Email Error:', err))
            );

            // 4. Facebook Conversions API (CAPI) - ROBUST VERSION
            const fbPromises = async () => {
                try {
                    const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
                    const userData = {
                        client_user_agent: data.userAgent,
                        client_ip_address: clientIp,
                        fbc: data.fbc || null,
                        fbp: data.fbp || null
                    };

                    // Only add if hashed data exists
                    const hashedEmail = hash(data.email);
                    const hashedPhone = hash(data.phone);
                    if (hashedEmail) userData.em = [hashedEmail];
                    if (hashedPhone) {
                        userData.ph = [hashedPhone];
                        userData.external_id = [hashedPhone];
                    }

                    const fbBody = {
                        data: [{
                            event_name: 'Lead',
                            event_time: Math.floor(Date.now() / 1000),
                            action_source: 'website',
                            event_id: data.orderId,
                            event_source_url: data.eventSourceUrl,
                            user_data: userData,
                            custom_data: {
                                content_name: packageName,
                                currency: 'VND',
                                value: data.amount || 0
                            }
                        }],
                        test_event_code: 'TEST73427'
                    };

                    const fbRes = await fetch(`https://graph.facebook.com/v18.0/${FB_PIXEL_ID}/events?access_token=${FB_ACCESS_TOKEN}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(fbBody)
                    });
                    
                    const fbResult = await fbRes.json();
                    console.log('FB CAPI Result:', JSON.stringify(fbResult));
                } catch (err) {
                    console.error('Facebook CAPI Error:', err);
                }
            };
            promises.push(fbPromises());

            await Promise.allSettled(promises);
            return res.status(200).json({ success: true, message: 'Lead captured and tracked' });
        }

        // ========== 2. XÁC NHẬN ĐÃ CHUYỂN TIỀN (Thủ công từ Website) ==========
        if (action === 'confirm-payment') {
            const vnTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
            
            // Tìm teleMessageId từ Sheet để GOM BOX
            let teleMessageId = null;
            try {
                const sheetRes = await fetch(GOOGLE_SHEET_URL, { method: 'GET', redirect: 'follow' });
                const sheetData = await sheetRes.json();
                if (sheetData.status === 'ok' && sheetData.data) {
                    const row = sheetData.data.find(r => r.orderId === data.orderId);
                    teleMessageId = row?.teleMessageId;
                }
            } catch (e) { console.error('Sheet Fetch Error:', e); }

            const promises = [];

            // 1. Notify Telegram (Gom bằng cách Reply hoặc Edit)
            const teleMsg = `📩 KHÁCH BÁO ĐÃ CHUYỂN TIỀN!\n` +
                `📅 ${vnTime}\n` +
                `🆔 Mã đơn: ${data.orderId || 'N/A'}\n` +
                `💰 Số tiền: ${new Intl.NumberFormat('vi-VN').format(data.amount || 0)} VNĐ\n` +
                `----------------------------\n` +
                `🔍 Hãy kiểm tra ngân hàng.`;

            const teleBody = {
                chat_id: CHAT_ID,
                text: teleMsg,
                reply_to_message_id: teleMessageId, // GOM THEO LEAD
                reply_markup: {
                    inline_keyboard: [[
                        { text: "🚀 KÍCH HOẠT NGAY", callback_data: `fullactivate_${data.phone}` },
                        { text: "❌ CHƯA THẤY", callback_data: `payno_${data.orderId}` }
                    ]]
                }
            };

            promises.push(
                fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(teleBody)
                }).catch(err => console.error('Tele Confirm Error:', err))
            );

            // 2. Send Feedback Email
            promises.push(
                fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${RESEND_API_KEY}`
                    },
                    body: JSON.stringify({
                        from: 'Minh Tấn <challenge@minhtanacademy.com>',
                        to: data.email,
                        subject: '📩 Đã nhận thông báo thanh toán!',
                        html: `<p>Tanlab đã nhận thông báo chuyển khoản đơn <b>${data.orderId}</b>. Đang xử lý...</p>`
                    })
                }).catch(err => console.error('Email Error:', err))
            );

            await Promise.allSettled(promises);
            return res.status(200).json({ success: true, message: 'Confirmation received' });
        }

    } catch (error) {
        console.error('Submission Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
