const { cmd } = require("../command");
const { fetchJson } = require("../lib/functions");

cmd(
  {
    pattern: "ask",
    alias: ["ai"],
    desc: "Ask the AI a question",
    category: "chatbot",
    filename: __filename,
  },
  async (conn, mek, m, { from, args, q, reply }) => {
    try {
      if (!q) return reply("*⭕ කරුණාකර ප්‍රශ්නයක් ඇතුළත් කරන්න!*\n\nඋදා: `.ask What is AI?`");

      let apiUrl = `https://mr-manul-ofc-apis.vercel.app/ask?q=${encodeURIComponent(q)}`;

      let response = await fetchJson(apiUrl);
      if (!response || !response.result) {
        return reply("⚠️ *AI පිළිතුර ලබාගැනීමට නොහැක! උත්සාහ කරන්න.*");
      }

      let aiReply = `🤖 *AI BOT*\n\n💬 *Question:* ${q}\n🧠 *Answer:* ${response.result}`;

      await conn.sendMessage(from, { text: aiReply }, { quoted: mek });
    } catch (error) {
      console.error(error);
      reply("❌ *Error:* AI API එක load කරන්න බැරිවුණා.");
    }
  }
);
