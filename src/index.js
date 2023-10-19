require('dotenv').config();

const { Client, IntentsBitField } = require('discord.js');

const client = new Client ({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', (c) => {
    console.log(`${c.user.username} is online. ✔`)
})

client.on('messageCreate', (message) => {
    if (!message.author.bot) {
        if (message.content == '$help') {
            message.reply('Hi! What can I help you with?');
        }
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'hey') {
        interaction.reply('Hey!');
    }

    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;
    
    if (commandName === 'delete') {
        const amount = options.getInteger('amount');
    
        if (amount < 1 || amount > 100) {
        return interaction.reply({
            content: 'Please provide a valid number of messages to delete (1-100).',
            ephemeral: true, // This makes the reply visible only to the user who issued the command
        });
        }
        
        
        const messages = await interaction.channel.messages.fetch({ limit: amount });
        messages.forEach((message) => {
          message.delete().catch((error) => {
            console.error(`Error deleting message: ${error}`);
          });
        });
    
        interaction.reply(`Deleted ${amount} messages.`);
    
    }

        
      
});

client.login(process.env.TOKEN);