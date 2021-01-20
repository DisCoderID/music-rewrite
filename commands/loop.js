module.exports = {
    name: "loop",
    description: "Toggle music loop",
    alias: ["repeat"],
    /**
     * @param {import("../classes/MusicClient")} client 
     * @param {import("discord.js").Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const serverQueue = client.queue.get(message.guild.id);

        if (!serverQueue) return message.reply("There is nothing playing.").catch(console.error);

        const { channel } = message.member.voice;

        if(channel.id !== serverQueue.channel.id || !channel) return message.reply("You need join same voice channel with me!")

        serverQueue.loop = !serverQueue.loop;

        return serverQueue.textChannel
        .send(`Loop is now ${serverQueue.loop ? "**on**" : "**off**"}`)
        .catch(console.error);
    }
}