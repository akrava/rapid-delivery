class Scene {
    constructor(userId, arrayFields, resultCallBack, telegramBot, scenes, other = null) {
        this.userId = userId;
        this.arrayFields = arrayFields;
        this.arrayAnswers = new Array();
        this.resultCallBack= resultCallBack;
        this.telegramBot = telegramBot;
        this.scenes = scenes;
        this.other = other;
    }

    async passData(userId, message) {
        if (userId !== this.userId) return;
        if (this.arrayAnswers.length + 1 === this.arrayFields.length) {
            this.arrayAnswers.push(message);
            let index;
            this.scenes.forEach((x, i) => {
                if (x.userId === this.userId) index = i;
            });
            this.scenes.splice(index, 1);
            return await this.resultCallBack(this.arrayAnswers, this.userId, this.telegramBot, this.other);
        } else {
            this.arrayAnswers.push(message);
            return await this.telegramBot.sendMessage({
                chat_id: this.userId,
                text: `Input ${this.arrayFields[this.arrayAnswers.length]}(${this.arrayAnswers.length}/${this.arrayFields.length}):`
            });
        }
    }
}

module.exports = Scene;