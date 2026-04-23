import templates from './emails.js';

export default async function handler(req, res) {
    // Chỉ cho phép Vercel Cron hoặc request có Authorization (để bảo mật)
    // if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return res.status(401).end('Unauthorized');
    // }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    const resendUrl = 'https://api.resend.com/emails';

    try {
        const response = await fetch(GOOGLE_SHEET_URL);
        const sheetData = await response.json();
        const leads = sheetData.data || [];
        
        const now = new Date();
        const sentLogs = [];
        let pendingCount = 0;

        for (const lead of leads) {
            // Chỉ rà soát các đơn hàng PENDING hoặc chưa có trạng thái
            const isPending = !lead.status || lead.status === 'PENDING';
            if (!isPending) continue;

            pendingCount++;

            // Parse timestamp robustly
            const dateMatch = String(lead.timestamp).match(/(\d{1,2}):(\d{1,2}):(\d{1,2}) (\d{1,2})\/(\d{1,2})\/(\d{4})/);
            if (!dateMatch) continue;
            const signupDate = new Date(dateMatch[6], dateMatch[5]-1, dateMatch[4], dateMatch[1], dateMatch[2], dateMatch[3]);
            
            const diffInMinutes = Math.floor((now - signupDate) / (1000 * 60));

            // --- GIÁM SÁT 30 PHÚT: Nhắc nhở thanh toán ---
            // Nếu đã quá 30 phút và chưa gửi mail_payment
            if (diffInMinutes >= 30 && !lead.mail_payment) {
                const emailData = templates.paymentReminder(lead.fullname, lead.phone);
                
                await fetch(resendUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${RESEND_API_KEY}`
                    },
                    body: JSON.stringify({
                        from: 'Minh Tấn <challenge@minhtanacademy.com>',
                        to: lead.email,
                        subject: emailData.subject,
                        html: emailData.html
                    })
                });

                // Cập nhật mốc thời gian đã gửi nhắc nhở vào Sheet
                const vnNow = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
                await fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        action: 'update-fields', 
                        phone: lead.phone, 
                        fields: { 
                            mail_payment: vnNow,
                            status: 'REMINDED' // Tầm quan trọng: Để admin biết máy đã tự rà soát
                        } 
                    })
                });

                sentLogs.push(lead.fullname);
            }
        }

        // --- BÁO CÁO TỰ ĐỘNG VỀ TELEGRAM (Chỉ gửi khi có biến động) ---
        if (sentLogs.length > 0) {
            const reportMsg = `🤖 [QUẢN LÝ ẢO] BÁO CÁO RÀ SOÁT 30 PHÚT\n` +
                `📅 ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}\n` +
                `----------------------------\n` +
                `✅ Đã tự động gửi mail nhắc nhở cho: \n- ${sentLogs.join('\n- ')}\n` +
                `----------------------------\n` +
                `📊 Hiện còn: ${pendingCount - sentLogs.length} khách đang xử lý.`;

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, text: reportMsg })
            });
        }

        res.status(200).json({ success: true, processed: leads.length, reminded: sentLogs.length });
    } catch (error) {
        console.error('Cron Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
