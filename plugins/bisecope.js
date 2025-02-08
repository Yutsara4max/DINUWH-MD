const fg = require('api-dylux');
const axios = require('axios');
const mime = require('mime-types');  // Make sure to install mime-types package
const cheerio = require('cheerio');
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const fs = require('fs-extra');
const config = require('../config')
const {
  cmd,
  commands
} = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson, fetchApi} = require('../lib/functions')



cmd({
    pattern: "baiscope",	
    react: '📑',
    category: "search",
    desc: "pirate moive downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, isDev, reply }) => {
try{
	if ( !isDev ) return reply('⚠️ ⚠️ *Contact owner to Active your number To Premium user*')
        if(!q) return await reply('*please give me text !..*')
const url = `${q}`;
const response = await axios.get(url);
const $ = cheerio.load(response.data);
      let results = [];
$('article.elementor-post').each((index, element) => {
        const titleElement = $(element).find('h5 > a');
        
        const title = titleElement.text().trim();
        const link = titleElement.attr('href');
        const img = $(element).find('img').attr('src');
})

        if (results.length < 1) return await conn.sendMessage(from, { text: 'erro !' }, { quoted: mek } )
      	var rows = [];  
for (var i = 0; i < results.length; i++) {
	rows.push({
    
              header: '',
              title: results[i].title,
              description: results[i].title,
              id: `.bidl ${results[i].link}`
            
          });
        }
          
        let buttons = [{
          name: "single_select",
                    buttonParamsJson: JSON.stringify({
                        title: 'Download Moive 📥',
                        sections: [{
                            title: 'Search By Baiscope',
                            highlight_label: 'T.C MOVIE-DL',
                            rows: rows
                    }]
               }),
          }
      ]
        const info = `⏳ Search A Movie Name: ${q}
📲 Search top 10 Movies\n
baiscope`
        let opts = {
                image: results[0].img,
                header: '_*T.C BAISCOPE DL*_',
                footer: 'MOVIE DOWNLOADER BY TC',
                body: info 

            }
            return await conn.sendButtonMessage(from, buttons, m, opts)
        } catch (e) {
reply()
l(e)
}
})       

//=================================SUB================================
                    
cmd({
    pattern: "baiscopesub",	
    react: '📑',
    category: "search",
    desc: "pirate moive downloader",
    filename: __filename
},
async (conn, m, mek, { from, q, isDev, reply }) => {
try{
	if ( !isDev ) return reply('⚠️ ⚠️ *Contact owner to Active your number To Premium user*')
        if(!q) return await reply('*please give me text !..*')
const url = `https://www.baiscope.lk/?s=${q}`
const response = await axios.get(url);
          const $ = cheerio.load(response.data);

    let baiscope = [];
    $("div.elementor-column.elementor-col-66.elementor-top-column.elementor-element.elementor-element-1c0cc75 > div > div > div > div > article").each((c, d) => {
        baiscope.push({
            title: $(d).find("div > div > h5 > a").text(),
            image: $(d).find("div > a > div > img").attr("src"),
            link: $(d).find("div > div > h5 > a").attr("href"),
        })
    })


        if (baiscope.length < 1) return await conn.sendMessage(from, { text: 'erro !' }, { quoted: mek } )
      	var rows = [];  
for (var i = 0; i < baiscope.length; i++) {
	rows.push({
    
              header: '',
              title: baiscope[i].title,
              description: baiscope[i].title,
              id: `.bidl ${baiscope[i].link}`
            
          });
        }
          
        let buttons = [{
          name: "single_select",
                    buttonParamsJson: JSON.stringify({
                        title: 'Download Moive 📥',
                        sections: [{
                            title: 'Search By Baiscope',
                            highlight_label: 'T.C MOVIE-DL',
                            rows: rows
                    }]
               }),
          }
      ]
        const info = `⏳ Search A Movie Name: ${q}
📲 Search top 10 Movie Subtitles\n
baiscope`
        let opts = {
                image: baiscope[0].image,
                header: '_*T.C BAISCOPE DL*_',
                footer: 'MOVIE DOWNLOADER BY TC',
                body: info 

            }
            return await conn.sendButtonMessage(from, buttons, m, opts)
        } catch (e) {
            reply('*Error !!*')
            console.log(e)
            }
    })


cmd({
    pattern: "bidl",	
    react: '📑',
    category: "search",
    desc: "sinhalasub moive downloader",
    filename: __filename
},
    async ( conn, mek, m, { reply, q, isDev, l, from }) => {
	 if ( !isDev ) return reply('⚠️ ⚠️ *Contact owner to Active your number To Premium user*')   
	    try {
		    if (!q) return await reply("please give me text !..")
		    const response = await axios.get(q);
          const $ = cheerio.load(response.data);

    
    const d = $("div.cm-posts.clearfix > article > div");
           const time = d.find("div.cm-below-entry-meta > span.cm-post-date > a > time").text();
           const title = d.find("header.cm-entry-header > h1").text();
           const desc = d.find("div.cm-entry-summary > p > span").text();
           const ratings = d.find("div.cm-entry-summary > div > div > div.gdrts-rating-text > strong").text();
           const image = d.find("div.cm-entry-summary > p:nth-child(2) > img").attr("src");
           const link = $("#post-218491 > div > div.cm-entry-summary > a").attr("href");
	   const lin2 = d.find("div.cm-entry-summary > div:nth-child(35) > a").attr("href");
           const dllinks = lin2 ? lin2 : link	    
                      const msg = `📃 *Title:* 
💫 *Rating:* ${title} 
⏳ *Date:* ${time}
💡 *rating:* ${ratings}
📂 *download:* ${dllinks}`



/*const links = d.find("div.cm-entry-summary > a").attr("href");
           const lin2 = d.find("div.cm-entry-summary > div:nth-child(35) > a").attr("href");
           const dllinks = lin2 ? lin2 : links*/
		    
                let buttons = [{
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: 'See On Baiscope',
                        url: q,
                        merchant_url: q
                    }),
                },
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: `SubDl`,
                        id: ".fetchrar " + dllinks
                    }),
                }
                ]
                let message = {
                    image: image,
                    header: '🎬━_*T.C BAISCOPE SUBDL*_━🎬',
                    footer: 'MOVIE DOWNLOADER BY TC',
                    body: msg

                }
                return conn.sendButtonMessage(from, buttons, m, message)

	    } catch (e) {
		    console.log(e)
		    reply('➥' + e)

	    }
    })
	
   




		
cmd({
    pattern: "fetchrar",
    react: "📥",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, isDev, reply }) => {
	if ( !isDev ) return reply('⚠️ ⚠️ *Contact owner to Active your number To Premium user*')
    if (!q) {
        return await reply('*Please provide a direct URL!*');
    }

    try {

	    
        const mediaUrl = q.trim();

        const response = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
        const mediaBuffer = Buffer.from(response.data, 'binary');

var vajiralod = [
"《 █▒▒▒▒▒▒▒▒▒▒▒》10%",
"《 ████▒▒▒▒▒▒▒▒》30%",
"《 ███████▒▒▒▒▒》50%",
"《 ██████████▒▒》80%",
"《 ████████████》100%",
"𝙸𝙽𝙸𝚃𝙸𝙰𝙻𝙸𝚉𝙴𝙳 𝙲𝙾𝙼𝙿𝙻𝙴𝚃𝙴𝙳 🦄..."
]
let { key } = await conn.sendMessage(from, {text: 'ᴜᴘʟᴏᴀᴅɪɴɢ ᴍᴏᴠɪᴇ...'})

for (let i = 0; i < vajiralod.length; i++) {
await conn.sendMessage(from, {text: vajiralod[i], edit: key })
}


        const message = {
            document: mediaBuffer,
	    caption: "*🎬 TC TEAM MOVIEDL 🎬*",
            mimetype: "application/rar",
            fileName: `TC TEAM.rar`,
        };
        await conn.sendMessage(from, message, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
    } catch (error) {
        console.error('Error fetching or sending', error);
        await conn.sendMessage(from, '*Error fetching or sending *', { quoted: mek });
    }
});


