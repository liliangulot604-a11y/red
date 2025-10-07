const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "unban",
  description: "Débannir un utilisateur par son ID",
  async execute(client, message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return message.reply("❌ Tu n'as pas la permission d'utiliser cette commande.");

    const userId = args[0];
    if (!userId) return message.reply("⚠️ Tu dois fournir un ID.");

    try {
      await message.guild.members.unban(userId);
      return message.reply(`✅ L'utilisateur ${userId} a été débanni.`);
    } catch (err) {
      console.error(err);
      return message.reply("❌ Impossible de débannir cet utilisateur.");
    }
  }
};
