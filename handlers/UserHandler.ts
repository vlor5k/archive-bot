import type { User } from "discord.js-selfbot-v13";
import { prisma } from "../db";
import { Logger } from "./Logger";

const logger = new Logger("UserHandler");

export default async function HandleUser(user: User) {
    const existing = await prisma.user.findFirst({
        where: {
            id: user.id
        }
    });

    // if this is the first time seeing this user, add it to database
    if(!existing) {
        logger.info("New user added", user.username);
        await prisma.user.create({
            data: {
                id: user.id,
                username: user.username,
                displayname: user.displayName
            }
        });

        return;
    }

    if(existing.displayname !== user.displayName || existing.username !== user.username) {
        logger.debug("Updating user", user.username);
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                username: user.username,
                displayname: user.displayName
            }
        })
    }
}