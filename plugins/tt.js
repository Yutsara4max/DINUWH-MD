const { cmd } = require('../command'); // Ensure the path is correct
const tiktokDownloader = require('@mrnima/tiktok-downloader'); // Import TikTok downloader

cmd({
    pattern: "tiktok",
    alias: ["ttdl"],
    react: "📥",
    desc: "Download a video from TikTok",
    category: "download",
    use: '.tiktok <url>',
    filename: __filename
},
async(conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return await reply("Please provide a TikTok video URL!");

        const videoInfo = await tiktokDownloader(q);
        if (!videoInfo || !videoInfo.url) return await reply("No video found!");

        await conn.sendMessage(from, { video: { url: videoInfo.url }, caption: "Didula MD V2 💚 - Here is your TikTok video!" }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply('An error occurred while downloading the video. Please try again later.');
    }
});