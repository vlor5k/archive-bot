import type { Channel, Guild, TextBasedChannel, TextChannel } from "discord.js-selfbot-v13";
import { prisma } from "../db";
import { Logger } from "./Logger";

const logger = new Logger("GuildHandler");

export default async function HandleGuild(guild: Guild) {
    // If guild doesnt exist, create it
    // Otherwise update it
    await prisma.guild.upsert({
        where: {
            id: guild.id
        },
        create: {
            id: guild.id,
            name: guild.name
        },
        update: {
            name: guild.name
        }
    });
}