export default {
    async fetch(request, env) {
        const token = env.BOT_TOKEN;
        
        // GET 请求：测试用
        if (request.method === 'GET') {
            return new Response('Falcon Bot is running! Send /start on Telegram.');
        }
        
        // POST 请求：接收任何路径的 Telegram 消息
        if (request.method === 'POST') {
            try {
                const update = await request.json();
                
                // 获取消息信息
                const chatId = update.message?.chat?.id;
                const messageText = update.message?.text;
                const userName = update.message?.from?.first_name;
                
                if (chatId && messageText) {
                    let replyText = '';
                    
                    if (messageText === '/start') {
                        replyText = `👋 Welcome to Falcon Team, ${userName}!\n\nPlease select an option:`;
                    } else {
                        replyText = `✅ Message received: "${messageText}"\n\nOur team will get back to you soon.`;
                    }
                    
                    // 发送回复
                    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            text: replyText
                        })
                    });
                }
                
                // 处理按钮点击（暂时先不加菜单）
                if (update.callback_query) {
                    const query = update.callback_query;
                    await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            callback_query_id: query.id,
                            text: 'Menu coming soon!'
                        })
                    });
                }
                
                return new Response('OK');
            } catch (err) {
                return new Response('Error: ' + err.message, { status: 500 });
            }
        }
        
        return new Response('Not Found', { status: 404 });
    }
};
