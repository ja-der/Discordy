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

    if (interaction.commandName === 'help') {
        interaction.reply('Hey! Welcome to the server. The UI is easy fo figure out and looks exactly like any regular texting app. Use the bar at the bottom of ' +
        'to chat');
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

    if (commandName == 'ban') {
        const member = interaction.guild.members.cache.get(user.id);
        const reason = options.getString('Reason') || 'No reason provided';
        
        if (!member) {
            return interaction.reply({
                content: 'Please enter a valid suer to ban.',
                ephemeral: true,
            })
        }

        // ban the user
        member.ban({ reason })
            .then(() => {
                interaction.reply('Banned ' + user.tag + ' from the server.');

            })
            .catch((error) => {
                console.error('Error banning user: ' + error);
                interaction.reply('An error occured while banning the user.');
            });
    }

    if (commandName == 'date') {
        const currentDate = new Date();
        interaction.reply('the current date is ' + currentDate);
    }

        
      
});

client.login(process.env.TOKEN);