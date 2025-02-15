
const { cmd } = require('../command'); // Make sure the path is correct
const { fetchJson } = require('../lib/functions'); // Make sure the path is correct

const apilink = 'https://api.fgmods.xyz/api/img/couple?apikey=nRHt2lt5'; // API LINK ( DO NOT CHANGE THIS!! )

cmd({
    pattern: "couplepp",
    alias: ["couplepic"],
    react: "💑",
    desc: "Get a couple image",
    category: "other",
    use: '.couple',
    filename: __filename
},
async(conn, mek, m, { from, reply }) => {
    try {
        const coupleData = await fetchJson(apilink);

        if (!coupleData.status) return await reply("Failed to fetch couple image!");

        const msg = `
            *Didula MD V2 💚 Couple Image* 💑

            • *Author* - Didula Rashmika
            • *Boy* - ${coupleData.result.boy}
            • *Girl* - ${coupleData.result.girl}\n\nDidula MD V2💚
        `;

        // Sending the message with couple images
        await conn.sendMessage(from, {
            text: msg,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
            }
        });

        // Sending images of the couple
        await conn.sendMessage(from, { image: { url: coupleData.result.boy }, caption: "Didula MD V2 💚 - Boy" }, { quoted: mek });
        await conn.sendMessage(from, { image: { url: coupleData.result.girl }, caption: "Didula MD V2 💚 - Girl" }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply('An error occurred while processing your request. Please try again later.');
    }
});
