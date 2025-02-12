const config = require('../config')
const { cmd, commands } = require('../command')
  
cmd({
    pattern: "kickall",
    desc: "Kicks all non-admin members from the group.",
    react: "👏",
    category: "group",
    filename: __filename,
},           
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
      if (!isAdmins) return reply(`ɪ ɴᴇᴇᴅ ᴀᴅᴍɪɴ 💀`)
      if (!isOwner) return reply(`ʏᴏᴜ ᴀʀᴇ ɴᴏᴛ ᴏᴡɴᴇʀ ᴏꜰ ᴅɪᴅᴜʟᴀ ᴍᴅ`)
      
        // Check if the command is used in a group
        if (!isGroup) return reply(`This command is only for groups.`);
        
        // Check if the bot has admin privileges
        if (!isBotAdmins) return reply(`I need admin privileges to kick users.`);
        // Fetch all participants from the group
        const allParticipants = groupMetadata.participants;
        // Filter out the admins (including the bot)
        const nonAdminParticipants = allParticipants.filter(member => !groupAdmins.includes(member.id));
        if (nonAdminParticipants.length === 0) {
            return reply('There are no non-admin members to kick.');
        }
        // Start removing non-admin participants
        for (let participant of nonAdminParticipants) {
            await conn.groupParticipantsUpdate(m.chat, [participant.id], "remove");
  }
        // Send a confirmation message once done
        reply(`Didula MD V2 💚 Successfully kicked all non-admin members from the group.`);
        
    } catch (e) {
        console.error('Error kicking users:', e);
        reply('An error occurred while trying to kick all members. Please try again.');
    }
});


cmd({
    pattern: "groupinfo",
    desc: "Get information about the group.",
    category: "group",
    filename: __filename,
    react: "ℹ️"
},
async(conn, mek, m, { from, isGroup, groupMetadata, groupName, participants, groupAdmins, reply }) => {
    try {
        if (!isGroup) return reply('This command can only be used in groups.');

        const groupInfo = `*Didula MD V2 💚*\n\n
📋 *Group Information*
👥 *Name:* ${groupName}
📝 *Description:* ${groupMetadata.desc || 'No description'}
🆔 *ID:* ${from}
👑 *Owner:* ${groupMetadata.owner || 'Not available'}
👤 *Members:* ${participants.length}
👮 *Admins:* ${groupAdmins.length}
📅 *Created:* ${new Date(groupMetadata.creation * 1000).toLocaleString()}\n\n*Didula MD V2 💚*
        `;
        reply(groupInfo);
    } catch(e) {
        console.error(e);
        reply(`❌ Error: ${e}`);
    }
});