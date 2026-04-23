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
Bạn là Trợ lý AI của Minh Tấn (Tanlab).
Nhiệm vụ: Tư vấn khóa học "21 Ngày Biến Video Thành Tài Sản".
Link Zalo hỗ trợ: https://zalo.me/g/p3iiiavxtief7jwno67l
Phong cách: Thân thiện, chuyên nghiệp, trả lời ngắn gọn bằng tiếng Việt.
Hành động: Luôn hướng khách hàng tham gia khóa học hoặc nhắn Zalo tư vấn.
`;

        // Sử dụng v1beta và đưa System Prompt vào nội dung tin nhắn để đảm bảo tương thích 100%
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        // Tạo nội dung chat
        let contents = [];
        
        // Nếu là tin nhắn đầu tiên (chưa có lịch sử), ta chèn System Prompt vào trước
        if (!history || history.length === 0) {
            contents.push({
                role: 'user',
                parts: [{ text: `HỆ THỐNG: ${systemPrompt}\n\nKHÁCH HÀNG: ${message}` }]
            });
        } else {
            // Nếu đã có lịch sử, ta format theo chuẩn Gemini
            contents = history.map(h => ({
                role: h.role === 'user' ? 'user' : 'model',
                parts: [{ text: h.text }]
            }));
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
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 800,
                }
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

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Mình đang gặp chút trục trặc, bạn nhắn lại nhé!";
        return res.status(200).json({ reply: aiText });

    } catch (error) {
        console.error('Crash Error:', error);
        return res.status(500).json({ error: 'Server Error', details: error.message });
    }
}
