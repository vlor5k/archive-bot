import type { Message, MessageAttachment } from "discord.js-selfbot-v13";
import { prisma } from "../db";
import { Logger } from "./Logger";
import { createWriteStream } from "node:fs";

const logger = new Logger("AttachmentHandler");
const folder = process.env.ATTACHMENTS_DIR || "./attachments";

export default async function HandleAttachment(attachment: MessageAttachment, message: Message) {
    const existing = await prisma.attachment.findUnique({
        where: {
            id: attachment.id,
        }
    });

    if(existing) {
        logger.debug("Attachment already exists (?)");
        return;
    }

    // put in database
    // even if we haven't downloaded it yet, we want to log that there is supposed to be something there...
    await prisma.attachment.create({
        data: {
            id: attachment.id,
            name: attachment.name || "attachment",
            messageId: message.id
        }
    });

    // download attachment
    logger.info("Downloading attachment", attachment.id);
    const req = await fetch(attachment.proxyURL);
    createWriteStream(`${folder}/${attachment.id}`).write(Buffer.from(await req.arrayBuffer()));
    logger.info("Downloaded", attachment.id);
}