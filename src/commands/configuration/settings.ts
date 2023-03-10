import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Update personal settings.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("reply_ping")
        .setDescription("Stop the bot from pinging you when replying.")
        .addBooleanOption((option) =>
          option
            .setName("enabled")
            .setDescription("Should the bot not ping you when replying?")
            .setRequired(true)
        )
    )
    .setDMPermission(true),
  run: async ({ client, interaction }) => {
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "reply_ping":
        {
          client.db.ensure(interaction.user.id, {
            reply_ping: true,
          });

          const enabled = interaction.options.getBoolean("enabled");
          client.db.set(interaction.user.id, enabled, "reply_ping");

          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `${enabled ? "Enabled" : "Disabled"} reply pings!`
                )
                .setColor("Green"),
            ],
            ephemeral: true,
          });
        }
        break;
    }
  },
});
