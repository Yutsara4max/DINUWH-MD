const config = require('../config');
const { cmd } = require('../command');
const fs = require('fs');


//======================================================================================================================
cmd({
    pattern: "join",
    fromMe: true,  // Only bot owner can use this command
    desc: "Make the bot join a group using an invite link.",
    category: "group",
    react: "🌀",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, args, q, reply }) => {
    try {
        // Check if invite link is provided
        if (!q || !q.includes("chat.whatsapp.com")) {
            return await reply("Please provide a valid WhatsApp group invite link.");
        }
        // Extract the group code from the invite link
        const inviteCode = q.split("chat.whatsapp.com/")[1];
        // Make the bot join the group using the invite code
        const response = await conn.groupAcceptInvite(inviteCode);
        // Send confirmation message if successfully joined
        if (response) {
            await reply("✅ Successfully joined the group!");
        } else {
            await reply("❌ Failed to join the group. Please check the invite link.");
        }
    } catch (e) {
        console.error("Error while joining group:", e);
        await reply("❗ An error occurred while trying to join the group.");
    }
});
//============================================================================================================================
// Leave Command
cmd({
    pattern: "left",
    fromMe: true,  // Only bot owner can use this command
    desc: "Make the bot leave the group.",
    category: "group",
    react: "👋",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, reply }) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) {
            return await reply("❌ This command can only be used in a group.");
        }
        // Make the bot leave the group
        await conn.groupLeave(from);
        // Send confirmation message after leaving the group
        console.log(`Bot left the group: ${from}`);
    } catch (e) {
        console.error("Error while leaving group:", e);
        await reply("❗ An error occurred while trying to leave the group.");
    }
});
//============================================================================================================================
// Hidetag Command
cmd({
    pattern: "hidetag",
    fromMe: true,  // Only bot owner can use this command
    desc: "Send a message with hidden tags to all group members.",
    category: "group",
    react: "🔍",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, args, q, participants, reply }) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) {
            return await reply("❌ This command can only be used in a group.");
        }
        // Check if a message is provided
        if (!q) {
            return await reply("❗ Please provide a message to send.");
        }
        // Extract group participants' contact IDs
        const participantIds = participants.map((participant) => participant.id);
        // Send the message with hidden tags
        await conn.sendMessage(from, { 
            text: q, 
            mentions: participantIds 
        });
        console.log("Hidetag message sent to all group members.");
    } catch (e) {
        console.error("Error while sending hidetag message:", e);
        await reply("❗ An error occurred while trying to send the hidetag message.");
    }
});
//======================================================================================================================

//======================================================================================================================

//======================================================================================================================

//======================================================================================================================
cmd({
    pattern: "broadcast",
    fromMe: true,
    desc: "📢 Broadcast a message to all chats",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    const message = args.join(" ");
    if (!message) return reply("❗ Please provide a message to broadcast.");

    const chats = await conn.getAllChats();
    let successCount = 0;

    for (let chat of chats) {
        try {
            await conn.sendMessage(chat.id, { text: `📢 *DIDULA MD V2 💚 BROADCAST MESSAGE*\n\n${message}` });
            successCount++;
        } catch (error) {
            console.error(`Failed to send broadcast to ${chat.id}:`, error);
        }
    }

    reply(`✅ Broadcast sent to ${successCount} chats successfully!`);
});

//======================================================================================================================
cmd({
    pattern: "ban",
    fromMe: true,
    desc: "🚫 Ban a user from using the bot",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { args, reply, isOwner }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    if (!args[0]) return reply("❗ Please provide a user's number to ban.");

    const userToBan = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    config.banned.push(userToBan);

    reply(`🚫 User ${args[0]} has been banned from using the bot.`);
});

//======================================================================================================================
cmd({
    pattern: "unban",
    desc: "✅ Unban a user",
    fromMe: true,
    category: "main",
    filename: __filename
}, async (conn, mek, m, { args, reply, isOwner }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    if (!args[0]) return reply("❗ Please provide a user's number to unban.");

    const userToUnban = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    config.banned = config.banned.filter(user => user !== userToUnban);

    reply(`✅ User ${args[0]} has been unbanned.`);
});

//======================================================================================================================

//======================================================================================================================
cmd({
    pattern: "setbotbio",
    desc: "✏️ Change the bot's bio",
    fromMe: true,
    category: "main",
    filename: __filename
}, async (conn, mek, m, { args, reply, isOwner }) => {
    if (!isOwner) return reply("❌ You are not the owner!");

    const newBio = args.join(" ");
    if (!newBio) return reply("❗ Please provide a new bio for the bot.");

    await conn.updateProfileStatus(newBio);
    reply(`✅ Bot's bio has been changed to: *${newBio}*`);
});

//======================================================================================================================

// Block a user
cmd({
    pattern: "block",
    desc: "🚫 Block a user",
    fromMe: true,
    category: "main",
    filename: __filename
}, async (conn, mek, m, { args, reply, isOwner }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    if (!args[0]) return reply("❗ Please provide a user's number to block.");

    const userToBlock = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    await conn.updateBlockStatus(userToBlock, "block");

    reply(`🚫 User ${args[0]} has been blocked.`);
});

//======================================================================================================================
cmd({
    pattern: "unblock",
    desc: "✅ Unblock a user",
    fromMe: true,
    category: "main",
    filename: __filename
}, async (conn, mek, m, { args, reply, isOwner }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    if (!args[0]) return reply("❗ Please provide a user's number to unblock.");

    const userToUnblock = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    await conn.updateBlockStatus(userToUnblock, "unblock");

    reply(`✅ User ${args[0]} has been unblocked.`);
});


//======================================================================================================================
cmd({
    pattern: "setpp",
    desc: "🖼️ Set bot's profile picture",
    fromMe: true,
    category: "main",
    filename: __filename
}, async (conn, mek, m, { reply, isOwner }) => {
    if (!isOwner) return reply("❌ You are not the owner!");

    const media = m.message?.imageMessage || m.message?.videoMessage;
    if (!media || !media.url) return reply("❗ No image or video found.");

    try {
        const buffer = await conn.downloadMediaMessage(m);
        await conn.updateProfilePicture(buffer);
        reply("✅ Profile picture has been updated.");
    } catch (error) {
        console.error("Failed to update profile picture:", error);
        reply("❗ Failed to update profile picture.");
    }
});

let autoBioInterval;

//======================================================================================================================
cmd({
    pattern: "setautobio",
    alias: ["autobio"],
    fromMe: true,
    desc: "Enable or disable the AutoBIO feature.",
    category: "main",
    react: "🛠️",
    filename: __filename
}, async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");

    config.autoBioEnabled = !config.autoBioEnabled;

    if (config.autoBioEnabled) {
        reply("🛠️ AutoBIO feature has been *enabled*! 🔄");
        startAutoBio(conn);
    } else {
        reply("🛠️ AutoBIO feature has been *disabled*! 🚫");
        stopAutoBio();
    }
});

// 2. Start AutoBIO
function startAutoBio(conn) {
    // Clear any existing interval to avoid duplicates
    if (autoBioInterval) clearInterval(autoBioInterval);

    // Set a new interval to update the bio every minute (or any preferred time)
    autoBioInterval = setInterval(async () => {
        const time = new Date().toLocaleTimeString();  // Get the current time
        const bioText = `Didula MD V2 💚`;  // Set the bio text with time
        await conn.updateProfileStatus(bioText);  // Update the bot's bio
    }, 60 * 1000);  // 1 minute interval
}

// 3. Stop AutoBIO
function stopAutoBio() {
    if (autoBioInterval) {
        clearInterval(autoBioInterval);  // Stop the interval
        autoBioInterval = null;
        console.log("🛠️ AutoBIO feature stopped.");  // Log the stopping of the feature
    }
}