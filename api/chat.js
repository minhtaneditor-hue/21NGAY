export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const { message, history } = req.body;
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();

        if (!GEMINI_API_KEY) {
            return res.status(200).json({ reply: "Lỗi: Thiếu GEMINI_API_KEY trên Vercel." });
        }

        const systemPrompt = `Bạn là Trợ lý AI của Thầy Tấn (Tanlab). Nhiệm vụ: Tư vấn khóa học "21 Ngày Biến Video Thành Tài Sản". Zalo hỗ trợ: https://zalo.me/g/p3iiiavxtief7jwno67l. Phong cách: Thân thiện, chuyên nghiệp, trả lời ngắn gọn bằng tiếng Việt.`;

        // Sử dụng Gemini 1.5 Pro theo yêu cầu (Gama/Gemini Pro)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;
        
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
                systemInstruction: { parts: [{ text: systemPrompt }] },
                contents: contents,
                generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            // Nếu Pro lỗi, thử lại lần cuối với Flash để cứu vãn
            const flashUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
            const flashRes = await fetch(flashUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ systemInstruction: { parts: [{ text: systemPrompt }] }, contents: contents })
            });
            const flashData = await flashRes.json();
            
            if (flashRes.ok) return res.status(200).json({ reply: flashData.candidates?.[0]?.content?.parts?.[0]?.text });

            return res.status(200).json({ 
                reply: `Lỗi kết nối AI: ${data.error?.message || 'Không xác định'}. Bạn nhắn Zalo cho Thầy Tấn nhé: https://zalo.me/g/p3iiiavxtief7jwno67l` 
            });
        }

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Mình đang bận chút, nhắn lại sau nhé!";
        return res.status(200).json({ reply: aiText });

    } catch (error) {
        console.error('Crash Error:', error);
        return res.status(500).json({ error: 'Server Error', details: error.message });
    }
}
