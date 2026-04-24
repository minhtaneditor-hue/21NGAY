export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const { message, history } = req.body;
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();

        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: 'Cấu hình AI chưa hoàn tất (Thiếu API Key).' });
        }

        const systemPrompt = `Bạn là Trợ lý AI của Thầy Tấn (Tanlab). Nhiệm vụ: Tư vấn khóa học "21 Ngày Biến Video Thành Tài Sản". Zalo hỗ trợ: https://zalo.me/g/p3iiiavxtief7jwno67l. Phong cách: Thân thiện, chuyên nghiệp, trả lời ngắn gọn bằng tiếng Việt. Hành động: Luôn hướng khách hàng tham gia khóa học hoặc nhắn Zalo tư vấn.`;

        // Sử dụng v1beta với systemInstruction chuẩn
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const systemInstruction = {
            parts: [{ text: systemPrompt }]
        };

        let contents = [];
        if (history && history.length > 0) {
            history.forEach(h => {
                contents.push({
                    role: h.role === 'user' ? 'user' : 'model',
                    parts: [{ text: h.text }]
                });
            });
        }
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemInstruction: systemInstruction,
                contents: contents,
                generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('Gemini Error:', data);
            // HƯỚNG KHÁC: Nếu AI lỗi, trả về tin nhắn điều hướng Zalo ngay lập tức
            return res.status(200).json({ 
                reply: "Xin lỗi bạn, trợ lý AI đang bận tư vấn cho nhiều học viên khác. Để được hỗ trợ nhanh nhất và nhận ưu đãi, bạn hãy nhắn trực tiếp cho Thầy Tấn qua Zalo này nhé: https://zalo.me/g/p3iiiavxtief7jwno67l" 
            });
        }

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Mình đang bận chút, nhắn lại sau nhé!";
        return res.status(200).json({ reply: aiText });

    } catch (error) {
        console.error('Crash Error:', error);
        return res.status(500).json({ error: 'Server Error', details: error.message });
    }
}
