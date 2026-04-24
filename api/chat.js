export default async function handler(req, res) {
    try {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();
        if (!GEMINI_API_KEY) return res.status(200).json({ reply: "Lỗi: Thiếu API Key" });

        const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
        const listRes = await fetch(listUrl);
        const listData = await listRes.json();
        
        if (!listRes.ok) {
            return res.status(200).json({ reply: `Lỗi ListModels: ${listData.error?.message}. Key: ${GEMINI_API_KEY.substring(0, 4)}...` });
        }

        const modelNames = listData.models?.map(m => m.name.replace('models/', '')) || [];
        return res.status(200).json({ reply: `Models available: ${modelNames.join(', ')}` });

    } catch (error) {
        return res.status(200).json({ reply: `Crash: ${error.message}` });
    }
}
