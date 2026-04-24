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
Bạn là Trợ lý AI của Thầy Tấn (Tanlab).
Nhiệm vụ: Tư vấn khóa học "21 Ngày Biến Video Thành Tài Sản".
Link Zalo hỗ trợ: https://zalo.me/g/p3iiiavxtief7jwno67l
Phong cách: Thân thiện, chuyên nghiệp, trả lời ngắn gọn bằng tiếng Việt.
Hành động: Luôn hướng khách hàng tham gia khóa học hoặc nhắn Zalo tư vấn.
`;

        // Sử dụng v1beta và model gemini-1.5-flash
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        let contents = [];
        
        // Gộp System Prompt vào tin nhắn đầu tiên để tránh lỗi role liên tiếp
        // và đảm bảo AI luôn tuân thủ chỉ dẫn
        const fullSystemPrompt = `HỆ THỐNG: ${systemPrompt}\n\n`;

        if (!history || history.length === 0) {
            contents.push({
                role: 'user',
                parts: [{ text: fullSystemPrompt + "Chào bạn, hãy bắt đầu tư vấn cho tôi." }]
            });
            contents.push({
                role: 'model',
                parts: [{ text: "Chào bạn! Mình là Minh Tấn đây. Rất vui được hỗ trợ bạn về khóa học '21 Ngày Biến Video Thành Tài Sản'. Bạn đang quan tâm đến phần nào của khóa học nhỉ?" }]
            });
        } else {
            // Thêm System Prompt vào tin nhắn cũ nhất trong lịch sử hoặc tin nhắn hiện tại
            history.forEach((h, index) => {
                contents.push({
                    role: h.role === 'user' ? 'user' : 'model',
                    parts: [{ text: (index === 0 && h.role === 'user' ? fullSystemPrompt : "") + h.text }]
                });
            });
        }

        // Thêm tin nhắn hiện tại
        // Kiểm tra xem tin nhắn cuối cùng trong contents có phải là 'user' không
        if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
            // Nếu cuối là user, ta chèn một câu trả lời mẫu của model để duy trì thứ tự user-model-user
            contents.push({
                role: 'model',
                parts: [{ text: "Tôi đang lắng nghe bạn, mời bạn tiếp tục." }]
            });
        }

        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        let response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: contents,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 800,
                }
            })
        });

        let data = await response.json();
        
        // --- FALLBACK LOGIC ---
        if (!response.ok && (data.error?.message?.includes('not found') || data.error?.message?.includes('not supported'))) {
            console.warn('Gemini 1.5 Flash failed, trying fallback to Gemini Pro...');
            const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
            const fallbackResponse = await fetch(fallbackUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: contents })
            });
            const fallbackData = await fallbackResponse.json();
            if (fallbackResponse.ok) {
                response = fallbackResponse;
                data = fallbackData;
            }
        }
        
        if (!response.ok) {
            console.error('Gemini Error:', data);
            return res.status(response.status).json({ 
                error: 'Gemini API Error', 
                details: data.error?.message || 'Lỗi không xác định' 
            });
        }

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Mình đang gặp chút trục trặc, bạn nhắn lại nhé!";
        return res.status(200).json({ reply: aiText });

    } catch (error) {
        console.error('Crash Error:', error);
        return res.status(500).json({ error: 'Server Error', details: error.message });
    }
}
