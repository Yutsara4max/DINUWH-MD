const { cmd } = require('../command'); // Ensure the path is correct
const fbDownloader = require('@mrnima/facebook-downloader'); // Import facebook-downloader for video downloading

cmd({
    pattern: "fbvideo",
    alias: ["fbvd"],
    react: "📥",
    desc: "Download a video from Facebook",
    category: "download",
    use: '.fbvideo <url>',
    filename: __filename
},
async(conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return await reply("Please provide a Facebook video URL!");

        const videoInfo = await fbDownloader(q);
        if (!videoInfo || !videoInfo.url) return await reply("No video found!");

        await conn.sendMessage(from, { video: { url: videoInfo.url }, caption: "Here is your video!" }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply('An error occurred while downloading the video. Please try again later.');
    }
});