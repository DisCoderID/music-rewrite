module.exports = {
    name: "stop",
    description: "Stop the music",
    alias: ["dc", "leave", "disconnect"],
    /**
     * @param {import("../classes/MusicClient")} client 
     * @param {import("discord.js").Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const serverQueue = client.queue.get(message.guild.id);

        if (!message.member.voice.channel) return message.reply("You need to join a voice channel first!").catch(console.error);
        if (!serverQueue) return message.reply("There is nothing playing.").catch(console.error);
        const { channel } = message.member.voice;
        if(channel.id !== serverQueue.channel.id) return message.reply("You need join same voice channel with me!")
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        serverQueue.textChannel.send(`${message.author.toString()} ⏹ stopped the music!`).catch(console.error);
    }
}