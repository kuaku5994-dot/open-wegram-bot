// Falcon Team Bot - 完整版带4个按钮菜单

const BUTTONS = [
    { id: "know", text: "1️⃣ Know Falcon Team", reply: `🔍 Know Falcon Team

Falcon Team is a group of blockchain security experts with 5+ years of experience in:
• Crypto asset tracking
• Smart contract auditing
• On-chain investigation

We are committed to helping victims of crypto scams.` },
    { id: "about", text: "2️⃣ About Falcon Team", reply: `🦅 About Falcon Team

• Founded in 2021
• Team of 15+ blockchain experts
• Recovered over $50M in stolen assets
• Partners with major exchanges and law enforcement

Our mission: Make crypto space safer for everyone.` },
    { id: "contact", text: "3️⃣ Contact Falcon Team", reply: `📞 Contact Falcon Team

• Email: support@falconteam.com
• Telegram: @FalconTeamSupport
• Twitter: @FalconTeam
• Response time: Within 24 hours

For urgent recovery cases, please provide:
- Transaction hash
- Wallet address involved
- Description of incident` },
    { id: "recovery", text: "4️⃣ Crypto Recovery", reply: `💰 Crypto Recovery Service

Our recovery process:
1️⃣ Free initial consultation
2️⃣ On-chain investigation
3️⃣ Exchange coordination
4️⃣ Legal support (if needed)

Success rate: ~78% for scam-related cases

Note: We do NOT request private keys or seed phrases. Stay safe!` }
];

function getMainMenu() {
    const keyboard = BUTTONS.map(btn => [{ text: btn.text, callback_data: btn.id }]);
    return { inline_keyboard: keyboard };
}

export default {
    async fetch(request, env) {
        const token = env.BOT_TOKEN;
        const adminId = env.ADMIN_USER_ID;
        
        if (request.method === 'GET') {
            return new Response('Falcon Bot is running! Send /start on Telegram.');
        }
        
        if (request.method === 'POST') {
            try {
                const update = await request.json();
                
                // 处理 /start 命令 - 显示菜单
                if (update.message?.text === '/start') {
                    const chatId = update.message.chat.id;
                    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            text: "👋 Welcome to Falcon Team!\n\nPlease select an option below:",
                            reply_markup: getMainMenu()
                        })
                    });
                }
                
                // 处理按钮点击
                else if (update.callback_query) {
                    const query = update.callback_query;
                    const buttonId = query.data;
                    const button = BUTTONS.find(b => b.id === buttonId);
                    
                    if (button) {
                        await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                chat_id: query.message.chat.id,
                                message_id: query.message.message_id,
                                text: button.reply,
                                reply_markup: getMainMenu()
                            })
                        });
                    }
                    
                    await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ callback_query_id: query.id })
                    });
                }
                
                // 处理普通消息
                else if (update.message?.text) {
                    const msg = update.message;
                    
                    // 回复用户
                    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: msg.chat.id,
                            text: "✅ Message received! Our team will get back to you soon."
                        })
                    });
                    
                    // 转发给管理员
                    if (adminId) {
                        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                chat_id: adminId,
                                text: `📨 New message:\n👤 ${msg.from.first_name}\n🆔 ${msg.from.id}\n💬 ${msg.text}`
                            })
                        });
                    }
                }
                
                return new Response('OK');
            } catch (error) {
                console.error('Error:', error.message);
                return new Response('Error: ' + error.message, { status: 500 });
            }
        }
        
        return new Response('Not Found', { status: 404 });
    }
};
