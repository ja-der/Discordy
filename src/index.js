require('dotenv').config();

const { Client, IntentsBitField } = require('discord.js');
const { OpenAI } = require('openai');

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

const IGNORE_PREFIX = "!";
const CHANNELS = ['1203482265804341408']
const openai = new OpenAI ({
    apiKey: process.env.OPEN_AI_KEY,
})


client.on('messageCreate', async (message) => {

    if (message.author.bot){
        return;
    }

    if (message.content.startsWith(IGNORE_PREFIX)) {
        return;
    }

    if (!CHANNELS.includes(message.channelId) && !message.mentions.users.has(client.user.id)) {
        return;
    }

    const response = await openai.chat.completions
    .create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role:'system',
                content: 'AI chatbots are useful.',
            },
            {
                role: 'user',
                content: message.content,
            },
        ],
    })
    .catch((error) => console.error('OpenAI Error:\n', error));

    message.reply(response.choices[0].message.content)

    

    // if (!message.author.bot) {
    //     if (message.content == '$help') {
    //         message.reply('Hi! What can I help you with?');
    //     }
    // }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'help') {
        interaction.reply('Hey! Welcome to the server. Feel free to browse around.');
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
        const currentDate = new Date().toUTCString();
        interaction.reply('the current date is ' + currentDate);
    }

    if (commandName == 'news') {
    }
});

client.on('interactionCreate', async (interaction) => {
    try {
        if (!interaction.isButton()) return;

        await interaction.deferReply({ ephemeral: true });
    
        const role = interaction.guild.roles.cache.get(interaction.customId);
        if (!role) {
            interaction.editReply({
                content: "I couldn't find that role",
            })
            return;
        }
    
        const hasRole = interaction.member.roles.cache.has(role.id);
    
        if (hasRole) {
            await interaction.member.roles.remove(role);
            await interaction.editReply(`The role ${role} has been added.`);
            return;
        }
    
        await interaction.member.roles.add(role);
        await interaction.editReply(`The role ${role} has been removed.`);
    
    } catch (error) {
        console.log(error);
    }
})


client.login(process.env.TOKEN);