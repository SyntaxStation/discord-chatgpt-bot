import "dotenv/config";

import { BotClient } from "./structures/BotClient";
import { ActivityType } from "discord.js";

const client = new BotClient({
  shards: "auto",
  allowedMentions: {
    parse: [],
    users: [],
    roles: [],
    repliedUser: true,
  },
  presence: {
    activities: [
      {
        name: "conversations",
        type: ActivityType.Listening,
      },
    ],
  },
  rest: {
    offset: 0,
  },
});
client.connect();
client.register();
