const { cmd } = require('../command'); // Ensure the path is correct
const textPro = require('@sl-code-lords/text-pro-me'); // Import text-pro-me for text transformation

cmd({
    pattern: "textpro",
    alias: ["texttransform"],
    react: "✍️",
    desc: "Transform text into various styles",
    category: "convert",
    use: '.textpro <style> <text>',
    filename: __filename
},
async(conn, mek, m, { from, reply, q }) => {
    try {
        const [style, ...textArr] = q.split(" ");
        const text = textArr.join(" ");

        if (!style || !text) return await reply("Please provide a style and text!");

        const result = await textPro(style, text);
        await conn.sendMessage(from, { image: { url: result } }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply('An error occurred while processing your request. Please try again later.');
    }
});