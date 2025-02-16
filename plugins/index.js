const { downloadMediaMessage } = require('../lib/msg');

module.exports = {
    pattern: "auto-status",
    alias: ["status"],
    function: async (conn, mek, m, { from, quoted, body, reply }) => {
        try {
            const stateSender = ["send", "dapan", "dapn", "ewhahn", "ewanna", "danna", "evano", "evpn", "ewano"];
            const lowerBody = body.toLowerCase();

            for (let word of stateSender) {
                if (lowerBody.includes(word)) {
                    if (!lowerBody.includes('tent') && !lowerBody.includes('docu') && !lowerBody.includes('https')) {
                        if (quoted) {
                            const quotedMessage = await downloadMediaMessage(quoted);

                            if (quoted.imageMessage) {
                                await conn.sendMessage(from, { image: quotedMessage }, { quoted: mek });
                            } else if (quoted.videoMessage) {
                                await conn.sendMessage(from, { video: quotedMessage }, { quoted: mek });
                            } else {
                                console.log('Unsupported media type:', quotedMessage.mimetype);
                            }
                        } else {
                            reply("📌 Reply to an image or video to resend.");
                        }
                        break;
                    }
                }
            }
        } catch (error) {
            console.error("🚨 Auto Status Plugin Error: ", error);
        }
    }
};
