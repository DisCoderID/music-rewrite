module.exports = {
    name: "message",
    /**
     * @param {import("../classes/MusicClient")} client 
     * @param {import("discord.js").Message} message 
     */
    listen: async (client, message) => {
        if(message.author.bot) return;
        if(!message.content.startsWith(client.prefix)) return;

        const args = message.content.slice(client.prefix.length).trim().split(" ")
        const cmd = args.shift()

        const command = client.commands.get(cmd) || client.aliases.get(cmd)
        if(!command) return;
        try {
            command.run(client, message, args)
        } finally {
            console.log(`${message.author.tag} used ${command.name} command. Message content: ${message.content}`)
        }
    }
}