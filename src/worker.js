export default {
    async fetch(request, env) {
        const token = env.BOT_TOKEN;
        
        // 处理 POST 请求（Telegram 发来的消息）
        if (request.method === 'POST') {
            try {
                const update = await request.json();
                const chatId = update.message?.chat?.id;
                const text = update.message?.text;
                
                if (chatId && text) {
                    // 发送回复
                    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            text: `收到：${text}`
                        })
                    });
                }
                return new Response('OK');
            } catch (err) {
                return new Response('Error: ' + err.message);
            }
        }
        
        // GET 请求：测试用
        return new Response('Falcon Bot Running');
    }
};
