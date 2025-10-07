const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "remove",
  description: "Retire un utilisateur d'un ticket.",
  async execute(client, message, args) {
    if (!message.channel.name?.startsWith("ticket-"))
      return message.reply("❌ Cette commande ne peut être utilisée que dans un ticket.");

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
      return message.reply("❌ Tu n'as pas la permission.");

    const member = message.mentions.members.first();
    if (!member) return message.reply("❌ Utilisation : `+remove @user`");

    message.channel.permissionOverwrites.edit(member.id, {
      ViewChannel: false,
      SendMessages: false,
    });

    message.reply(`✅ ${member.user.tag} a été retiré du ticket.`);
  },
};
