import templates from './emails.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { pw } = req.query;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin21day';
    if (pw !== ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    try {
        const body = req.body;
        const { action } = body;

        // ===== GỬI EMAIL THỦ CÔNG =====
        if (action === 'send-email') {
            const { emailType, fullname, email, phone, orderId, amount } = body;

            if (!email) {
                return res.status(400).json({ success: false, message: 'Missing email address' });
            }

            let emailData;
            let mailField;

            if (emailType === 'welcome') {
                emailData = templates.welcome(fullname);
                mailField = 'mail_welcome';
            } else if (emailType === 'payment_reminder') {
                emailData = templates.paymentReminder(fullname, phone);
                mailField = 'mail_payment';
            } else if (emailType === 'payment_confirmation') {
                emailData = templates.paymentConfirmation(fullname, orderId);
                mailField = 'mail_payment';
            } else {
                return res.status(400).json({ success: false, message: 'Invalid emailType. Use: welcome, payment_reminder, payment_confirmation' });
            }

            // 1. Gửi email qua Resend
            const sendRes = await fetch('https://api.resend.com/emails', {
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

            if (!sendRes.ok) {
                const errText = await sendRes.text();
                console.error('Resend Error:', errText);
                throw new Error('Failed to send email via Resend');
            }

            const sentAt = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

            // 2. Cập nhật trạng thái đã gửi vào Google Sheet
            if (GOOGLE_SHEET_URL && (phone || orderId)) {
                await fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    redirect: 'follow',
                    body: JSON.stringify({
                        action: 'update-fields',
                        phone: phone || '',
                        orderId: orderId || '',
                        fields: {
                            [mailField]: sentAt
                        }
                    })
                }).catch(err => console.error('Sheet update error:', err));
            }

            return res.status(200).json({ 
                success: true, 
                message: `Email ${emailType} sent successfully to ${email}`,
                sentAt
            });
        }

        // ===== CẬP NHẬT TYPE / FIELDS =====
        if (action === 'update-field') {
            const { phone, orderId, fields } = body;

            if (!phone && !orderId) {
                return res.status(400).json({ success: false, message: 'Need phone or orderId to identify lead' });
            }
            if (!fields || typeof fields !== 'object') {
                return res.status(400).json({ success: false, message: 'fields must be an object' });
            }

            const sheetRes = await fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                redirect: 'follow',
                body: JSON.stringify({
                    action: 'update-fields',
                    phone: phone || '',
                    orderId: orderId || '',
                    fields
                })
            });

            const sheetData = await sheetRes.json();
            return res.status(200).json({ success: true, result: sheetData });
        }

        // ===== XÓA LEAD =====
        if (action === 'delete-lead') {
            const { phone, orderId } = body;
            if (!phone && !orderId) {
                return res.status(400).json({ success: false, message: 'Need phone or orderId to delete' });
            }
            const sheetRes = await fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                redirect: 'follow',
                body: JSON.stringify({
                    action: 'delete-lead',
                    phone: phone || '',
                    orderId: orderId || ''
                })
            });
            const sheetData = await sheetRes.json();
            return res.status(200).json({ success: true, result: sheetData });
        }

        return res.status(400).json({ success: false, message: 'Unknown action' });

    } catch (error) {
        console.error('Admin Actions Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
    }
}
