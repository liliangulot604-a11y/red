const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "ban",
  description: "Bannir un utilisateur par mention ou par son ID",
  async execute(client, message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return message.reply("❌ Tu n'as pas la permission d'utiliser cette commande.");

    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers))
      return message.reply("❌ Je n'ai pas la permission de bannir des membres.");

    const target = message.mentions.members.first() || args[0];
    if (!target) return message.reply("⚠️ Tu dois mentionner un utilisateur ou fournir un ID.");

    let member;

    if (typeof target === "string") {
      member = await message.guild.members.fetch(target).catch(() => null);
      if (!member) return message.reply("❌ Utilisateur introuvable sur le serveur.");
    } else {
      member = target;
    }

    if (member.roles.highest.position >= message.member.roles.highest.position)
      return message.reply("❌ Tu ne peux pas bannir cet utilisateur (rôle trop haut).");
le
    if (!member.bannable)
      return message.reply("❌ Je ne peux pas bannir cet utilisateur (rôle trop haut ou hiérarchie insuffisante).");

    try {
      await member.ban({ reason: `Banni par ${message.author.tag}` });
      return message.reply(`✅ L'utilisateur ${member.user.tag} a été banni.`);
    } catch (err) {
      console.error(err);
      return message.reply("❌ Une erreur est survenue lors du bannissement.");
    }
  }
};
