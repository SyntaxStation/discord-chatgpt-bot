import {
  ApplicationCommandDataResolvable,
  Client,
  ClientOptions,
  Collection,
  GatewayIntentBits,
  Partials,
} from "discord.js";
import fs from "fs";
import path from "path";
import { CommandOptions } from "./Command";
import config from "../config.json";
import Enmap from "enmap";

type BotOptions = Omit<ClientOptions, "intents" | "partials">;

export class BotClient<Ready extends boolean = boolean> extends Client<Ready> {
  commands = new Collection<string, CommandOptions>();

  db = new Enmap({
    name: "Database",
    dataDir: "./db",
  });

  constructor(options?: BotOptions) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
      ],
      partials: [Partials.Channel],
      ...options,
    });
  }

  connect() {
    this.login(process.env.TOKEN);
  }

  register() {
    // Commands
    const commands: ApplicationCommandDataResolvable[] = [];
    fs.readdirSync(path.join(__dirname, "../commands")).forEach((dir) =>
      fs
        .readdirSync(path.join(__dirname, `../commands/${dir}`))
        .filter((file) => file.endsWith("js") || file.endsWith("ts"))
        .forEach(async (file) => {
          const command = await import(`../commands/${dir}/${file}`)
            .then((x) => x.default)
            .catch(() => null);
          if (!command?.data || !command?.run) return;

          this.commands.set(command.data.toJSON().name, command);
          commands.push(command.data.toJSON());
        })
    );

    this.on("ready", async () => {
      if (config.guildId && config.guildId.length) {
        const guild = this.guilds.cache.get(config.guildId);
        if (!guild)
          throw new SyntaxError(`No guild exists with ID ${config.guildId}.`);

        guild.commands.set(commands);
        console.log(`Registered commands in ${guild.name}.`);
      } else {
        this.application?.commands.set(commands);
        console.log("Registered commands globally.");
      }
    });

    // Events
    fs.readdirSync(path.join(__dirname, "../events"))
      .filter((file) => file.endsWith("js") || file.endsWith("ts"))
      .forEach(async (file) => {
        const event = await import(`../events/${file}`)
          .then((x) => x.default)
          .catch(() => null);
        if (!event?.name || !event?.run) return;

        this.on(event.name, event.run.bind(null, this));
      });
  }
}
