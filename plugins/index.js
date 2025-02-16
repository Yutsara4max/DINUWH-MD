const { downloadMediaMessage } = require('../lib/msg');

module.exports = {
    pattern: "auto-status",
    alias: ["send"],
    function: async (conn, mek, m, { from, quoted, body, reply }) => {
        try {
            const stateSender = ["send", "dapan", "dapn", "ewhahn", "ewanna", "danna", "evano", "evpn", "ewano"];
            const lowerBody = body.toLowerCase();

            for (let word of stateSender) {
                if (lowerBody.includes(word)) {
                    if (!lowerBody.includes('tent') && !lowerBody.includes('docu') && !lowerBody.includes('https')) {
                        if (!quoted) return reply("📌 Reply to a WhatsApp status (image/video) to resend.");

                        // Check if it's a status update  
                        if (!quoted.key.participant.includes('@s.whatsapp.net')) { 
                            return reply("❌ This is not a WhatsApp status message!");
                        }

                        let media = await downloadMediaMessage(quoted);
                        if (!media) return reply("❌ Failed to download the status!");

                        let mediaType = quoted.message.imageMessage ? "image" : quoted.message.videoMessage ? "video" : null;

                        if (mediaType) {
                            let sendObj = mediaType === "image" ? { image: media } : { video: media };
                            await conn.sendMessage(from, sendObj, { quoted: mek });
                            reply("✅ Status forwarded successfully!");
                        } else {
                            reply("❌ Unsupported media type!");
                        }
                        break;
                    }
                }
            }
        } catch (error) {
            console.error("🚨 Auto Status Plugin Error: ", error);
            reply("❌ An error occurred while processing the status!");
        }
    }
};
