const ytSr = require("youtube-sr").default
const ytdl = require("ytdl-core")

module.exports = {
    name: "playlist",
    description: "Plays a playlist from youtube",
    alias: ["pl"],
    usage: "playlist <playlistUrl>",
    /**
     * @param {import("../classes/MusicClient")} client 
     * @param {import("discord.js").Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const { channel } = message.member.voice;

        if (!args.length) return message.reply(`No argument submitted, Try ${client.prefix}${module.exports.usage}`).catch(console.error);
        if (!channel) return message.reply("You need to join a voice channel first!").catch(console.error);

        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) return message.reply("Cannot connect to voice channel, missing permissions");
        if (!permissions.has("SPEAK")) return message.reply("I cannot speak in this voice channel, make sure I have the proper permissions!");
        /* eslint no-useless-escape: "off" */
        const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
        const url = args[0];
        const urlValid = pattern.test(args[0]);
        const serverQueue = client.queue.get(message.guild.id)
        const queueConstruct = {
            textChannel: message.channel,
            channel,
            connection: null,
            songs: [],
            loop: false,
            volume: 100,
            playing: true
        };
      
        let song = null;
        let playlist = null;
        let videos = [];

        if(urlValid) {
            try {
                playlist = await ytSr.getPlaylist(url)
                videos = playlist.videos
            } catch (err) {
                console.error(err)
            }
        } else {
            try {
                throw Error("abc")
            } catch (err) {
                return message.channel.send(`Invalid playlist URL`)
            }
        }

        videos.forEach(async video => {
            const songInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${video.id}`)
            song = {
                title: songInfo.videoDetails.title,
                channel: songInfo.videoDetails.author.name,
                url: songInfo.videoDetails.video_url,
                playUser: message.author.id,
                vote: []
            }

            if(serverQueue) {
                serverQueue.songs.push(song)
                if(channel.id !== serverQueue.channel.id) return message.reply("You need to join same voice channel with me!")
                message.channel.send(`✅ **${song.title}** has been added to the queue by ${message.author}`).catch(console.error);
            } else {
                queueConstruct.songs.push(song)
            }
        })

        if(!serverQueue) client.queue.set(message.guild.id, queueConstruct)

        if(!serverQueue) {
            try {
                const connection = await channel.join();
                queueConstruct.connection = connection;
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