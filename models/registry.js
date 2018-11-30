const mongoose = require('mongoose'),
    Invoice = require('./invoice'),
    Counter = require('./counter');

const MODEL_NAME = 'Registry';

const RegistryScheme = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: Number, required: true, unique: true },
    description: String,
    created: { type: Date, default: Date.now() },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// https://stackoverflow.com/questions/23199482/create-unique-autoincrement-field-with-mongoose
RegistryScheme.pre('save', async function (next) {
    let counter;
    try {
        counter = await Counter.findByIdAndUpdate({ _id: MODEL_NAME }, { $inc: { seq: 1 } });
    } catch(error) {
        next(error);
    };
    this.number = counter.seq;
    next();
});

const RegistryModel = mongoose.model(MODEL_NAME, RegistryScheme);

class Registry {
    constructor(id, name, number, description, createdAt, userId) {
        this.id = id;
        this.name = name;
        this.number = number;
        this.description = description;
        this.created = createdAt;
        this.user = userId;
    }

    static async insert(x) {
        const registry = await new RegistryModel(x).save();
        return registry._id;
    }

    static async getAll() {
        const models = await RegistryModel.find().populate('user');
        const registries = models.map(x => new Registry(x.id, x.name, x.number, 
            x.description, x.created, x.user));
        const promiceInvoices = [];
        for (const registry of registries) {
            promiceInvoices.push(await Invoice.model().find({registry: registry.id}));
        }
        for (let i = 0; i < registries.length; i++) {
            registries[i].invoices = promiceInvoices[i].map(x => new Invoice(x._id, x.number));
        }
        return registries;
    }

    static async getById(id) {
        const model = await RegistryModel.findById(id).populate('user');
        if (!model) return null;
        const registry = new Registry(model.id, model.name, model.number, 
            model.description, model.created, model.user);
        const invoices = await Invoice.model().find({registry: registry.id});
        registry.invoices = invoices.map(x => new Invoice(x._id, x.number, x.recipient,
            x.description, x.departure, x.arrival, x.location, x.weight, 
            x.cost, x.photoPath));
        return registry;
    }

    static async getByNumber(number) {
        const model = await RegistryModel.findOne({ number });
        return model ? await this.getById(model._id) : null;
    }

    static async update(x) {
        await RegistryModel.findByIdAndUpdate(x.id, {$set: {
            name: x.name, description: x.description, user: x.user
        }});
    }

    static async delete(id) {
        const invoices = await Invoice.model().find({ registry: id });
        if (invoices) {
            for (const invoice of invoices) {
                await Invoice.delete(invoice._id);
            }
        }
        await RegistryModel.findByIdAndRemove(id);
    }
    
    static model() { return RegistryModel; }
}

module.exports = Registry;