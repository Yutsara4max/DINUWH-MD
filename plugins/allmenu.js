const { cmd, commands } = require('../command');
const config = require('../config'); // Ensure you import your config file

cmd({
    pattern: "allmenu",
    alias: ["list"],
    react: "📜",
    desc: "Get a comprehensive command list categorized",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const categories = ['download', 'main', 'group', 'owner', 'convert', 'search'];
        let allMenu = '';

        categories.forEach(category => {
            let menu = '';
            for (let i = 0; i < commands.length; i++) {
                if (commands[i].category === category && !commands[i].dontAddCommandList) {
                    menu += `*📍➣ Command :* ${commands[i].pattern}\n*📃➣ Desc :* ${commands[i].desc}\n*⌛➣ Use:* ${commands[i].use}\n\n`;
                }
            }

            if (menu) {
                allMenu += `💚 *${category.charAt(0).toUpperCase() + category.slice(1)} Menu:📥*\n\n${menu}────────────────────\n\n`;
            }
        });

        if (!allMenu) {
            allMenu = 'No commands available in any category.';
        }

        await conn.sendMessage(from, { image: { url: config.ALIVE_IMG }, caption: allMenu }, { quoted: mek });
    } catch (e) {
        console.error(e);
        reply(`An error occurred: ${e.message}`);
    }
});