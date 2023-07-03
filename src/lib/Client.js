const Discord = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");

require("dotenv").config();

module.exports = class Client extends Discord.Client {

    constructor(hex = "") {
        super({ intents: ["MessageContent", "Guilds", "GuildMembers", "GuildMessages"] });
        this.login(process.env.TOKEN);

        this.on("ready", () => { if (process.env.DEBUG) console.log("[Client]: Ready!") });

        this.params = new Map();
        this.extensions = new Map();

        this.handler();
    }

    async handler() {
        const files = readdirSync(join(process.cwd(), "src", "extensions")).filter(file => file.endsWith(".js"));
        for (const file of files) {
            const Extension = require(join("..", "extensions", file));
            const extension = new Extension(this);

            if (extension.export) this.params.set(extension.name.toLowerCase().replace(/\s/g, "_"), extension.export());
            if (process.env.DEBUG) console.log(`[${extension.name}] Loaded!`);

            this.extensions.set(extension.name.toLowerCase().replace(/\s/g, "_"), extension);
        }
    }
}