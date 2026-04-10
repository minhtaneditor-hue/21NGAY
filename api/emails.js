const COMMUNITY_LINK = "https://www.facebook.com/groups/26557378780561721";

const templates = {
    // EMAIL NHẮC NHỞ THANH TOÁN (30 PHÚT)
    paymentReminder: (name, phone) => ({
        subject: "⚠️ Đừng để sự trì hoãn làm \"dìm hàng\" chiếc iPhone 30 triệu của bạn",
        html: baseTemplate(name, `
            <h2 style="color: #9b2c2c; font-size: 22px; border-bottom: 2px solid #feb2b2; padding-bottom: 10px;">📩 ĐỪNG ĐỂ SỰ TRÌ HOÃN LÀM "DÌM HÀNG" CHIẾC IPHONE 30 TRIỆU CỦA BẠN</h2>
            <p>Chào bạn, tôi là Tấn.</p>
            <p>Tôi thấy bạn đã đăng ký tham gia <b>7 Ngày Lên Tay "Phó Nháy" Cho Người Yêu</b> nhưng chưa hoàn tất bước cuối cùng. Với tư cách là một Advisor, tôi muốn nhắc bạn về một "điểm đau" thực tế:</p>
            
            <div style="background: #fff5f5; padding: 20px; border-radius: 10px; border-left: 5px solid #e53e3e; margin: 20px 0;">
                <h4 style="margin: 0; color: #9b2c2c;">1. Vấn đề:</h4>
                <p style="margin: 10px 0 0 0;">Sự trì hoãn chính là lý do khiến bạn vẫn đang sở hữu một thiết bị 30 triệu nhưng chỉ chụp ra những bức ảnh trị giá 3 triệu. Mỗi ngày bạn chần chừ, là một ngày bạn tiếp tục bị bạn gái chê, tiếp tục "khớp" trước ống kính và để lãng phí tài sản trong túi mình.</p>
            </div>

            <h4 style="color: #06403D;">2. Tại sao bạn phải hoàn tất NGAY?</h4>
            <ul style="padding-left: 20px;">
                <li><b>Số lượng có hạn:</b> Hiện tại chỉ còn 3 suất cuối cùng, hệ thống sẽ tự động hủy đơn đăng ký của bạn sau 15 phút nữa để nhường cho người khác.</li>
                <li><b>Mất cơ hội nhận quà 10 triệu:</b> Chỉ những người tham gia và thực hành đầy đủ 7 ngày mới có quyền cạnh tranh giải thưởng là Khóa học 21 Ngày Biến Video Thành Tài Sản.</li>
                <li><b>Điểm Sướng bị bỏ lỡ:</b> Cảm giác bạn gái tự hào đăng ảnh bạn chụp lên Story là thứ "tài sản hạnh phúc" mà tiền không mua được.</li>
            </ul>

            <h4 style="color: #06403D;">3. Nhiệm vụ (1 phút):</h4>
            <p>Hãy dứt điểm sự trì hoãn này bằng 3 bước:</p>
            <ol>
                <li>Bấm vào link thanh toán bên dưới.</li>
                <li>Chụp màn hình xác nhận chuyển khoản.</li>
                <li>Đợi Email Day 1 sẽ được gửi thẳng vào hộp thư của bạn sau 5 phút.</li>
            </ol>

            <div style="text-align: center; margin: 35px 0; background: #fafafa; padding: 30px; border-radius: 15px; border: 1px dashed #ccc;">
                <p style="font-weight: bold; margin-bottom: 15px; color: #06403D;">QUÉT MÃ ĐỂ GIỮ SUẤT CUỐI CÙNG</p>
                <img src="https://img.vietqr.io/image/MB-0922255861-compact.png?amount=199000&addInfo=Thanh%20toan%207Day%20${phone}&accountName=NGUYEN%20MINH%20TAN" alt="VietQR Payment" style="width: 100%; max-width: 250px; border: 5px solid white; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <p style="font-size: 14px; color: #666; margin-top: 15px;">
                    <b>Ngân hàng:</b> MB Bank<br>
                    <b>Số tài khoản:</b> 0922255861<br>
                    <b>Chủ TK:</b> NGUYEN MINH TAN<br>
                    <b>Số tiền:</b> 199.000đ<br>
                    <b>Nội dung:</b> Thanh toan 7Day ${phone}
                </p>
                <div style="margin-top: 25px;">
                    <a href="https://7day.minhtanacademy.com/#register-form-section" style="display: inline-block; background: #06403D; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; text-transform: uppercase; font-size: 14px;">HOÀN TẤT THANH TOÁN NGAY →</a>
                </div>
            </div>

            <p>Hẹn gặp bạn ở vạch xuất phát vào sáng mai. Đừng để mình là người đứng ngoài cuộc chơi "Tài sản số" này.</p>
            <p>Chào quyết thắng!</p>
        `)
    }),

    // EMAIL CHÀO MỪNG (DAY 0)
    day0: (name) => ({
        subject: "[Welcome] Đã đến lúc chiếc iPhone 30 triệu của bạn thôi \"làm cảnh\" 📸",
        html: baseTemplate(name, `
            <h2 style="color: #06403D; font-size: 24px; border-bottom: 2px solid #FFD700; padding-bottom: 10px;">📩 BIẾN CHIẾC IPHONE 30 TRIỆU THÀNH "VŨ KHÍ" HẠNH PHÚC</h2>
            <p>Chào bạn, tôi là Minh Tấn.</p>
            <p>Chúc mừng bạn đã chính thức có mặt tại thử thách <b>7 Ngày Lên Tay "Phó Nháy" Cho Người Yêu</b>. Việc bạn đọc email này cho thấy bạn không muốn tiếp tục là một người "tàng hình" trên mạng xã hội hay một "phó nháy" luôn khiến người thương phải thở dài.</p>
            
            <div style="background: #fdf6e3; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 5px solid #FFD700;">
                <h4 style="margin: 0; color: #b8860b;">🎯 Lý do thử thách này ra đời</h4>
                <p style="margin: 10px 0 0 0; font-size: 0.95rem;">Sự thật là, rất nhiều người đàn ông sở hữu thiết bị đắt tiền nhất, mạnh mẽ nhất nhưng lại gặp lỗi "hệ thống" trong cách quan sát. Bạn có thể làm chủ những dự án triệu đô, nhưng lại "khớp" trước một khung hình đơn giản. Thử thách này không chỉ dạy bạn chụp ảnh; nó giúp bạn lấy lại sự tự tin và làm chủ thiết bị đang nằm trong túi mình.</p>
            </div>

            <h3 style="color: #06403D;">🧠 Bạn sẽ học được gì? (Không spoil kỹ thuật)</h3>
            <p>Trong 7 ngày tới, tôi sẽ không nhồi nhét cho bạn những thông số kỹ thuật khô khan hay lý thuyết nhiếp ảnh phức tạp. Thay vào đó, chúng ta sẽ tập trung vào:</p>
            <ul style="padding-left: 20px;">
                <li><b>Tư duy quan sát:</b> Cách nhìn thấy "góc vàng" ở những nơi bình thường nhất.</li>
                <li><b>Kiểm soát bối cảnh:</b> Điều phối ánh sáng và chủ thể để tạo ra chiều sâu cho bức ảnh.</li>
                <li><b>Sự tinh gọn:</b> Chỉ 5 phút thực hành mỗi ngày để thay đổi kết quả vĩnh viễn.</li>
            </ul>

            <h3 style="color: #06403D;">🏆 Bạn sẽ đạt được gì sau 7 ngày?</h3>
            <p>✅ <b>Sự công nhận:</b> Không còn nghe câu "Anh chụp xấu quá", thay vào đó là nụ cười tự hào của cô ấy khi đăng tấm hình bạn chụp lên Story.</p>
            <p>✅ <b>Tài sản số đầu tiên:</b> Bạn sẽ hiểu thế nào là một bức ảnh có "gu" – nền tảng quan trọng nhất để bước vào thế giới video chuyên nghiệp.</p>
            <p>✅ <b>Cơ hội bứt phá:</b> Người có kết quả đẹp nhất và nhiệt tình nhất sẽ nhận được phần quà đặc biệt là <b>Khóa học Quy trình 21 ngày biến Video thành Tài sản (trị giá hơn 10.000.000 VNĐ)</b>.</p>

            <div style="background: #e6fffa; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
                <h4 style="margin: 0; color: #06403D;">🧭 Lời mời tham gia thử thách</h4>
                <p style="margin-top: 10px;">Hành trình trở thành "Phó Nháy" thực thụ sẽ bắt đầu vào sáng mai. Bài học đầu tiên: <b>"Chỉnh góc này, mặt sẽ nhỏ lại ngay"</b>.</p>
            </div>

            <p>Để bắt đầu, hãy chuẩn bị sẵn tinh thần và chiếc smartphone của bạn.</p>
            <p>Hẹn gặp bạn ngày mai!</p>
        `)
    }),

    // DAY 1
    day1: (name) => ({
        subject: "[Day 1] Tại sao chiếc iPhone 30 triệu lại biến mặt cô ấy thành... hình tròn?",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">🤳 DAY 1: Tuyệt chiêu "gọt mặt" V-line không cần dùng App</h2>
            <p>Chào bạn,</p>
            <p>Rất nhiều học viên của tôi từng thắc mắc: "Tại sao điện thoại xịn, mẫu đẹp mà ảnh ra nhìn cứ bị thô?" Câu trả lời nằm ở <b>Hiệu ứng tiêu cự</b>. Camera điện thoại thường có ống kính góc rộng (Wide). Nếu bạn đứng quá gần, ống kính sẽ làm biến dạng các đường nét: mũi to hơn, mặt bè ra và nọng cằm lộ rõ.</p>
            
            <p>Chúng ta sẽ sửa lỗi này bằng kỹ thuật <b>"Góc Nhìn Cố Vấn"</b> trong 3 bước:</p>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #ddd; font-size: 14px;">
                <thead>
                    <tr style="background: #06403D; color: white;">
                        <th style="padding: 12px; border: 1px solid #ddd;">Bước</th>
                        <th style="padding: 12px; border: 1px solid #ddd;">Hành động</th>
                        <th style="padding: 12px; border: 1px solid #ddd;">Tại sao?</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">1</td>
                        <td style="padding: 12px; border: 1px solid #ddd;"><b>Khoảng cách 2m</b><br>Đứng lùi lại cách người mẫu khoảng 1.5m - 2m. Nếu muốn lấy cận mặt, hãy sử dụng Zoom 2x hoặc 3x thay vì đứng sát lại.</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">Tránh hiện tượng méo hình do ống kính góc rộng gây ra. Giúp các đường nét khuôn mặt trở về đúng tỉ lệ tự nhiên.</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">2</td>
                        <td style="padding: 12px; border: 1px solid #ddd;"><b>Độ cao Trán</b><br>Giơ điện thoại lên sao cho ống kính camera cao bằng tầm trán của người mẫu.</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">Góc từ trên xuống giúp giấu đi phần nọng cằm và làm khuôn mặt trông thanh thoát hơn.</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">3</td>
                        <td style="padding: 12px; border: 1px solid #ddd;"><b>Quy tắc 15 độ</b><br>Hơi nghiêng nhẹ phần đầu điện thoại xuống phía dưới (khoảng 15 độ).</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">Tạo hiệu ứng V-line tự nhiên cho cằm và khiến đôi mắt trông to, có hồn hơn.</td>
                    </tr>
                </tbody>
            </table>

            <p>💡 <b>Mẹo nhỏ cho Advisor:</b> Hãy nhắc cô ấy hơi cúi mặt xuống một chút và nhìn vào ống kính. Đây chính là "góc vàng" mà mọi KOL đều sử dụng.</p>

            ${missionBox(1, "<b>Tấm 1:</b> Đứng sát (0.5m), để camera ngang miệng người mẫu và chụp.<br><b>Tấm 2:</b> Đứng xa 2m, dùng Zoom 2x, nâng máy cao bằng trán, nghiêng 15 độ và chụp.", "#ngay1")}

            <div style="background: #06403D; color: white; padding: 20px; border-radius: 10px; margin-top: 30px;">
                <h4 style="margin-top: 0; color: #FFD700;">🔥 QUY TRÌNH NHẬN QUÀ 10.000.000 VNĐ:</h4>
                <p style="font-size: 14px;">Để ghi tên mình vào danh sách xét duyệt phần thưởng, hãy hoàn thành thử thách:<br>
                1. Đăng ảnh so sánh (Tấm 1 vs Tấm 2) lên Facebook cá nhân ở chế độ công khai.<br>
                2. Chia sẻ cảm xúc khi thấy sự khác biệt.<br>
                3. Kèm bộ hashtag: <b>#minhtanacademy #BoyfriendCameraChallenge #ngay1</b></p>
                ${communityButton()}
            </div>

            <p style="margin-top: 20px;">Hẹn gặp bạn vào sáng mai, tôi sẽ chỉ cho bạn cách "hack" đôi chân dài thêm 10cm mà không cần kéo ảnh! 🦵</p>
        `)
    }),

    // DAY 2
    day2: (name) => ({
        subject: "[Day 2] Mẹo khiến chân dài miên man (không cần dùng app kéo)",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">🦵 DAY 2: Tuyệt chiêu "hack" chân dài 1.1m trong 3 giây</h2>
            <p>Chào bạn,</p>
            <p>Một trong những lý do khiến bạn gái "dỗi" sau khi xem ảnh là vì trông họ bị lùn đi so với thực tế. 📏</p>
            <p><b>Sai lầm của đa số đàn ông:</b> Cầm điện thoại ngang ngực hoặc ngang bụng để chụp. Theo quy luật xa gần của thấu kính, góc chụp này sẽ làm phần thân trên to ra và phần chân bị ngắn lại.</p>
            
            <p>Hôm nay, tôi sẽ hướng dẫn bạn kỹ thuật <b>"Góc Nhìn Từ Dưới"</b> để biến đôi chân trở nên thanh thoát và dài hơn hẳn.</p>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #ddd; font-size: 14px;">
                <thead>
                    <tr style="background: #06403D; color: white;">
                        <th style="padding: 12px; border: 1px solid #ddd;">Bước</th>
                        <th style="padding: 12px; border: 1px solid #ddd;">Hành động</th>
                        <th style="padding: 12px; border: 1px solid #ddd;">Hiệu quả</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">1</td>
                        <td style="padding: 12px; border: 1px solid #ddd;"><b>Hạ thấp camera</b><br>Ngồi thụp xuống hoặc hạ thấp tay sao cho điện thoại nằm ở tầm ngang hông hoặc eo của người mẫu.</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">Thay đổi trọng tâm thị giác, khiến phần chân trở thành tâm điểm và trông dài hơn.</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">2</td>
                        <td style="padding: 12px; border: 1px solid #ddd;"><b>Độ nghiêng 10 độ</b><br>Hơi nghiêng phần đỉnh điện thoại về phía bạn (màn hình hơi hướng lên trên) khoảng 10-15 độ.</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">Tạo hiệu ứng kéo giãn cơ thể theo chiều dọc một cách tự nhiên mà không làm méo bối cảnh.</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">3</td>
                        <td style="padding: 12px; border: 1px solid #ddd;"><b>Điểm chạm mép</b><br>Căn chỉnh sao cho bàn chân của người mẫu sát với mép dưới của khung hình.</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">Tận dụng sự biến dạng nhẹ ở rìa ống kính góc rộng để "kéo chân" dài nhất có thể.</td>
                    </tr>
                </tbody>
            </table>

            <p>💡 <b>Mẹo từ Advisor:</b> Nếu cô ấy đứng chân trước chân sau và hơi nhón gót, hiệu quả sẽ tăng gấp đôi!</p>

            ${missionBox(2, "<b>Tấm 1:</b> Đứng thẳng, để camera ngang ngực và chụp.<br><b>Tấm 2:</b> Hạ thấp máy xuống ngang hông, nghiêng máy 10 độ, để chân sát mép ảnh.", "#ngay2")}

            <div style="background: #06403D; color: white; padding: 20px; border-radius: 10px; margin-top: 30px;">
                <h4 style="margin-top: 0; color: #FFD700;">🔥 QUY TRÌNH NHẬN QUÀ 10.000.000 VNĐ:</h4>
                <p style="font-size: 14px;">
                1. Đăng ảnh so sánh lên Facebook cá nhân (chế độ công khai).<br>
                2. Viết 1 câu: "Ngày 2: Đã biết cách chụp cho người yêu chân dài như siêu mẫu!"<br>
                3. Kèm bộ hashtag: <b>#minhtanacademy #BoyfriendCameraChallenge #ngay2</b></p>
                ${communityButton()}
            </div>

            <p style="margin-top: 20px;">Hẹn gặp bạn vào sáng mai, chúng ta sẽ xử lý vấn đề "Ánh sáng" để da cô ấy luôn sáng mịn như dùng filter! ✨</p>
        `)
    }),

    // DAY 3
    day3: (name) => ({
        subject: "[Day 3] Tại sao ảnh bạn chụp luôn làm cô ấy trông... mệt mỏi?",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">✨ DAY 3: Bí mật "Ánh sáng triệu đô" cho làn da mịn màng</h2>
            <p>Chào bạn,</p>
            <p>Có một nghịch lý: Bạn cầm trên tay chiếc điện thoại có cảm biến hình ảnh hàng đầu thế giới, nhưng ảnh chụp xong cô ấy vẫn phải thốt lên: "Sao da em trông sạm thế?" hay "Sao mắt em thâm vậy?" 😫</p>
            <p><b>Cái sai mang tính hệ thống:</b> Đàn ông thường có thói quen chụp ảnh dưới ánh đèn trần (đèn điện trong nhà). 💡</p>
            <p>Ánh sáng từ trên đỉnh đầu đổ xuống sẽ tạo ra những vùng bóng đổ "ác mộng". Chúng ta sẽ dùng <b>Ánh sáng hướng mặt (Front-lighting)</b>.</p>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #ddd; font-size: 14px;">
                <thead>
                    <tr style="background: #06403D; color: white;">
                        <th style="padding: 12px; border: 1px solid #ddd;">Bước</th>
                        <th style="padding: 12px; border: 1px solid #ddd;">Hành động kỹ thuật</th>
                        <th style="padding: 12px; border: 1px solid #ddd;">Kết quả đạt được</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">1</td>
                        <td style="padding: 12px; border: 1px solid #ddd;"><b>Tìm "Cửa sổ vàng"</b><br>Di chuyển đến gần cửa sổ hoặc ban công (nơi có ánh sáng tự nhiên nhưng không bị nắng gắt).</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">Ánh sáng tự nhiên có độ mịn (soft) cao nhất, giúp che phủ các khuyết điểm trên da.</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">2</td>
                        <td style="padding: 12px; border: 1px solid #ddd;"><b>Xoay 180 độ</b><br>Hãy để người mẫu đứng đối diện với nguồn sáng (mặt hướng ra cửa sổ), còn bạn đứng lưng dựa vào cửa sổ.</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">Ánh sáng hắt thẳng vào mặt sẽ "lấp đầy" các nếp nhăn và quầng thâm, tạo ra làn da căng bóng.</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">3</td>
                        <td style="padding: 12px; border: 1px solid #ddd;"><b>Điểm sáng trong mắt</b><br>Nhìn vào màn hình, đảm bảo bạn thấy được hai chấm sáng nhỏ trong con ngươi (Catchlight).</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">Đôi mắt có thêm điểm sáng sẽ trông long lanh, tràn đầy sức sống và có chiều sâu hơn.</td>
                    </tr>
                </tbody>
            </table>

            <p>💡 <b>Lời khuyên từ Advisor:</b> Nếu phải chụp trong nhà buổi tối, hãy nhờ cô ấy hơi ngẩng mặt về phía bóng đèn thay vì cúi mặt. Mục tiêu là để ánh sáng "tắm" đều lên khuôn mặt.</p>

            ${missionBox(3, "<b>Tấm 1:</b> Chụp cô ấy đứng giữa phòng, dưới ánh đèn trần.<br><b>Tấm 2:</b> Chụp cô ấy đứng cạnh cửa sổ, mặt hướng ra phía ánh sáng.", "#ngay3")}

            <div style="background: #06403D; color: white; padding: 20px; border-radius: 10px; margin-top: 30px;">
                <h4 style="margin-top: 0; color: #FFD700;">🔥 QUY TRÌNH NHẬN QUÀ 10.000.000 VNĐ:</h4>
                <p style="font-size: 14px;">
                1. Đăng 2 tấm ảnh so sánh lên Facebook cá nhân (chế độ công khai).<br>
                2. Viết cảm nhận: "Ngày 3: Hiểu về ánh sáng mới thấy chiếc iPhone của mình mạnh đến mức nào!"<br>
                3. Kèm bộ hashtag: <b>#minhtanacademy #BoyfriendCameraChallenge #ngay3</b></p>
                ${communityButton()}
            </div>

            <p style="margin-top: 20px;">Hẹn gặp bạn ngày mai, chúng ta sẽ học cách "phá băng" sự cứng nhắc khi đứng trước ống kính!</p>
        `)
    }),

    // DAY 4
    day4: (name) => ({
        subject: "[Day 4] Bí kíp để cô ấy không bao giờ bị \"đơ\" trước ống kính",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">🚶‍♀️ DAY 4: Tuyệt chiêu Pose ảnh "diễn như không diễn"</h2>
            <p>Chào bạn,</p>
            <p>Bạn đã bao giờ gặp cảnh bạn gái đứng tạo dáng rất lâu nhưng khi xem ảnh lại thốt lên: "Nhìn em cứng đơ như khúc gỗ vậy!" chưa? 🪵</p>
            <p><b>Cái sai mang tính hệ thống:</b> Đàn ông thường bắt người mẫu đứng yên và đợi mình canh chỉnh. Việc đứng im quá lâu khiến cơ mặt bị mỏi, nụ cười gượng gạo.</p>
            
            <p>Hôm nay, tôi sẽ hướng dẫn bạn kỹ thuật <b>"Bắt trọn khoảnh khắc" (Burst Mode)</b> – giúp mọi bức ảnh đều mang hơi thở của sự tự nhiên.</p>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #ddd; font-size: 14px;">
                <thead>
                    <tr style="background: #06403D; color: white;">
                        <th style="padding: 12px; border: 1px solid #ddd;">Bước</th>
                        <th style="padding: 12px; border: 1px solid #ddd;">Hành động kỹ thuật</th>
                        <th style="padding: 12px; border: 1px solid #ddd;">Tại sao?</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">1</td>
                        <td style="padding: 12px; border: 1px solid #ddd;"><b>Hành động giả</b><br>Nhờ cô ấy thực hiện hành động: bước đi chậm về phía bạn, xoay người nhẹ hoặc vuốt tóc.</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">Khi cơ thể chuyển động, tâm trí sẽ bớt tập trung vào ống kính, giúp biểu cảm rạng rỡ nhất.</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">2</td>
                        <td style="padding: 12px; border: 1px solid #ddd;"><b>Kỹ thuật Burst</b><br>Nhấn và giữ nút chụp (hoột vuốt nút chụp sang trái tùy dòng máy) để chụp liên tục.</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">Bạn sẽ có từ 10-20 khung hình trong 1 giây. Chắc chắn sẽ có 1 khoảnh khắc "vàng" khi tóc bay hoặc nụ cười vừa hé mở.</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">3</td>
                        <td style="padding: 12px; border: 1px solid #ddd;"><b>Sàng lọc tài sản</b><br>Vào Album ảnh, chọn tấm đẹp nhất (mắt sáng và dáng đi thanh thoát nhất).</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">Giúp bạn giữ lại những bức ảnh chất lượng cao nhất và xóa bỏ những tấm "rác" ngay lập tức.</td>
                    </tr>
                </tbody>
            </table>

            <p>💡 <b>Lời khuyên từ Advisor:</b> Trong lúc cô ấy bước đi, hãy nói những câu đùa hoặc khen ngợi nhẹ nhàng. Âm thanh từ bạn chính là chất xúc tác để có được nụ cười thật nhất.</p>

            ${missionBox(4, "Yêu cầu: Nhờ cô ấy bước đi từ xa lại gần bạn.<br>Hành động: Giữ nút chụp liên tục cho đến khi cô ấy dừng lại. Chọn ra 1 tấm ưng ý nhất.", "#ngay4")}

            <div style="background: #06403D; color: white; padding: 20px; border-radius: 10px; margin-top: 30px;">
                <h4 style="margin-top: 0; color: #FFD700;">🔥 QUY TRÌNH NHẬN QUÀ 10.000.000 VNĐ:</h4>
                <p style="font-size: 14px;">
                1. Đăng bức ảnh "tự nhiên" nhất của bạn lên Facebook cá nhân (chế độ công khai).<br>
                2. Viết cảm nhận: "Ngày 4: Hóa ra chụp ảnh đẹp không khó, chỉ cần biết cách bắt đúng khoảnh khắc!"<br>
                3. Kèm bộ hashtag: <b>#minhtanacademy #BoyfriendCameraChallenge #ngay4</b></p>
                ${communityButton()}
            </div>

            <p style="margin-top: 20px;">Hẹn gặp bạn ngày mai, chúng ta sẽ học cách đặt người mẫu vào khung hình sao cho chuyên nghiệp như ảnh tạp chí!</p>
        `)
    }),

    // DAY 5
    day5: (name) => ({
        subject: "[Day 5] Đừng đặt người vào giữa ảnh nếu muốn trông chuyên nghiệp",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">📐 DAY 5: Biến ảnh chụp điện thoại thành "ảnh bìa tạp chí"</h2>
            <p>Chào bạn,</p>
            <p>Tại sao có những bức ảnh trông rất "sang" và có chiều sâu, còn ảnh bạn chụp trông cứ bị "kịch"? 🎭</p>
            <p><b>Cái sai mang tính hệ thống:</b> 90% đàn ông có thói quen đưa máy lên là đặt ngay người mẫu vào chính giữa. Ngoài ra, việc bỏ qua "rác" ở phông nền (cột điện, túi rác...) sẽ phá hỏng công sức của bạn.</p>
            
            <p>Hôm nay, tôi sẽ dạy bạn cách sử dụng <b>Quy tắc 1/3</b> – "tỷ lệ vàng" trong nghệ thuật thị giác.</p>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #ddd; font-size: 14px;">
                <thead>
                    <tr style="background: #06403D; color: white;">
                        <th style="padding: 12px; border: 1px solid #ddd;">Bước</th>
                        <th style="padding: 12px; border: 1px solid #ddd;">Hành động kỹ thuật</th>
                        <th style="padding: 12px; border: 1px solid #ddd;">Tại sao?</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">1</td>
                        <td style="padding: 12px; border: 1px solid #ddd;"><b>Kích hoạt Grid</b><br>Vào Cài đặt Camera -> Bật chế độ Lưới (Grid). Màn hình sẽ xuất hiện 4 đường kẻ chia ảnh thành 9 ô.</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">Đây là "thước đo" giúp bạn căn chỉnh độ cân bằng và vị trí chính xác của chủ thể.</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">2</td>
                        <td style="padding: 12px; border: 1px solid #ddd;"><b>Quy tắc 1/3</b><br>Thay vì đặt người vào ô giữa, hãy đặt cô ấy dọc theo đường kẻ bên trái hoặc bên phải.</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">Tạo ra "khoảng thở" cho bức ảnh, giúp mắt người xem tập trung vào chủ thể một cách tự nhiên hơn.</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">3</td>
                        <td style="padding: 12px; border: 1px solid #ddd;"><b>Quét sạch "rác"</b><br>Trước khi bấm máy, hãy nhìn nhanh 4 góc hình để đảm bảo không có vật thể lạ đâm vào người mẫu.</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">Một phông nền sạch sẽ giúp người mẫu trở thành tâm điểm tuyệt đối, tăng giá trị "sang" cho bức ảnh. ✨</td>
                    </tr>
                </tbody>
            </table>

            <p>💡 <b>Lời khuyên từ Advisor:</b> Nếu cô ấy nhìn về phía bên trái, hãy đặt cô ấy ở đường kẻ bên phải (để chừa khoảng trống phía trước mặt). Điều này tạo ra sự kết nối giữa con người và không gian.</p>

            ${missionBox(5, "<b>Tấm 1:</b> Đặt người mẫu vào đúng giữa ảnh, không quan tâm phông nền.<br><b>Tấm 2:</b> Đặt người mẫu vào đường kẻ 1/3, chọn phông nền sạch và thoáng.", "#ngay5")}

            <div style="background: #06403D; color: white; padding: 20px; border-radius: 10px; margin-top: 30px;">
                <h4 style="margin-top: 0; color: #FFD700;">🔥 QUY TRÌNH NHẬN QUÀ 10.000.000 VNĐ:</h4>
                <p style="font-size: 14px;">
                1. Đăng bức ảnh quy tắc 1/3 của bạn lên Facebook cá nhân.<br>
                2. Viết cảm nhận: "Ngày 5: Hóa ra chỉ cần đặt lệch đi một chút là ảnh nhìn sang hơn hẳn!"<br>
                3. Kèm bộ hashtag: <b>#minhtanacademy #BoyfriendCameraChallenge #ngay5</b></p>
                ${communityButton()}
            </div>

            <p style="margin-top: 20px;">Hẹn gặp bạn vào sáng mai, chúng ta sẽ áp dụng tất cả vào bối cảnh phổ biến nhất: Chụp ảnh tại quán Cafe! ☕</p>
        `)
    }),

    // DAY 6
    day6: (name) => ({
        subject: "[Day 6] Tại sao ảnh Cafe của bạn trông... nhạt nhẽo?",
        html: baseTemplate(name, `
            <h2 style="color: #06403D;">☕ DAY 6: Góc chụp Cafe "vạn người mê"</h2>
            <p>Chào bạn,</p>
            <p>Sai lầm lớn nhất khi chụp ảnh Cafe là: Chụp chính diện hoặc từ trên xuống một cách hời hợt.🤦‍♂️ Điều này làm bức ảnh trông giống như ảnh chụp "báo cáo".</p>
            
            <p>Hãy dùng kỹ năng <b>"Chiều sâu không gian"</b> để làm nổi bật chủ thể:</p>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #ddd; font-size: 14px;">
                <thead>
                    <tr style="background: #06403D; color: white;">
                        <th style="padding: 12px; border: 1px solid #ddd;">Bước</th>
                        <th style="padding: 12px; border: 1px solid #ddd;">Hành động kỹ thuật</th>
                        <th style="padding: 12px; border: 1px solid #ddd;">Hiệu quả đạt được</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">1</td>
                        <td style="padding: 12px; border: 1px solid #ddd;"><b>Góc chéo 45°</b><br>Đứng lệch sang một bên bàn thay vì đối diện trực tiếp.</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">Tạo các đường dẫn thị giác, khiến không gian quán trông rộng và sâu hơn. 📐</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">2</td>
                        <td style="padding: 12px; border: 1px solid #ddd;"><b>Hạ tầm mắt</b><br>Đưa camera xuống ngang tầm mắt hoặc ngang tầm ly nước.</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">Làm nổi bật các chi tiết nhỏ (lớp bọt cafe, lát chanh...) và tạo cảm giác "sang". ✨</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">3</td>
                        <td style="padding: 12px; border: 1px solid #ddd;"><b>Kỹ thuật Layering</b><br>Đặt một vật nhỏ (laptop, cuốn sách) sát ống kính để làm mờ nhẹ (tiền cảnh).</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">Tạo chiều sâu 3D cho bức ảnh, khiến người xem cảm thấy như đang thực sự ngồi tại đó. 🖼️</td>
                    </tr>
                </tbody>
            </table>

            <p>💡 <b>Mẹo từ Advisor:</b> Hãy tận dụng chế độ Chân dung (Portrait) để làm mờ phông nền phía sau, giúp chủ thể nổi bật hoàn toàn khỏi bối cảnh quán lộn xộn.</p>

            ${missionBox(6, "Hãy chụp 3 tấm tại một góc làm việc hoặc quán cafe: (1) Chính diện. (2) Góc chéo 45 độ. (3) Lấy thêm tiền cảnh.", "#ngay6")}

            <div style="background: #06403D; color: white; padding: 20px; border-radius: 10px; margin-top: 30px;">
                <h4 style="margin-top: 0; color: #FFD700;">🔥 QUY TRÌNH NHẬN QUÀ 10.000.000 VNĐ:</h4>
                <p style="font-size: 14px;">
                1. Đăng bộ ảnh Cafe của bạn lên Facebook cá nhân (chế độ công khai).<br>
                2. Viết cảm nhận: "Ngày 6: Biến góc Cafe quen thuộc thành studio chuyên nghiệp chỉ với 3 bước!"<br>
                3. Kèm bộ hashtag: <b>#minhtanacademy #BoyfriendCameraChallenge #ngay6</b></p>
                ${communityButton()}
            </div>

            <p style="margin-top: 20px;">Hẹn gặp bạn ngày mai cho Bài Test Tổng Lực! 🚀</p>
        `)
    }),

    // DAY 7
    day7: (name) => ({
        subject: "[Day 7] Tấm ảnh \"Masterpiece\" thay lời muốn nói",
        html: baseTemplate(name, `
            <h2 style="color: #06403D; text-align: center;">🏆 BÀI THI CUỐI CÙNG: TRỞ THÀNH "PHÓ NHÁY" THỰC THỤ</h2>
            <p>Chào bạn, chúc mừng bạn đã đi đến ngày cuối cùng. Bạn đã sở hữu 6 mảnh ghép quan trọng nhất. 🧩</p>
            <p><b>Cái sai mang tính hệ thống cuối cùng:</b> Đó là sự rời rạc. Một bức ảnh thực sự giá trị (Digital Asset) phải là sự giao thoa hoàn hảo của tất cả yếu tố.</p>
            
            <p>Hôm nay, chúng ta sẽ thực hiện kỹ thuật <b>"Tổng lực Advisor"</b> để tạo ra một bức ảnh khiến cô ấy phải thốt lên: "Wow".</p>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #ddd; font-size: 14px;">
                <thead>
                    <tr style="background: #06403D; color: white;">
                        <th style="padding: 12px; border: 1px solid #ddd;">Bước</th>
                        <th style="padding: 12px; border: 1px solid #ddd;">Hành động kỹ thuật</th>
                        <th style="padding: 12px; border: 1px solid #ddd;">Kết quả đạt được</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">1</td>
                        <td style="padding: 12px; border: 1px solid #ddd;"><b>Setup bối cảnh</b><br>Chọn góc 1/3 (Day 5), tìm nguồn ánh sáng tự nhiên (Day 3) và dọn sạch "rác".</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">Tạo ra một không gian chuyên nghiệp, sạch sẽ và tôn vinh chủ thể tuyệt đối. ✨</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">2</td>
                        <td style="padding: 12px; border: 1px solid #ddd;"><b>Điều phối "Góc vàng"</b><br>Hạ máy ngang eo (Day 2), hơi chúi máy 15 độ (Day 1) và đứng cách 2m.</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">Kết hợp hoàn hảo giữa việc làm đẹp dáng và thanh thoát khuôn mặt. 📐</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">3</td>
                        <td style="padding: 12px; border: 1px solid #ddd;"><b>Kích hoạt cảm xúc</b><br>Nhờ cô ấy chuyển động nhẹ (Day 4) và dùng Burst Mode.</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">Điểm Sướng cuối cùng: Một bức ảnh tự nhiên, có hồn và rạng rỡ. 📸</td>
                    </tr>
                </tbody>
            </table>

            <p>💡 <b>Lời khuyên từ Advisor:</b> Đừng nói "Chụp nhé", hãy cứ để cô ấy chuyển động và bạn là người lặng lẽ bắt trọn những khoảnh khắc đẹp nhất.</p>

            ${missionBox("CUỐI", "Chụp 1 tấm ảnh hoàn chỉnh hội tụ đủ các yếu tố. Gửi cho cô ấy và xem phản hồi!", "#ngay7")}

            <div style="background: #06403D; color: white; padding: 25px; border-radius: 15px; text-align: center; margin-top: 30px;">
                <h3 style="margin-top: 0; color: #FFD700;">🎁 CƠ HỘI CUỐI CÙNG NHẬN QUÀ 10.000.000 VNĐ</h3>
                <p>Đăng thành quả rực rỡ nhất và viết về hành trình 7 ngày của bạn kèm hashtag để tham gia xét duyệt quà tặng!</p>
                ${communityButton()}
            </div>

            <p style="margin-top: 25px;">Hành trình 7 ngày kết thúc, nhưng con đường biến Smartphone thành tài sản số của bạn chỉ mới bắt đầu.</p>
            <p>Chào quyết thắng!</p>
        `)
    })
};

// --- HELPER FUNCTIONS FOR CLEANER CODE ---

function baseTemplate(name, body) {
    return `
        <div style="background: #f4f4f4; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <div style="background: #06403D; padding: 25px; text-align: center; border-bottom: 4px solid #FFD700;">
                    <h1 style="color: white; margin: 0; font-size: 20px; letter-spacing: 2px;">7 NGÀY LÊN TAY "PHÓ NHÁY"</h1>
                </div>
                <div style="padding: 30px 40px; color: #333; line-height: 1.7; font-size: 16px;">
                    <p style="font-size: 18px;">Xin chào <b>${name || 'bạn'}</b>,</p>
                    ${body}
                    <div style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 30px; text-align: center;">
                        <p style="margin: 0; font-weight: bold; color: #06403D;">Minh Tấn</p>
                        <p style="margin: 0; color: #888; font-size: 14px;">Advisor - Minh Tấn Academy</p>
                    </div>
                </div>
            </div>
            <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
                © 2026 Minh Tần Academy. Đã đăng ký bản quyền.<br>
                Bạn nhận được email này vì đã đăng ký Thử thách 7 Ngày Lên Tay "Phó Nháy" Cho Người Yêu.
            </p>
        </div>
    `;
}

function missionBox(day, task, hashtag) {
    const title = day === "CUỐI" ? "🏆 BÀI THI CUỐI CÙNG" : `🔥 NHIỆM VỤ NGÀY ${day}`;
    return `
        <div style="margin: 30px 0; background: #fdf2f2; border: 1px solid #feb2b2; padding: 20px; border-radius: 12px; border-left: 6px solid #e53e3e;">
            <h4 style="margin: 0 0 10px 0; color: #9b2c2c;">${title}</h4>
            <p style="margin: 0; font-size: 0.95rem;">${task}</p>
            <p style="margin-top: 10px; font-size: 0.85rem; color: #666;">Kèm bộ hashtag: <b>#minhtanacademy #BoyfriendCameraChallenge ${hashtag}</b></p>
        </div>
    `;
}

function communityButton() {
    return `
        <div style="text-align: center; margin-top: 20px;">
            <a href="${COMMUNITY_LINK}" style="display: inline-block; background: #FFD700; color: #000; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 10px rgba(218, 165, 32, 0.3);">KHOE THÀNH QUẢ TRÊN GROUP →</a>
        </div>
    `;
}

export default templates;
