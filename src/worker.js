// Falcon Team Bot - Mobile Optimized 2-3-3 Layout

const BUTTONS = [
    { 
        id: "meet", 
        text: "🤝 Meet Falcon Team", 
        reply: `🤝 Meet Falcon Team

Falcon Team is comprised of senior blockchain security experts and legal advisors. We maintain deep working relationships with the U.S. Department of Justice (DOJ) and the Federal Bureau of Investigation (FBI).

With over five years of industry experience, we have successfully assisted numerous victims in recovering stolen assets.

Our core areas of expertise include:
• Crypto asset tracking and forensics
• Smart contract security audits
• On-chain fraud investigation
• Emergency asset freezing and loss mitigation

Our mission: Committed to helping victims of cryptocurrency fraud, recovering your financial losses, and assisting in bringing fraudsters to justice.` 
    },
    { 
        id: "about", 
        text: "🦅 About Falcon Team", 
        reply: `🦅 About Falcon Team

• Founded in 2021, deeply rooted in blockchain security
• "No Win, No Fee" model – no charges before asset recovery
• A team of over 15 blockchain experts, investigators, and legal professionals
• Successfully recovered over $50 million in stolen assets for clients to date
• Established strong partnerships with major global crypto exchanges and law enforcement agencies

Our Commitment:
Making the crypto ecosystem safer for everyone. Our legal and investigative teams work closely with law enforcement, tracing experts, regulators, and exchanges to track and recover lost or stolen crypto assets. We are also experienced in handling asset freeze petitions, fraud claims, money laundering issues, and asset recovery following hacks or unauthorized transfers.` 
    },
    { 
        id: "contact", 
        text: "📞 Contact Falcon Team", 
        reply: `📞 Contact Falcon Team

To ensure your information security and communication efficiency, please reach out to us via the following official channels:

• Email: FalconLawFirmfor@gmail.com
• Telegram Official Account 1: @FalconTeamSupport1
• Telegram Official Account 2: @FalconTeamSupport2

• Average response time: Within 24 hours

To help us process your urgent case as quickly as possible, please provide the following information when you first contact us:
- Transaction Hash (Tx Hash)
- Wallet address(es) involved
- Detailed description of the incident` 
    },
    { 
        id: "recovery", 
        text: "💰 Crypto Asset Recovery", 
        reply: `💰 Crypto Asset Recovery Service

We follow a rigorous, legitimate four-step recovery process:

1️⃣ Free Initial Consultation: Preliminary case assessment to determine recovery potential.
2️⃣ On-chain & Off-chain Investigation: Tracing fund flows using professional tools and intelligence networks.
3️⃣ Exchange Coordination & Negotiation: Collaborating with relevant trading platforms to freeze suspect accounts.
4️⃣ Legal Support & Litigation: Providing comprehensive legal support when necessary, including applying for asset freezing injunctions and enforcing foreign judgments.

• Success rate for fraud-related cases: Approximately 80%

⚠️ Important Security Notice: We will NEVER ask for your wallet's private keys or seed phrases for any reason. Please keep your personal information secure!` 
    },
    { 
        id: "faq", 
        text: "❓ FAQ", 
        reply: `❓ Frequently Asked Questions

Q1: How long does the recovery process take?
A1: Each case is unique. Initial assessment takes 24-48 hours. Complex cases may take several weeks to months.

Q2: Do you charge upfront fees?
A2: No. We operate on a "No Win, No Fee" basis. You pay only after successful recovery.

Q3: What information do I need to provide?
A3: Transaction hash (Tx Hash), wallet addresses involved, and a detailed description of the incident.

Q4: Is my information confidential?
A4: Yes. We sign strict NDAs and comply with all data privacy regulations.

Q5: Can you guarantee 100% recovery?
A5: No ethical firm can guarantee recovery. However, our success rate for fraud-related cases is approximately 80%.` 
    },
    { 
        id: "guide", 
        text: "📋 Case Assessment Guide", 
        reply: `📋 Case Assessment Guide

Before contacting us, please prepare the following:

1️⃣ Transaction Hash (Tx Hash) – Required
2️⃣ Wallet addresses (sender & receiver)
3️⃣ Screenshots of conversations with the scammer
4️⃣ Name of the exchange or platform involved (if any)
5️⃣ Date and time of the transaction

⚠️ Do NOT share your private keys or seed phrases with anyone, including us.

Having this information ready will significantly speed up your case assessment.` 
    },
    { 
        id: "disclaimer", 
        text: "⚖️ Legal Disclaimer", 
        reply: `⚖️ Legal Disclaimer & Terms

1. Falcon Team provides asset recovery consultation and investigation services.
2. Results are not guaranteed. Success rates are based on historical data and do not constitute a promise.
3. We do NOT request private keys, seed phrases, or any login credentials.
4. All communications are confidential under applicable laws.
5. By using this service, you agree that Falcon Team is not liable for any losses resulting from actions taken based on our advice.

For full terms, please contact us via email.` 
    },
    { 
        id: "hours", 
        text: "🕒 Business Hours", 
        reply: `🕒 Business Hours

Our standard operating hours:
Monday - Friday: 9:00 AM - 6:00 PM (UTC+8)

Weekend Support:
Saturday & Sunday: CLOSED (except for emergencies)

For urgent cases outside of business hours, please email us or send a message via Telegram. We will respond as soon as possible, typically within 24 hours.

⚠️ Emergency cases will be prioritized. Please mark your message as "URGENT" in the subject line or first message.` 
    }
];

// Mobile-optimized keyboard layout: 2-3-3
function getMainMenu() {
    const keyboard = [
        // Row 1: 2 buttons
        [
            { text: BUTTONS[0].text, callback_data: BUTTONS[0].id },
            { text: BUTTONS[1].text, callback_data: BUTTONS[1].id }
        ],
        // Row 2: 3 buttons
        [
            { text: BUTTONS[2].text, callback_data: BUTTONS[2].id },
            { text: BUTTONS[3].text, callback_data: BUTTONS[3].id },
            { text: BUTTONS[4].text, callback_data: BUTTONS[4].id }
        ],
        // Row 3: 3 buttons
        [
            { text: BUTTONS[5].text, callback_data: BUTTONS[5].id },
            { text: BUTTONS[6].text, callback_data: BUTTONS[6].id },
            { text: BUTTONS[7].text, callback_data: BUTTONS[7].id }
        ]
    ];
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
                
                // Handle /start command - show menu
                if (update.message && update.message.text === '/start') {
                    const chatId = update.message.chat.id;
                    const userName = update.message.from.first_name;
                    
                    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            text: `👋 Welcome to Falcon Law Firm, ${userName}!

We are a professional firm specializing in cross-border crypto asset recovery and cybersecurity. We provide comprehensive, targeted support for victims of crypto fraud, employing innovative strategies and court applications to achieve favorable outcomes.

Our services include applying for asset freezing injunctions, cross-border fund tracing, and enforcing foreign judgments.

⚠️ Important Reminder: As time passes, the transfer and mixing of cryptocurrencies will make recovering your assets exponentially more difficult. We strongly advise you to contact us as soon as you discover assets have been stolen to secure the best possible recovery window.

Please select an option below for more details:`,
                            reply_markup: getMainMenu()
                        })
                    });
                }
                // Handle button clicks
                else if (update.callback_query) {
                    const query = update.callback_query;
                    const button = BUTTONS.find(b => b.id === query.data);
                    
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
                        body: JSON.stringify({
                            callback_query_id: query.id
                        })
                    });
                }
                // Handle regular messages
                else if (update.message && update.message.text) {
                    const msg = update.message;
                    
                    // Auto-reply to user
                    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: msg.chat.id,
                            text: "✅ Message received!\n\nFor urgent assistance, please click '📞 Contact Falcon Team' in the menu to reach us via email or official Telegram channels. Our team will get back to you as soon as possible."
                        })
                    });
                    
                    // Forward to admin
                    if (adminId) {
                        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                chat_id: adminId,
                                text: `📨 New Message Alert:\n👤 User: ${msg.from.first_name} (ID: ${msg.from.id})\n💬 Message: ${msg.text}`
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
