const { MessageEmbed } = require("discord.js");
const ytSr = require("youtube-sr").default

module.exports = {
    name: "search",
    description: "Search and select video to play",
    alias: ["sc"],
    /**
     * @param {import("../classes/MusicClient")} client 
     * @param {import("discord.js").Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        if (!args.length) return message.reply(`Usage: ${module.exports.name} <videoName>`).catch(console.error);
        if (message.channel.activeCollector) return message.reply("A message collector is already active in this channel.");
        if (!message.member.voice.channel) return message.reply("You need to join a voice channel first!").catch(console.error);

        const search = args.join(" ");

        let resultsEmbed = new MessageEmbed()
        .setTitle(`**Reply with the song number you want to play**`)
        .setDescription(`Results for: ${search}`)
        .setColor("RANDOM");

        try {

            /**
             * @type {import("youtube-sr").Video[]}
             */
            let videos = []

            /**
             * @type {import("youtube-sr").Video[]}
             */
            const results = await ytSr.search(search, {limit: 10})

            results.map((video, index) => {
                videos.push(`https://youtube.com/watch?v=${video.id}`)
                resultsEmbed.addField(`${index + 1}. ${video.title}`, `[${video.channel.name}](${video.channel.url})`)
            })

            var resultsMessage = await message.channel.send(resultsEmbed);
            /* eslint no-inner-declarations: "off" */
            function filter(msg) {
                const pattern = /(^[1-9][0-9]{0,1}$)/g;
                return pattern.test(msg.content) && parseInt(msg.content.match(pattern)[0]) <= 10;
            }
        
            message.channel.activeCollector = true;
            const response = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] });
            const choice = videos[parseInt(response.first()) - 1];

            message.channel.activeCollector = false;
            client.commands.get("play").run(client, message, [choice]);
            resultsMessage.delete().catch(console.error);
        } catch (err) {
            console.error(err)
            message.channel.activeCollector = false
            resultsMessage.delete().catch(console.error);
        }
    }
}