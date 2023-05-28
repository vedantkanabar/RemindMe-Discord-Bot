require('dotenv').config();
const {Client, Collection, GatewayIntentBits, Events} = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// Creating new client
const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
	  GatewayIntentBits.GuildMembers,
    ],
});

client.commands = new Collection();

//Setting up file path
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

//Activate the commands
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

  try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// Discord bot token
const token = process.env.BOT_TOKEN;

// On ready
client.on('ready', () => {
  console.log(`${client.user.tag} is Online!`);
})

// Test
client.on('messageCreate', (message) => {

    if (message.content == 'ping'){
        message.reply('pong!');
    }
})

// Logging in the bot
client.login(token);