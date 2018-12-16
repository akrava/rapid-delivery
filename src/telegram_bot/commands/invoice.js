const User = require('./../../../models/user'),
    Invoice = require('./../../../models/invoice'),
    Scene = require('./../scene'),
    Registry = require('./../../../models/registry');

module.exports = async function invoiceCommand(message, commands, telegramBot, scenes) {
    const userId = message.from.id;
    const user = await getUser(userId);
    const arrayFields = ["register number", "recipient login", "descrption", "city departure", "weight", "cost"];
    if (!user) {
        return telegramBot.sendMessage({
            chat_id: userId,
            text: `Couldn't find you in db..\nDo nothing`
        });
    }
    if (commands.length === 2 && commands[1] === 'add') {
        if (user.registries.length === 0) {
            return telegramBot.sendMessage({
                chat_id: userId,
                parse_mode: 'Markdown',
                text: `Create a registry via the our site [here](https://rapid-delivery.herokuapp.com/registries/new)`
            });
        }
        ensureScenes(scenes);
        const scene = new Scene(userId, arrayFields, invoiceCallback, telegramBot, scenes);
        scenes.push(scene);
        return telegramBot.sendMessage({
            chat_id: userId,
            text: `To create invoice enter some fields:\nInput register number(0/6):`
        });
    } else if (commands.length === 3) {
        const numberInvoice = commands[2];
        try {
            switch (commands[1]) {
                case 'show': { 
                    return await showInvoice(numberInvoice, user, telegramBot);
                }
                case 'update': { 
                    const model = await Invoice.getByNumber(numberInvoice);
                    if (model && model.registry.user.login !== user.login) {
                        return telegramBot.sendMessage({
                            chat_id: user.telegramUserId,
                            text: `403 Forbidden`
                        });
                    }
                    ensureScenes(scenes);
                    const scene = new Scene(userId, arrayFields, invoiceCallback, telegramBot, scenes, numberInvoice);
                    scenes.push(scene);
                    return telegramBot.sendMessage({
                        chat_id: userId,
                        text: `To update invoice enter some fields:\nInput register number(0/6):`
                    });
                }
                case 'delete': {
                    const model = await Invoice.getByNumber(numberInvoice);
                    if (!model) {
                        return telegramBot.sendMessage({
                            chat_id: userId,
                            text: `We don't know such invoice`
                        });
                    } else if (model.registry.user.login !== user.login) {
                        return telegramBot.sendMessage({
                            chat_id: user.telegramUserId,
                            text: `403 Forbidden`
                        });
                    }
                    await Invoice.delete(model.id);
                    return telegramBot.sendMessage({
                        chat_id: userId,
                        text: `Ivoice #${model.number} was successfully deleted`
                    });
                }
                default: {
                    return telegramBot.sendMessage({
                        chat_id: userId,
                        text: `We don't know such command... :(`
                    });
                }
            }
        } catch (e) {
            return telegramBot.sendMessage({
                chat_id: userId,
                text: `Invalid data`
            });
        }
    }
    return telegramBot.sendMessage({
        chat_id: userId,
        text: `You can do CRUD operations with your invoices.\n`+
            `Just do it in this way: /invoice add|(update $num)|(delete $num)|(show  $num)\n`+
            `Pay attention that all commands (execept of add) require 3 args - the lat one`+
            ` is the number of invoice`
    });
};

async function showInvoice(numberInvoice, user, telegramBot) {
    const model = await Invoice.getByNumber(numberInvoice);
    if (!model) {
        return telegramBot.sendMessage({
            chat_id: user.telegramUserId,
            text: `We couldn't found such inoice (`
        });
    } else if (model.registry.user.login !== user.login) {
        return telegramBot.sendMessage({
            chat_id: user.telegramUserId,
            text: `403 Forbidden`
        });
    }
    return telegramBot.sendMessage({
        chat_id: user.telegramUserId,
        text: `Invoice #${model.number}\n` +
            `Registry: ${model.registry.number}\n` +
            `Recipient: ${model.recipient.fullname} (${model.recipient.login})\n` +
            `Description: ${model.description}\n` +
            `Weight: ${model.weight} kg\n` + 
            `Cost: ${model.cost} UAH`
    });
}

async function getUser(userId) {
    const user = await User.getByTelegramUserId(userId);    
    return user || null;
}

async function invoiceCallback(array, userID, telegramBot, numberInvoice) {
    let user, registry, recipient, model;
    try {
        user = await getUser(userID);
        registry = await Registry.getByNumber(array[0]);
        recipient = await User.getByLogin(array[1]);
        model = await Invoice.writeIvoiceToDb(array, user, registry, recipient, numberInvoice || false);
    } catch(e) {
        return telegramBot.sendMessage({
            chat_id: userID,
            text: `Bad input data: ${e.message}`
        });
    }
    if (model) {
        return telegramBot.sendMessage({
            chat_id: userID,
            text: `Ivoice #${model.number} was successfully ${numberInvoice ? "created" : "updated" }`
        });
    } else {
        return telegramBot.sendMessage({
            chat_id: userID,
            text: `Couldn't create invoice. Bad input data`
        });
    }
}
function ensureScenes(arr) {
    if (arr.length === 10) {
        arr.shift();
    }
}