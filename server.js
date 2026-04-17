const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from api/.env for local/VPS consistency
dotenv.config({ path: path.join(__dirname, 'api', '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from root
app.use(express.static(__dirname));

// Route API requests to Vercel-style handlers
const handlers = {
    'submit': require('./api/submit'),
    'check-status': require('./api/check-status'),
    'cron': require('./api/cron'),
    'sepay-webhook': require('./api/sepay-webhook'),
    'telegram-webhook': require('./api/telegram-webhook'),
    'admin': require('./api/admin')
};

// Map /api/:path to the corresponding handler
app.all('/api/:action', async (req, res) => {
    const action = req.params.action;
    const handler = handlers[action];
    
    if (handler && typeof handler.default === 'function') {
        try {
            await handler.default(req, res);
        } catch (error) {
            console.error(`API Error (${action}):`, error);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    } else {
        res.status(404).json({ success: false, error: 'API Endpoint Not Found' });
    }
});

// Fallback to index.html for SPA if needed (optional)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints registered: ${Object.keys(handlers).join(', ')}`);
});
