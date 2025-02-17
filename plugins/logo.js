const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');

const apilink = 'https://api-pink-venom.vercel.app';
const caption = `*MADE BY DINUWH BOY*`;

const logoLinks = {
    "1": "https://en.ephoto360.com/matrix-text-effect-154.html",
    "2": "https://en.ephoto360.com/online-blackpink-style-logo-maker-effect-711.html",
    "3": "https://en.ephoto360.com/create-a-blackpink-neon-logo-text-effect-online-710.html",
    "4": "https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html",
    "5": "https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html",
    "6": "https://en.ephoto360.com/create-pixel-glitch-text-effect-online-769.html",
    "7": "https://en.ephoto360.com/create-online-3d-comic-style-text-effects-817.html",
    "8": "https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html",
    "9": "https://en.ephoto360.com/free-bear-logo-maker-online-673.html",
    "10": "https://en.ephoto360.com/neon-devil-wings-text-effect-online-683.html",
    "11": "https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html",
    "12": "https://en.ephoto360.com/create-glossy-silver-3d-text-effect-online-802.html",
    "13": "https://en.ephoto360.com/multicolor-3d-paper-cut-style-text-effect-658.html",
    "14": "https://en.ephoto360.com/free-pubg-logo-maker-online-609.html",
    "15": "https://en.ephoto360.com/pubg-logo-maker-cute-character-online-617.html",
    "16": "https://en.ephoto360.com/create-free-fire-facebook-cover-online-567.html",
    "17": "https://en.ephoto360.com/write-text-on-wet-glass-online-589.html",
    "18": "https://en.ephoto360.com/create-online-typography-art-effects-with-multiple-layers-811.html",
    "19": "https://en.ephoto360.com/modern-gold-5-215.html",
    "20": "https://en.ephoto360.com/create-a-blackpink-style-logo-with-members-signatures-810.html"
};

cmd({
    pattern: "logolist",
    alias: "logo",
    desc: "Create logos",
    category: "convert",
    filename: __filename
}, async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("*_ඔයාට ලෝගෝ එක හදාගන්න ඕනි නමත් ඕනි💀 උදා:- .logo DINUWH-MD._*");

        let logoMsg = `*LOGO MAKER BY DINUWH MD🫣❤️*\n\n`
            + `_🔢 Reply Below Number:_\n\n`
            + Object.keys(logoLinks).map(num => `${num} || ${logoLinks[num].split("/")[3].replace(/-/g, ' ')}`).join("\n")
            + `\n\n*ඔනී ඩිසයින්ග් එකේ අන්කය දෙන්න😁👍*`;

        let send = await conn.sendMessage(from, {
            image: { url: "https://i.ibb.co/YTQS67kR/DiNuWhMd.jpg" },
            caption: logoMsg
        }, { quoted: mek });

        global.logoReplies = global.logoReplies || {};
        global.logoReplies[send.key.id] = { from, q, mek };

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

// 🟢 Event Handler for Reply Detection 🟢
conn.ev.on('messages.upsert', async (msgUpdate) => {
    try {
        const msg = msgUpdate.messages[0];
        if (!msg.message || !msg.message.extendedTextMessage) return;

        const selectedOption = msg.message.extendedTextMessage.text.trim();
        const contextInfo = msg.message.extendedTextMessage.contextInfo;

        if (!contextInfo || !global.logoReplies[contextInfo.stanzaId]) return;

        const { from, q, mek } = global.logoReplies[contextInfo.stanzaId];

        if (!logoLinks[selectedOption]) {
            return conn.sendMessage(from, { text: "*_ගහන්න ඕනි නම්බර් එක්අක් ගහපම්😂 1-20 අතර🙂‍↔️._*" }, { quoted: mek });
        }

        let logoUrl = logoLinks[selectedOption];
        let data = await fetchJson(`${apilink}/api/logo?url=${logoUrl}&name=${q}`);

        if (!data || !data.result || !data.result.download_url) {
            return conn.sendMessage(from, { text: "*🚨 Error generating logo. Try again later!*" }, { quoted: mek });
        }

        await conn.sendMessage(from, {
            image: { url: data.result.download_url },
            caption: caption
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
    }
});
