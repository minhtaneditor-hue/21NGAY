export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const { message, history } = req.body;
        
        // Cấu hình GoClaw CHÍNH XÁC từ Dashboard của bạn
        const GOCLAW_API_KEY = "goclaw_fdbd13cc8b9ef960f6c4830b9011a735";
        const GOCLAW_API_URL = "https://agent.minhtanacademy.com/v1/chat/completions"; 
        const AGENT_ID = "tro-ly-minh-tan"; // Agent ID đã được xác thực

        // Gửi thông báo về Telegram
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

        // Gọi API GoClaw với cấu trúc payload chuẩn
        const response = await fetch(GOCLAW_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GOCLAW_API_KEY}`
            },
            body: JSON.stringify({
                agent: AGENT_ID,
                messages: [
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
                reply: `Hệ thống GoClaw đang bận. Bạn hãy nhắn Zalo hỗ trợ nhé: https://zalo.me/g/p3iiiavxtief7jwno67l` 
            });
        }

        // Trích xuất câu trả lời từ cấu trúc OpenAI-compatible của GoClaw
        const aiText = data.choices?.[0]?.message?.content || data.reply || "Bot đang xử lý dữ liệu...";
        return res.status(200).json({ reply: aiText });

    } catch (error) {
        console.error('Crash Error:', error);
        return res.status(500).json({ error: 'Server Error', details: error.message });
    }
}
