import type { User } from "discord.js-selfbot-v13";
import { prisma } from "../db";
import { Logger } from "./Logger";

const logger = new Logger("UserHandler");

export default async function HandleUser(user: User) {
    // If existing doesnt exist, create it
    // Otherwise update it
    await prisma.user.upsert({
        where: {
            id: user.id
        },
        create: {
            id: user.id,
            username: user.username,
            displayname: user.displayName
        },
        update: {
            username: user.username,
            displayname: user.displayName
        }
    });
}