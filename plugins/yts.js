const yts = require("yt-search");

cmd({
    pattern: "yts",
    alias: ["ytsearch"],
    use: '.yts <query>',
    react: "🔎",
    desc: descsh,
    category: "search",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply(Give me a text);

        const searchResults = await yts(q);
        if (!searchResults.all.length) return reply(N_FOUND);

        let response = searchResults.all.map(video => `*🗓️ ${video.title}*\n🔗 ${video.url}\n`).join("\n");
        await conn.sendMessage(from, { text: response }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply('*Error occurred while searching YouTube!*');
    }
});
