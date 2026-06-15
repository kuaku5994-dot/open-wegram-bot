// ==================== 配置区域 ====================
// 在这里设置你的4个按钮和对应的回复内容

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

// ==================== 以下代码请勿修改 ====================

// 构建菜单键盘
function getMainMenu() {
    const keyboard = [];
    for (const btn of BUTTONS) {
        keyboard.push([{ text: btn.text, callback_data: `menu_${btn.id}` }]);
    }
    return { inline_keyboard: keyboard };
}

// 处理 /start 命令
async function handleStart(ctx, env) {
    const welcomeMsg = `👋 Welcome to Falcon Team!

Please select an option below to learn more:`;

    return {
        method: "sendMessage",
        chat_id: ctx.message.chat.id,
        text: welcomeMsg,
        reply_markup: getMainMenu(),
        parse_mode: "HTML"
    };
}

// 处理按钮点击
async function handleCallback(ctx, env) {
    const data = ctx.callback_query.data;
    const buttonId = data.replace("menu_", "");
    const button = BUTTONS.find(btn => btn.id === buttonId);
    
    if (button) {
        return {
            method: "editMessageText",
            chat_id: ctx.callback_query.message.chat.id,
            message_id: ctx.callback_query.message.message_id,
            text: button.reply,
            reply_markup: getMainMenu(),
            parse_mode: "HTML"
        };
    }
    
    return {
        method: "answerCallbackQuery",
        callback_query_id: ctx.callback_query.id,
        text: "Please use the menu buttons."
    };
}

// 处理普通用户消息（转发给管理员）
async function handleUserMessage(ctx, env) {
    const message = ctx.message;
    const sender = message.from;
    const adminId = env.ADMIN_USER_ID;
    
    let forwardText = `📨 New message from user:\n`;
    forwardText += `👤 Name: ${sender.first_name} ${sender.last_name || ''}\n`;
    forwardText += `🆔 User ID: ${sender.id}\n`;
    forwardText += `💬 Message: ${message.text || '(non-text message)'}`;
    
    // 转发给管理员
    await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: adminId,
            text: forwardText
        })
    });
    
    // 回复用户
    return {
        method: "sendMessage",
        chat_id: message.chat.id,
        text: "✅ Message received! We will reply you shortly."
    };
}

// 处理管理员回复
async function handleAdminReply(ctx, env) {
    const message = ctx.message;
    const replyToMessage = message.reply_to_message;
    
    if (replyToMessage && replyToMessage.text) {
        // 从转发的消息中提取用户ID
        const userText = replyToMessage.text;
        const match = userText.match(/🆔 User ID: (\d+)/);
        
        if (match) {
            const originalUserId = match[1];
            const replyText = message.text;
            
            await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: originalUserId,
                    text: `🤖 Falcon Team:\n\n${replyText}`
                })
            });
            
            return {
                method: "sendMessage",
                chat_id: message.chat.id,
                text: "✅ Reply sent to user."
            };
        }
    }
    return null;
}

// 主入口
export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        
        // 处理安装请求
        if (path === `/${env.PREFIX}/install/${env.ADMIN_USER_ID}/${env.BOT_TOKEN}`) {
            return new Response(JSON.stringify({ ok: true, message: "Bot installed successfully!" }), {
                headers: { "Content-Type": "application/json" }
            });
        }
        
        // 处理 Telegram webhook
        if (path === `/webhook/${env.BOT_TOKEN}` && request.method === "POST") {
            const update = await request.json();
            
            // 处理 /start 命令
            if (update.message && update.message.text === "/start") {
                const response = await handleStart(update, env);
                await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/${response.method}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(response)
                });
            }
            // 处理按钮点击
            else if (update.callback_query) {
                const response = await handleCallback(update, env);
                if (response.method === "answerCallbackQuery") {
                    await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/${response.method}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(response)
                    });
                } else {
                    await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/${response.method}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(response)
                    });
                }
            }
            // 处理管理员回复
            else if (update.message && update.message.reply_to_message) {
                const response = await handleAdminReply(update, env);
                if (response) {
                    await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/${response.method}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(response)
                    });
                }
            }
            // 处理普通用户消息
            else if (update.message && update.message.text) {
                const response = await handleUserMessage(update, env);
                await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/${response.method}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(response)
                });
            }
            
            return new Response("OK", { status: 200 });
        }
        
        return new Response("Not Found", { status: 404 });
    }
};
