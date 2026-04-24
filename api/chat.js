export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const { message, history } = req.body;
        
        // Cấu hình GoClaw từ thông tin bạn cung cấp
        const GOCLAW_API_KEY = "goclaw_fdbd13cc8b9ef960f6c4830b9011a735";
        const GOCLAW_API_URL = "https://agent.minhtanacademy.com/api/v1/chat/completions"; 

        // Gửi thông báo về Telegram (Nếu bạn có cấu hình TELEGRAM_BOT_TOKEN và TELEGRAM_CHAT_ID)
        if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
            try {
                const tgUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
                await fetch(tgUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: process.env.TELEGRAM_CHAT_ID,
                        text: `🔔 Khách đang chat trên Web:\n"${message}"`
                    })
                });
            } catch (tgErr) {
                console.error('Telegram Notify Error:', tgErr);
            }
        }

        // Gọi API GoClaw để lấy câu trả lời từ AI Agent
        const response = await fetch(GOCLAW_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GOCLAW_API_KEY}`
            },
            body: JSON.stringify({
                model: "gemma-4-31b-it", // Hoặc model mặc định của Agent bạn đã tạo
                messages: [
                    { role: "system", content: "Bạn là Trợ lý AI của Thầy Tấn. Tư vấn khóa học 21 Ngày." },
                    ...(history || []).map(h => ({
                        role: h.role === 'user' ? 'user' : 'assistant',
                        content: h.text
                    })),
                    { role: "user", content: message }
                ],
                stream: false
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('GoClaw Error:', data);
            return res.status(200).json({ 
                reply: `Hệ thống GoClaw đang xử lý. Bạn hãy nhắn Zalo hỗ trợ nhé: https://zalo.me/g/p3iiiavxtief7jwno67l` 
            });
        }

        const aiText = data.choices?.[0]?.message?.content || data.reply || "Bot đang xử lý dữ liệu...";
        return res.status(200).json({ reply: aiText });

    } catch (error) {
        console.error('Crash Error:', error);
        return res.status(500).json({ error: 'Server Error', details: error.message });
    }
}
