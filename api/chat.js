export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const { message, history } = req.body;
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();

        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: 'Cấu hình AI chưa hoàn tất (Thiếu API Key).' });
        }

        const systemPrompt = `Bạn là Trợ lý AI của Thầy Tấn (Tanlab). Nhiệm vụ: Tư vấn khóa học "21 Ngày Biến Video Thành Tài Sản". Zalo hỗ trợ: https://zalo.me/g/p3iiiavxtief7jwno67l. Phong cách: Thân thiện, chuyên nghiệp, trả lời ngắn gọn bằng tiếng Việt. Hành động: Luôn hướng khách hàng tham gia khóa học hoặc nhắn Zalo tư vấn.`;

        // Sử dụng v1beta với API Key trong Header (chuẩn hơn)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`;
        
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
            headers: { 
                'Content-Type': 'application/json',
                'x-goog-api-key': GEMINI_API_KEY
            },
            body: JSON.stringify({
                systemInstruction: systemInstruction,
                contents: contents,
                generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('Gemini Error:', data);
            // THỬ LẠI LẦN CUỐI VỚI V1 VÀ GEMINI-PRO NẾU FLASH LỖI
            const urlV1 = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
            const resV1 = await fetch(urlV1, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: contents })
            });
            const dataV1 = await resV1.json();
            
            if (resV1.ok) {
                const aiText = dataV1.candidates?.[0]?.content?.parts?.[0]?.text || "Lỗi phản hồi";
                return res.status(200).json({ reply: aiText });
            }

            // Nếu tạch hết thì trả về Zalo
            return res.status(200).json({ 
                reply: "AI hiện đang bảo trì hệ thống. Để được Thầy Tấn hỗ trợ trực tiếp và nhận ưu đãi khóa học, bạn hãy nhắn Zalo tại đây nhé: https://zalo.me/g/p3iiiavxtief7jwno67l" 
            });
        }

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Mình đang bận chút, nhắn lại sau nhé!";
        return res.status(200).json({ reply: aiText });

    } catch (error) {
        console.error('Crash Error:', error);
        return res.status(500).json({ error: 'Server Error', details: error.message });
    }
}
