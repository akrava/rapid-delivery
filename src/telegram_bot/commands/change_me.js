const User = require('./../../../models/user');

module.exports = async function change_meCommand(message, commands, telegramBot) {
    const userId = message.from.id;
    const user = await getUser(userId);
    if (!user) {
        return telegramBot.sendMessage({
            chat_id: userId,
            text: `Couldn't find you in db..\nDo nothing`
        });
    }
    if (commands.length === 3) {
        const value = commands[2];
        try {
            switch (commands[1]) {
                case 'fullname': { 
                    const fullname = value ? value.trim() : null;
                    if (!fullname || fullname.length < 3 || fullname.length > 30) throw new Error("Bad input");
                    user.fullname = fullname;
                } break;
                case 'phone': { 
                    const phoneRegExPattern = /\+380[0-9]{9}/;
                    const phone = value ? value.trim() : null;
                    if (!phone || !phone.match(phoneRegExPattern)) throw new Error("Bad input");
                    user.phone = phone;
                } break;
                case 'email': {
                    const emailRegExPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                    const email = value ? value.toLowerCase().trim() : null;
                    if (!email || !email.match(emailRegExPattern)) throw new Error("Bad input");
                    user.email = email;
                } break;
                default: {
                    return telegramBot.sendMessage({
                        chat_id: userId,
                        text: `We don't know such command... :(`
                    });
                }
            }
            await User.update(user);
        } catch (e) {
            return telegramBot.sendMessage({
                chat_id: userId,
                text: `Invalid data`
            });
        }
        return telegramBot.sendMessage({
            chat_id: userId,
            text: `Successfully changed. Look just /me`
        });
    }
    return telegramBot.sendMessage({
        chat_id: userId,
        text: `You can change fullname, phone and email in this way:\n` 
            + `/change_me property_name property_value`
    });
};

async function getUser(userId) {
    const user = await User.getByTelegramUserId(userId);    
    return user || null;
}