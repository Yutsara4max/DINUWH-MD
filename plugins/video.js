const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');
const yts = require('yt-search');

const domain = `https://manul-official-api-site-4a4d3aa3fe73.herokuapp.com/ytmp4?url=`;

//=============================================

cmd({
    pattern: 'video', // Command for video
    alias: ["vplay"],
    desc: 'Download YouTube Videos',
    use: '.video <YouTube Title or URL>',
    react: "📹",
    category: 'media',
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }) => {
    try {
        if (!q) return reply('❌ *Please provide a valid YouTube title or URL!*');

        // Search for YouTube video using the provided title or URL
        const yt = await yts(q);
        const ytsResult = yt.videos[0]; // Selecting the first result

        // Get the download URLs for different resolutions
        const ytdl = await fetchJson(`${domain}${ytsResult.url}`);
        const video240p = ytdl.download['240p'];
        const video360p = ytdl.download['360p'];
        const video480p = ytdl.download['480p'];
        const video720p = ytdl.download['720p'];
        const videoTitle = ytsResult.title;
        const videoAuthor = ytsResult.author.name;
        const videoViews = ytsResult.views;
        const videoDuration = ytsResult.timestamp;
        const videoThumbnail = ytsResult.thumbnail;

        // Create message with formatted details
        let desc = `◈     *SYKO VIDEO DOWNLOADER*     ◈
┌───────────────────
├ *ℹ️ \`Title:\`* ${videoTitle}
├ *👤 \`Author:\`* ${videoAuthor}
├ *👁️‍🗨️ \`Views:\`* ${videoViews}
├ *🕘 \`Duration:\`* ${videoDuration}
├ *🔗 \`Url:\`* ${ytsResult.url}
└───────────────────

> *🔢 SELECT THE VIDEO QUALITY BELOW!*

*1.1 📹 - 240p*

*1.2 📹 - 360p*

*1.3 📹 - 480p*

*1.4 📹 - 720p*`;

        // Send the message with the video details and options
        const vv = await conn.sendMessage(from, { image: { url: videoThumbnail }, caption: desc }, { quoted: mek });

        // Listen for the user selection in the chat
        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();

            if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {
                let mass, videoUrl;

                switch (selectedOption) {
                    case '1.1':
                        videoUrl = video240p;
                        break;
                    case '1.2':
                        videoUrl = video360p;
                        break;
                    case '1.3':
                        videoUrl = video480p;
                        break;
                    case '1.4':
                        videoUrl = video720p;
                        break;
                    default:
                        reply("❌ Invalid option selected. Please choose a valid option.");
                        return;
                }

                // React with ⬇️ when uploading starts
                mass = await conn.sendMessage(from, { image: { url: videoThumbnail } });

                // Upload and send the selected video
                await conn.sendMessage(from, { video: { url: videoUrl }, caption: `> *Powered by Syko Video Downloader*`, mimetype: 'video/mp4' }, { quoted: mass });

                // React with ✅ once the file has been uploaded and sent
                await conn.sendMessage(from, { react: { text: '✅', key: msg.key } });
            }
        });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply('❌ An error occurred while processing your request.');
    }
});
