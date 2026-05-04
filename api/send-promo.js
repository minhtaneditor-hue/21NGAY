import templates from './emails.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { pw } = req.query;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin21day';
    if (pw !== ADMIN_PASSWORD) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    try {
        // 1. Lấy danh sách khách hàng từ Google Sheet
        const sheetRes = await fetch(GOOGLE_SHEET_URL, { redirect: 'follow' });
        const sheetData = await sheetRes.json();
        const allLeads = sheetData.data || [];

        // 2. Lọc khách PENDING có email
        const pendingLeads = allLeads.filter(lead => {
            const status = (lead.status || lead.Status || '').toUpperCase();
            const email = lead.email || lead.Email || '';
            return status === 'PENDING' && email.includes('@');
        });

        if (pendingLeads.length === 0) {
            return res.status(200).json({ success: true, sent: 0, message: 'Không có khách PENDING nào có email' });
        }

        // 3. Gửi email cho từng người
        const results = [];
        for (const lead of pendingLeads) {
            const name = lead.fullname || lead.Fullname || lead['Họ và tên'] || 'bạn';
            const email = lead.email || lead.Email || '';
            const emailData = templates.holidayPromotion(name);

            try {
                const emailRes = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${RESEND_API_KEY}`
                    },
                    body: JSON.stringify({
                        from: 'Minh Tấn <challenge@minhtanacademy.com>',
                        to: email,
                        subject: emailData.subject,
                        html: emailData.html
                    })
                });
                const emailResult = await emailRes.json();
                results.push({ name, email, status: emailResult.id ? 'sent' : 'failed', id: emailResult.id });
            } catch (err) {
                results.push({ name, email, status: 'error', error: err.message });
            }
        }

        const sentCount = results.filter(r => r.status === 'sent').length;

        return res.status(200).json({
            success: true,
            total_pending: pendingLeads.length,
            sent: sentCount,
            failed: pendingLeads.length - sentCount,
            results
        });

    } catch (error) {
        console.error('Send Promo Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
