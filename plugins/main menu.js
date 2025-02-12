
const config = require('../config');
const { cmd, commands } = require('../command');
const pdfUrl = "https://i.ibb.co/tC37Q7B/20241220-122443.jpg";

cmd({
    pattern: "menu",
    desc: "Check commands.",
    category: "main",
    react: "✅",
    filename: __filename
}, async (conn, mek, m, { from, quoted, reply }) => {
    try {
        // Send a message indicating the bot is alive
        const message = await conn.sendMessage(from, { text: '`𝗗𝗶𝗱𝘂𝗹𝗮 𝗠𝗗 𝗠𝗲𝗻𝘂💚`' });

        // Simulate some processing time
        const startTime = Date.now();
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulating a delay
        const endTime = Date.now();
        const ping = endTime - startTime;

        // New menu message
        const menuMessage = `
💚 *𝗗𝗶𝗱𝘂𝗹𝗮 𝗠𝗗 𝗠𝗲𝗻𝘂: 📥*

🔱 𝗢𝘄𝗻𝗲𝗿 - 𝗗𝗶𝗱𝘂𝗹𝗮 𝗥𝗮𝘀𝗵𝗺𝗶𝗸𝗮  
‼️ 𝗛𝗲𝗹𝗽 𝗗𝗲𝘃 - 𝗖𝘆𝗯𝗲𝗿 𝗝𝗮𝗻𝗶𝘆𝗮  
📥 𝗖𝗼𝗻𝘁𝗮𝗰𝘁 - 94771820962  

────────────────────  

✨ *𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗠𝗲𝗻𝘂:*  

📍➣ Command :  *.downloadmenu*  
📃➣ Desc : Download files from provided links.  
⌛➣ Use:   use command for get uses  

────────────────────  

✨ *𝗠𝗮𝗶𝗻 𝗠𝗲𝗻𝘂:*  

📍➣ Command :  *.mainmenu*  
📃➣ Desc : Get help with bot commands.  
⌛➣ Use: use command for get uses  

────────────────────  

✨ *𝗚𝗿𝗼𝘂𝗽 𝗠𝗲𝗻𝘂:*  

📍➣ Command :  *.groupmenu*  
📃➣ Desc : Get information about the group.  
⌛➣ Use: use command for get uses  

────────────────────  

✨ *𝗢𝘄𝗻𝗲𝗿 𝗠𝗲𝗻𝘂:*  

📍➣ Command :  *.ownermenu*  
📃➣ Desc : Set welcome message for new members.  
⌛➣ Use: use command for get uses  

────────────────────  

✨ *𝗖𝗼𝗻𝘃𝗲𝗿𝘁 𝗠𝗲𝗻𝘂:*  

📍➣ Command :  *.convertmenu*  
📃➣ Desc : Convert files to different formats.  
⌛➣ Use: use command for get uses  

────────────────────  

✨ *𝗦𝗲𝗮𝗿𝗰𝗵 𝗠𝗲𝗻𝘂:*  

📍➣ Command :  *.searchmenu*  
📃➣ Desc : Search for information online.  
⌛➣ Use: use command for get uses  

────────────────────  
`;

        // Send the alive response with the updated menu
        await conn.sendMessage(from, {
            document: { url: pdfUrl },
            fileName: 'Didula MD💚',
            mimetype: "application/pdf",
            fileLength: 99999999999999,
            image: { url: 'https://i.ibb.co/tC37Q7B/20241220-122443.jpg' },
            pageCount: 2024,
            caption: menuMessage,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: 'Didula MD V2 💚',
                    newsletterJid: "120363343196447945@newsletter",
                },
                externalAdReply: {
                    title: '©Didula MD V2 💚',
                    body: ' *Didula MD V2 💚*',
                    thumbnailUrl: 'https://i.ibb.co/tC37Q7B/20241220-122443.jpg',
                    sourceUrl: 'https://wa.me/message/DIDULLTK7ZOGH1',
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });
    } catch (e) {
        console.error(e);
        reply(`${e}`);
    }
});
