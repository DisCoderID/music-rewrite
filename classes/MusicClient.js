const discord = require("discord.js")
const axios = require("axios")
require("dotenv").config()

/**
 * @typedef Command
 * @property {string} name
 * @property {string} description
 * @property {string[]} alias
 * @property {Promise<any>} run
 */

/**
 * @typedef Event
 * @property {string} name
 * @property {Promise<any>} listen
 */

/**
 * @typedef Song
 * @property {string} title
 * @property {string} channel
 * @property {string} url
 * @property {string} playUser
 * @property {any} vote
 */

/**
 * @typedef Queue
 * @property {discord.TextChannel} textChannel
 * @property {discord.VoiceChannel} channel
 * @property {discord.VoiceConnection} connection
 * @property {Song[]} songs
 * @property {boolean} loop
 * @property {number} volume
 * @property {boolean} playing
 */

class MusicClient extends discord.Client {
    constructor() {
        super({disableMentions: "everyone"})
    }

    /**
     * @type {import("discord.js").Collection<string, Command>}
     */
    commands = new discord.Collection()

    /**
     * @type {import("discord.js").Collection<string, Command>}
     */
    aliases = new discord.Collection()


    prefix = require("../config.json").prefix

    /**
     * @type {Map<string, Queue>}
     */
    queue = new Map()

    handler = new (require("./MusicHandler"))(this)

    /**
     * Create a new hastebin
     * @param {string} text The text
     * @returns {Promise<string>} `Promise<string>`
     */
    async hastebin(text) {
        const {data} = await axios.post("https://hastebin.com/documents", text)
        return `https://hastebin.com/${data.key}`
    }

    loadCommand() {
        require("fs").readdirSync("commands/").filter(x => x.endsWith(".js")).forEach(cmd => {

            /**
             * @type {Command}
             */
            const command = require(`../commands/${cmd}`)

            this.commands.set(command.name, command)

            command.alias.forEach(alias => this.aliases.set(alias, command))
        })
    }

    loadEvent() {
        require("fs").readdirSync("events/").filter(x => x.endsWith(".js")).forEach(ev => {

            /**
             * @type {Event}
             */
            const event = require(`../events/${ev}`)

            this.on(event.name, (...args) => event.listen(this, ...args))
        })
    }

    intialize() {
        this.login(process.env.TOKEN)
        this.loadCommand()
        this.loadEvent()
    }
}

module.exports = MusicClient