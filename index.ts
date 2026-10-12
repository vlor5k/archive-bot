if(!process.env.DISCORD_TOKEN) {
    throw "Missing DISCORD_TOKEN in environment!";
}

import { Client, TextChannel } from "discord.js-selfbot-v13";
import HandleUser from "./handlers/UserHandler";
import { logger } from "./handlers/Logger";
import HandleChannel from "./handlers/ChannelHandler";
import HandleGuild from "./handlers/GuildHandler";
import HandleMessage from "./handlers/MessageHandler";

const client = new Client();

client.on("ready", () => {
    console.log(`logged in as ${client.user?.username}`);
});

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