export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { message, history } = req.body;
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {
            return res.status(500).json({ 
                error: 'Cấu hình AI chưa hoàn tất', 
                details: 'Thiếu API Key trên Vercel.' 
            });
        }

        const systemPrompt = `
Bạn là Trợ lý AI của Minh Tấn (Tanlab). Nhiệm vụ của bạn là tư vấn khóa học "21 Ngày Biến Video Thành Tài Sản".
Zalo nhóm: https://zalo.me/g/p3iiiavxtief7jwno67l
Trả lời ngắn gọn, thân thiện bằng tiếng Việt.
`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const contents = (history || []).map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
        }));
        contents.push({ role: 'user', parts: [{ text: message }] });

        // Sử dụng global fetch (Node 18+)
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: contents,
                generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            return res.status(response.status).json({ 
                error: 'Gemini API Error', 
                details: data.error?.message || 'Lỗi API' 
            });
        }

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Mình chưa hiểu ý bạn lắm.";
        return res.status(200).json({ reply: aiText });

    } catch (error) {
        return res.status(500).json({ error: 'Server Error', details: error.message });
    }
}
