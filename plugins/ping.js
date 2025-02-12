const config = require('../config')
const { cmd, commands } = require('../command')

// Define the ping command
cmd({
    pattern: "ping",
    desc: "Check bot's response time.",
    category: "main",
    react: "✅",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Start timer to calculate ping
        const startTime = Date.now()

        // Send initial message
        const message = await conn.sendMessage(from, { text: '> *DINUWH-MD...𝙿𝙸𝙽𝙶𝙸𝙽𝙶😼💖(සුට්ටක් ඉදාම් ඉතින්😫)*' })

        // End timer and calculate ping
        const endTime = Date.now()
        const ping = endTime - startTime

        // Channel information text
        const channelInfo = `
         _*☊ 𝙳𝙸𝙽𝚄𝚆-𝙿𝙸𝙽𝙶-𝙸𝚂 ☊*_ : ${ping}ms
          𝚏𝚘𝚕𝚕𝚘𝚠 𝚞𝚜 𝚘𝚞𝚛 𝚌𝚑𝚊𝚗𝚗𝚎𝚕🫣🔷
        `;

        // Send the ping result along with the channel info
        await conn.sendMessage(
            from,
            {
                text: channelInfo,
                contextInfo: {
                    externalAdReply: {
                        title: "𝙳𝙸𝙽𝚄𝚆 𝙼𝙳 𝚃𝙴𝙲𝙷 𝙲𝙷𝙽𝙽𝙻",
                        body: "© 𝙼𝙰𝙳𝙴 𝙱𝚈 𝙳𝙸𝙽𝚄𝚆𝙷 𝙱𝙾𝚈🫣",
                        thumbnail: { url: "https://i.ibb.co/mcGKFZD/3769.jpg" },
                        sourceUrl: "https://whatsapp.com/channel/0029Vat7xHl7NoZsrUVjN844",
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            },
            { quoted: message }
        );
    } catch (e) {
        // Log any errors to the console and reply with error message
        console.log(e)
        reply(`Error: ${e.message}`)
    }
});
