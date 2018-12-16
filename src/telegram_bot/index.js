const TelegramBotApi = require('telegram-bot-api'),
    config = require('./../../config'),
    processRequest = require('./commands/index');

const telegramBot = config.TelegramBotEnable === "true" && new TelegramBotApi({
    token: config.TelegramBotToken,
    updates: { enabled: true }
});

if (config.TelegramBotEnable === "true") {
    telegramBot.on('message', onMessage);
}

function onMessage(message) {
    processRequest(message, telegramBot)
        .catch(err => telegramBot.sendMessage({
            chat_id: message.chat.id,
            text: `Oops. Something went wrong. Try again later. Error: ${err.message}`
        }));
}

module.exports = async function sendMessage(messageObject) {
    return telegramBot.sendMessage(messageObject);
};