const templates = {
    // -------------------------------------------------------------------------
    // 1. EMAIL NHẮC NHỞ THANH TOÁN (30 PHÚT)
    // -------------------------------------------------------------------------
    paymentReminder: (name, phone) => ({
        subject: "⏰ Đừng để sự trì hoãn lặng lẽ lấy mất cơ hội lớn nhất của bạn!",
        html: baseTemplate(name, `
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
                Video Strategy là kỹ năng có thể thay đổi hoàn toàn thu nhập và vị thế của bạn ngay lúc này.
            </p>
            <p style="color: #555555; font-size: 16px; line-height: 1.7;">
                Tấn chỉ mong bạn dành vài phút ngay lúc này, hoàn tất bước thanh toán để cho bản thân một cơ hội bắt đầu thật sự. Vì nếu bạn bỏ qua hôm nay, rất có thể tuần sau bạn vẫn <strong>đứng nguyên ở vạch xuất phát</strong>, trong khi những người khác đã đi được những bước tiến xa rồi.
            </p>
            <div style="text-align: center; margin: 40px 0;">
                <a href="https://khoahoc.minhtanacademy.com#register-section" style="background-color: #f5bc1b; color: #000000; padding: 20px 45px; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 17px; display: inline-block; transition: all 0.3s;">TÔI MUỐN BẮT ĐẦU NGAY</a>
            </div>
            <p style="color: #777777; font-size: 15px; font-style: italic; text-align: center;">
                Đừng để sự trì hoãn âm thầm lấy mất cơ hội của mình.
            </p>
        `)
    }),

    // -------------------------------------------------------------------------
    // 2. EMAIL XÁC NHẬN THANH TOÁN (KHI CÓ TIỀN VỀ)
    // -------------------------------------------------------------------------
    paymentConfirmation: (name, orderId) => ({
        subject: "⚡ XÁC NHẬN: Email quan trọng về hành trình Video của bạn!",
        html: baseTemplate(name, `
            <p style="color: #1b5e20; font-size: 18px; font-weight: bold; margin-bottom: 20px;">Tuyệt vời, chúc mừng ${name || 'bạn'}!</p>
            <p style="color: #444444; font-size: 16px; line-height: 1.7;">
                Hệ thống đã ghi nhận thông báo thanh toán cho đơn hàng <strong>${orderId || 'N/A'}</strong>. Bạn vừa chính thức mở ra một chương mới rực rỡ hơn cho sự nghiệp của mình.
            </p>
            
            <div style="background-color: #f1f8e9; border-left: 5px solid #2e7d32; padding: 25px; border-radius: 8px; margin: 30px 0;">
                <p style="margin: 0; font-weight: bold; color: #2e7d32; font-size: 17px;">🚀 Bạn đang rất gần vạch xuất phát:</p>
                <p style="margin: 10px 0 0 0; font-size: 16px; color: #444444;">
                    Hệ thống và đội ngũ Admin đang đối soát giao dịch cuối cùng để kích hoạt quyền học tập cho bạn. 
                    <strong>Trong vòng 2-4 giờ tới, một email chứa link mời tham gia Khối học chính thức (Skool Pro) sẽ được gửi đến hộp thư này.</strong>
                </p>
                <p style="margin: 15px 0 0 0; font-size: 15px; color: #666;">
                    Đích đến của bạn là: <strong>Cộng đồng Skool Classroom</strong>.
                </p>
            </div>

            <p style="color: #333333; font-size: 17px; line-height: 1.7; font-weight: 600; font-style: italic;">
                "Mỗi giây phút bạn chờ đợi lúc này chính là sự chuẩn bị cho một sự bứt phá rực rỡ sắp tới."
            </p>
            <p style="color: #444444; font-size: 16px; line-height: 1.7;">
                Tấn vô cùng phấn chấn khi biết rằng chỉ ít giờ nữa thôi, chúng ta sẽ bắt đầu biến mỗi Video của bạn thành một tài sản thực thụ mang lại giá trị bền vững.
            </p>
            <p style="color: #444444; font-size: 16px; line-height: 1.7; margin-top: 20px;">
                Hẹn gặp bạn trong bài học đầu tiên!
            </p>
        `, "WELCOME TO VIDEO ADVISOR")
    }),

    // -------------------------------------------------------------------------
    // 3. EMAIL GỬI QUÀ TẶNG (LEAD MAGNET MAGNET.HTML)
    // -------------------------------------------------------------------------
    giftMagnet: (name) => ({
        subject: "🎁 Gửi bạn: 25 Hooks Cực Mạnh giúp bứt phá doanh thu!",
        html: baseTemplate(name, `
            <p style="color: #444444; font-size: 16px; line-height: 1.7;">
                Chúc mừng bạn đã sở hữu bộ tài liệu <strong>"25 Hook cực mạnh cho chủ kênh"</strong>. Đây là những công thức Tấn đã chắt lọc để giúp video của bạn thu hút ngay từ 3 giây đầu tiên.
            </p>
            <p style="color: #333333; font-size: 16px; line-height: 1.7; font-weight: bold; margin-top: 25px;">
                Bạn có thể truy cập tài liệu ngay tại đây:
            </p>
            <div style="text-align: center; margin: 35px 0;">
                <a href="https://25-hook-cuc-manh-cho-chu-h2ik8ou.gamma.site/" style="background-color: #000000; color: #f5bc1b; padding: 18px 45px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">TRUY CẬP BỘ HOOKS (GAMMA)</a>
            </div>
            <p style="color: #555555; font-size: 16px; line-height: 1.7;">
                Ngoài ra, Tấn cũng đang chia sẻ rất nhiều kiến thức sâu hơn về xây dựng nhân hiệu và tối ưu video tại cộng đồng <strong>Skool Classroom</strong>. Hãy tham gia cùng Tấn nhé!
            </p>
        `, "QUÀ TẶNG TỪ TẤN")
    })
};

// --- BASE TEMPLATE (HIGH-END DESIGN) ---
function baseTemplate(name, body, customTitle = "VIDEO ADVISOR") {
    return `
        <div style="background-color: #f9f9f9; padding: 40px 20px; font-family: 'Inter', Helvetica, Arial, sans-serif;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.08);">
                <tr>
                    <td style="padding: 40px 40px; background-color: #000000; text-align: left; border-bottom: 4px solid #f5bc1b;">
                        <h1 style="color: #f5bc1b; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 2px;">${customTitle}</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 50px 40px; background-color: #ffffff;">
                        <p style="color: #333333; font-size: 18px; margin-top: 0; font-weight: 600;">Chào ${name || 'bạn'},</p>
                        ${body}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 40px; background-color: #fafafa; border-top: 1px solid #eeeeee;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="text-align: left;">
                                    <p style="color: #333333; font-size: 15px; margin: 0; line-height: 1.5;">
                                        Trân trọng,<br>
                                        <span style="font-size: 17px; font-weight: 800; color: #000000;">Minh Tấn | Video Advisor</span>
                                    </p>
                                    <p style="color: #999999; font-size: 13px; margin-top: 5px;">
                                        Biến Video thành Tài sản bền vững
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <p style="text-align: center; color: #aaaaaa; font-size: 12px; margin-top: 30px;">
                © 2026 Minh Tấn Academy. Tất cả quyền được bảo lưu.
            </p>
        </div>
    `;
}

export default templates;
