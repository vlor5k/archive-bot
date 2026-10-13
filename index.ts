if(!process.env.DISCORD_TOKEN) {
    throw "Missing DISCORD_TOKEN in environment!";
}

import { Client, Message, TextChannel } from "discord.js-selfbot-v13";
import HandleUser from "./handlers/UserHandler";
import { logger } from "./handlers/Logger";
import HandleChannel from "./handlers/ChannelHandler";
import HandleGuild from "./handlers/GuildHandler";
import HandleMessage from "./handlers/MessageHandler";
import { prisma } from "./db";

const client = new Client();

client.on("ready", () => {
    console.log(`logged in as ${client.user?.username}`);
    prisma.logins.create({});
});

client.on("messageUpdate", async (_oldMsg, newMsg) => {
    // apparently msg can be a Message or a PartialMessage...
    // Nothing about PartialMessage on the docs (https://discordjs-self-v13.netlify.app)
    // and I can't find an import for it...
    if(newMsg instanceof Message) {
        await HandleMessage(newMsg);
    } else {
        console.debug("Not instanceof Message... Investigate... ", newMsg);
    }
})

client.on("messageCreate", async (msg) => {
    await HandleUser(msg.author);

    if(!msg.guild) {
        logger.debug("Received message without a guild. Not continuing. (Probably a DM)");
        return;
    }

    await HandleGuild(msg.guild);

    if(!(msg.channel instanceof TextChannel)) {
        logger.warn("Channel is not a TextChannel... Investigate...", msg.channel);
        return;
    }

    await HandleChannel(msg.channel);
    await HandleMessage(msg);
});

client.login(process.env.DISCORD_TOKEN);