const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "stats",
    description: "Display bot statistics",
    alias: ["st"],
    /**
     * @param {import("../classes/MusicClient")} client 
     * @param {import("discord.js").Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const serverQueue = client.queue.get(message.guild.id)
        const uptime = require("pretty-ms")(client.uptime, {verbose: true})

        let status;
        let loop;

        const embed = new MessageEmbed()
        .setTitle(`${client.user.username} music stats`)
        .setFooter("© Not A 開発者 2021")
        .setColor("RANDOM")
        .addField("Uptime", uptime);

        if(!serverQueue) return message.channel.send(embed).catch(console.error)
        if(serverQueue.playing === true) status = "Playing"
        if(serverQueue.playing === false) status = "Paused"
        if(serverQueue.loop === true) loop = "Yes"
        if(serverQueue.loop === false) loop = "No"
        embed.addField("Music", `Playing: ${serverQueue.songs[0].title}
Queue songs amount: ${parseInt((serverQueue.songs.length) - 1)} songs
Voice Channel: ${serverQueue.channel.name}
Volume: ${serverQueue.volume}%
Status: ${status}
Loop? ${loop}
Requester: <@${serverQueue.songs[0].playUser}>`)
        message.channel.send(embed)
    }
}