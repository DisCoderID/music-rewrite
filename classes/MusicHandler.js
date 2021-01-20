class MusicHandler {

    /**
     * @param {import("./MusicClient")} client 
     */
    constructor(client) {
        this.client = client
    }

    /**
     * @param {Object} song 
     * @param {string} song.title
     * @param {string} song.channel
     * @param {string} song.url
     * @param {string} song.playUser
     * @param {any} song.vote
     * @param {import("discord.js").Message} message 
     */
    async play(song, message) {
        const queue = this.client.queue.get(message.guild.id)
        const Discord = require("discord.js")
        if(!song) {
            queue.channel.leave()
            this.client.queue.delete(message.guild.id)
            return queue.textChannel.send("🚫 Music queue ended.").catch(console.error);
        }

        try {
            var stream = require("discord-ytdl-core")(song.url, {
                filter: "audioonly",
                encoderArgs: ["-af"],
                opusEncoded: true,
                quality: "highestaudio",
                fmt: "mp3",
                highWaterMark: 1 << 25
            })
            const tipeof = typeof stream
            console.log(tipeof)
        } catch (err) {
            if(queue) {
                queue.songs.shift()
                this.play(queue.songs[0], message)
            }
        }

        const dispatcher = queue.connection
        .play(stream, {type: "opus", bitrate: "auto"})
        .on("finish", () => {
            if(playingMessage && !playingMessage.deleted) playingMessage.delete().catch(console.error);

            if(queue.loop) {
                let lastSong = queue.songs.shift()
                queue.songs.push(lastSong)
                this.play(queue.songs[0], message)
            } else {
                queue.songs.shift()
                this.play(queue.songs[0], message)
            }
        }).on("error", (err) => {
            console.error(err)
            queue.songs.shift()
            this.play(queue.songs[0], message)
        })
        dispatcher.setVolumeLogarithmic(queue.volume / 100)

        try {
            var playingMessage = await queue.textChannel.send(`Now Playing: ${song.title} from ${song.channel}`);
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = MusicHandler