export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { message, history } = req.body;
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();
        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: 'Thiếu API Key trên Vercel.' });
        }

        const systemPrompt = `Bạn là Trợ lý AI của Thầy Tấn (Tanlab). Tư vấn khóa học "21 Ngày Biến Video Thành Tài Sản". Zalo: https://zalo.me/g/p3iiiavxtief7jwno67l. Trả lời ngắn gọn, thân thiện bằng tiếng Việt.`;

        let contents = [];
        if (!history || history.length === 0) {
            contents.push({ role: 'user', parts: [{ text: `HỆ THỐNG: ${systemPrompt}\n\nChào bạn.` }] });
            contents.push({ role: 'model', parts: [{ text: "Chào bạn! Mình là Trợ Lý AI của Thầy Tấn. Rất vui được hỗ trợ bạn. Bạn cần tư vấn về khóa học hay kỹ năng gì nào?" }] });
        } else {
            history.forEach(h => {
                contents.push({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] });
            });
        }

        if (contents.length > 0 && contents[contents.length-1].role === 'user') {
            contents[contents.length-1].parts[0].text += `\n\nKHÁCH HÀNG: ${message}`;
        } else {
            contents.push({ role: 'user', parts: [{ text: message }] });
        }

        // Danh sách các model để thử (theo thứ tự ưu tiên)
        const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro'];
        let lastError = '';

        for (const modelName of models) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: contents,
                        generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
                    })
                });

                const data = await response.json();
                if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
                }
                lastError = data.error?.message || 'Lỗi không xác định';
            } catch (e) {
                lastError = e.message;
            }
        }

        return res.status(500).json({ 
            error: 'AI Error', 
            details: `Đã thử ${models.join(', ')} nhưng đều thất bại. Lỗi cuối: ${lastError}. Vui lòng kiểm tra lại API Key hoặc quyền truy cập model.` 
        });

    } catch (error) {
        console.error('Crash Error:', error);
        return res.status(500).json({ error: 'Server Error', details: error.message });
    }
}
