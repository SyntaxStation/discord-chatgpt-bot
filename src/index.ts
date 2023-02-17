import "dotenv/config";

import { BotClient } from "./structures/BotClient";
import { ActivityType } from "discord.js";

const client = new BotClient({
  presence: {
    activities: [
      {
        name: "conversations",
        type: ActivityType.Listening,
      },
    ],
  },
});
client.connect();
client.register();
