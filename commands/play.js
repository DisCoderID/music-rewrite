const ytSr = require("youtube-sr").default
const ytdl = require("ytdl-core");

module.exports = {
    name: "play",
    description: "Play songs from youtube",
    alias: ["p"],
    usage: "play <songName> / play <songUrl>",
    /**
     * @param {import("../classes/MusicClient")} client 
     * @param {import("discord.js").Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const { channel } = message.member.voice;
        if(!args.length) return message.reply(`No argument submitted. Try ${client.prefix}${module.exports.usage}`)
        if (!channel) return message.reply("You need to join a voice channel first!").catch(console.error);

        const permissions = channel.permissionsFor(client.user);
        if (!permissions.has("CONNECT")) return message.reply("Cannot connect to voice channel, missing permissions");
        if (!permissions.has("SPEAK")) return message.reply("I cannot speak in this voice channel, make sure I have the proper permissions!");

        const search = args.join(" ");
        const videoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
        const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
        const url = args[0];
        const urlValid = videoPattern.test(args[0]);

        // Start the playlist if playlist url was provided
        if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
            return client.commands.get("playlist").run(client, message, args);
        }

        const serverQueue = client.queue.get(message.guild.id);
        const queueConstruct = {
            textChannel: message.channel,
            channel,
            connection: null,
            songs: [],
            loop: false,
            volume: 100,
            playing: true
        };

        let song = null
        let songInfo = null

        if(urlValid) {
            try {
                songInfo = await ytdl.getInfo(url);
                song = {
                    title: songInfo.videoDetails.title,
                    channel: songInfo.videoDetails.author.name,
                    url: songInfo.videoDetails.video_url,
                    playUser: message.author.id,
                    vote:[]
                };
            } catch (err) {
                console.error(err)
            }
        } else {
            try {
                songInfo = (await ytSr.search(search, {limit: 1}))[0]
                song = {
                    title: songInfo.title,
                    channel: songInfo.channel.name,
                    url: `https://youtube.com/watch?v=${songInfo.id}`,
                    playUser: message.author.id,
                    vote: []
                }
            } catch (err) {
                console.error(err)
                return message.reply("No video was found with a matching title").catch(console.error)
            }
        }

        if(serverQueue) {
            if(channel.id !== serverQueue.channel.id) return message.reply("You need join same voice channel with me!")
            serverQueue.songs.push(song)
            return serverQueue.textChannel
            .send(`✅ **${song.title}** has been added to the queue by ${message.author}`)
            .catch(console.error);
        } else {
            queueConstruct.songs.push(song)
        }

        if (!serverQueue) client.queue.set(message.guild.id, queueConstruct);
        if (!serverQueue) {
            try {
                queueConstruct.connection = await channel.join()
                client.handler.play(queueConstruct.songs[0], message)
            } catch (err) {
                console.error(`Could not join voice channel: ${err}`);
                client.queue.delete(message.guild.id);
                await channel.leave();
                return message.channel.send(`Could not join the channel: ${err}`).catch(console.error);
            }
        }
    }
}