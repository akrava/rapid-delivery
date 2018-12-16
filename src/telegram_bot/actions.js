const registerActions = require('./registerUser');

function proceedMessageText(messageText) {
    if (!messageText.startsWith('/')) {
        return false;
    } 
    return messageText.split(/\s+/);
}

module.exports = async function processRequest(message, telegramBot) {
    const commands = proceedMessageText(message.text);
    switch (commands[0]) {
        case '/start': await registerActions.startAction(message, commands, telegramBot); break;
    }
};
