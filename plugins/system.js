const { cmd } = require('../command');
const si = require('systeminformation'); // System info module

cmd(
  {
    pattern: "system",
    desc: "Show bot system details like ping, uptime, and time",
    category: "utility",
    filename: __filename,
  },
  async (robin, mek, m, { from, quoted, reply }) => {
    try {
      // Bot uptime calculation
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      // Calculate ping
      const start = Date.now();
      await reply("🔄 Calculating ping...");
      const ping = Date.now() - start;

      // Get current time
      const currentTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Colombo",
        hour12: true,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });

      // Greeting message based on time
      const hourNow = new Date().getHours();
      const greeting =
        hourNow >= 5 && hourNow < 12
          ? "🌅 Good Morning"
          : hourNow >= 12 && hourNow < 18
          ? "☀️ Good Afternoon"
          : "🌙 Good Evening";

      // Fetch system information
      const cpu = await si.cpu();
      const mem = await si.mem();
      const os = await si.osInfo();

      // System Info Message
      const message = `
${greeting} 👋

🤖 *𝙳𝙸𝙽𝚄𝚆𝙷 𝙼𝙳 𝚂𝚈𝚂𝚃𝙴𝙼 𝙸𝙽𝙵𝙾*:

🔹 *Uptime:* ${hours}h ${minutes}m ${seconds}s    
🔹 *Ping:* ${ping}ms  
🔹 *Current Time:* ${currentTime}  
🔹 *CPU:* ${cpu.manufacturer} ${cpu.brand} (${cpu.cores} Cores)  
🔹 *RAM:* ${(mem.total / 1e9).toFixed(2)} GB  
🔹 *OS:* ${os.distro} ${os.release}  

> *°•° POWERED BY 𝙳𝙸𝙽𝚄𝚆𝙷 𝙼𝙳 ☊°_°🖤*
`;

      // Sending System Info with Photo and Channel Preview
      return await robin.sendMessage(
        from,
        {
          caption: message,
          contextInfo: {
            externalAdReply: {
              title: "𝙳𝙸𝙽𝚄𝚆 𝙼𝙳 𝚃𝙴𝙲𝙷 𝙲𝙷𝙽𝙽𝙻",
              body: "© 𝙼𝙰𝙳𝙴 𝙱𝚈 𝙳𝙸𝙽𝚄𝚆ʜ ᴍᴅ 🫣",
              thumbnailUrl: "https://i.ibb.co/CsQd4sTP/8060.jpg",
              sourceUrl: "https://whatsapp.com/channel/0029Vat7xHl7NoZsrUVjN844",
              mediaType: 1,
              renderLargerThumbnail: true,
            },
          },
        },
        { quoted: mek }
      );

    } catch (e) {
      console.error(e); // Log any errors
      reply(`❌ Error: ${e.message || "An unknown error occurred!"}`);
    }
  }
);
