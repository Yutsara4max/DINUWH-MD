const { cmd, commands } = require("../command");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const { downloadMediaMessage } = require("../lib/msg.js"); // Adjust the path as needed

cmd(
  {
    pattern: "sticker",
    alias: ["s", "tos"],
    react: "🔄",
    desc: "Convert an image to a sticker",
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
      // Check if user replied to an image or video
      if (!quoted || !(quoted.imageMessage || quoted.videoMessage)) {
        return reply(
          "😒 *මචං, Sticker එකක් හදන්න නම් Image එකක් හෝ Video එකක් ටැග් කරලා යන්නකෝ! ඉතිං මට ආකාසෙ Sticker හදන්න බෑනෙ! 😂*"
        );
      }

      // Download the media
      const media = await downloadMediaMessage(quoted, "stickerInput");
      if (!media)
        return reply(
          "😵‍💫 *අපෝ බන්, මට මෙයාගේ Media එක Download කරන්න බැරි උනා! තව Try එකක් දාපන්! 🤡*"
        );

      // Create sticker
      const sticker = new Sticker(media, {
        pack: "🔥 DINUWH MD 🔥", // Sticker pack name
        author: "😎 DINUWH MD 😎", // Sticker author name
        type: StickerTypes.FULL, // Sticker type (FULL or CROPPED)
        quality: 100, // Quality of the output sticker (0–100)
      });

      const buffer = await sticker.toBuffer();
      await conn.sendMessage(from, { sticker: buffer }, { quoted: mek });

      // Funny success message
      await reply(
        "✅ *අඩෝ! දැන් මේක Sticker එකක්! හරියටම Check කරලා බලන්නකෝ! 😂🔥*"
      );

    } catch (e) {
      console.error(e);
      reply(
        `😵 *අනේ බන්, Sticker එක හදන්න බැරි උනා! මේකට මොකද වුනේ?* 🤔\n\n👉 *Error:* ${
          e.message || e
        }\n\n💡 *මචං, තව Try එකක් දාපන්!* 🚀`
      );
    }
  }
);
