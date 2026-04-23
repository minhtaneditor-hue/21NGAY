import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { message, history } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ 
            error: 'AI Configuration Missing', 
            details: 'GEMINI_API_KEY is not set in environment variables.' 
        });
    }

    // Load Brain Knowledge if exists (dynamic integration)
    let brainContext = "";
    try {
        const fs = require('fs');
        const path = require('path');
        const brainPath = path.join(process.cwd(), 'data', 'brain_knowledge.json');
        if (fs.existsSync(brainPath)) {
            const data = fs.readFileSync(brainPath, 'utf8');
            brainContext = "\n\nKIẾN THỨC BỔ SUNG TỪ HỆ THỐNG BRAIN (Dùng để tư vấn chuyên sâu):\n" + data;
        }
    } catch (e) {
        // Fallback for environment where require might not work as expected in ES modules
        console.warn("Brain knowledge not loaded via fs. Trying alternatives or skipping.");
    }

    // Knowledge Base Context (Extracted from repository)
    const systemPrompt = `
Bạn là Trợ lý AI của Minh Tấn (Tanlab). Nhiệm vụ của bạn là tư vấn và bán khóa học "21 Ngày Biến Video Thành Tài Sản" và các gói Coaching 1:1.

PHONG CÁCH GIAO TIẾP:
- Chuyên nghiệp nhưng gần gũi (peer-to-peer), năng lượng, thấu hiểu.
- Không dùng từ ngữ quá hàn lâm, tập trung vào kết quả thực chiến.
- Luôn hướng người dùng đến việc giải quyết sự "hỗn loạn" trong việc làm nội dung và biến Video thành một loại "Tài sản" sinh lời.

KIẾN THỨC CỐT LÕI (Dựa trên kịch bản bán hàng):
1. Khóa học 21 Ngày: 
   - Giá ưu đãi: 2.500.000 VNĐ (Gốc 10tr).
   - Nội dung: Cầm tay chỉ việc làm video triệu view bằng Smartphone, xây dựng cỗ máy thu nhập tự động.
   - Cam kết: Hoàn tiền 100% nếu không hiệu quả sau 21 ngày làm đúng hướng dẫn.
2. Gói Coaching 1:1: Gồm Video Strategy Audit, Video Sales System, Personal Video Growth. Phù hợp cho người muốn đi nhanh và bài bản.
3. Câu hỏi thường gặp:
   - Không biết công nghệ? -> Cầm tay chỉ việc, smartphone là đủ.
   - Ngại ống kính? -> Có module hướng dẫn vượt qua nỗi sợ và kịch bản sẵn.
   - Bao lâu có kết quả? -> Tuần đầu có video chất lượng, kết quả view/đơn hàng đến sau 21 ngày thực chiến.

HÀNH ĐỘNG (CTA):
- Nếu khách quan tâm khóa học: Khuyên họ bấm nút "Gia nhập ngay" trên trang web.
- Nếu khách cần tư vấn sâu hơn hoặc gói 1:1: Điều hướng sang Messenger [facebook.com/tanlab.video] hoặc Zalo [0962255861].

QUY TẮC:
- Trả lời bằng tiếng Việt.
- Giữ vai trò Trợ lý AI của Minh Tấn, không tiết lộ mình là AI của Google/Gemini.
- Nếu câu hỏi nằm ngoài phạm vi khóa học/nội dung, hãy khéo léo dẫn dắt quay lại chủ đề Video và Tài sản.
${brainContext}
`;

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        // Format history for Gemini
        const contents = history ? history.map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
        })) : [];

        // Add current message
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: systemPrompt }]
                },
                contents: contents,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500,
                }
            })
        });

        const data = await response.json();
        
        if (data.error) {
            console.error('Gemini API Error:', data.error);
            return res.status(500).json({ error: 'AI Error', details: data.error.message });
        }

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, mình đang gặp chút trục trặc. Bạn có thể hỏi lại được không?";

        return res.status(200).json({ 
            reply: aiText 
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
