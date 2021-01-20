module.exports = {
    name: "pause",
    description: "Pause the currently playing music",
    alias: ["ps"],
    /**
     * @param {import("../classes/MusicClient")} client 
     * @param {import("discord.js").Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        if (!message.member.voice.channel) return message.reply("You need to join a voice channel first!").catch(console.error);

        const serverQueue = client.queue.get(message.guild.id);
        const { channel } = message.member.voice;

        if(channel.id !== serverQueue.channel.id) return message.reply("You need join same voice channel with me!")

        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause(true);
            return serverQueue.textChannel.send(`${message.author} ⏸ paused the music.`).catch(console.error);
        }
        
        return message.reply("There is nothing playing.").catch(console.error);
    }
}