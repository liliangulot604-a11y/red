const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "help",
  description: "Affiche la liste des commandes",
  async execute(client, message, args) {
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle("📖 Menu d'aide")
      .setDescription(
        "Salut 👋 Voici la liste des commandes disponibles.\nMon préfix actuel est **`-`**"
      )
      .addFields(
        { 
          name: "👥 Staff", 
          value: "`-addrole` `-removerole` `-ban` `-unban` `-ticketcreate` `-add (ticket)` `-remove (ticket)`" 
        },
        { 
          name: "📊 Informations", 
          value: "`-?`" 
        },
        { 
          name: "🎉 Fun", 
          value: "`-?`" 
        },
        { 
          name: "ℹ️ Aide", 
          value: "`-help`"  
        }
      )
      .setFooter({ 
        text: "Besoin d'aide ? Contacte un membre du staff ✨", 
        iconURL: client.user.displayAvatarURL() 
      })
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  }
};
