const lastCallPromoTemplate = (name) => ({
    subject: `[SẮP HẾT HẠN] Nhập mã DAILE3004 để nhận ưu đãi 1.600.000đ ngay! 🎁`,
    html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
            <p>Chào <strong>${name}</strong>,</p>
            <p>Chỉ còn vài tiếng nữa là kỳ nghỉ lễ 30/4 chính thức khép lại.</p>
            <p>Để giúp bạn có một "cú hích" mạnh mẽ và bắt đầu công việc đầy hứng khởi vào ngày mai, mình dành tặng bạn mã ưu đãi đặc biệt nhất dành cho lộ trình <strong>"21 Ngày Biến Video Thành Tài Sản"</strong>.</p>
            <p>Thay vì mức học phí thông thường, bạn sẽ được tiết kiệm ngay <strong>1.600.000đ</strong> nếu hành động ngay bây giờ.</p>
            <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; border: 2px dashed #007bff;">
                <p style="margin: 0; font-size: 14px; color: #666;">🎫 MÃ ƯU ĐÃI:</p>
                <h2 style="margin: 10px 0; color: #007bff; font-size: 32px; letter-spacing: 2px;">DAILE3004</h2>
                <p style="margin: 0; font-size: 14px; color: #666;">(Giảm trực tiếp 1.600.000đ khi đăng ký lộ trình 21 Ngày)</p>
            </div>
            <p><strong>Tại sao bạn không nên bỏ lỡ cơ hội này?</strong></p>
            <ul>
                <li><strong>Tiết kiệm tối đa:</strong> Đây là mức ưu đãi tốt nhất trong năm để bạn sở hữu lộ trình xây dựng tài sản Video bài bản.</li>
                <li><strong>Hành trình thực chiến:</strong> 21 ngày giúp bạn xóa bỏ nỗi sợ, làm chủ nội dung và có hệ thống video tự động thu hút khách hàng.</li>
                <li><strong>Hạn chót:</strong> Hệ thống sẽ tự động đóng mã vào lúc <strong>00:00 đêm nay</strong>.</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://khoahoc.minhtanacademy.com/" style="background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">NHẬN ƯU ĐÃI & BẮT ĐẦU NGAY</a>
                <p style="font-size: 12px; color: #999; margin-top: 10px;">Link đăng ký: https://khoahoc.minhtanacademy.com/</p>
            </div>
            <p style="font-size: 14px; color: #666;"><em>Lưu ý: Mã <strong>DAILE3004</strong> chỉ có hiệu lực cho 50 suất đầu tiên để đảm bảo chất lượng hỗ trợ tốt nhất. Nếu bạn click vào link mà mã không còn hiệu lực, nghĩa là chương trình đã kết thúc sớm hơn dự kiến.</em></p>
            <p>Hẹn gặp bạn ở bên trong hành trình bứt phá sắp tới!</p>
            <p>Chúc bạn một buổi tối cuối kỳ nghỉ thật ý nghĩa,</p>
            <p><strong>Minh Tấn</strong><br>Tanlab - Video Advisor</p>
        </div>
    `
});

export default async function handler(req, res) {
    // Cho phép cả GET (Vercel Cron) và POST (Admin gọi thủ công)
    const { pw } = req.query;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin21day';

    // Nếu là POST thì kiểm tra mật khẩu
    if (req.method === 'POST' && pw !== ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    try {
        // 1. Lấy danh sách khách hàng từ Google Sheet
        const sheetRes = await fetch(GOOGLE_SHEET_URL, { redirect: 'follow' });
        const sheetData = await sheetRes.json();
        const allLeads = sheetData.data || [];

        // 2. Lọc khách PENDING + REMINDED có email (gửi cho TẤT CẢ ai chưa thanh toán)
        const targetLeads = allLeads.filter(lead => {
            const status = (lead.status || lead.Status || '').toUpperCase();
            const email = lead.email || lead.Email || '';
            return (status === 'PENDING' || status === 'REMINDED') && email.includes('@');
        });

        if (targetLeads.length === 0) {
            return res.status(200).json({ success: true, sent: 0, message: 'Không có khách nào để gửi' });
        }

        // 3. Gửi email cho từng người
        const results = [];
        for (const lead of targetLeads) {
            const name = lead.fullname || lead.Fullname || lead['Họ và tên'] || 'bạn';
            const email = lead.email || lead.Email || '';
            const emailData = lastCallPromoTemplate(name);

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
        const failedCount = targetLeads.length - sentCount;

        // 4. Báo cáo về Telegram
        const reportMsg = `📧 [EMAIL MARKETING] LAST CALL 30/4\n` +
            `📅 ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}\n` +
            `----------------------------\n` +
            `✅ Đã gửi thành công: ${sentCount} email\n` +
            `❌ Thất bại: ${failedCount}\n` +
            `----------------------------\n` +
            `📋 Chi tiết:\n` +
            results.map(r => `${r.status === 'sent' ? '✅' : '❌'} ${r.name} (${r.email})`).join('\n');

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: reportMsg })
        });

        return res.status(200).json({
            success: true,
            total_target: targetLeads.length,
            sent: sentCount,
            failed: failedCount,
            results
        });

    } catch (error) {
        console.error('Send LastCall Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
