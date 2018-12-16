module.exports = async function helpCommand(message, commands, telegramBot) {
    const userId = message.from.id;
    const commandsInfo = {
        'start': '/start - Enable your Telegram integration with our service',
        'stop': `/stop - remove Tg integration with Rapid Delivery service`,
        'notify': '/notify (on|off) - disable/enable silent mode of notification. Show current setting by default',
        'me': '/me - view my personal info',
        'change_me': '/change_me - you can change some your personal data',
        'invoice': '/invoice - perform CRUD operations with your invoices'
    };
    if (commands.length === 2) {
        if (commandsInfo[commands[1]]) {
            return telegramBot.sendMessage({
                chat_id: userId,
                text: `Help info about ${commands[1]}:\n${commandsInfo[commands[1]]}`
            });
        } else {
            return telegramBot.sendMessage({
                chat_id: userId,
                text: `We don't know such command... :(`
            });
        }
    }
    const helpStr = helpObjToString(commandsInfo);
    console.log(helpStr);
    return telegramBot.sendMessage({
        chat_id: userId,
        text: `Here is a commands, which you can use:\n${helpStr}`
    });
};

function helpObjToString(obj) {
    let str = '';
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            str += obj[key] + '\n';
        }
    }
    return str;
}