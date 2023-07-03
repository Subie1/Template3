const { join } = require("path");
const { readdirSync } = require("fs");

module.exports = class CommandHandler {

    constructor(client) {
        this.name = "Command Handler";
        
        this.client = client;

        this.commands = new Map();
        this.alias = new Map();

        this.client.on("messageCreate", async message => {
            if (!message.content.startsWith(process.env.PREFIX));
            if (message.author.bot) return;

            const args = message.content.slice(process.env.PREFIX.length).split(" ");
            const command = args.shift().toLowerCase();

            if (!this.commands.has(command) && !this.alias.has(command)) return;

            const cmd = this.commands.get(command) ?? this.alias.get(command);
            await cmd.run({ message, args, client, handler: this, commands: this.commands, prefix: process.env.PREFIX, hex: process.env.HEX, command: cmd });
        })

        this.handler();
    }

    async handler() {
        const files = readdirSync(join(process.cwd(), "src", "commands")).filter(file => file.endsWith(".js"));
        for (const file of files) {
            const Command = require(join("..", "commands", file));

            const command = new Command(this.client);
            this.commands.set(command.name, command);

            if (command.alias) command.alias.forEach(alias => this.alias.set(alias, command));
        }
    }

    export() {
        return this.commands;
    }

}