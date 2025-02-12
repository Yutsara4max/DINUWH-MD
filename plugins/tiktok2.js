const { cmd } = require('../command'); // Ensure the path is correct
const tiktokDownloader = require('@mrnima/tiktok-downloader'); // Import TikTok downloader

cmd({
    pattern: "tiktok2",
    alias: ["tt2"],
    react: "📥",
    desc: "Download a video from TikTok",
    category: "download",
    use: '.tiktok <url>',
    filename: __filename
},
async(conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return await reply("*URL එක මන්ද ගන්නෙ😂!*");

        const videoInfo = await tiktokDownloader(q);
        if (!videoInfo || !videoInfo.url) return await reply("*හොයාගන්න බැයි වුනා😒✌️!*");

        await conn.sendMessage(from, { video: { url: videoInfo.url }, caption: "DINUWH-MD - *your TikTok video!*" }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply('*tt කමාන්ඩ් එකෙනුත් ට්‍රයි කරන්න ආවෙ නැත්තම් කරන්න දෙයක් නෑ මේකෙන් එම්නෙ නෑ වීඩියෝ එක🥲✌️.*');
    }
});
