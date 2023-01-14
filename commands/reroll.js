const Discord = require("discord.js");

module.exports = {
  description: "換人",

  options: [
    {
      name: "giveaway",
      description: "活動訊息ID",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client, interaction) => {
    // If the member doesn't have enough permissions
    if (
      !interaction.member.permissions.has("MANAGE_MESSAGES") &&
      !interaction.member.roles.cache.some((r) => r.name === "Giveaways")
    ) {
      return interaction.reply({
        content:
          "其實你知道你沒有開權限給我嗎?",
        ephemeral: true,
      });
    }

    const query = interaction.options.getString("giveaway");

    // try to found the giveaway with prize then with ID
    const giveaway =
      // Search with giveaway prize
      client.giveawaysManager.giveaways.find(
        (g) => g.prize === query && g.guildId === interaction.guild.id
      ) ||
      // Search with giveaway ID
      client.giveawaysManager.giveaways.find(
        (g) => g.messageId === query && g.guildId === interaction.guild.id
      );

    // If no giveaway was found
    if (!giveaway) {
      return interaction.reply({
        content: "找不到此項目 `" + query + "`.",
        ephemeral: true,
      });
    }

    if (!giveaway.ended) {
      return interaction.reply({
        content: "還沒結束.",
        ephemeral: true,
      });
    }

    // Reroll the giveaway
    client.giveawaysManager
      .reroll(giveaway.messageId)
      .then(() => {
        // Success message
        interaction.reply("已換人!");
      })
      .catch((e) => {
        interaction.reply({
          content: e,
          ephemeral: true,
        });
      });
  },
};
