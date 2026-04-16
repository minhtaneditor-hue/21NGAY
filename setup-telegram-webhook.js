/**
 * HƯỚNG DẪN: Chạy script này 1 lần sau khi deploy lên Vercel
 * 
 * Cách dùng:
 *   node setup-telegram-webhook.js https://YOUR-VERCEL-DOMAIN.vercel.app
 * 
 * Ví dụ: 
 *   node setup-telegram-webhook.js https://21ngay.vercel.app
 */

const BOT_TOKEN = '8753662126:AAHjqwCiSyn50oxIg7ABgebgh_B1tiWNX0E';

async function setupWebhook() {
    const domain = process.argv[2];
    
    if (!domain) {
        console.error('❌ Lỗi: Vui lòng cung cấp domain Vercel!');
        console.error('Cách dùng: node setup-telegram-webhook.js https://YOUR-DOMAIN.vercel.app');
        process.exit(1);
    }

    const webhookUrl = `${domain}/api/telegram-webhook`;
    
    console.log(`🔧 Đang cài đặt Telegram Webhook...`);
    console.log(`   URL: ${webhookUrl}`);
    
    try {
        // 1. Xóa webhook cũ trước
        const deleteRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`);
        const deleteData = await deleteRes.json();
        console.log('🗑️ Xóa webhook cũ:', deleteData.ok ? 'Thành công' : 'Thất bại');

        // 2. Đặt webhook mới
        const setRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: webhookUrl,
                allowed_updates: ['callback_query', 'message']
            })
        });
        const setData = await setRes.json();
        console.log('✅ Cài webhook mới:', setData.ok ? 'Thành công' : 'Thất bại');
        console.log('   Chi tiết:', setData.description);

        // 3. Kiểm tra lại
        const infoRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`);
        const infoData = await infoRes.json();
        console.log('\n📊 Thông tin webhook hiện tại:');
        console.log(`   URL: ${infoData.result.url}`);
        console.log(`   Pending updates: ${infoData.result.pending_update_count}`);
        console.log(`   Last error: ${infoData.result.last_error_message || 'Không có lỗi'}`);
        
        console.log('\n🎉 Hoàn tất! Hãy thử bấm nút trên Telegram để kiểm tra.');
    } catch (err) {
        console.error('❌ Lỗi:', err.message);
    }
}

setupWebhook();
