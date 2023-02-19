import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  InteractionReplyOptions,
} from "discord.js";
import { Event } from "../structures/Event";

export default new Event({
  name: "interactionCreate",
  run: async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (!interaction.inGuild())
      return (
        interaction as ChatInputCommandInteraction<"cached" | "raw">
      ).reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Hey there! 👋")
            .setDescription(
              "You can only use my commands in Discord servers, see you there!"
            )
            .setColor("Blurple"),
        ],
      });

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.run({
        client,
        interaction: interaction as ChatInputCommandInteraction & {
          member: GuildMember;
        },
      });
    } catch (err) {
      console.error(err);

      const options: InteractionReplyOptions = {
        embeds: [
          new EmbedBuilder()
            .setTitle("An error occured!")
            .setDescription(
              "Don't worry, this has nothing to do with you. Try again later."
            )
            .setColor("Red"),
        ],
        ephemeral: true,
      };
      if (interaction.replied || interaction.deferred)
        interaction.followUp(options);
      else interaction.reply(options);
    }
  },
});
