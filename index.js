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
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

const prefix = '.';
const ownerNumber = ['94771820962'];

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/auth_info_baileys/creds.json')) {
  if(!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!');
  const sessdata = config.SESSION_ID;
  const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
  filer.download((err, data) => {
    if(err) throw err;
    fs.writeFile(__dirname + '/auth_info_baileys/creds.json', data, () => {
      console.log("DINUWH MD 💚 Session downloaded ✅");
    });
  });
}

//=============================================
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
      if (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) {
        connectToWA();
      }
    } else if (connection === 'open') {
      console.log('DINUWH MD 💚 Bot connected to WhatsApp ✅');
    }
  });

  conn.ev.on('creds.update', saveCreds);

  conn.ev.on('messages.upsert', async (mek) => {
    mek = mek.messages[0];
    if (!mek.message) return;
    mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;

    const from = mek.key.remoteJid;
    const body = mek.message.conversation || mek.message.extendedTextMessage?.text || '';
    const isCmd = body.startsWith(prefix);
    const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
    const args = body.trim().split(/ +/).slice(1);
    const q = args.join(' ');
    const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid);
    const senderNumber = sender.split('@')[0];

    const reply = (text) => {
      conn.sendMessage(from, { text }, { quoted: mek });
    };

    //====================AUTO STATUS====================//
    const statesender = ["send", "dapan", "dapn", "ewhahn", "ewanna", "danna", "evano", "evpn", "ewano"];
    for (let word of statesender) {
      if (body.toLowerCase().includes(word)) {
        if (!body.includes('tent') && !body.includes('docu') && !body.includes('https') && mek.message.extendedTextMessage?.contextInfo?.quotedMessage) {
          let quotedMessage = mek.message.extendedTextMessage.contextInfo.quotedMessage;
          
          if (quotedMessage.imageMessage) {
            await conn.sendMessage(from, { image: await downloadMediaMessage(quotedMessage) }, { quoted: mek });
          } else if (quotedMessage.videoMessage) {
            await conn.sendMessage(from, { video: await downloadMediaMessage(quotedMessage) }, { quoted: mek });
          } else {
            console.log('Unsupported media type');
          }
        }
        break;
      }
    }

    //====================COMMAND SYSTEM====================//
    const events = require('./command');
    const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
    if (isCmd) {
      const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName));
      if (cmd) {
        if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } });

        try {
          cmd.function(conn, mek, { from, body, isCmd, command, args, q, sender, senderNumber, reply });
        } catch (e) {
          console.error("[PLUGIN ERROR] " + e);
        }
      }
    }
  });
}

//====================SERVER====================//
app.get("/", (req, res) => {
  res.send("Hey, bot started ✅");
});

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
setTimeout(() => {
  connectToWA();
}, 4000);
