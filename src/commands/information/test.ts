import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test to see if the bot is working."),
  run: ({ client, interaction }) =>
    interaction.reply({
      content: `${client.user.username} is working!`,
      ephemeral: true,
    }),
});
