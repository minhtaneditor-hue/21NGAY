export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const { message, history } = req.body;
        const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim();

        if (!OPENAI_API_KEY) {
            return res.status(200).json({ 
                reply: "Hệ thống đang chuyển đổi sang ChatGPT. Vui lòng cấu hình OPENAI_API_KEY trên Vercel để bắt đầu trò chuyện." 
            });
        }

        const systemPrompt = `Bạn là Trợ lý AI của Thầy Tấn (Tanlab). Nhiệm vụ: Tư vấn khóa học "21 Ngày Biến Video Thành Tài Sản". Zalo hỗ trợ: https://zalo.me/g/p3iiiavxtief7jwno67l. Phong cách: Thân thiện, chuyên nghiệp, trả lời ngắn gọn bằng tiếng Việt.`;

        let messages = [
            { role: "system", content: systemPrompt }
        ];

        if (history && history.length > 0) {
            history.forEach(h => {
                messages.push({
                    role: h.role === 'user' ? 'user' : 'assistant',
                    content: h.text
                });
            });
        }

        messages.push({ role: "user", content: message });

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: messages,
                temperature: 0.7,
                max_tokens: 800
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('OpenAI Error:', data);
            return res.status(200).json({ 
                reply: `Lỗi kết nối ChatGPT: ${data.error?.message || 'Không xác định'}. Bạn hãy nhắn Zalo hỗ trợ nhé: https://zalo.me/g/p3iiiavxtief7jwno67l` 
            });
        }

        const aiText = data.choices?.[0]?.message?.content || "Mình đang bận chút, nhắn lại sau nhé!";
        return res.status(200).json({ reply: aiText });

    } catch (error) {
        console.error('Crash Error:', error);
        return res.status(500).json({ error: 'Server Error', details: error.message });
    }
}
