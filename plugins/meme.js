const { cmd } = require('../command'); // Ensure the path is correct
const photoOxy = require('@sl-code-lords/photooxy'); // Import PhotoOxy for meme generation

cmd({
    pattern: "meme",
    alias: ["memegen"],
    react: "😂",
    desc: "Generate a meme with text",
    category: "other",
    use: '.meme <top text> | <bottom text>',
    filename: __filename
},
async(conn, mek, m, { from, reply, q }) => {
    try {
        const [topText, bottomText] = q.split("|").map(text => text.trim());
        if (!topText || !bottomText) return await reply("Please provide top and bottom text for the meme!");

        const memeImage = await photoOxy.memeGenerator(topText, bottomText);
        await conn.sendMessage(from, { image: { url: memeImage } }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply('An error occurred while generating the meme. Please try again later.');
    }
});