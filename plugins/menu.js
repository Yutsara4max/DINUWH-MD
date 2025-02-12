const { cmd, commands } = require("../command");

cmd(
  {
    pattern: "menu",
    alise: ["getmenu"],
    desc: "Get command list",
    category: "main",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    {
      from,
      pushname,
      reply,
    }
  ) => {
    try {
      let menuText = `╭─━━━❰ *👋 Hello ${pushname} * ❱━━━─╮
⇼𝚘𝚞𝚛 𝚜𝚎𝚖𝚜𝚢 𝚟𝚒𝚍𝚎𝚘 𝚞𝚙𝚕𝚘𝚊𝚍𝚎𝚛 𝚌𝚑𝚊𝚗𝚗𝚎𝚕😌⇼

* *_https://whatsapp.com/channel/0029VaxVCPi96H4VOKai4S3s_*

   🤖 *BOT MENU* 🤖

╭───❰ *MAIN COMMANDS* ❱───╮
│  ▫️ .alive
│  ▫️ .menu
│  ▫️ .ai <text>
│  ▫️ .system
│  ▫️ .owner
╰───────────────────────╯

╭───❰ *DOWNLOAD COMMANDS* ❱───╮
│  ▫️ .song <text>
│  ▫️ .video <text>
│  ▫️ .fb <link>
╰───────────────────────────╯

╭───❰ *GROUP COMMANDS* ❱───╮
│  ▫️ .add
│  ▫️ .del
╰───────────────────────╯

╭───❰ *OWNER COMMANDS* ❱───╮
│  ▫️ .restart
│  ▫️ .update
╰───────────────────────╯

╭───❰ *CONVERT COMMANDS* ❱───╮
│  ▫️ .sticker <reply img>
│  ▫️ .img <reply sticker>
│  ▫️ .tr <lang><text>
│  ▫️ .tts <text>
╰───────────────────────────╯

╭───❰ *SEARCH COMMANDS* ❱───╮
│  (⚋⚋⚋⚋⚋⚋⚋⚋⚋⚋⚋⚋⚋⚋⚋)
╰───────────────────────╯

╭─━━━❰ *THANK YOU!* ❱━━━─╮
│ ⛦ *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅɪɴᴜᴡʜ ᴍᴅ* ⛦
╰───────────────────────╯
`;

      // Send the menu text
      await robin.sendMessage(
        from,
        {
          text: menuText,
          contextInfo: {
            externalAdReply: {
              title: "𝙳𝙸𝙽𝚄𝚆 𝙼𝙳 𝚃𝙴𝙲𝙷 𝙲𝙷𝙽𝙽𝙻",
              body: "© 𝙼𝙰𝙳𝙴 𝙱𝚈 𝙳𝙸𝙽𝚄𝚆𝙷 𝙱𝙾𝚈🫣",
              thumbnailUrl: "https://i.ibb.co/mcGKFZD/3769.jpg",
              sourceUrl: "https://whatsapp.com/channel/0029Vat7xHl7NoZsrUVjN844",
              mediaType: 1,
              renderLargerThumbnail: true,
            },
          },
        },
        { quoted: m }
      );
    } catch (e) {
      console.log(e);
      reply(`Error: ${e.message}`);
    }
  }
);
