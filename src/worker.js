// 最简化 Falcon 机器人 - 先保证能回复
export default {
    async fetch(request, env) {
        // 1. 检查是不是 Telegram 发来的消息
        if (request.method === 'POST') {
            try {
                const update = await request.json();
                const token = env.BOT_TOKEN;

                // 2. 获取用户发的消息文本和聊天 ID
                const messageText = update.message?.text;
                const chatId = update.message?.chat?.id;

                // 3. 如果有消息文本，就回复
                if (messageText && chatId) {
                    // 这是最简单的回复逻辑：用户发什么，机器人就回什么
                    let replyText = `你说的是："${messageText}"`;
                    
                    // 如果是 /start 命令，就给个欢迎语
                    if (messageText === '/start') {
                        replyText = "欢迎使用 Falcon 机器人！\n\n系统已上线，你可以继续发送任何消息，我会回复你。";
                    }

                    // 4. 发消息回去
                    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            text: replyText
                        })
                    });
                }

                return new Response('OK');
            } catch (err) {
                console.error('Error:', err);
                return new Response('Error: ' + err.message, { status: 500 });
            }
        }

        return new Response('Bot is running');
    }
};
