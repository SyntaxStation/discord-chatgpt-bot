import { ClientEvents } from "discord.js";
import { BotClient } from "./BotClient";

interface EventOptions<K extends keyof ClientEvents> {
  name: K;
  run: (client: BotClient<true>, ...args: ClientEvents[K]) => any;
}

export class Event<K extends keyof ClientEvents> {
  constructor(options: EventOptions<K>) {
    Object.assign(this, options);
  }
}
