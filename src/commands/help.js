const { EmbedBuilder } = require("discord.js");

module.exports = class Help {

    constructor() {
        this.name = "help";
        this.category = "Information";
        this.description = "Get a help menu";

        this.prefix = process.env.PREFIX;
        this.example = `${this.prefix}help`;
    }

    async run({ message, args, client }) {
        const commands = client.params.get("command_handler");
        const { Pagination, Mathf } = client.params.get("utils");

        const page = new Pagination(message);

        condition: if (args.length) {
            if (!commands.has(args[0]).toLowerCase()) break condition;
        }

        const categories = {};

        for (const command of Array.from(commands.values())) {
            if (command.hidden) continue;
            if (!categories[command.category]) {
                categories[command.category] = [command];
                continue;
            }
            categories[command.category].push(command);
        }

        const chunks = Mathf.chunks(Object.keys(categories), 5);

        for (const chunk of chunks) {
            const embed = new EmbedBuilder();
            embed.setColor(process.env.HEX);
            embed.setTitle(`Commands - ${Array.from(commands.values()).filter(c => !c.hidden).length}`);
            embed.setDescription(`📢 Commands labeled with "⚠️" are still in BETA and are subject to change`);

            for (const category of chunk) {
                embed.addFields({
                    name: `${category} - ${categories[category].length}`,
                    value: categories[category].map(command => `\`${command.name}\``).join(" | "),
                })
            }

            page.add(embed);
        }

        return await page.run();
    }

}