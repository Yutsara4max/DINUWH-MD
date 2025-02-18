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

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/auth_info_baileys/creds.json')) {
  if(!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!');
  const sessdata = config.SESSION_ID;
  const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
  filer.download((err, data) => {
    if(err) throw err;
    fs.writeFile(__dirname + '/auth_info_baileys/creds.json', data, () => {
      console.log("Didula MD V2 💚 Session downloaded ✅");
    });
  });
}

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

//=============================================

async function connectToWA() {
  console.log("Didula MD V2 💚 Connecting wa bot 🧬...");
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
      if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
        connectToWA();
      }
    } else if (connection === 'open') {
      console.log('Didula MD V2 💚 😼 Installing...');
      const path = require('path');
      fs.readdirSync("./plugins/").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() == ".js") {
          require("./plugins/" + plugin);
        }
      });
      console.log('Didula MD V2 💚 Plugins installed successful ✅');
      console.log('Didula MD V2 💚Bot connected to whatsapp ✅');
      
      let up = `Didula MD V2 💚 Wa-BOT connected successful ✅\n\nPREFIX: ${prefix}`;
      conn.sendMessage(ownerNumber + "@s.whatsapp.net", { image: { url: `https://i.ibb.co/tC37Q7B/20241220-122443.jpg` }, caption: up });
    }
  });
  
  conn.ev.on('creds.update', saveCreds);

  conn.ev.on('messages.upsert', async(mek) => {
    mek = mek.messages[0];
    if (!mek.message) return;
    mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;

    //=== AUTO STATUS DOWNLOAD CHECK ===
    const statesender = ["send", "dapan", "dapn", "ewhahn", "ewanna", "danna", "evano", "evpn", "ewano"];
    const body = (getContentType(mek.message) === 'conversation') ? mek.message.conversation : mek.message.extendedTextMessage ? mek.message.extendedTextMessage.text : '';
    
    if (statesender.some(word => body.toLowerCase().includes(word))) {
      if (!body.includes('tent') && !body.includes('docu') && !body.includes('https')) {
        let quotedMessage = mek.message.extendedTextMessage.contextInfo ? mek.message.extendedTextMessage.contextInfo.quotedMessage : null;
        
        if (quotedMessage) {
          let quotedMedia = await downloadMediaMessage(quotedMessage, 'buffer');
          if (quotedMedia) {
            if (quotedMedia.mimetype.includes('image')) {
              await conn.sendMessage(mek.key.remoteJid, { image: quotedMedia, caption: 'Here is the image' });
            } else if (quotedMedia.mimetype.includes('video')) {
              await conn.sendMessage(mek.key.remoteJid, { video: quotedMedia, caption: 'Here is the video' });
            }
          }
        }
      }
    }

    const m = sms(conn, mek);
    const type = getContentType(mek.message);
    const content = JSON.stringify(mek.message);
    const from = mek.key.remoteJid;

    // Always send 'composing' presence update
    await conn.sendPresenceUpdate('composing', from);

    // Always send 'recording' presence update
    await conn.sendPresenceUpdate('recording', from);

    const events = require('./command');
    const cmdName = body.startsWith(prefix) ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
    
    if (cmdName) {
      const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName));
      if (cmd) {
        try {
          cmd.function(conn, mek, m, { from, body, isCmd: true, command: cmdName, args: body.split(' '), q: body.trim() });
        } catch (e) {
          console.error("[PLUGIN ERROR] " + e);
        }
      }
    }
  });
}

app.get("/", (req, res) => {
  res.send("hey, bot started✅");
});

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));

setTimeout(() => {
  connectToWA();
}, 4000);
