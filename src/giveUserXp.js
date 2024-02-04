const { Client, Message } = require('discord.js');
const Level = require('./Level');
const calculateLevelXp = require('./calculateLevelXP');
const level = require('./Level');

function getRandomXP(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(math.random() * (max - min + 1)) + min;
}

module.exports = async (client, message) => {
    if (!message.inGuild() || message.author.bot) return;

    const xpToGive = getRandomXP(5,15);

    const query = {
        userID: message.author.id,
        guildID: message.guild.id,
    };

    try {
        const level = await Level.findOne (query);

        if (level) {
            level.xp += xpToGive;

            if (level.xp > calculateLevelXp(level.level)) {
                level.xp = 0;
                level.level += 1;

                message.channel.send(`${message.member} you have levelled up to ** level ${level.level}**.`);
            }

            await level.save().catch((e) => {
                console.log(`Error saving updated level ${e}`);
                return;
            })
        }  else {
            const newLevel = new Level({
                userID: message.author.id,
                guildID: message.guild.id,
                xp: xpToGive,
            });

            await newLevel.save();

        }

    } catch (error) {
        console.log(`Error giving xp: ${error}`)
    }
}