const registerActions = require('./registerUser'),
    helpCommand = require('./help'),
    stopCommand = require('./stop'),
    notifyCommand = require('./notify'),
    meCommand = require('./me'),
    change_meCommand = require('./change_me'),
    invoiceCommand = require('./invoice');

function proceedMessageText(messageText) {
    if (!messageText.startsWith('/')) {
        return false;
    } 
    let commands = messageText.split(/\s(?=(?:"[^"]*"|[^"])*$)/);
    commands = commands.map(x => {
        // https://stackoverflow.com/a/19156525
        return x.replace(/^"(.*)"$/, '$1');
    });
    return commands;
}

const scenes = new Array(10);

module.exports = async function processRequest(message, telegramBot) {
    const commands = proceedMessageText(message.text);
    switch (commands[0]) {
        case '/start':     await registerActions.startCommand(message, commands, telegramBot); break;
        case '/help' :     await helpCommand(message, commands, telegramBot);                  break;
        case '/stop' :     await stopCommand(message, commands, telegramBot);                  break;
        case '/notify':    await notifyCommand(message, commands, telegramBot);                break;
        case '/me':        await meCommand(message, commands, telegramBot);                    break;
        case '/change_me': await change_meCommand(message, commands, telegramBot);             break;
        case '/invoice':   await invoiceCommand(message, commands, telegramBot, scenes);       break;
        default: {
            scenes.forEach(async x => {
                await x.passData(message.from.id, message.text);
            });
        }
    }
};
