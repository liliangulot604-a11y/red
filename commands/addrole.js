const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "addrole",
  description: "Ajoute un rôle à un utilisateur mentionné",

  async execute(client, message, args, context) {
    const { allowedUsers } = context;

    if (!allowedUsers.includes(message.author.id) && !message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return message.reply("❌ Tu n’as pas la permission d’utiliser cette commande.");
    }

    const member = message.mentions.members.first();
    const role = message.mentions.roles.first();

    if (!member || !role) {
      return message.reply("❌ Utilisation : `-addrole @utilisateur @rôle`");
    }

    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return message.reply("❌ Je n’ai pas la permission de gérer les rôles !");
    }

    if (role.position >= message.guild.members.me.roles.highest.position) {
      return message.reply("❌ Je ne peux pas ajouter ce rôle, il est plus haut que le mien.");
    }

    try {
      await member.roles.add(role);
      message.reply(`✅ Le rôle ${role} a été ajouté à ${member.user.tag} avec succès.`);
    } catch (error) {
      console.error(error);
      message.reply("❌ Une erreur est survenue lors de l’ajout du rôle.");
    }
  }
};
