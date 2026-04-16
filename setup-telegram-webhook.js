/**
 * SETUP TELEGRAM WEBHOOK CHO BOT 21 NGÀY
 * 
 * Chạy 1 lần sau khi deploy:
 *   node setup-telegram-webhook.js
 */

const BOT_TOKEN = '8711452465:AAE6iG51e8yUBn0Fbt09EeMTckWLpRxN0vs';
const WEBHOOK_URL = 'https://khoahoc.minhtanacademy.com/api/telegram-webhook';

async function setup() {
    console.log('🔧 Đang cài đặt Telegram Webhook...');
    console.log(`   Bot: ${BOT_TOKEN.split(':')[0]}`);
    console.log(`   URL: ${WEBHOOK_URL}`);

    try {
        // Xóa webhook cũ
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`);
        console.log('🗑️  Đã xóa webhook cũ');

        // Đặt webhook mới
        const setRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: WEBHOOK_URL,
                allowed_updates: ['callback_query', 'message']
            })
        });
        const setData = await setRes.json();
        console.log('✅ Kết quả:', setData.ok ? 'THÀNH CÔNG' : 'THẤT BẠI');
        console.log('   ', setData.description);

        // Kiểm tra
        const infoRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`);
        const info = await infoRes.json();
        console.log('\n📊 Webhook hiện tại:');
        console.log(`   URL: ${info.result.url}`);
        console.log(`   Pending: ${info.result.pending_update_count}`);
        console.log(`   Last error: ${info.result.last_error_message || 'Không có'}`);
    } catch (err) {
        console.error('❌ Lỗi:', err.message);
    }
}

setup();
