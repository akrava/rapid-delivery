const sendMessage = require('../index');

module.exports = {
    async notifyAll(arrUserId, text) {
        arrUserId.forEach(async user => {
            await sendMessage({
                chat_id: user,
                text,
                parse_mode: 'Markdown'
            });
        });
    },

    async sendMessageToUser(userId, text) {
        if (!userId) return;
        await sendMessage({
            chat_id: userId,
            text,
            parse_mode: 'Markdown'
        });
    }
};
