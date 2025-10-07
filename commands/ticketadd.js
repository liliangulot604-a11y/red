const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "add",
  description: "Ajoute un utilisateur à un ticket via son ID.",
  async execute(client, message, args) {
    if (!message.channel.name?.startsWith("ticket-"))
      return message.reply("❌ Cette commande ne peut être utilisée que dans un ticket.");

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
      return message.reply("❌ Tu n'as pas la permission.");

    const userId = args[0];
    if (!userId) return message.reply("❌ Utilisation : `+add <userID>`");

    const member = await message.guild.members.fetch(userId).catch(() => null);
    if (!member) return message.reply("❌ Utilisateur introuvable.");

    message.channel.permissionOverwrites.edit(member.id, {
      ViewChannel: true,
      SendMessages: true,
    });

    message.reply(`✅ ${member.user.tag} a été ajouté au ticket.`);
  },
};
