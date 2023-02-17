import { Event } from "../structures/Event";

export default new Event({
  name: "messageCreate",
  run: async (client, message) => {
    if (message.author.bot || !message.inGuild()) return;

    if (message.mentions.users.has(client.user.id)) {
      console.log(message.content);
    }
  },
});
