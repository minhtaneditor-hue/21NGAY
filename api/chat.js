export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const { message, history } = req.body;
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();

        if (!GEMINI_API_KEY) {
            return res.status(200).json({ 
                reply: "⚠️ Lỗi: Bạn chưa cấu hình GEMINI_API_KEY trên Vercel. Hãy dán API Key vào Vercel để kích hoạt model Gemma 4 31B IT này nhé!" 
            });
        }

        const systemPrompt = `Bạn là Trợ lý AI của Thầy Tấn (Tanlab). Nhiệm vụ: Tư vấn khóa học "21 Ngày Biến Video Thành Tài Sản". Link Zalo: https://zalo.me/g/p3iiiavxtief7jwno67l. Phong cách: Thân thiện, chuyên nghiệp, trả lời ngắn gọn bằng tiếng Việt.`;

        // Sử dụng Gemma 4 31B IT theo yêu cầu chính xác của bạn
        const modelsToTry = ['gemma-4-31b-it', 'gemma-4-31b', 'gemini-1.5-pro'];
        let lastError = '';

        for (const modelName of modelsToTry) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        systemInstruction: { parts: [{ text: systemPrompt }] },
                        contents: history && history.length > 0 
                            ? [...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })), { role: 'user', parts: [{ text: message }] }]
                            : [{ role: 'user', parts: [{ text: message }] }],
                        generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
                    })
                });

                const data = await response.json();
                if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
                }
                lastError = data.error?.message || 'Lỗi model';
            } catch (e) {
                lastError = e.message;
            }
        }

        return res.status(200).json({ 
            reply: `Lỗi kết nối AI: ${lastError}. Bạn hãy nhắn Zalo hỗ trợ nhé: https://zalo.me/g/p3iiiavxtief7jwno67l` 
        });

    } catch (error) {
        console.error('Crash Error:', error);
        return res.status(500).json({ error: 'Server Error', details: error.message });
    }
}
