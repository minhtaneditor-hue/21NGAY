import templates from './emails.js';

export default async function handler(req, res) {
    // Chỉ cho phép Vercel Cron hoặc request có Authorization (để bảo mật)
    // if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return res.status(401).end('Unauthorized');
    // }

    const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const resendUrl = 'https://api.resend.com/emails';

    try {
        // 1. Lấy danh sách học viên từ Google Sheets
        const response = await fetch(GOOGLE_SHEET_URL);
        const leads = await response.json();
        
        const now = new Date();
        const sentLogs = [];

        // 2. Duyệt qua từng học viên để kiểm tra ngày
        for (const lead of leads) {
            const signupDate = new Date(lead.timestamp);
            const diffInMs = now - signupDate;
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

            // --- TRƯỜNG HỢP 1: NHẮC NHỞ THANH TOÁN (Sau 30 phút) ---
            // Nếu status trống (mới đăng ký) và đã qua 30 phút
            if (!lead.status && diffInMinutes >= 30 && diffInMinutes <= 90) {
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

                // Cập nhật trạng thái đã nhắc nhở để không gửi lại lần sau
                await fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'update-status', phone: lead.phone, status: 'REMINDED' })
                });

                sentLogs.push({ email: lead.email, type: 'reminder' });
            }
        }

        res.status(200).json({ success: true, processed: leads.length, sent: sentLogs });
    } catch (error) {
        console.error('Cron Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
