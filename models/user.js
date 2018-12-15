const mongoose = require('mongoose'),
    Registry = require('./registry'),
    Invoice = require('./invoice'),
    cloudinary = require('cloudinary'),
    config = require('../config');

const UserScheme = new mongoose.Schema({
    login: { type: String, required: true, unique: true },
    password : { type: String, required: true },
    role: { type: Number, required: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    registered: { type: Date, default: Date.now() },
    avaUrl: { type: String, default: '/images/userpic.png' },
    bio: String,
    isDisabled: { type: Boolean, default: false }
});

const UserModel = mongoose.model('User', UserScheme);

cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret
});

class User {
    constructor(id, login, password, role, fullname, email, phone, registeredAt, avaUrl, 
        bio, isDisabled)
    {
        this.id = id;
        this.password = password;
        this.login = login;
        this.role = role;
        this.fullname = fullname;
        this.email = email;
        this.phone = phone;
        this.registered = registeredAt;
        this.avaUrl = avaUrl;
        this.bio = bio;
        this.isDisabled = isDisabled;
    }

    static async getAll() {
        const models = await UserModel.find();
        const users = models.map(x => new User(x._id, x.login, x.password, x.role, 
            x.fullname, x.email, x.phone, x.registered, x.avaUrl, x.bio, x.isDisabled));
        const promiceRegistries = [];
        const promiceUpcomingInv = [];
        for (const user of users) {
            promiceRegistries.push(await Registry.model().find({user: user.id}));
            promiceUpcomingInv.push(await Invoice.model().find({recipient: user.id}));
        }
        for (let i = 0; i < users.length; i++) {
            const registrtiesCur = promiceRegistries[i];
            const invoicesUpcomingCur = promiceUpcomingInv[i];
            users[i].registries = [];
            users[i].upcomingInvoices = [];
            registrtiesCur.forEach(x => {
                users[i].registries.push(new Registry(x._id, x.name, x.number));
            });
            invoicesUpcomingCur.forEach(x => {
                users[i].upcomingInvoices.push(new Invoice(x._id, x.number));
            });
        }
        return users;
    }

    static async getById(id) {
        const model = await UserModel.findById(id);
        if (!model) return null;
        const user = new User(model._id, model.login, model.password, model.role, 
            model.fullname, model.email, model.phone, model.registered, model.avaUrl, 
            model.bio, model.isDisabled);
        const promiceRegistries = await Registry.model().find({user: user.id});
        const promiceUpcomInv = await Invoice.model().find({recipient: user.id});
        const createdInvoices = [];
        for (const registry of promiceRegistries) {
            createdInvoices.push(await Invoice.model().find({registry: registry._id}));
        }
        user.registries = [];
        user.upcomingInvoices = [];
        for (let i = 0; i < promiceRegistries.length; i++) {
            const cur = promiceRegistries[i];
            const registry = new Registry(cur._id, cur.name, cur.number,
                cur.description, cur.created);
            registry.invoices = createdInvoices[i];
            user.registries.push(registry);
        }
        promiceUpcomInv.forEach(x => {
            user.upcomingInvoices.push(new Invoice(x._id, x.number, null,
                x.description, x.departure, x.arrival, x.location, 
                x.weight, x.cost, x.photoPath));
        });
        return user;
    }

    static async getByLogin(login) {
        const model = await UserModel.findOne({ login });
        return model ? await this.getById(model._id) : null;
    }

    static async insert(x) {
        const user = await new UserModel(x).save();
        return user._id;
    }

    static async update(x) {
        const property = {$set: { 
            role: x.role, fullname: x.fullname, bio: x.bio, isDisabled: x.isDisabled,
            avaUrl: x.avaUrl, phone: x.phone, email: x.email
        }};
        if (x.password) property.$set.password = x.password;
        return UserModel.findByIdAndUpdate(x.id, property);
    }

    static async delete(id) {
        const registries = await Registry.model().find({ user: id });
        for (const registry of registries) {
            await Registry.delete(registry.id);
        }
        await Invoice.model().deleteMany({ recipient: id });
        await UserModel.findByIdAndRemove(id);
    }

    async loadAvatarToStorage(fileData) {
        if (!fileData) throw new Error("Uploaded file is not valid");
        const user = this;
        await new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream({ resource_type: 'raw' },
                async (error, result) => {
                    if (error) reject(new Error (error));
                    user.avaUrl = result.secure_url; 
                    await UserModel.findByIdAndUpdate(user.id, {$set: {avaUrl: user.avaUrl}});
                    resolve();
                }).end(fileData);
        });
    }

    async deleteAvatarFromStorage() {
        if (this.avaUrl === '/images/userpic.png') return;
        if (!this.avaUrl.startsWith('https://res.cloudinary.com/akrava/raw/upload/')) return;
        if (!this.avaUrl || this.avaUrl.lastIndexOf('/') < 0) {
            throw new Error("File path was not found");
        }
        const public_idIndex = this.avaUrl.lastIndexOf('/') + 1;
        const public_id = this.avaUrl.substr(public_idIndex);  
        await new Promise((resolve, reject) => {  /* eslint-disable-line */
            cloudinary.v2.uploader.destroy(public_id, {resource_type: 'raw'},
                async (error, result) => {
                    if (error) console.error(error); // reject(new Error (error));
                    if (result.result !== "ok") console.error(error); // reject(new Error("Couldn't delete image"));
                    resolve();
                });
        });
    }
}

module.exports = User;