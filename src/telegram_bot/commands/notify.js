const User = require('./../../../models/user');

module.exports = async function notifyCommand(message, commands, telegramBot) {
    const userId = message.from.id;
    const tg_username = message.from.username;
    const user = await getUser(userId);
    if (!user) {
        return telegramBot.sendMessage({
            chat_id: userId,
            text: `Couldn't find you in db..\nDo nothing`
        });
    }
    if (commands.length === 2) {
        if (commands[1] === 'on') {
            const model = await setNotify(tg_username, false); 
            if (!model) {
                return telegramBot.sendMessage({
                    chat_id: userId,
                    text: `Couldn't change. Error ocurred`
                });
            } 
            return telegramBot.sendMessage({
                chat_id: userId,
                parse_mode: 'Markdown',
                text: `Hi, *${user.fullname}*!\nYour settigs of notify was changed:\nSilent mode now: \`${model.telegramNotifySilent.toString()}\``
            });
        } else if (commands[1] === 'off') {
            const model = await setNotify(tg_username, true); 
            if (!model) {
                return telegramBot.sendMessage({
                    chat_id: userId,
                    text: `Couldn't change. Error ocurred`
                });
            } 
            return telegramBot.sendMessage({
                chat_id: userId,
                parse_mode: 'Markdown',
                text: `Hi, *${user.fullname}*!\nYour settigs of notify was changed:\nSilent mode now: \`${model.telegramNotifySilent.toString()}\``
            });
        } else {
            return telegramBot.sendMessage({
                chat_id: userId,
                parse_mode: 'Markdown',
                text: `I don't understand you, *${user.fullname}* :(`
            });
        }
    } else {
        return telegramBot.sendMessage({
            chat_id: userId,
            parse_mode: 'Markdown',
            text: `Hi, *${user.fullname}*!\nYour settigs of notify:\nSilent mode: \`${user.telegramNotifySilent.toString()}\``
        });
    }
};

async function getUser(userId) {
    const user = await User.getByTelegramUserId(userId);    
    return user || null;
}

async function setNotify(telegramUsername, silentMode) {
    await User.setTelegramNotify(telegramUsername, silentMode);
    const user = await User.getByTelegramUsername(telegramUsername);    
    return user || null;
}