
const { generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');
const { cmd } = require('../command');
const config = require("../config");

cmd({
    pattern: "alive2",
    react: "📜",
    desc: "Check if the bot is alive",
    category: "fun",
    filename: __filename
}, async (conn, mek, m, { from, pushname, reply }) => {
    try {
        // Create the alive message
        const aliveMessage = `Didula MD V2 💚 is alive and kicking! 🤖✨\n\nFeel free to ask me anything!`;

        // Create the interactive message with buttons
        const interactiveMessage = proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.create({
                text: aliveMessage
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
                text: config.FOOTER
            }),
            header: proto.Message.InteractiveMessage.Header.create({
                title: 'Hello ' + pushname,
                hasMediaAttachment: false
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                buttons: [
                    {
                        "name": "quick_reply",
                        "buttonParamsJson": "{\"display_text\":\"Quick Reply\",\"id\":\"quick_reply\"}"
                    },
                    {
                        "name": "cta_url",
                        "buttonParamsJson": "{\"display_text\":\"Learn More\",\"url\":\"https://www.example.com\"}"
                    },
                    {
                        "name": "cta_copy",
                        "buttonParamsJson": "{\"display_text\":\"Copy\",\"id\":\"copy_id\",\"copy_code\":\"message\"}"
                    }
                ]
            })
        });

        // Generate the complete message with viewOnce functionality
        const msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: interactiveMessage
                }
            }
        }, {});

        // Send the alive message
        await conn.relayMessage(m.chat, msg.message, {
            messageId: msg.key.id
        });

    } catch (e) {
        console.error(e);
        reply(`An error occurred: ${e.message}`);
    }
});