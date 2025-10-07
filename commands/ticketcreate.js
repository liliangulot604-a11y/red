const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "ticketcreate",
  description: "Crée un bouton pour ouvrir un ticket",
  async execute(client, message) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply("❌ Tu n'as pas la permission d'utiliser cette commande.");
    }

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle("🎫 Support - Ouvrir un ticket")
      .setDescription("Clique sur le bouton ci-dessous pour créer un ticket avec le staff.");

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("open_ticket")
        .setLabel("Ouvrir un ticket")
        .setStyle(ButtonStyle.Primary)
    );

    return message.channel.send({ embeds: [embed], components: [button] });
  }
};
