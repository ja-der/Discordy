require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType} = require('discord.js');

const commands = [
    {
        name: 'help',
        description: 'will print out a help message',

    },

    {
        name: 'delete',
        description: 'tidy up chat by deleting old messages',
        type: 1, // 1 represents a SUB_COMMAND, 3 represents INTEGER
        options: [
        {
            name: 'amount',
            description: 'Number of messages to delete (1-100).',
            type: 4, // 4 represents INTEGER
            required: true,
        }]   
    },

    {
        name: 'ban',
        description: 'will ban a certain user',
        options: [
            {
                name: 'user',
                description: 'Enter the name of user you wish to ban.',
                type: ApplicationCommandOptionType.User,
                required: true,
            },

            {
                name: 'reason',
                description: 'Enter why you are banning the selected user.',
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ]
    },
    
    {
        name: 'date',
        description: 'gives current date and time in UTC\nUseful when talking to friends around the world',
    }
];

const rest = new REST({ version: '10'}).setToken(process.env.TOKEN);

(async () => {
    try {

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );

    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
})();