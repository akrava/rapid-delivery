const User = require('./../../../models/user');

module.exports = {
    async startCommand(message, commands, telegramBot) {
        const userId = message.from.id;
        const tg_username = message.from.username;
        const user = await registerUser(tg_username, userId);
        if (user === false) {
            return telegramBot.sendMessage({
                chat_id: userId,
                text: `It seems that you have been already connected to our system`
            });
        } else if (user) {
            return telegramBot.sendMessage({
                chat_id: userId,
                text: `👋 Hi, *${user.fullname}*, from Rapid Delivery bot!`+
                    `\nNow you are connected to our service\r\nTo see what can you do check /help`,
                parse_mode: 'Markdown'
            });
        } else {
            return telegramBot.sendMessage({
                chat_id: userId,
                text: `Sorry, ${tg_username}, but we couldn't find you in db. Are you really registered?`
            });
        }
    }
};

async function registerUser(tg_username, userId) {
    const user = await User.getByTelegramUsername(tg_username);    
    if (!user) {
        return null;
    } else if (user.telegramUserId) {
        return false;
    }
    return await User.setTelegramUserId(user.login, userId);
}