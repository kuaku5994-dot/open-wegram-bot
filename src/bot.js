// Falcon Team Bot - 完整功能版

// ==================== 按钮配置（可以随意修改）====================
const BUTTONS = [
    {
        id: "know",
        text: "1️⃣ Know Falcon Team",
        reply: `🔍 Know Falcon Team

Falcon Team is a group of blockchain security experts with 5+ years of experience in:
• Crypto asset tracking
• Smart contract auditing
• On-chain investigation

We are committed to helping victims of crypto scams.`
    },
    {
        id: "about",
        text: "2️⃣ About Falcon Team",
        reply: `🦅 About Falcon Team

• Founded in 2021
• Team of 15+ blockchain experts
• Recovered over $50M in stolen assets
• Partners with major exchanges and law enforcement

Our mission: Make crypto space safer for everyone.`
    },
    {
        id: "contact",
        text: "3️⃣ Contact Falcon Team",
        reply: `📞 Contact Falcon Team

• Email: support@falconteam.com
• Telegram: @FalconTeamSupport
• Twitter: @FalconTeam
• Response time: Within 24 hours

For urgent recovery cases, please provide:
- Transaction hash
- Wallet address involved
- Description of incident`
    },
    {
        id: "recovery",
        text: "4️⃣ Crypto Recovery",
        reply: `💰 Crypto Recovery Service

Our recovery process:
1️⃣ Free initial consultation
2️⃣ On-chain investigation
3️⃣ Exchange coordination
4️⃣ Legal support (if needed)

Success rate: ~78% for scam-related cases

Note: We do NOT request private keys or seed phrases. Stay safe!`
    }
];

// Telegram API 请求封装
async function tg(token, method, body) {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return res.json();
}

// 构建菜单键盘
function getMenu() {
    const keyboard = BUTTONS.map(btn => [{ text: btn.text, callback_data: btn.id }]);
    return { inline_keyboard: keyboard };
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        
        // GET 请求：用于测试和设置 webhook
        if (request.method === 'GET') {
            // 测试端点
            if (url.pathname === '/') {
                return new Response('Falcon Team Bot is running! Visit /setup to configure webhook.', { status: 200 });
            }
            
            // 设置 webhook
            if (url.pathname === '/setup') {
                const webhookUrl = `https://${url.host}/webhook`;
                const result = await tg(env.BOT_TOKEN, 'setWebhook', { url: webhookUrl });
                return new Response(JSON.stringify({ webhook_url: webhookUrl, result }, null, 2), {
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            
            // 检查 webhook 状态
            if (url.pathname === '/status') {
                const result = await tg(env.BOT_TOKEN, 'getWebhookInfo', {});
                return new Response(JSON.stringify(result, null, 2), {
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            
            return new Response('Not Found', { status: 404 });
        }
        
        // POST 请求：接收 Telegram 消息
        if (request.method === 'POST' && url.pathname === '/webhook') {
            const update = await request.json();
            const token = env.BOT_TOKEN;
            
            // 处理 /start 命令
            if (update.message?.text === '/start') {
                await tg(token, 'sendMessage', {
                    chat_id: update.message.chat.id,
                    text: '👋 Welcome to Falcon Team!\n\nPlease select an option below:',
                    reply_markup: getMenu(),
                    parse_mode: 'HTML'
                });
            }
            
            // 处理按钮点击
            else if (update.callback_query) {
                const query = update.callback_query;
                const button = BUTTONS.find(b => b.id === query.data);
                
                if (button) {
                    await tg(token, 'editMessageText', {
                        chat_id: query.message.chat.id,
                        message_id: query.message.message_id,
                        text: button.reply,
                        reply_markup: getMenu(),
                        parse_mode: 'HTML'
                    });
                }
                
                // 确认按钮点击
                await tg(token, 'answerCallbackQuery', {
                    callback_query_id: query.id
                });
            }
            
            // 处理普通消息（转发给管理员）
            else if (update.message?.text) {
                const msg = update.message;
                // 自动回复
                await tg(token, 'sendMessage', {
                    chat_id: msg.chat.id,
                    text: '✅ Message received! Our team will get back to you soon.'
                });
                // 转发给管理员
                if (env.ADMIN_USER_ID) {
                    await tg(token, 'sendMessage', {
                        chat_id: env.ADMIN_USER_ID,
                        text: `📨 New message from @${msg.from.username || msg.from.first_name}\n🆔 ${msg.from.id}\n💬 ${msg.text}`
                    });
                }
            }
            
            return new Response('OK', { status: 200 });
        }
        
        return new Response('Not Found', { status: 404 });
    }
};
