const { cmd, commands } = require('../command'),
  scraper = require('../lib/scraperd'),
  axios = require('axios'),
  fetch = require('node-fetch'),
  { fetchJson, getBuffer } = require('../lib/functions'),
  { lookup } = require('mime-types'),
  fs = require('fs'),
  path = require('path'),
  yts = require('yt-search'),
  cheerio = require('cheerio');

// Instagram Video Download Command
cmd(
  {
    pattern: 'insta',
    alias: 'ig'
    desc: 'To download Instagram videos.',
    category: 'download',
    react: '📩',
    filename: __filename,
  },
  async (bot, message, args, { reply }) => {
    try {
      if (!args[0]) {
        return reply('*ඩව්න්ලෝඩර් ලින්ක් එකක් දීපාම්😒✌️*');
      }

      await message.react('📥');

      let instaData;
      try {
        instaData = await igdl(args[0]);
      } catch (error) {
        return reply('*Error...හදුනාගන්නට නොහැකි වුනා wutto😹✌️*');
      }

      let videoList = instaData.data;
      if (!videoList || videoList.length === 0) {
        return reply('*No results found.*');
      }

      let selectedVideo =
        videoList.find((video) => video.resolution === '720p (HD)') ||
        videoList.find((video) => video.resolution === '360p (SD)');

      if (!selectedVideo) {
        return reply('*Error: Data loss.*');
      }

      await message.react('⚡');

      let videoUrl = selectedVideo.url;
      let caption = '*📥 Instagram Video Downloaded*';

      try {
        await bot.sendMessage(
          message.chat,
          {
            video: { url: videoUrl },
            caption: caption,
            fileName: 'instagram_video.mp4',
            mimetype: 'video/mp4',
          },
          { quoted: message }
        );
      } catch (error) {
        return reply('*Error downloading video.*');
      }
    } catch (error) {
      console.log(error);
      reply('*Error: ' + error.message + '*');
    }
  }
);

// Direct Link Uploader Command
cmd(
  {
    pattern: 'dl',
    react: '📥',
    alias: ['dlurl'],
    desc: 'Direct link uploader',
    category: 'download',
    use: '.dl <link>',
    filename: __filename,
  },
  async (bot, message, args, { reply }) => {
    try {
      if (!args[0]) {
        return reply('❗ Please provide a link!');
      }

      const isValidUrl = (url) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      };

      if (!isValidUrl(args[0])) {
        return reply('❌ Invalid URL format! Please check the link.');
      }

      const response = await axios.get(args[0], {
        responseType: 'arraybuffer',
        timeout: 15000,
      });

      const mimeType = response.headers['content-type'] || 'application/octet-stream';
      const fileExtension = lookup(mimeType) || 'unknown';
      const fileSize = response.headers['content-length'] || 0;
      const maxFileSize = 10 * 1024 * 1024; // 10MB limit

      if (fileSize > maxFileSize) {
        return reply('❗ File is too large to upload (limit: 10MB).');
      }

      const fileName = 'Download_File.' + fileExtension;

      await bot.sendMessage(
        message.chat,
        {
          document: { url: args[0] },
          caption: '> Downloaded File 📥',
          mimetype: mimeType,
          fileName: fileName,
        },
        { quoted: message }
      );
    } catch (error) {
      console.error(error);
      reply('❌ Error: ' + error.message);
    }
  }
);

// APK Download Command
cmd(
  {
    pattern: 'apk',
    desc: 'Downloads APK files',
    use: '.apk <app_name>',
    react: '📥',
    category: 'download',
    filename: __filename,
  },
  async (bot, message, args, { reply }) => {
    const appName = args.join(' ');
    if (!appName) {
      return reply('Please provide an app name.');
    }

    reply('_Downloading ' + appName + '_');

    try {
      const apkData = await scraper.aptoideDl(appName);
      const apkFile = await getBuffer(apkData.link);

      if (!apkFile || !apkData.appname) {
        return await bot.sendMessage(message.chat, {
          react: {
            text: '❌',
            key: message.key,
          },
        });
      }

      await bot.sendMessage(
        message.chat,
        {
          document: apkFile,
          caption: '*📥 APK Downloaded*',
          mimetype: 'application/vnd.android.package-archive',
          filename: apkData.appname + '.apk',
        },
        { quoted: message }
      );

      await bot.sendMessage(message.chat, {
        react: {
          text: '✅',
          key: message.key,
        },
      });

      reply('*_Download Successful_*');
    } catch (error) {
      console.error(error);
      reply('❌ Error: ' + error.message);
    }
  }
);

// YouTube Song Download Command
cmd(
  {
    pattern: 'song',
    react: '🎶',
    desc: 'Download audio from YouTube',
    category: 'music',
    use: '.play1 <song name>',
    filename: __filename,
  },
  async (bot, message, args, { reply }) => {
    try {
      const songName = args.join(' ');
      if (!songName) {
        return reply('*Please provide a song name.*');
      }

      reply('🎵 Searching for the song...');

      const searchResults = await yts(songName);
      if (!searchResults.videos.length) {
        return reply('❌ No results found.');
      }

      const video = searchResults.videos[0];
      const downloadUrl = `https://api.davidcyriltech.my.id/download/ytmp3?url=${video.url}`;
      const response = await axios.get(downloadUrl);

      if (!response.data.success) {
        return reply('❌ Failed to fetch audio.');
      }

      await bot.sendMessage(
        message.chat,
        {
          audio: { url: response.data.result.download_url },
          mimetype: 'audio/mp4',
          ptt: false,
        },
        { quoted: message }
      );

      reply(`✅ *${response.data.result.title}* has been downloaded successfully!`);
    } catch (error) {
      console.error(error);
      reply('❌ An error occurred.');
    }
  }
);

// Wallpaper Download Command
cmd(
  {
    pattern: 'wallpaper',
    alias: ['wallpaperdownload'],
    react: '🖼️',
    desc: 'Download a random wallpaper',
    category: 'download',
    use: '.wallpaper',
    filename: __filename,
  },
  async (bot, message, args, { reply }) => {
    try {
      const url = 'https://unsplash.com/s/photos/wallpaper';
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      let wallpapers = [];

      $('figure img').each((index, element) => {
        wallpapers.push($(element).attr('src'));
      });

      if (!wallpapers.length) {
        return reply('No wallpapers found!');
      }

      const randomWallpaper = wallpapers[Math.floor(Math.random() * wallpapers.length)];

      await bot.sendMessage(
        message.chat,
        {
          image: { url: randomWallpaper },
          caption: 'Here is your wallpaper!',
        },
        { quoted: message }
      );
    } catch (error) {
      console.error(error);
      reply('An error occurred while downloading the wallpaper.');
    }
  }
);
