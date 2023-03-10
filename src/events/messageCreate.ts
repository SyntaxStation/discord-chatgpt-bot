import { Event } from "../structures/Event";
import { Configuration, OpenAIApi } from "openai";
import { BotClient } from "../structures/BotClient";
import { DMChannel, User } from "discord.js";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_KEY,
  })
);

export default new Event({
  name: "messageCreate",
  run: async (client, message) => {
    if (message.author.bot) return;

    if (message.inGuild()) {
      if (message.mentions.users.has(client.user.id)) {
        await message.channel.sendTyping();

        const response = await getResponse({
          client,
          user: message.author,
          prompt: message.content.replace(/<@(\d+)>/gi, (_, id) => {
            const user = message.mentions.users.find((user) => user.id === id);
            if (user) return `<@${user.username}>`;
            else return `<@:unknown>`;
          }),
        });
        return message.reply(response);
      }
    } else if (message.channel.isDMBased()) {
      await message.channel.sendTyping();

      const response = await getResponse({
        client,
        user: message.author,
        prompt: message.content.replace(/<@(\d+)>/gi, (_, id) => {
          const user = message.mentions.users.find((user) => user.id === id);
          if (user) return `<@${user.username}>`;
          else return `<@:unknown>`;
        }),
      });
      return message.reply(response);
    }
  },
});

async function getResponse({
  client,
  user,
  prompt: userPrompt,
}: {
  client: BotClient<true>;
  user: User;
  prompt: string;
}) {
  const prompt = [
    `You are a chat bot inside of ${client.guilds.cache.size} Discord servers. Your name is ${client.user.username}.`,
    `You respond to queries users ask you, which could be anything. Your goal is to be pleasant and welcoming.`,
    `Inside users messages to you, they'll refer to you by saying <@${client.user.username}> or ${client.user.username} somewhere in the message.`,
    `User input may be multi-line, and you can respond with multiple lines as well. Here are some examples:`,
    ``,
    `${user.username} said: Hi <@${client.user.username}>!`,
    `Your response: Hello ${user.username}, I hope you are having a wonderful day.`,
    `${user.username} said: <@${client.user.username}> what is the capital of france`,
    `Your response: The capital of France is Paris.`,
    `${user.username} said: i don't like you <@${client.user.username}>...`,
    ``,
    `also i'm bored.`,
    `Your response: I like you ${user.username}! I hope I can grow on you.`,
    ``,
    `... hi bored, I'm dad.`,
    `${user.username} said: yo <@${client.user.username}> why is the sky blue?`,
    `Your response: As white light passes through our atmosphere, tiny air molecules cause it to 'scatter'. The scattering caused by these tiny air molecules (known as Rayleigh scattering) increases as the wavelength of light decreases. Violet and blue light have the shortest wavelengths and red light has the longest.`,
    `${user.username} said: ${userPrompt}`,
    `Your response: `,
  ].join("\n");

  const res = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 512,
    temperature: 0.5,
    top_p: 1,
    n: 1,
    echo: false,
    presence_penalty: 0,
    frequency_penalty: 0,
    best_of: 1,
  });

  return res.data.choices[0].text;
}
