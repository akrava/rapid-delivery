const User = require('./../../../models/user');

module.exports = async function meCommand(message, commands, telegramBot) {
    const userId = message.from.id;
    const user = await getUser(userId);
    if (!user) {
        return telegramBot.sendMessage({
            chat_id: userId,
            text: `Couldn't find you in db..\nDo nothing`
        });
    }
    return telegramBot.sendMessage({
        chat_id: userId,
        parse_mode: 'Markdown',
        text: `Hi, *${user.fullname}*!\n` +
            `Your email: ${user.email}\n` +
            `Your phone: ${user.phone}\n` +
            `Number of upcoming invoces: ${user.upcomingInvoices.length}\n` +
            `Number of registries: ${user.registries.length}`
    });
};

async function getUser(userId) {
    const user = await User.getByTelegramUserId(userId);    
    return user || null;
}