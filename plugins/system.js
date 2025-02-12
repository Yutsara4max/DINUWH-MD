const { cmd } = require('../command'); // Ensure the path is correct
const si = require('systeminformation'); // Import systeminformation for system data

cmd({
    pattern: "sysinfo",
    alias: ["system"],
    react: "🖥️",
    desc: "Get system information",
    category: "main",
    use: '.sysinfo',
    filename: __filename
},
async(conn, mek, m, { from, reply }) => {
    try {
        const data = await si.getAllData();
        const msg = `
            *Didula MD V2 💚 System Information:*
            • CPU: ${data.cpu.manufacturer} ${data.cpu.brand}
            • Cores: ${data.cpu.cores}
            • RAM: ${(data.mem.total / 1e9).toFixed(2)} GB
            • OS: ${data.os.distro} ${data.os.release}
        `;
        await reply(msg);

    } catch (error) {
        console.error(error);
        reply('An error occurred while fetching system information. Please try again later.');
    }
});