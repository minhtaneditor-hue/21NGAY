export default async function handler(req, res) {
    const { pw } = req.query;
    
    // Check password
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin21day';
    
    if (pw !== ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL;
        
        // Fetch data from Google Sheet (doGet)
        const response = await fetch(GOOGLE_SHEET_URL, { redirect: 'follow' });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Apps Script Fetch Failed:', errorText);
            throw new Error(`Google Apps Script returned ${response.status}`);
        }
        const result = await response.json();
        const rawData = result.data || result;
        
        return res.status(200).json({ 
            success: true, 
            data: rawData.map(item => {
                const normalized = { ...item };
                
                // Intelligent Mapping Logic
                for (const key in item) {
                    const lowerKey = key.toLowerCase();
                    const val = String(item[key] || "").trim();
                    if (!val) continue;

                    if (lowerKey.includes('dấu thời gian') || lowerKey.includes('timestamp')) {
                        normalized.timestamp = val;
                    }
                    if (lowerKey.includes('họ và tên') || lowerKey.includes('name')) {
                        normalized.fullname = val;
                    }
                    if (lowerKey.includes('số điện thoại') || lowerKey.includes('phone') || lowerKey.includes('sđt')) {
                        normalized.phone = val;
                    }
                    if (lowerKey.includes('email') || lowerKey.includes('địa chỉ email')) {
                        normalized.email = val;
                    }
                    if (lowerKey.includes('status') || lowerKey.includes('trạng thái')) {
                        normalized.status = val;
                    }
                    if (lowerKey === 'type') {
                        normalized.type = val;
                    }
                    if (lowerKey === 'mail_welcome') {
                        normalized.mailWelcomeSent = val;
                    }
                    if (lowerKey === 'mail_payment') {
                        normalized.mailPaymentSent = val;
                    }
                    if (lowerKey === 'package') {
                        normalized.package = val;
                    }
                    if (lowerKey === 'amount') {
                        normalized.amount = val;
                    }
                    if (lowerKey === 'orderid') {
                        normalized.orderId = val;
                    }
                    if (lowerKey === 'promocode') {
                        normalized.promoCode = val;
                    }
                }

                // Heuristic Overrides
                if (normalized.fullname && /^\d+$/.test(normalized.fullname.replace(/[\s\.\-\+]/g, '')) && normalized.fullname.length >= 8) {
                    if (!normalized.phone || normalized.phone.length < 5) {
                        normalized.phone = normalized.fullname;
                        normalized.fullname = item['địa chỉ email'] || item['name'] || 'Khách hàng';
                    }
                }
                
                // If status marker found anywhere
                for (const key in item) {
                    const val = String(item[key] || "").trim().toUpperCase();
                    if (['PAID', 'CANCELLED', 'REMINDED', 'PENDING'].includes(val)) {
                        normalized.status = val;
                    }
                }

                // Auto-detect type from package if not set
                if (!normalized.type) {
                    const pkg = (normalized.package || '').toUpperCase();
                    if (pkg.includes('COACHING')) normalized.type = 'Coaching';
                    else if (pkg.includes('ELEARN') || pkg.includes('21NGAY') || pkg.includes('ONLINE')) normalized.type = 'E-learning';
                }

                // Final Cleanups
                normalized.timestamp = normalized.timestamp || item.timestamp || item.ts || '';
                normalized.fullname = normalized.fullname || 'Ẩn danh';
                normalized.status = (normalized.status || 'PENDING').toUpperCase();
                normalized.type = normalized.type || '';
                normalized.mailWelcomeSent = normalized.mailWelcomeSent || '';
                normalized.mailPaymentSent = normalized.mailPaymentSent || '';

                return normalized;
            })
        });
    } catch (error) {
        console.error('Admin API Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch data' });
    }
}
