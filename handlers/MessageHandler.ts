import type { Message } from "discord.js-selfbot-v13";
import { prisma } from "../db";
import { Logger } from "./Logger";
import HandleAttachment from "./AttachmentHandler";

const logger = new Logger("MessageHandler");

export default async function HandleMessage(message: Message) {
    if(message.attachments) {
        for(const data of message.attachments) {
            if(!data[1]) {
                logger.warn("No attachment in", data);
                continue;
            }
            HandleAttachment(data[1], message);
        }
    }

    // If message doesnt exist, create it
    // Otherwise update it
    await prisma.message.upsert({
        where: {
            id: message.id
        },
        create: {
            id: message.id,
            userId: message.author?.id || "0",
            channelId: message.channelId,
            content: message.content,
            replyMessageId: message.reference?.messageId
        },
        update: {
            content: message.content
        }
    });
}