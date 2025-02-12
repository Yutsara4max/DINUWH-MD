
const axios = require('axios');
const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent } = require('@whiskeysockets/baileys');
const { cmd, commands } = require('../command');
const config = require("../config");

cmd({
    pattern: "quote",
    react: "📜",
    desc: "Get random quotes",
    category: "fun",
    filename: __filename
},
async(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        async function createQuote(quote) {
            return {
                text: quote
            };
        }

        let push = [];
        let { data } = await axios.get(`https://api.quotable.io/random`); // Fetch a random quote
        let quote = data.content;

        // Push the quote with buttons
        push.push({
            body: proto.Message.InteractiveMessage.Body.fromObject({
                text: `Quote: "${quote}"`
            }),
            footer: proto.Message.InteractiveMessage.Footer.fromObject({
                text: config.FOOTER
            }),
            header: proto.Message.InteractiveMessage.Header.fromObject({
                title: 'Hello ' + pushname,
                hasMediaAttachment: false
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                buttons: [
                    {
                        "name": "single_select",
                        "buttonParamsJson": "{\"title\":\"title\",\"sections\":[{\"title\":\"title\",\"highlight_label\":\"label\",\"rows\":[{\"header\":\"header\",\"title\":\"title\",\"description\":\"description\",\"id\":\"id\"}]}]}"
                    },
                    {
                        "name": "quick_reply",
                        "buttonParamsJson": "{\"display_text\":\"quick_reply\",\"id\":\"message\"}"
                    },
                    {
                        "name": "cta_url",
                        "buttonParamsJson": "{\"display_text\":\"Learn More\",\"url\":\"https://www.example.com\",\"merchant_url\":\"https://www.example.com\"}"
                    }
                    // You can add more buttons as needed
                ]
            })
        });

        const msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: 'Here is a random quote for you!'
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: config.FOOTER
                        }),
                        header: proto.Message.InteractiveMessage.Header.create({
                            hasMediaAttachment: false
                        }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                            cards: [
                                ...push
                            ]
                        })
                    })
                }
            }
        }, {});
        await conn.relayMessage(m.chat, msg.message, {
            messageId: msg.key.id
        });

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
