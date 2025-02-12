const { cmd } = require('../command'); // Ensure the path is correct
const QRCode = require('qrcode'); // Import QRCode for generating QR codes

cmd({
    pattern: "qrcode",
    alias: ["qr"],
    react: "📱",
    desc: "Generate a QR code",
    category: "utility",
    use: '.qrcode <text>',
    filename: __filename
},
async(conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return await reply("Please provide text or a URL to generate a QR code!");

        const qrImage = await QRCode.toDataURL(q);
        await conn.sendMessage(from, { image: { url: qrImage }, caption: "Didula MD V2 💚 - Here is your QR code!" }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply('An error occurred while generating the QR code. Please try again later.');
    }
});