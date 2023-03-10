import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping the bot to see how much latency it has.")
    .setDMPermission(false),
  run: async ({ client, interaction }) => {
    const res = await interaction.deferReply({
      ephemeral: true,
      fetchReply: true,
    });

    const ping = res.createdTimestamp - interaction.createdTimestamp;

    interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `š¤ **Bot**: ${ping}ms\nš¶ **API**: ${client.ws.ping}ms`
          )
          .setColor("Blurple"),
      ],
    });
  },
});
