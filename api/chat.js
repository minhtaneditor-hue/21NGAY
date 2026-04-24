export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const { message, history } = req.body;
        const GOCLAW_API_KEY = "goclaw_fdbd13cc8b9ef960f6c4830b9011a735";
        const AGENT_ID = "tro-ly-minh-tan";

        // Thử 2 endpoint phổ biến nhất của hệ thống này
        const endpoints = [
            `https://agent.minhtanacademy.com/api/v1/chat/completions`,
            `https://agent.minhtanacademy.com/v1/chat/completions`,
            `https://agent.minhtanacademy.com/api/v1/prediction/${AGENT_ID}`
        ];

        let lastResponse = null;
        let aiText = "";

        for (const url of endpoints) {
            try {
                const isPrediction = url.includes('prediction');
                const body = isPrediction 
                    ? { question: message, history: history?.map(h => ({ role: h.role, text: h.text })) }
                    : { agent: AGENT_ID, messages: [{ role: "user", content: message }], stream: false };

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${GOCLAW_API_KEY}`
                    },
                    body: JSON.stringify(body)
                });

                if (response.ok) {
                    const data = await response.json();
                    aiText = data.choices?.[0]?.message?.content || data.text || data.reply || "";
                    if (aiText) break;
                }
            } catch (e) {
                console.error(`Failed ${url}:`, e.message);
            }
        }

        if (aiText) {
            return res.status(200).json({ reply: aiText });
        }

        return res.status(200).json({ 
            reply: "Hệ thống đang kết nối với Agent. Bạn vui lòng đợi giây lát hoặc nhắn Zalo cho Thầy Tấn nhé: https://zalo.me/g/p3iiiavxtief7jwno67l" 
        });

    } catch (error) {
        console.error('Crash Error:', error);
        return res.status(500).json({ error: 'Server Error' });
    }
}
