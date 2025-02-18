const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys');

const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions');
const fs = require('fs');
const P = require('pino');
const config = require('./config');
const qrcode = require('qrcode-terminal');
const util = require('util');
const { sms, downloadMediaMessage } = require('./lib/msg');
const axios = require('axios');
const { File } = require('megajs');
const prefix = '.';

const ownerNumber = ['94771820962'];

if (!fs.existsSync(__dirname + '/auth_info_baileys/creds.json')) {
  if (!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!');
  const sessdata = config.SESSION_ID;
  const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
  filer.download((err, data) => {
    if (err) throw err;
    fs.writeFile(__dirname + '/auth_info_baileys/creds.json', data, () => {
      console.log("DINUWH MD 💚 Session downloaded ✅");
    });
  });
}

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

async function connectToWA() {
  console.log("DINUWH MD 💚 Connecting wa bot 🧬...");
  const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/auth_info_baileys/');
  var { version } = await fetchLatestBaileysVersion();

  const conn = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: false,
    browser: Browsers.macOS("Firefox"),
    syncFullHistory: true,
    auth: state,
    version
  });

  conn.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
        connectToWA();
      }
    } else if (connection === 'open') {
      console.log('DINUWH MD 💚 Bot connected successfully ✅');

      let up = `DINUWH MD 💚 Wa-BOT connected successfully ✅\n\nPREFIX: ${prefix}`;
      conn.sendMessage(ownerNumber + "@s.whatsapp.net", { text: up });
    }
  });

  conn.ev.on('creds.update', saveCreds);

  conn.ev.on('messages.upsert', async (mek) => {
    mek = mek.messages[0];
    if (!mek.message) return;

    mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;

    const sender = mek.key.participant || mek.key.remoteJid;
    const messageType = Object.keys(mek.message)[0];
    const messageContent = mek.message[messageType];
    const from = mek.key.remoteJid;

    if (from === 'status@broadcast') {
      if (config.AUTO_READ_STATUS === "true") {
        await conn.readMessages([mek.key]);
        
        const emojis = ['🧩', '🍉', '💜', '🌸', '🪴', '💊', '💫', '🍂', '🌟', '🎋', '😶‍🌫️', '🫀', '🧿', '👀', '🤖', '🚩', '🥰', '🗿', '💜', '💙', '🌝', '🖤', '💚'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        await conn.sendMessage(mek.key.remoteJid, {
          react: {
            text: randomEmoji,
            key: mek.key,
          }
        }, { statusJidList: [mek.key.participant] });
      }

      const allowedCommands = ["send", "save", "ewanna"];
      if (messageType === 'conversation' && allowedCommands.includes(messageContent.toLowerCase().trim())) {
        const mediaMessage = mek.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage 
                          || mek.message.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage 
                          || mek.message.extendedTextMessage?.contextInfo?.quotedMessage?.documentMessage 
                          || mek.message.extendedTextMessage?.contextInfo?.quotedMessage?.audioMessage;

        if (mediaMessage) {
          const buffer = await downloadMediaMessage({ message: mediaMessage }, 'buffer');
          await conn.sendMessage(sender, { document: buffer, mimetype: mediaMessage.mimetype, fileName: 'status_media' });
        } else {
          await conn.sendMessage(sender, { text: "📢 *මෙම Status එකට Send කල නොහැක!*" });
        }
      }
    }

    const m = sms(conn, mek);
    const type = getContentType(mek.message);
    const content = JSON.stringify(mek.message);
    const isCmd = (type === 'conversation') ? mek.message.conversation.startsWith(prefix) : false;
    const command = isCmd ? mek.message.conversation.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
    const args = mek.message.conversation ? mek.message.conversation.trim().split(/ +/).slice(1) : [];
    const q = args.join(' ');

    conn.sendPresenceUpdate('composing', from);
    conn.sendPresenceUpdate('recording', from);

    const reply = (teks) => {
      conn.sendMessage(from, { text: teks }, { quoted: mek });
    }

    conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
      let mime = '';
      let res = await axios.head(url);
      mime = res.headers['content-type'];
      if (mime.split("/")[1] === "gif") {
        return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options });
      }
      let type = mime.split("/")[0] + "Message";
      if (mime === "application/pdf") {
        return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options });
      }
      if (mime.split("/")[0] === "image") {
        return conn.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options });
      }
      if (mime.split("/")[0] === "video") {
        return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options });
      }
      if (mime.split("/")[0] === "audio") {
        return conn.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options });
      }
    }
  });
}

app.get("/", (req, res) => {
  res.send("DINUWH MD Bot is Running! ✅");
});

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
setTimeout(() => {
  connectToWA();
}, 4000);
