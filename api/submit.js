import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const BOT_TOKEN = '8711452465:AAE6iG51e8yUBn0Fbt09EeMTckWLpRxN0vs';
    const CHAT_ID = '7384174497';
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzJu2FbsEhfYEi969iFQoBaKs7ScA_oFdxzGjTynPqMaqa_tCbeNs1fDx7S8RM7qMdi/exec';
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

            // 3. Resend Welcome Email (Urgency Marketing Email)
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
                        subject: '⏰ Đừng để sự trì hoãn lặng lẽ lấy mất cơ hội lớn nhất của bạn!',
                        html: `
                            <div style="background-color: #f9f9f9; padding: 20px; font-family: 'Inter', Arial, sans-serif;">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
                                    <tr>
                                        <td style="padding: 40px 40px; background-color: #000000; text-align: left;">
                                            <h1 style="color: #f5bc1b; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 1px;">VIDEO ADVISOR</h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 40px 40px; background-color: #ffffff;">
                                            <p style="color: #333333; font-size: 16px; margin-top: 0;">Chào ${data.fullname || 'bạn'},</p>
                                            <p style="color: #444444; font-size: 17px; line-height: 1.7;">
                                                Tấn muốn nói với bạn một chuyện rất thật. Trong hàng ngàn người đăng ký làm Video, phần lớn không bỏ cuộc vì kỹ thuật khó hay vì họ không đủ giỏi. 
                                            </p>
                                            <p style="color: #d32f2f; font-size: 17px; line-height: 1.7; font-weight: 700;">
                                                Họ dừng lại... chỉ vì họ TRÌ HOÃN bước đầu tiên quá lâu.
                                            </p>
                                            <p style="color: #555555; font-size: 16px; line-height: 1.7;">
                                                Ban đầu ai cũng nghĩ đơn giản lắm: "Để lát nữa", "Mai học cũng được", "Cuối tuần làm luôn cho tiện". Nhưng bạn biết không, càng để lâu, việc bắt đầu càng trở nên nặng nề. Và rồi một cơ hội đầy kỳ vọng lại trở thành một việc dang dở.
                                            </p>
                                            <p style="color: #1a1a1a; font-size: 17px; line-height: 1.7; font-weight: 600;">
                                                Video là kỹ năng có thể thay đổi hoàn toàn thu nhập và hướng đi sự nghiệp của bạn.
                                            </p>
                                            <p style="color: #555555; font-size: 16px; line-height: 1.7;">
                                                Tấn chỉ mong bạn dành vài phút ngay lúc này, hoàn tất bước thanh toán để cho bản thân một cơ hội bắt đầu thật sự. Vì nếu bạn bỏ qua hôm nay, rất có thể tuần sau bạn vẫn <strong>đứng nguyên ở vạch xuất phát</strong>, trong khi người khác đã đi được những bước tiến xa rồi.
                                            </p>
                                            <div style="text-align: center; margin: 40px 0;">
                                                <a href="https://minhtanacademy.com#register-section" style="background-color: #f5bc1b; color: #000000; padding: 20px 45px; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 17px; display: inline-block; transition: all 0.3s;">TÔI MUỐN BẮT ĐẦU NGAY</a>
                                            </div>
                                            <p style="color: #777777; font-size: 15px; font-style: italic;">
                                                Đừng để việc trì hoãn âm thầm lấy mất cơ hội của mình.
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 35px 40px; background-color: #fbfbfb; border-top: 1px solid #eeeeee;">
                                            <p style="color: #333333; font-size: 15px; margin: 0; line-height: 1.5;">
                                                Trân trọng,<br>
                                                <strong>Minh Tấn | Video Advisor</strong>
                                            </p>
                                            <p style="color: #999999; font-size: 13px; margin-top: 15px;">
                                                P/S: Bạn có thắc mắc gì cứ reply email này, Tấn luôn ở đây hỗ trợ bạn.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        `
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

        // 1.2. KHÁCH NHẬN QUÀ TẶNG (FREEBIE MAGNET)
        if (action === 'submit-freebie') {
            const vnTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
            const SKOOL_URL = 'https://www.skool.com/tan-lab-6821/classroom';
            const GAMMA_LINK = 'https://25-hook-cuc-manh-cho-chu-h2ik8ou.gamma.site/';

            // A. Gửi Telegram thông báo
            const telegramUrl = `https://api.telegram.org/bot8711452465:AAE6iG51e8yUBn0Fbt09EeMTckWLpRxN0vs/sendMessage`;
            await fetch(telegramUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    chat_id: '7384174497', 
                    text: `🔥 KHÁCH NHẬN HOOKS MIỄN PHÍ!\n` +
                          `📅 Thời gian: ${vnTime}\n` +
                          `👤 Họ tên: ${data.fullname || 'N/A'}\n` +
                          `📧 Email: ${data.email}\n` +
                          `----------------------------\n` +
                          `👉 Check Sheet & Chăm sóc ngay!`
                })
            });

            // B. Gửi Email chứa link quà tặng (Email Marketing Chuẩn)
            const RESEND_API_KEY = 're_Gq7KcaeK_2ar8XM8RhiQxeyNMgnjpEr2o';
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: 'Minh Tấn <challenge@minhtanacademy.com>',
                    to: data.email,
                    subject: '🎁 Gửi bạn: 25 Hooks Cực Mạnh giúp bứt phá doanh thu!',
                    html: `
                        <div style="background-color: #f4f4f4; padding: 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                                <tr>
                                    <td style="padding: 40px 30px; background-color: #f5bc1b; text-align: center;">
                                        <h1 style="color: #000000; margin: 0; font-size: 24px; text-transform: uppercase;">QUÀ TẶNG TỪ TẤN</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 40px 30px; background-color: #ffffff;">
                                        <h2 style="color: #333333; font-size: 20px; margin-top: 0;">Chào ${data.fullname || 'bạn'},</h2>
                                        <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                                            Chúc mừng bạn đã sở hữu bộ tài liệu <strong>"25 Hook cực mạnh cho chủ kênh"</strong>. Đây là những công thức Tấn đã chắt lọc để giúp video của bạn thu hút ngay từ 3 giây đầu tiên.
                                        </p>
                                        <p style="color: #333333; font-size: 16px; line-height: 1.6; font-weight: bold;">
                                            Bạn có thể truy cập tài liệu ngay tại đây:
                                        </p>
                                        <div style="text-align: center; margin: 30px 0;">
                                            <a href="${GAMMA_LINK}" style="background-color: #000000; color: #f5bc1b; padding: 18px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">TRUY CẬP BỘ HOOKS (GAMMA)</a>
                                        </div>
                                        <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                                            Ngoài ra, Tấn cũng đang chia sẻ rất nhiều kiến thức sâu hơn về xây dựng nhân hiệu và tối ưu video tại cộng đồng <strong>Skool Classroom</strong>. Hãy tham gia cùng Tấn nhé!
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 30px; background-color: #fafafa; border-top: 1px solid #eeeeee; text-align: center;">
                                        <p style="color: #999999; font-size: 14px; margin: 0;">
                                            <strong>Minh Tấn | Video Advisor</strong><br>
                                            Biến Video thành Tài sản bền vững
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    `
                })
            });

            return res.status(200).json({ success: true, skool_url: SKOOL_URL });
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

            // 2. Send Feedback Email (Reassurance Email)
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
                        subject: '⚡ XÁC NHẬN: Email quan trọng về hành trình Video của bạn!',
                        html: `
                            <div style="background-color: #f4f7f4; padding: 20px; font-family: 'Inter', Arial, sans-serif;">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                                    <tr>
                                        <td style="padding: 40px 40px; background-color: #2e7d32; text-align: left;">
                                            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 1px;">WELCOME TO VIDEO ADVISOR</h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 40px 40px; background-color: #ffffff;">
                                            <h2 style="color: #1b5e20; font-size: 20px; margin-top: 0;">Chúc mừng bạn đã có một quyết định đúng đắn!</h2>
                                            <p style="color: #333333; font-size: 16px; line-height: 1.7;">Chào <b>${data.fullname || 'bạn'}</b>,</p>
                                            <p style="color: #444444; font-size: 16px; line-height: 1.7;">
                                                Hệ thống đã ghi nhận thông báo thanh toán của bạn cho đơn hàng <strong>${data.orderId}</strong>. Bạn vừa chính thức mở ra một chương mới cho sự nghiệp của mình.
                                            </p>
                                            
                                            <div style="background-color: #f1f8e9; border: 1px solid #c8e6c9; padding: 25px; border-radius: 8px; margin: 30px 0;">
                                                <p style="margin: 0; font-weight: bold; color: #2e7d32; font-size: 17px;">🚀 Bạn đang rất gần vạch xuất phát:</p>
                                                <p style="margin: 10px 0 0 0; font-size: 16px; color: #444444;">
                                                    Đội ngũ Admin đang đối soát giao dịch cuối cùng để kích hoạt quyền truy cập cho bạn. <strong>Trong vòng 2-4 giờ tới, một email chứa link tham gia khóa học chính thức sẽ được gửi đến bạn.</strong>
                                                </p>
                                            </div>

                                            <p style="color: #333333; font-size: 17px; line-height: 1.7; font-weight: 600; font-style: italic;">
                                                "Mỗi giây phút bạn chờ đợi lúc này chính là sự chuẩn bị cho sự bứt phá rực rỡ sắp tới."
                                            </p>
                                            <p style="color: #444444; font-size: 16px; line-height: 1.7;">
                                                Tấn vô cùng phấn chấn khi biết rằng chỉ ít giờ nữa thôi, chúng ta sẽ bắt đầu biến mỗi Video của bạn thành một tài sản thực thụ mang lại giá trị bền vững. Hãy sẵn sàng để mở ra con đường mới cho chính mình!
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 35px 40px; background-color: #fbfbfb; border-top: 1px solid #eeeeee;">
                                            <p style="color: #333333; font-size: 15px; margin: 0; line-height: 1.5;">
                                                Hẹn gặp bạn trong bài học đầu tiên!<br>
                                                <strong>Minh Tấn | Video Advisor</strong>
                                            </p>
                                            <p style="color: #999999; font-size: 13px; margin-top: 15px;">
                                                Hotline hỗ trợ: 0962255861 (Zalo)
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        `
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
