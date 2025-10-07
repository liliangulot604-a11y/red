const fs = require("fs");
const express = require("express");
const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType
} = require("discord.js");
require("dotenv").config();

const prefix = "-";
const allowedUsers = ["965998238282948630", "1208512644622065777", "987430969772507206"];
const configPath = "./ticketConfig.json";

let ticketConfig = { logChannelId: null };
if (fs.existsSync(configPath)) {
  ticketConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
} else {
  fs.writeFileSync(configPath, JSON.stringify(ticketConfig, null, 2));
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages
  ],
  partials: ["CHANNEL"]
});

const app = express();
app.get("/", (req, res) => res.send("Bot en ligne"));
app.listen(process.env.PORT || 3000, () => console.log("Bot en ligne"));

const ticketMessages = new Map();

client.commands = new Map();
const commandFiles = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));
for (const file of commandFiles) {
  const cmd = require(`./commands/${file}`);
  client.commands.set(cmd.name, cmd);
}

client.once("ready", () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

client.on("guildMemberAdd", async (member) => {
  if (member.guild.id !== "1421472786022404299") return;

  try {
    const role = member.guild.roles.cache.get("1423024797570433206");
    if (!role) return console.log("Rôle introuvable !");

    await member.roles.add(role);
    console.log(`✅ Rôle ajouté à ${member.user.tag}`);
  } catch (err) {
    console.error("Erreur lors de l'ajout du rôle :", err);
  }
});


client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/\s+/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (command) {
    try {
      await command.execute(client, message, args, { allowedUsers, ticketConfig, configPath, prefix });
    } catch (err) {
      console.error(`Erreur commande ${commandName}:`, err);
      message.reply("❌ Une erreur est survenue lors de l'exécution de la commande.");
    }
  }

  if (message.channel.name?.startsWith("ticket-") && !message.author.bot) {
    if (!ticketMessages.has(message.channel.id)) ticketMessages.set(message.channel.id, []);
    const arr = ticketMessages.get(message.channel.id);

    const lastMsg = arr[arr.length - 1];
    if (lastMsg && lastMsg.authorId === message.author.id && lastMsg.content === message.content) return;

    arr.push({
      authorTag: message.author.tag,
      authorId: message.author.id,
      content: message.content,
      timestamp: new Date()
    });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "open_ticket") {
    const guild = interaction.guild;

    const existingChannel = guild.channels.cache.find(
      c => c.name === `ticket-${interaction.user.username.toLowerCase()}`
    );
    if (existingChannel) {
      return interaction.reply({ content: "❌ Tu as déjà un ticket ouvert.", ephemeral: true });
    }

    const ticketChannel = await guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
        },
      ],
    });

    await interaction.reply({ content: `✅ Ton ticket a été créé : ${ticketChannel}`, ephemeral: true });
  }
});

client.login(process.env.TOKEN);

