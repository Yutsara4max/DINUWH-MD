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
      if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
        connectToWA();
      }
    } else if (connection === 'open') {
      console.log('DINUWH MD 💚 Plugins installing...');
      const path = require('path');
      fs.readdirSync("./plugins/").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() == ".js") {
          require("./plugins/" + plugin);
        }
      });
      console.log('DINUWH MD 💚 Plugins installed ✅');
      console.log('DINUWH MD 💚 Bot connected to WhatsApp ✅');

      let up = `DINUWH MD 💚 Wa-BOT connected successfully ✅\n\nPREFIX: ${prefix}`;
      conn.sendMessage(ownerNumber + "@s.whatsapp.net", { image: { url: `https://i.ibb.co/tC37Q7B/20241220-122443.jpg` }, caption: up });
    }
  });

  conn.ev.on('creds.update', saveCreds);

  conn.ev.on('messages.upsert', async (mek) => {
    mek = mek.messages[0];
    if (!mek.message) return;
    mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;

    const m = sms(conn, mek);
    const type = getContentType(mek.message);
    const from = mek.key.remoteJid;
    const body = (type === 'conversation') ? mek.message.conversation :
        (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text :
        (type == 'imageMessage' && mek.message.imageMessage.caption) ? mek.message.imageMessage.caption :
        (type == 'videoMessage' && mek.message.videoMessage.caption) ? mek.message.videoMessage.caption : '';

    // ✅ Auto Status Handler
    const statesender = ["send", "dapan", "dapn", "ewhahn", "ewanna", "danna", "evano", "evpn", "ewano"];  

    for (let word of statesender) {
        if (body.toLowerCase().includes(word)) {
            if (!body.includes('tent') && !body.includes('docu') && !body.includes('https')) {
                let quoted = mek.message.extendedTextMessage?.contextInfo?.quotedMessage;
                if (!quoted) return;

                let quotedMessage = await downloadMediaMessage(quoted);
                
                if (quoted.imageMessage) {
                    await conn.sendMessage(from, { image: quotedMessage }, { quoted: mek });
                } else if (quoted.videoMessage) {
                    await conn.sendMessage(from, { video: quotedMessage }, { quoted: mek });
                } else {
                    console.log('Unsupported media type:', quotedMessage.mimetype);
                }
                break;  
            }
        }
    }
  });

  // ✅ Anti-Delete Message Feature
  conn.ev.on('messages.delete', async (message) => {
    if (config.ANTI_DELETE === "true" && message.remoteJid.endsWith('@g.us')) {
        try {
            const deletedMessage = await conn.loadMessage(message.remoteJid, message.id);
            if (deletedMessage) {
                const deletedContent = deletedMessage.message;

                let notificationText = `🚨 Deleted Message Detected 🚨\n\n`;
                notificationText += `From: ${deletedMessage.pushName} (@${deletedMessage.participant.split('@')[0]})\n`;

                if (deletedContent) {
                    if (deletedContent.conversation) {
                        notificationText += `Message: ${deletedContent.conversation}`;
                    } else if (deletedContent.extendedTextMessage) {
                        notificationText += `Message: ${deletedContent.extendedTextMessage.text}`;
                    } else if (deletedContent.imageMessage) {
                        notificationText += `Message: [Image with caption: ${deletedContent.imageMessage.caption}]`;
                    } else if (deletedContent.videoMessage) {
                        notificationText += `Message: [Video with caption: ${deletedContent.videoMessage.caption}]`;
                    } else {
                        notificationText += `Message: [${Object.keys(deletedContent)[0]} message]`;
                    }
                } else {
                    notificationText += `Message: [Unable to retrieve deleted content]`;
                }

                // Send notification to the chat where the message was deleted
                await conn.sendMessage(message.remoteJid, { text: notificationText });

                // If it's an image or video, send the media as well
                if (deletedContent && (deletedContent.imageMessage || deletedContent.videoMessage)) {
                    const media = await downloadMediaMessage(deletedMessage, 'buffer');
                    await conn.sendMessage(message.remoteJid, { image: media, caption: 'Deleted media' });
                }
            }
        } catch (error) {
            console.error('Error handling deleted message:', error);
        }
    }
  });

  conn.sendPresenceUpdate('unavailable'); 

  console.log("DINUWH MD 💚 Bot is ready!");
}

app.get("/", (req, res) => res.sendFile(require('path').join(__dirname, "./index.html")));
app.listen(port, () => console.log(`✅ DINUWH MD - Server Running...`));
setTimeout(() => {
    connectToWA();
}, 4000);
