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

//=================== SESSION-AUTH ============================
const downloadSession = async () => {
    try {
        const sessdata = config.SESSION_ID;
        if (!sessdata) return console.log('Please add your session to SESSION_ID env !!');

        const file = File.fromURL(`https://mega.nz/file/${sessdata}`);
        const data = await file.downloadBuffer();
        fs.writeFileSync(__dirname + '/auth_info_baileys/creds.json', data);
        console.log("Didula MD V2 💚 Session downloaded ✅");
    } catch (err) {
        console.error("❌ Failed to download session: ", err);
    }
};

if (!fs.existsSync(__dirname + '/auth_info_baileys/creds.json')) {
    downloadSession();
}

//=================== EXPRESS SERVER ==========================
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
    res.send("Hey, bot started ✅");
});

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));

//=================== WHATSAPP CONNECTION =====================
async function connectToWA() {
    console.log("Didula MD V2 💚 Connecting wa bot 🧬...");
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/auth_info_baileys/');
    const { version } = await fetchLatestBaileysVersion();

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
            console.log('Didula MD V2 💚 Plugins installing...');
            
            const path = require('path');
            fs.readdirSync("./plugins/").forEach((plugin) => {
                if (path.extname(plugin).toLowerCase() === ".js") {
                    require("./plugins/" + plugin);
                }
            });

            console.log('Didula MD V2 💚 Plugins installed ✅');
            console.log('Didula MD V2 💚 Bot connected to WhatsApp ✅');

            const up = `Didula MD V2 💚 Wa-BOT connected successfully ✅\n\nPREFIX: ${prefix}`;
            conn.sendMessage(ownerNumber[0] + "@s.whatsapp.net", {
                image: { url: "https://i.ibb.co/tC37Q7B/20241220-122443.jpg" },
                caption: up
            });
        }
    });

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('messages.upsert', async (mek) => {
        mek = mek.messages[0];
        if (!mek.message) return;

        mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;

        if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_READ_STATUS === "true") {
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

        const m = sms(conn, mek);
        const type = getContentType(mek.message);
        const body = type === 'conversation' ? mek.message.conversation :
            type === 'extendedTextMessage' ? mek.message.extendedTextMessage.text :
            (type === 'imageMessage' && mek.message.imageMessage.caption) ? mek.message.imageMessage.caption :
            (type === 'videoMessage' && mek.message.videoMessage.caption) ? mek.message.videoMessage.caption : '';

        const isCmd = body.startsWith(prefix);
        const command = isCmd ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase() : '';
        const args = body.trim().split(/ +/).slice(1);
        const q = args.join(' ');
        const from = mek.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid);
        const senderNumber = sender.split('@')[0];
        const botNumber = conn.user.id.split(':')[0];
        const pushname = mek.pushName || 'Sin Nombre';
        const isMe = botNumber.includes(senderNumber);
        const isOwner = ownerNumber.includes(senderNumber) || isMe;

        await conn.sendPresenceUpdate('composing', from);
        await conn.sendPresenceUpdate('recording', from);

        const reply = (text) => {
            conn.sendMessage(from, { text }, { quoted: mek });
        };

        if (isCmd) {
            const events = require('./command');
            const cmd = events.commands.find((cmd) => cmd.pattern === command) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(command));
            if (cmd) {
                if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } });
                try {
                    cmd.function(conn, mek, m, { from, quoted: null, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber, pushname, isMe, isOwner, reply });
                } catch (e) {
                    console.error("[PLUGIN ERROR] " + e);
                }
            }
        }
    });

    conn.sendPresenceUpdate('unavailable'); // Sets bot as 'offline'
}

setTimeout(connectToWA, 4000);
