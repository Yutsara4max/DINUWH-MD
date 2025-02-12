const axios = require('axios');
const xml2js = require('xml2js');
const { cmd } = require('../command');

cmd({
    pattern: "itnnews",
    desc: "Get the latest ITN news headlines or details of a given link.",
    category: "news",
    react: "📰",
    filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
    try {
        const rssFeedUrl = 'https://www.itnnews.lk/feed/';
        const response = await axios.get(rssFeedUrl);
        const xmlData = response.data;

        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(xmlData);

        const newsItems = result.rss.channel[0].item.map(item => ({
            title: item.title[0],
            link: item.link[0],
            description: item.description[0],
            pubDate: item.pubDate[0]
        }));

        // User එකට link එකක් දීලා search කරොත්
        if (q && q.startsWith("https://www.itnnews.lk/")) {
            const article = newsItems.find(news => news.link === q.trim());
            if (!article) return reply("❌ Sorry, this news article was not found in the latest updates!");

            let articleText = `*📰 ITN News Details:*\n\n`;
            articleText += `📌 *${article.title}*\n`;
            articleText += `📅 _${article.pubDate}_\n`;
            articleText += `📖 ${article.description}\n`;
            articleText += `🔗 ${article.link}\n`;

            return reply(articleText);
        }

        // User එක link එකක් දීලා නැත්නම් Latest 5 news return කරනවා
        let newsText = `*📰 ITN Latest News:*\n\n`;
        newsItems.slice(0, 5).forEach((news, index) => {
            newsText += `📌 *${index + 1}.* *${news.title}*\n`;
            newsText += `📅 _${news.pubDate}_\n`;
            newsText += `🔗 ${news.link}\n\n`;
        });

        reply(newsText);
    } catch (error) {
        console.error("Error fetching ITN News:", error);
        reply("❌ Could not fetch ITN news. Please try again later.");
    }
});
