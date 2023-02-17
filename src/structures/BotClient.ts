import { Client, ClientOptions, GatewayIntentBits } from "discord.js";
import fs from "fs";
import path from "path";

type BotOptions = Omit<ClientOptions, "intents">;

export class BotClient<Ready extends boolean = boolean> extends Client<Ready> {
  constructor(options?: BotOptions) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageTyping,
      ],
      ...options,
    });
  }

  connect() {
    this.login(process.env.TOKEN);
  }

  register() {
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
