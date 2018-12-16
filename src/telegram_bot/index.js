const TelegramBotApi = require('telegram-bot-api'),
    config = require('./../../config'),
    processRequest = require('./actions');

const telegramBot = new TelegramBotApi({
    token: config.TelegramBotToken,
    updates: { enabled: true }
});

telegramBot.on('message', onMessage);

function onMessage(message) {
    processRequest(message, telegramBot)
        .catch(err => telegramBot.sendMessage({
            chat_id: message.chat.id,
            text: `Oops. Something went wrong. Try again later. Error: ${err.toString()}`
        }));
}