const { cmd, commands } = require("../command");
const { Sticker } = require("wa-sticker-formatter");
const { downloadMediaMessage } = require("../lib/msg.js"); // Adjust the path as needed
const fs = require("fs");

cmd(
  {
    pattern: "toimg",
    alias: ["getimg", "photo"],
    desc: "Convert a sticker to an image",
    category: "utility",
    filename: __filename,
  },
  async (
    conn,
    mek,
    m,
    {
      from,
      quoted,
      body,
      isCmd,
      command,
      args,
      q,
      isGroup,
      sender,
      senderNumber,
      botNumber2,
      botNumber,
      pushname,
      isMe,
      isOwner,
      groupMetadata,
      groupName,
      participants,
      groupAdmins,
      isBotAdmins,
      isAdmins,
      reply,
    }
  ) => {
    try {
      // Ensure the message contains a sticker to convert
      if (!quoted || quoted.stickerMessage == null) {
        return reply("❌ *මචං, Sticker එකකට රිප්ලයි කරලා Convert කරන්න! 😑*");
      }

      // Download the sticker from the quoted message
      const stickerBuffer = await downloadMediaMessage(quoted, "stickerInput");
      if (!stickerBuffer)
        return reply("❌ *අපෝ, Sticker එක Download කරන්න බැරි උනා! 😭*");

      // Convert the sticker buffer to an image (using Sticker class)
      const sticker = new Sticker(stickerBuffer, {
        pack: "DINUWH MD",
        author: "DINUWH MD",
        type: "FULL", // This may not be needed, but ensures we're using the full sticker format
        quality: 100, // Quality of the output image (0-100)
      });

      // Get the image buffer
      const imageBuffer = await sticker.toBuffer({ format: "image/jpeg" });

      // Send the image as a response
      await conn.sendMessage(
        from,
        {
          image: imageBuffer,
          caption: "📸 **මෙන්න ඔබේ Sticker Image එක!**\n🔥 *Powered by DINUWH MD*",
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error(e);
      reply(`❌ *අනේ බං, එකක්ම Error එකක් අවා! 😵*\n\n👉 *Error:* ${e.message || e}`);
    }
  }
);
