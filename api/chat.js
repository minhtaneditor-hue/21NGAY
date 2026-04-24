export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const { message, history } = req.body;
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();

        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: 'Cấu hình AI chưa hoàn tất (Thiếu API Key).' });
        }

        const systemPrompt = `Bạn là Trợ lý AI của Thầy Tấn (Tanlab). Nhiệm vụ: Tư vấn khóa học "21 Ngày Biến Video Thành Tài Sản". Zalo hỗ trợ: https://zalo.me/g/p3iiiavxtief7jwno67l. Phong cách: Thân thiện, chuyên nghiệp, trả lời ngắn gọn bằng tiếng Việt. Hành động: Luôn hướng khách hàng tham gia khóa học hoặc nhắn Zalo tư vấn.`;

        // Sử dụng v1beta và gemini-1.5-flash (đã xác nhận là khả dụng)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        let contents = [];
        const fullSystemPrompt = `HỆ THỐNG: ${systemPrompt}\n\n`;

        if (!history || history.length === 0) {
            contents.push({
                role: 'user',
                parts: [{ text: fullSystemPrompt + "Chào bạn, hãy bắt đầu tư vấn cho tôi." }]
            });
            contents.push({
                role: 'model',
                parts: [{ text: "Chào bạn! Mình là Trợ Lý AI của Thầy Tấn. Rất vui được hỗ trợ bạn. Bạn đang quan tâm đến việc xây dựng kênh video hay kỹ năng quay dựng nào nhỉ?" }]
            });
        } else {
            history.forEach((h, index) => {
                contents.push({
                    role: h.role === 'user' ? 'user' : 'model',
                    parts: [{ text: (index === 0 && h.role === 'user' ? fullSystemPrompt : "") + h.text }]
                });
            });
        }

        // Đảm bảo user-model-user
        if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
            contents[contents.length - 1].parts[0].text += `\n\nKHÁCH HÀNG: ${message}`;
        } else {
            contents.push({
                role: 'user',
                parts: [{ text: message }]
            });
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: contents,
                generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('Gemini Error:', data);
            return res.status(response.status).json({ 
                error: 'Gemini API Error', 
                details: data.error?.message || 'Lỗi không xác định' 
            });
        }

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Mình đang bận chút, nhắn lại sau nhé!";
        return res.status(200).json({ reply: aiText });

    } catch (error) {
        console.error('Crash Error:', error);
        return res.status(500).json({ error: 'Server Error', details: error.message });
    }
}
