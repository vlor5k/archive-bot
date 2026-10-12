if(!process.env.DISCORD_TOKEN) {
    throw "Missing DISCORD_TOKEN in environment!";
}

import { Client } from "discord.js-selfbot-v13";

const client = new Client();

client.on("ready", () => {
    console.log(`logged in as ${client.user?.username}`);
});

client.on("messageCreate", (msg) => {
    console.log(`${msg.author.username}: ${msg.content}`);
});

client.login(process.env.DISCORD_TOKEN);