const { cmd, commands } = require('../command'); 
const { fetchJson } = require('../lib/functions');
const chalk = require('chalk');

cmd({
    pattern: 'apk',
    desc: 'Download APK from BK9',
    category: 'download',
    filename: __filename
}, async (client, message, args, extra) => {
    try {
        let { from, reply, q } = extra;

        if (!q) return reply('*Provide an app name!*');

        // Search for the APK
        let searchResult = await fetchJson(`https://bk9.fun/search/apk?q=${q}`);
        if (!searchResult || !searchResult.name) return reply('*No results found!*');

        // Fetch the download link
        let apkData = await fetchJson(`https://bk9.fun/download/apk?id=${searchResult.name[0].id}`);
        if (!apkData || !apkData.name || !apkData.name.dllink) return reply('*Download link not found!*');

        // Notify user
        reply('*♻️ DOWNLOADING... 🪄*\n> POWERED BY DINUWH MD');

        // Send APK
        await client.sendMessage(from, {
            document: { url: apkData.name.dllink },
            fileName: apkData.name.name,
            mimetype: 'application/vnd.android.package-archive',
            caption: '> *CREATED BY DINUWH MD™* 🪀'
        }, { quoted: message });

    } catch (error) {
        console.log(chalk.red('ERROR:'), error);
        reply('*An error occurred while downloading the APK!*');
    }
});
