const { cmd } = require('../command'); // Ensure the path is correct

cmd({
    pattern: "ping",
    alias: ["pong"],
    react: "🏓",
    desc: "Check the bot's responsiveness",
    category: "utility",
    use: '.ping',
    filename: __filename
},
async(conn, mek, m, { from, reply }) => {
    const start = Date.now();
    await reply("𝐂𝐡𝐞𝐜𝐤𝐢𝐧𝐠 𝐃𝐢𝐝𝐮𝐥𝐚 𝐌𝐃 𝐒𝐩𝐞𝐞𝐝💚"); // Inform the user that the ping is in progress
    const end = Date.now();
    
    const latency = end - start; // Calculate the latency
    await reply(`𝐃𝐢𝐝𝐮𝐥𝐚 𝐌𝐃 𝐒𝐩𝐞𝐞𝐝 💚: ${latency}𝐦𝐬`);
});