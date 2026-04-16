export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { orderId } = req.query;
    if (!orderId) {
        return res.status(400).json({ status: 'error', message: 'Missing orderId' });
    }

    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxKOFrsrF6AsmHGzXxYDWqEZ0BoOMtfh5aU4tGjbX6Ama_6tL8mIpzFv5rNRMExIv4U/exec';

    try {
        // Gọi Google Apps Script (doGet trả về toàn bộ rows)
        const response = await fetch(GOOGLE_SHEET_URL, {
            method: 'GET',
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error('Google Sheet connection failed');
        }

        const result = await response.json();
        
        if (result.status === 'ok' && result.data) {
            // Tìm dòng có orderId khớp
            const order = result.data.find(row => row.orderId === orderId);
            
            if (order) {
                return res.status(200).json({ 
                    status: 'success', 
                    orderStatus: order.status,
                    fullname: order.fullname
                });
            } else {
                return res.status(200).json({ status: 'not_found', message: 'Order not found' });
            }
        }

        return res.status(500).json({ status: 'error', message: 'Could not parse data from Sheet' });

    } catch (error) {
        console.error('Check Status Error:', error);
        res.status(500).json({ status: 'error', error: error.message });
    }
}
