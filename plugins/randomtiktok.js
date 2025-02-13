
//=============================================
const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');
const domain = `https://mr-manul-ofc-apis.vercel.app`;

//=============================================
cmd({
    pattern: "rtiktok",
    alias: ["randomtiktok","randomtik","rtt"],
    desc: 'Download tiktok random Video',
    use: '.rtik Title',
    react: "🎬",
    category: 'download',
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply('*ඔයා හොයන වර්ගෙ වීඩියෝ එකක 𝚝𝚒𝚝𝚕𝚎 එකක් දෙන්න*');
        const response = await fetchJson(`${domain}/random-tiktok?apikey=Manul-Official-Key-3467&query=${q}`);
        const manul = response.data
        const title = manul.title
        const cover = manul.cover
        const no_watermark = manul.no_watermark
        const watermark = manul.watermark
        const music = manul.music
        let desc = `
*🎬𝚁𝙰𝙽𝙳𝙾𝙼 𝚃𝙸𝙺𝚃𝙾𝙺 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁🎬*
* *𝙿𝙾𝚆𝙴𝚁𝙳 𝙱𝚈 𝙳𝙸𝙽𝚄𝚆𝙷 𝙼𝙳 🫸🙂‍↔️*

*𝗧𝗶𝘁𝗹𝗲 -:* _~${title}~_

*◄❪ඕනි නම්බර් එක රිප්ලයි කරන්න❫►*

* 1. 𝚆𝙸𝚃𝙷 𝚆𝙰𝚃𝙴𝚁 𝚖𝚊𝚛𝚔 𝚟𝚒𝚍𝚎𝚘 ✅
* 2. 𝙽𝙾 𝚆𝙰𝚃𝙴𝚁 𝚖𝚊𝚛𝚔 𝚟𝚒𝚍𝚎𝚘 ❎
* 3. 𝙰𝚄𝙳𝙸𝙾 𝚃𝚈𝙿𝙴🎧

> *⚖️𝙿𝙾𝚆𝙴𝚁𝙳 𝙱𝚈- 𝙳𝙸𝙽𝚄𝚆𝙷 𝙼𝙳 🫣🩷*
`;

        const vv = await conn.sendMessage(from, { image: { url: cover }, caption: desc }, { quoted: mek });

        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();

            if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {
                switch (selectedOption) {
                    case '1':
                    await conn.sendMessage(from,{video:{url: watermark },mimetype:"video/mp4",caption :"> > *⚖️𝙿𝙾𝚆𝙴𝚁𝙳 𝙱𝚈- 𝙳𝙸𝙽𝚄𝚆𝙷 𝙼𝙳 🫣🩷*"},{quoted:mek})
                        break;
                        
                    case '2':
                    await conn.sendMessage(from,{video:{url: no_watermark },mimetype:"video/mp4",caption :"> > *⚖️𝙿𝙾𝚆𝙴𝚁𝙳 𝙱𝚈- 𝙳𝙸𝙽𝚄𝚆𝙷 𝙼𝙳 🫣🩷*"},{quoted:mek})
                        break;
       
                    case '3':               
//============Send Audio======================
await conn.sendMessage(from,{audio:{url: music },mimetype:"audio/mpeg",caption :"> > *⚖️𝙿𝙾𝚆𝙴𝚁𝙳 𝙱𝚈- 𝙳𝙸𝙽𝚄𝚆𝙷 𝙼𝙳 🫣🩷*"},{quoted:mek})
                        break;
 
                    default:
                        reply("*1-3 අතර අන්කයක් රිප්ලයි කරහම්🙂👍*");
                }

            }
        });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
        reply('An error occurred while processing your request. *සින්හලෙන් කියන්න ඕනි නෑනෙ එරර් එකක්😞✌️*');
    }
});
