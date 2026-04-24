export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { message, history } = req.body;
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();
        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: 'Thiếu API Key' });
        }

        const systemPrompt = `Bạn là Trợ lý AI của Thầy Tấn (Tanlab). Tư vấn khóa học "21 Ngày Biến Video Thành Tài Sản". Zalo: https://zalo.me/g/p3iiiavxtief7jwno67l. Trả lời ngắn gọn, thân thiện bằng tiếng Việt.`;

        // Sử dụng v1/gemini-pro là bản ổn định nhất, hỗ trợ rộng rãi nhất
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
        
        let contents = [];
        
        // Cấu trúc đơn giản nhất có thể để tránh lỗi
        if (!history || history.length === 0) {
            contents.push({
                role: 'user',
                parts: [{ text: `HỆ THỐNG: ${systemPrompt}\n\nChào bạn.` }]
            });
            contents.push({
                role: 'model',
                parts: [{ text: "Chào bạn! Mình là Trợ Lý AI của Thầy Tấn. Rất vui được hỗ trợ bạn về khóa học. Bạn cần giúp gì nào?" }]
            });
        } else {
            // Đảm bảo history luôn bắt đầu bằng user và xen kẽ user-model
            history.forEach(h => {
                contents.push({
                    role: h.role === 'user' ? 'user' : 'model',
                    parts: [{ text: h.text }]
                });
            });
        }

        // Đảm bảo tin nhắn cuối cùng là user
        if (contents.length > 0 && contents[contents.length-1].role === 'user') {
            // Nếu cuối là user, ta không thêm message trực tiếp mà gộp vào
            contents[contents.length-1].parts[0].text += `\n\nKHÁCH HÀNG: ${message}`;
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
            // Nếu gemini-pro trên v1 cũng tạch, thử v1beta/gemini-1.5-flash như phương án cuối
            const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
            const fbRes = await fetch(fallbackUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: contents })
            });
            const fbData = await fbRes.json();
            
            if (fbRes.ok) {
                const aiText = fbData.candidates?.[0]?.content?.parts?.[0]?.text || "Lỗi phản hồi";
                return res.status(200).json({ reply: aiText });
            }

            return res.status(500).json({ 
                error: 'AI Error', 
                details: `V1: ${data.error?.message} | V1Beta: ${fbData.error?.message}` 
            });
        }

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Mình đang bận chút, nhắn lại sau nhé!";
        return res.status(200).json({ reply: aiText });

    } catch (error) {
        console.error('Crash Error:', error);
        return res.status(500).json({ error: 'Server Error', details: error.message });
    }
}
