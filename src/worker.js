// ==================== 配置区域 ====================
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

// ==================== 辅助函数 ====================
function getMainMenu() {
    const keyboard = [];
    for (const btn of BUTTONS) {
        keyboard.push([{ text: btn.text, callback_data: btn.id }]);
    }
    return { inline_keyboard: keyboard };
}

async function sendTelegram(token, method, body) {
    const url = `https://api.telegram.org/bot${token}/${method}`;
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    return response.json();
}

// ==================== 主入口 ====================
export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const token = env.BOT_TOKEN;
        
        // ========== GET 请求：设置 webhook 或测试 ==========
        if (request.method === "GET") {
            // 如果访问根路径，自动设置 webhook
            if (url.pathname === "/") {
                const webhookUrl = `https://${url.host}/webhook`;
                const result = await sendTelegram(token, "setWebhook", { url: webhookUrl });
                return new Response(JSON.stringify({
                    success: true,
                    webhook_url: webhookUrl,
                    telegram_response: result
                }, null, 2), {
                    headers: { "Content-Type": "application/json" }
                });
            }
            
            // 安装机器人
            if (url.pathname === `/install/${env.ADMIN_USER_ID}/${token}`) {
                return new Response(JSON.stringify({ ok: true, message: "Bot installed successfully!" }), {
                    headers: { "Content-Type": "application/json" }
                });
            }
            
            return new Response("Send /start to your bot on Telegram!", { status: 200 });
        }
        
        // ========== POST 请求：处理 Telegram webhook ==========
        if (request.method === "POST" && url.pathname === "/webhook") {
            const update = await request.json();
            
            // 处理 /start 命令
            if (update.message && update.message.text === "/start") {
                await sendTelegram(token, "sendMessage", {
                    chat_id: update.message.chat.id,
                    text: "👋 Welcome to Falcon Team!\n\nPlease select an option below to learn more:",
                    reply_markup: getMainMenu(),
                    parse_mode: "HTML"
                });
            }
            // 处理按钮点击
            else if (update.callback_query) {
                const query = update.callback_query;
                const button = BUTTONS.find(btn => btn.id === query.data);
                
                if (button) {
                    await sendTelegram(token, "editMessageText", {
                        chat_id: query.message.chat.id,
                        message_id: query.message.message_id,
                        text: button.reply,
                        reply_markup: getMainMenu(),
                        parse_mode: "HTML"
                    });
                }
                
                // 必须响应按钮点击
                await sendTelegram(token, "answerCallbackQuery", {
                    callback_query_id: query.id
                });
            }
            // 处理普通消息（转发给管理员）
            else if (update.message && update.message.text) {
                const msg = update.message;
                const sender = msg.from;
                
                // 转发给管理员
                await sendTelegram(token, "sendMessage", {
                    chat_id: env.ADMIN_USER_ID,
                    text: `📨 New message:\n👤 ${sender.first_name} ${sender.last_name || ''}\n🆔 ${sender.id}\n💬 ${msg.text}`
                });
                
                // 回复用户
                await sendTelegram(token, "sendMessage", {
                    chat_id: msg.chat.id,
                    text: "✅ Message received! We will reply you shortly."
                });
            }
            // 处理管理员回复用户
            else if (update.message && update.message.reply_to_message) {
                const msg = update.message;
                const repliedMsg = msg.reply_to_message;
                
                if (repliedMsg && repliedMsg.text) {
                    const match = repliedMsg.text.match(/🆔 (\d+)/);
                    if (match) {
                        const userId = match[1];
                        await sendTelegram(token, "sendMessage", {
                            chat_id: userId,
                            text: `🤖 Falcon Team:\n\n${msg.text}`
                        });
                        
                        await sendTelegram(token, "sendMessage", {
                            chat_id: msg.chat.id,
                            text: "✅ Reply sent!"
                        });
                    }
                }
            }
            
            return new Response("OK", { status: 200 });
        }
        
        return new Response("Not Found", { status: 404 });
    }
};
