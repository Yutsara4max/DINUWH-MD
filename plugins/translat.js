const { cmd } = require('../command'); // Ensure the path is correct
const translate = require('translate-google-api'); // Import translate-google-api for translation

cmd({
    pattern: "translate",
    alias: ["trans"],
    react: "🌐",
    desc: "Translate text to a specified language",
    category: "convert",
    use: '.translate <text> to <language>',
    filename: __filename
},
async(conn, mek, m, { from, reply, q }) => {
    try {
        const [text, lang] = q.split(" to ");
        if (!text || !lang) return await reply("Please provide text and the target language!");

        const translatedText = await translate(text, { to: lang });
        await reply(`*Translated Text:*\n${translatedText}`);

    } catch (error) {
        console.error(error);
        reply('An error occurred while translating the text. Please try again later.');
    }
});