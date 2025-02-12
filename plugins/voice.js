
const { cmd } = require('../command'); // Assuming you have a command module
const fs = require('fs'); // File system module to read the voice file

// Command to send a voice message
cmd({
    pattern: "test",
    desc: "Send a voice message with footer and context info.",
    category: "owner",
    react: "🎤",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");

    const voicePath = '../didula.mp3'; // Path to the voice message file

    // Check if the file exists
    if (!fs.existsSync(voicePath)) {
        return reply("❌ Voice file not found!");
    }

    // Read the voice file
    const voiceMessageBuffer = fs.readFileSync(voicePath);

    const messageOptions = {
        audio: voiceMessageBuffer,
        mimetype: 'audio/mpeg', // Specify the correct MIME type for the audio
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: 'A L E X  M D​',
                newsletterJid: "120363333519565664@newsletter",
            },
            externalAdReply: {
                title: 'A L E X  M D',
                body: '> *Didula MD V2 💚*',
                thumbnailUrl: 'https://telegra.ph/file/aa2b0c3227ae3ec2001b3.jpg',
                sourceUrl: 'https://bhashi-md-ofc.netlify.app/',
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    };

    await conn.sendMessage(from, messageOptions, { quoted: mek });
    reply("🎤 Voice message sent successfully!");
});
