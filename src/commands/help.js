module.exports = {
    name: "help",
    description: "Show command list",
    alias: ["h", "cmd", "?", "commandlist", "cmdlist"],
    /**
     * @param {import("../classes/MusicClient")} client 
     * @param {import("discord.js").Message} message 
     */
    run: async (client, message) => {
        const helpembed = new (require("discord.js").MessageEmbed)()
        .setTitle(client.user.username + " Command List")
        .setDescription(`The number one project of Client Developer`);
        client.commands.map(cmd =>{
            helpembed.addField(`${cmd.name} (${cmd.alias})`, cmd.description)
        })
        helpembed.setColor("RANDOM")
        .setFooter("© Not A 開発者 2021")
        message.channel.send(helpembed)
    }
}