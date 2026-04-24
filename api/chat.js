export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const { message, history } = req.body;
        
        // Cấu hình GoClaw từ tài liệu nội bộ của bạn
        const GOCLAW_API_KEY = "goclaw_fdbd13cc8b9ef960f6c4830b9011a735";
        const GOCLAW_API_URL = "https://agent.minhtanacademy.com/v1/chat/completions"; 
        const AGENT_ID = "tro-ly-minh-tan";

        // Giao tiếp với GoClaw
        const response = await fetch(GOCLAW_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GOCLAW_API_KEY}`
            },
            body: JSON.stringify({
                agent: AGENT_ID,
                messages: [
                    { role: "user", content: message }
                ],
                stream: false
            })
        });

        const text = await response.text();
        
        try {
            const data = JSON.parse(text);
            if (!response.ok) {
                console.error('GoClaw Error:', data);
                return res.status(200).json({ reply: "Hệ thống Agent đang bận, bạn thử lại sau nhé!" });
            }
            const aiText = data.choices?.[0]?.message?.content || data.reply || "Bot đang xử lý...";
            return res.status(200).json({ reply: aiText });
        } catch (e) {
            console.error('GoClaw Non-JSON Response:', text);
            return res.status(200).json({ reply: "Lỗi kết nối Agent (HTML Response). Vui lòng nhắn Zalo cho Thầy Tấn nhé!" });
        }

    } catch (error) {
        console.error('Crash Error:', error);
        return res.status(500).json({ error: 'Server Error', details: error.message });
    }
}
