const templates = {
    // 1. EMAIL CHÀO MỪNG (GỬI NGAY KHI ĐĂNG KÝ)
    // -------------------------------------------------------------------------
    welcome: (name) => ({
        subject: "🚀 Chúc mừng! Bạn đã đặt chân vào hành trình Biến Video Thành Tài Sản",
        html: baseTemplate(name, `
            <p style="color: #444444; font-size: 17px; line-height: 1.7;">
                Cảm ơn bạn đã đăng ký tham gia Trại huấn luyện 21 Ngày. Tấn rất hào hứng khi được đồng hành cùng bạn trong hành trình bứt phá này.
            </p>
            <p style="color: #1a1a1a; font-size: 17px; line-height: 1.7; font-weight: 600;">
                Đây là bước đi đầu tiên để bạn làm chủ kỹ năng xây dựng cỗ máy thu nhập từ Video.
            </p>
            <div style="background-color: #fff9c4; border-left: 5px solid #fbc02d; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <p style="margin: 0; font-weight: bold; color: #000;">⚡ Bước tiếp theo dành cho bạn:</p>
                <p style="margin: 10px 0 0 0; font-size: 16px;">
                    Để chính thức kích hoạt lộ trình học và nhận đầy đủ bộ công cụ, bạn hãy hoàn tất thủ tục thanh toán theo hướng dẫn trên website hoặc nút bên dưới.
                </p>
            </div>
            <div style="text-align: center; margin: 35px 0;">
                <a href="https://khoahoc.minhtanacademy.com#register-section" style="background-color: #000000; color: #f5bc1b; padding: 18px 40px; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 17px; display: inline-block;">HOÀN TẤT THANH TOÁN</a>
            </div>
            <p style="color: #555555; font-size: 15px; font-style: italic;">
                Nếu bạn cần hỗ trợ nhanh, đừng ngần ngại nhắn tin cho Tấn qua Zalo: 0922255861.
            </p>
        `)
    }),

    // -------------------------------------------------------------------------
    // 2. EMAIL NHẮC NHỞ THANH TOÁN (30 PHÚT)
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
    }),

    // -------------------------------------------------------------------------
    // 4. CHUỖI EMAIL NURTURE: GÓI COACHING
    // -------------------------------------------------------------------------
    coachingWelcome: (name) => ({
        subject: "👑 Kích hoạt gói Coaching: Hành trình làm chủ Video của bạn bắt đầu!",
        html: baseTemplate(name, `
            <p style="color: #444444; font-size: 17px; line-height: 1.7;">Chào ${name}, cảm ơn bạn đã quyết định đầu tư vào bản thân với gói <strong>Video Coaching 1:1</strong>.</p>
            <p style="color: #1a1a1a; font-size: 17px; line-height: 1.7; font-weight: 600;">Đây không chỉ là một khóa học, đây là sự đồng hành.</p>
            <p style="color: #444444; font-size: 16px; line-height: 1.7;">Với gói Coaching, Tấn sẽ trực tiếp theo sát, tối ưu từng thông điệp, từng kịch bản và cách bạn xuất hiện trên khung hình. Bạn không cần phải đoán mò hay đi đường vòng nữa.</p>
            <div style="background-color: #fff9c4; border-left: 5px solid #fbc02d; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <p style="margin: 0; font-weight: bold; color: #000;">🎯 Việc cần làm ngay bây giờ:</p>
                <p style="margin: 10px 0 0 0; font-size: 16px;">Hãy kiểm tra tin nhắn Zalo/Telegram, Tấn đã gửi lịch đặt hẹn cho buổi Kick-off đầu tiên của chúng ta. Hãy chọn một khung giờ phù hợp nhất trong tuần này!</p>
            </div>
            <p style="color: #444444; font-size: 16px; line-height: 1.7;">Hẹn gặp bạn trong buổi làm việc trực tiếp sắp tới.</p>
        `, "COACHING PREMIUM")
    }),

    coachingNurture1: (name) => ({
        subject: "💡 Sự thật: Người bận rộn không có thời gian để 'tự mò mẫm'",
        html: baseTemplate(name, `
            <p style="color: #444444; font-size: 17px; line-height: 1.7;">Chào ${name}, dạo gần đây bạn vẫn theo dõi các video của Tấn chứ?</p>
            <p style="color: #444444; font-size: 16px; line-height: 1.7;">Tấn biết bạn là một người rất bận rộn với công việc kinh doanh hiện tại. Việc xuất hiện trên Mạng Xã Hội là bắt buộc để nhân bản doanh thu, nhưng bạn không có thời gian thử sai hay vò đầu bứt tóc dựng từng chiếc video.</p>
            <p style="color: #1a1a1a; font-size: 17px; line-height: 1.7; font-weight: 700;">Đó là lý do Coaching 1:1 là con đường tắt rẻ nhất.</p>
            <p style="color: #555555; font-size: 16px; line-height: 1.7;">Thay vì tốn 6 tháng tự học và làm sai, việc có một Mentor đồng hành nghĩa là bạn cầm trong tay bộ khung chuẩn chỉnh, chỉ việc ráp vào và ra kết quả ngay trong 21 ngày đầu tiên.</p>
            <div style="text-align: center; margin: 35px 0;">
                <a href="https://khoahoc.minhtanacademy.com#pricing-section" style="background-color: #000; color: #f5bc1b; padding: 18px 40px; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 17px; display: inline-block;">TIẾN HÀNH BẮT ĐẦU NGAY</a>
            </div>
            <p style="color: #444444; font-size: 16px; line-height: 1.7;">Đừng để đối thủ cướp khách hàng chỉ vì bạn chậm chân lên xu hướng.</p>
        `, "VIDEO ADVISOR")
    }),

    coachingNurture2: (name) => ({
        subject: "⏳ Đừng để sự trì hoãn cướp đi tệp khách hàng của bạn!",
        html: baseTemplate(name, `
            <p style="color: #d32f2f; font-size: 17px; line-height: 1.7; font-weight: bold;">Chỉ còn trống đúng 2 slot Coaching trong tháng này!</p>
            <p style="color: #444444; font-size: 16px; line-height: 1.7;">Chào ${name}, tháng vừa rồi học viên của Tấn đã mang về kết quả X3 doanh số chỉ sau chuỗi 15 video ngắn đúng insight.</p>
            <p style="color: #444444; font-size: 16px; line-height: 1.7;">Vì tính chất đồng hành 1:1, Tấn không thể nhận quá nhiều học viên cùng lúc để đảm bảo chất lượng. Nếu bạn vẫn đang khao khát thay đổi chiến lược bán hàng của mình, thì đây là lúc bạn cần quyết định.</p>
            <div style="background-color: #f1f8e9; border-left: 5px solid #2e7d32; padding: 25px; border-radius: 8px; margin: 30px 0;">
                <p style="color: #444444; font-size: 16px; margin: 0; font-style: italic;">"Hối hận lớn nhất không phải là làm sai, mà là không dám bắt đầu sớm hơn khi cơ hội còn ngay trước mắt."</p>
            </div>
            <div style="text-align: center; margin: 35px 0;">
                <a href="https://khoahoc.minhtanacademy.com#pricing-section" style="background-color: #d32f2f; color: #fff; padding: 18px 40px; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 17px; display: inline-block;">GIỮ CHỖ COACHING 1:1 NGAY LÚC NÀY</a>
            </div>
        `, "VIDEO ADVISOR")
    }),

    coachingNurture3: (name) => ({
        subject: "🔓 Lựa chọn thứ hai dành cho bạn: Tự học với rủi ro bằng 0",
        html: baseTemplate(name, `
            <p style="color: #444444; font-size: 17px; line-height: 1.7;">Chào ${name}, Tấn hoàn toàn hiểu nếu hiện tại gói Coaching đang vượt quá ngân sách trải nghiệm của bạn.</p>
            <p style="color: #1a1a1a; font-size: 16px; line-height: 1.7; font-weight: 600;">Tuy nhiên, mục tiêu quan trọng nhất vẫn là bạn PHẢI HÀNH ĐỘNG.</p>
            <p style="color: #444444; font-size: 16px; line-height: 1.7;">Chính vì vậy, Tấn mời bạn trải nghiệm gói <strong>E-Learning (Khóa học 21 Ngày)</strong> với chi phí mềm hơn cực kỳ nhiều. Bạn vẫn sở hữu toàn bộ công thức, kịch bản, và bí quyết tối ưu y hệt như những gì Tấn chia sẻ trong Coaching.</p>
            <p style="color: #444444; font-size: 16px; line-height: 1.7;">Hãy dùng gói E-Learning làm bước đệm. Khi bạn ra kết quả và có lợi nhuận, bạn hoàn toàn có thể dùng lợi nhuận đó nâng cấp lên Coaching sau này cũng chưa muộn.</p>
            <div style="text-align: center; margin: 35px 0;">
                <a href="https://khoahoc.minhtanacademy.com#pricing-section" style="background-color: #f5bc1b; color: #000; padding: 18px 40px; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 17px; display: inline-block;">BẮT ĐẦU VỚI GÓI E-LEARNING</a>
            </div>
            <p style="color: #444444; font-size: 16px; line-height: 1.7;">Đừng chần chừ nữa, đây là lựa chọn an toàn tuyệt đối dành cho bạn.</p>
        `, "VIDEO ADVISOR")
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
