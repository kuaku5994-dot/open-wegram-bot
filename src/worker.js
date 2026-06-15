export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const token = env.BOT_TOKEN;

        // 处理 GET 请求
        if (request.method === 'GET') {
            return new Response('Falcon Bot is running! Send /start on Telegram.');
        }

        // 处理 POST 请求 (Telegram Webhook)
        if (request.method === 'POST') {
            try {
                const update = await request.json();
                const chatId = update.message?.chat?.id;
                const text = update.message?.text;

                // 如果有消息，就回复
                if (chatId && text) {
                    // 调用 Telegram API 发送消息
                    const apiUrl = `https://api.telegram.org/bot${token}/sendMessage`;
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            text: `✅ 收到消息: ${text}`
                        })
                    });

                    const result = await response.json();
                    // 如果发送失败，记录错误（可选）
                    if (!result.ok) {
                        console.error('Telegram API Error:', result.description);
                    }
                }

                return new Response('OK');
            } catch (error) {
                console.error('Worker Error:', error.message);
                return new Response('Error: ' + error.message, { status: 500 });
            }
        }

        return new Response('Not Found', { status: 404 });
    }
};
