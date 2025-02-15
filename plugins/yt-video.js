const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');
const yts = require('yt-search');

const domain = `https://manul-official-api-site-4a4d3aa3fe73.herokuapp.com/ytmp4?url=`;

cmd({
    pattern: 'video',
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

        console.log("🔍 Searching for video:", q);
        const yt = await yts(q);
        console.log("🔍 Search results:", yt);

        if (!yt.videos.length) {
            return reply('❌ *No videos found. Please try another search query.*');
        }

        const ytsResult = yt.videos[0];
        console.log("✅ Selected video:", ytsResult.url);

        const ytdl = await fetchJson(`${domain}${ytsResult.url}`);
        console.log("📥 Video Download Data:", ytdl);

        if (!ytdl.download) {
            return reply('❌ *Failed to fetch download links. API might be down.*');
        }

        const video240p = ytdl.download['240p'] || null;
        const video360p = ytdl.download['360p'] || null;
        const video480p = ytdl.download['480p'] || null;
        const video720p = ytdl.download['720p'] || null;

        if (!video240p && !video360p && !video480p && !video720p) {
            return reply('❌ *No downloadable video links found!*');
        }

        const desc = `*🎥 Video Downloader*
📌 *Title:* ${ytsResult.title}
👤 *Author:* ${ytsResult.author.name}
👁️ *Views:* ${ytsResult.views}
⏳ *Duration:* ${ytsResult.timestamp}
🔗 *URL:* ${ytsResult.url}

> *Choose video quality below:*
1️⃣ - 240p
2️⃣ - 360p
3️⃣ - 480p
4️⃣ - 720p`;

        const messageSent = await conn.sendMessage(from, { image: { url: ytsResult.thumbnail }, caption: desc }, { quoted: mek });

        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();

            if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === messageSent.key.id) {
                let videoUrl;
                switch (selectedOption) {
                    case '1️⃣':
                        videoUrl = video240p;
                        break;
                    case '2️⃣':
                        videoUrl = video360p;
                        break;
                    case '3️⃣':
                        videoUrl = video480p;
                        break;
                    case '4️⃣':
                        videoUrl = video720p;
                        break;
                    default:
                        return reply("❌ Invalid option. Please select a valid one.");
                }

                if (!videoUrl) return reply("❌ *Selected resolution is unavailable!*");

                const sent = await conn.sendMessage(from, { image: { url: ytsResult.thumbnail } });
                await conn.sendMessage(from, { video: { url: videoUrl }, caption: `🎥 *Downloaded from Syko Video Downloader*`, mimetype: 'video/mp4' }, { quoted: sent });

                await conn.sendMessage(from, { react: { text: '✅', key: msg.key } });
            }
        });

    } catch (e) {
        console.error("❌ Error Occurred:", e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply('❌ An error occurred while processing your request.');
    }
});
