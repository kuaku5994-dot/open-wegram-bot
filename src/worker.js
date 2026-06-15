export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const token = env.BOT_TOKEN;
        
        // GET 请求 - 测试用
        if (request.method === 'GET') {
            return new Response('Bot is running! Send /start on Telegram.', { status: 200 });
        }
        
        // POST 请求 - 接收 Telegram 消息
        if (request.method === 'POST') {
            try {
                const update = await request.json();
                
                // 处理 /start 命令
                if (update.message && update.message.text === '/start') {
                    const chatId = update.message.chat.id;
                    
                    // 发送带菜单的欢迎消息
                    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            text: '👋 Welcome to Falcon Team!\n\nPlease select an option:',
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: '1️⃣ Know Falcon Team', callback_data: 'know' }],
                                    [{ text: '2️⃣ About Falcon Team', callback_data: 'about' }],
                                    [{ text: '3️⃣ Contact Falcon Team', callback_data: 'contact' }],
                                    [{ text: '4️⃣ Crypto Recovery', callback_data: 'recovery' }]
                                ]
                            }
                        })
                    });
                }
                
                // 处理按钮点击
                else if (update.callback_query) {
                    const query = update.callback_query;
                    const data = query.data;
                    
                    let replyText = '';
                    if (data === 'know') replyText = '🔍 Know Falcon Team - Blockchain security experts...';
                    else if (data === 'about') replyText = '🦅 About Falcon Team - Founded in 2021...';
                    else if (data === 'contact') replyText = '📞 Contact Falcon Team - Email: support@falconteam.com';
                    else if (data === 'recovery') replyText = '💰 Crypto Recovery - Free consultation available...';
                    else replyText = 'Please use the buttons.';
                    
                    // 回复按钮点击
                    await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ callback_query_id: query.id })
                    });
                    
                    // 发送回复内容
                    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: query.message.chat.id,
                            text: replyText
                        })
                    });
                }
                
                return new Response('OK', { status: 200 });
                
            } catch (err) {
                return new Response('Error: ' + err.message, { status: 500 });
            }
        }
        
        return new Response('Not Found', { status: 404 });
    }
};
