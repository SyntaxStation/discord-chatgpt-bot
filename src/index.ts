import "dotenv/config";

import { BotClient } from "./structures/BotClient";

const client = new BotClient();
client.connect();
client.register();
