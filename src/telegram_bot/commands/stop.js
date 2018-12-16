const User = require('./../../../models/user');

module.exports = async function stopCommand(message, commands, telegramBot) {
    const userId = message.from.id;
    const tg_username = message.from.username;
    const user = await disconnectTgUser(tg_username);
    if (user === null) {
        return telegramBot.sendMessage({
            chat_id: userId,
            text: `Couldn't find you in db..\nDo nothing`
        });
    } else {
        return telegramBot.sendMessage({
            chat_id: userId,
            text: `Successfully! Now you are disconnected from our service`
        });
    }
};

async function disconnectTgUser(tg_username) {
    const user = await User.getByTelegramUsername(tg_username);    
    if (!user) {
        return null;
    }
    return await User.setTelegramUsername(user.login, null);
}