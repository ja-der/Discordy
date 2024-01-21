require('dotenv').config();

const { Client, IntentsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const client = new Client ({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
})

const roles = [ 
    {
        id: '1198748450624393256',
        label: 'wizard '
    },
    {
        id: '1198748684167417926',
        label: 'muffinman '
    },
    {
        id: '1198748977655468124',
        label: 'grandmaster '
    }
]

client.on('ready', async (c) => {
    try {
        const channel = await client.channels.cache.get('1197331922448289882');
        if (!channel) return;

        const row = new ActionRowBuilder();

        roles.forEach((role) => {
            row.components.push(
                new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary)
            );
        });

        await channel.send({
            content: 'Claim a role',
            components: [row],
        });
        process.exit();
    } catch (error) {
        console.log(error);
    }
});

client.login(process.env.TOKEN);

