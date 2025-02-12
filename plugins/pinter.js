
const { cmd } = require('../command'); // Ensure the path is correct
const { fetchJson } = require('../lib/functions'); // Ensure the path is correct

const apilink = 'https://api.giftedtech.my.id/api/download/pinterestdl?apikey=gifted&url='; // API LINK ( DO NOT CHANGE THIS!! )

cmd({
    pattern: "pinterest",
    alias: ["pindl"],
    react: "📌",
    desc: "Download and send Pinterest photo/video",
    category: "download",
    use: '.pinterest <Pinterest URL>',
    filename: __filename
},
async(conn, mek, m, { from, quoted, reply, q }) => {
try {
    if (!q) return await reply("𝖯𝗅𝖺𝗌𝖾 𝖦𝗂𝗏𝖾 𝗍𝗁𝖾 𝖴𝗋𝗅!");

    const pinterestUrl = encodeURIComponent(q);
    const response = await fetchJson(`${apilink}${pinterestUrl}`);

    if (!response.success) return await reply("Failed to fetch the media. Please check the URL!");

    const mediaInfo = response.result.media[0]; // Assuming we want the first media item
    const msg = `
        *Pinterest Media Downloader* 📌
        
        • *𝖳𝗂𝗍𝗅𝗂𝖾* - ${response.result.title}
        • *𝖬𝗲𝗱𝗶𝗮 𝗧𝗬𝗉𝗘* - ${mediaInfo.type}
        • *𝖬𝗲𝗱𝗶𝗮 𝗙𝗼𝗿𝗺𝗮𝖳* - ${mediaInfo.format}
    `;

    // Sending the message with details
    await conn.sendMessage(from, { text: msg }, { quoted: mek });

    // Send the media (video or thumbnail)
    const mediaUrl = mediaInfo.download_url;
    await conn.sendMessage(from, { video: { url: mediaUrl }, caption: mediaInfo.type }, { quoted: mek });

} catch (error) {
    console.error(error);
    reply('An error occurred while processing your request. Please try again later.');
}
});
