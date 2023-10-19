require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType} = require('discord.js');

const commands = [
    {
        name: 'hey',
        description: 'will type out hey',

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