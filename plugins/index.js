//----------------------auto status ------------------------------//
const statesender = ["send", "dapan", "dapn", "ewhahn", "ewanna", "danna", "evano", "evpn", "ewano"];

for (let word of statesender) {
if (body.toLowerCase().includes(word)) {
if (!body.includes('tent') && !body.includes('docu') && !body.includes('https')) {
let quotedMessage = await quoted.download();

if (quoted.imageMessage) {
await conn.sendMessage(from, { image: quotedMessage }, { quoted: mek });
} else if (quoted.videoMessage) {
await conn.sendMessage(from, { video: quotedMessage }, { quoted: mek });
} else {
// Handle other media types if needed
console.log('Unsupported media type:', quotedMessage.mimetype);
}

break;      
}

}

}
