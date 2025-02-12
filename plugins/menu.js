
const { cmd, commands } = require('../command');
const config = require('../config'); // Ensure you import your config file

cmd({
    pattern: "downloadmenu",
    react: "👾",
    desc: "get cmd list",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let menu = '';
        for (let i = 0; i < commands.length; i++) {
            if (commands[i].category === 'download' && !commands[i].dontAddCommandList) {
                menu += `*📍➣ Command :* ${commands[i].pattern}\n*📃➣ Desc :* ${commands[i].desc}\n*⌛➣ Use:* ${commands[i].use}\n\n`;
            }
        }

        let madeMenu = `💚 *𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗠𝗲𝗻𝘂:📥*\n\n${menu}────────────────────`;

        await conn.sendMessage(from, { image: { url: config.ALIVE_IMG }, caption: madeMenu }, { quoted: mek });
    } catch (e) {
        console.error(e);
        reply(`An error occurred: ${e.message}`);
    }
});

cmd({
    pattern: "mainmenu",
    react: "👾",
    desc: "get cmd list",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let menu = '';
        for (let i = 0; i < commands.length; i++) {
            if (commands[i].category === 'main' && !commands[i].dontAddCommandList) {
                menu += `*📍➣ Command :* ${commands[i].pattern}\n*📃➣ Desc :* ${commands[i].desc}\n*⌛➣ Use:* ${commands[i].use}\n\n`;
            }
        }

        let madeMenu = `💚 *𝗠𝗮𝗶𝗻 𝗠𝗲𝗻𝘂:📥*\n\n${menu}────────────────────`;

        await conn.sendMessage(from, { image: { url: config.ALIVE_IMG }, caption: madeMenu }, { quoted: mek });
    } catch (e) {
        console.error(e);
        reply(`An error occurred: ${e.message}`);
    }
});

cmd({
    pattern: "groupmenu",
    react: "👾",
    desc: "get cmd list",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let menu = '';
        for (let i = 0; i < commands.length; i++) {
            if (commands[i].category === 'group' && !commands[i].dontAddCommandList) {
                menu += `*📍➣ Command :* ${commands[i].pattern}\n*📃➣ Desc :* ${commands[i].desc}\n*⌛➣ Use:* ${commands[i].use}\n\n`;
            }
        }

        let madeMenu = `💚 *𝗚𝗿𝗼𝘂𝗽 𝗠𝗲𝗻𝘂:📥*\n\n${menu}────────────────────`;

        await conn.sendMessage(from, { image: { url: config.ALIVE_IMG }, caption: madeMenu }, { quoted: mek });
    } catch (e) {
        console.error(e);
        reply(`An error occurred: ${e.message}`);
    }
});

cmd({
    pattern: "ownermenu",
    react: "👾",
    desc: "get cmd list",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let menu = '';
        for (let i = 0; i < commands.length; i++) {
            if (commands[i].category === 'owner' && !commands[i].dontAddCommandList) {
                menu += `*📍➣ Command :* ${commands[i].pattern}\n*📃➣ Desc :* ${commands[i].desc}\n*⌛➣ Use:* ${commands[i].use}\n\n`;
            }
        }

        let madeMenu = `💚 *𝗢𝘄𝗻𝗲𝗿 𝗠𝗲𝗻𝘂:📥*\n\n${menu}────────────────────`;

        await conn.sendMessage(from, { image: { url: config.ALIVE_IMG }, caption: madeMenu }, { quoted: mek });
    } catch (e) {
        console.error(e);
        reply(`An error occurred: ${e.message}`);
    }
});

cmd({
    pattern: "convertmenu",
    react: "👾",
    desc: "get cmd list",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let menu = '';
        for (let i = 0; i < commands.length; i++) {
            if (commands[i].category === 'convert' && !commands[i].dontAddCommandList) {
                menu += `*📍➣ Command :* ${commands[i].pattern}\n*📃➣ Desc :* ${commands[i].desc}\n*⌛➣ Use:* ${commands[i].use}\n\n`;
            }
        }

        let madeMenu = `💚 *𝗖𝗼𝗻𝘃𝗲𝗿𝘁 𝗠𝗲𝗻𝘂:📥*\n\n${menu}────────────────────`;

        await conn.sendMessage(from, { image: { url: config.ALIVE_IMG }, caption: madeMenu }, { quoted: mek });
    } catch (e) {
        console.error(e);
        reply(`An error occurred: ${e.message}`);
    }
});

cmd({
    pattern: "searchmenu",
    react: "👾",
    desc: "get cmd list",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let menu = '';
        for (let i = 0; i < commands.length; i++) {
            if (commands[i].category === 'search' && !commands[i].dontAddCommandList) {
                menu += `*📍➣ Command :* ${commands[i].pattern}\n*📃➣ Desc :* ${commands[i].desc}\n*⌛➣ Use:* ${commands[i].use}\n\n`;
            }
        }

        let madeMenu = `💚 *𝗦𝗲𝗮𝗿𝗰𝗵 𝗠𝗲𝗻𝘂:📥*\n\n${menu}────────────────────`;

        await conn.sendMessage(from, { image: { url: config.ALIVE_IMG }, caption: madeMenu }, { quoted: mek });
    } catch (e) {
        console.error(e);
        reply(`An error occurred: ${e.message}`);
    }
});
