import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  GuildMember,
} from "discord.js";
import { BotClient } from "./BotClient";

export interface CommandOptions {
  data:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  run: ({
    client,
    interaction,
  }: {
    client: BotClient;
    interaction: ChatInputCommandInteraction & { member: GuildMember };
  }) => any;
}

export class Command {
  constructor(options: CommandOptions) {
    Object.assign(this, options);
  }
}
