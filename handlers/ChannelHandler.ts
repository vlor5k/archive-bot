import type { Channel, TextBasedChannel, TextChannel } from "discord.js-selfbot-v13";
import { prisma } from "../db";
import { Logger } from "./Logger";

const logger = new Logger("ChannelHandler");

export default async function HandleChannel(channel: TextChannel) {
    // If channel doesnt exist, create it
    // Otherwise update it
    await prisma.channel.upsert({
        where: {
            id: channel.id
        },
        create: {
            id: channel.id,
            name: channel.name,
            guildId: channel.guildId
        },
        update: {
            name: channel.name
        }
    });
}