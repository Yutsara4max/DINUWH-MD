const { cmd } = require('../command');

cmd({
    pattern: "getpp",
    react: "📸",
    category: "utility",
    desc: "Get someone's profile picture",
    filename: __filename
}, async (conn, m, mek, { reply, q }) => {
    try {
        let userJid = q ? q.replace(/[^0-9]/g, '') + "@s.whatsapp.net" : mek.mentionedJid[0] || mek.sender;

        let ppUrl = await conn.profilePictureUrl(userJid, 'image').catch(() => 'https://via.placeholder.com/500');

        await conn.sendMessage(mek.chat, { image: { url: ppUrl }, caption: "🔰 Profile Picture" }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("⚠️ Couldn't fetch the profile picture!");
    }
});
