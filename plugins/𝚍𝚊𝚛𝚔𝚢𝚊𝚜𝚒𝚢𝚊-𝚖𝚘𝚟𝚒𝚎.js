
const config = require('../config');
const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
    pattern: "movie",
    alias: ["gdl", "directlink"],
    use: '.getdirectlink <movie-url>',
    react: "📥",
    desc: "Get direct download links for movies",
    category: "movie",
    filename: __filename
},

async (conn, mek, m, { from, q }) => {
    try {
        if (!q) return await conn.sendMessage(from, { text: "🚩 Please provide a movie URL!" }, { quoted: mek });

        // Fetch movie details from the existing info API
        const movieDetails = await fetchJson(`https://darksadas-yt-sinhalasub-info-dl.vercel.app/?url=${encodeURIComponent(q)}`);
        
        if (!movieDetails || movieDetails.downloadLinks.length < 1) {
            return await conn.sendMessage(from, { text: "🚩 No direct download links found for this movie." }, { quoted: mek });
        }

        // Prepare the message with download links
        let msg = `🎥 Direct Download Links for *${movieDetails.title}*\n\n`;
        movieDetails.downloadLinks.forEach(link => {
            msg += `- [${link.quality}](${link.link}) - Size: ${link.size}\n`; // Assuming the API returns quality, link, and size
        });

        // Send the message
        await conn.sendMessage(from, { text: msg }, { quoted: mek });
    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { text: '🚩 Error while fetching links.' }, { quoted: mek });
    }
});
