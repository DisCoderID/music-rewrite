module.exports = {
    name: "ready",
    /**
     * @param {import("../classes/MusicClient")} client 
     */
    listen: async (client) => {
        console.log(`${client.user.tag} is ready!`)
    }
}