const mongoose = require('mongoose'),
    cloudinary = require('cloudinary'),
    config = require('../config'),
    Counter = require('./counter');

const MODEL_NAME = 'Invoice';

const InvoiceScheme = new mongoose.Schema({
    number: { type: Number, required: true, unique: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    departure: { type: Date, default: Date.now() },
    arrival: { type: Date, default: Date.now() },
    location: { type: String, required: true },
    weight: { type: Number, required: true },
    cost: { type: Number, required: true },
    photoPath: { type: String, default: '/images/default_box.jpg' },
    registry: { type: mongoose.Schema.Types.ObjectId, ref: 'Registry', required: true }
});

// https://stackoverflow.com/questions/23199482/create-unique-autoincrement-field-with-mongoose
InvoiceScheme.pre('save', async function (next) {
    let counter = null;
    try {
        counter = await Counter.findByIdAndUpdate({ _id: MODEL_NAME }, { $inc: { seq: 1 } });
    } catch (error) {
        next(error);
    }
    this.number = counter.seq;
    next();
});

InvoiceScheme.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj._id;
    delete obj.registry;
    delete obj.recipient;
    delete obj.__v;
    return obj;
};

const InvoiceModel = mongoose.model(MODEL_NAME, InvoiceScheme);

cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret
});

class Invoice {
    constructor(id, number, recipient, description, departureDate, 
        arrivalDate, location, weight, cost, photoPath, registry) 
    {
        this.id = id;
        this.number = number;
        this.recipient = recipient;
        this.description = description;
        this.departure = departureDate;
        this.arrival = arrivalDate;
        this.location = location;
        this.weight = weight;
        this.cost = cost;
        this.photoPath = photoPath;
        this.registry = registry;
    }

    static async insert(x) {
        const invoice = await new InvoiceModel(x).save();
        return invoice._id;
    }

    static async getAll() {
        const models = await InvoiceModel.find().populate(['registry', 'recipient']);
        return models.map(x => new Invoice(x._id, x.number, x.recipient, 
            x.description, x.departure, x.arrival, x.location, x.weight,
            x.cost, x.photoPath, x.registry));
    }

    static async getById(id) {
        const model = await InvoiceModel.findById(id).populate([{
            path: 'registry', populate: {path:'user'}}, 'recipient'
        ]);
        if (model) {
            return new Invoice(model._id, model.number, model.recipient, 
                model.description, model.departure, model.arrival, model.location, 
                model.weight, model.cost, model.photoPath, model.registry);
        } else {
            return null;
        }
    }

    static async getByNumber(number) {
        const model = await InvoiceModel.findOne({ number });
        return model ? await this.getById(model._id) : null;
    }

    static async update(x) {
        await InvoiceModel.findByIdAndUpdate(x.id, {$set: {
            recipient: x.recipient, description: x.description, departure: x.departure,
            arrival: x.arrival, location: x.location, weight: x.weight, cost: x.cost,
            registry: x.registry
        }});
    }

    static async delete(id) {
        const invoice = await this.getById(id);
        if (!invoice) throw Error("No such invoice");
        await invoice.deleteFileFromStorage();
        await InvoiceModel.findByIdAndRemove(id);
    }

    async loadFileToStorage(fileData) {
        if (!fileData) throw new Error("Uploaded file is not valid");
        const invoice = this;
        await new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream({ resource_type: 'raw' },
                async (error, result) => {
                    if (error) reject(new Error (error));
                    invoice.photoPath = result.secure_url; 
                    await InvoiceModel.findByIdAndUpdate(invoice.id, {$set: {photoPath: invoice.photoPath}});
                    resolve();
                }).end(fileData);
        });
    }

    async deleteFileFromStorage() {
        if (!this.photoPath.startsWith('https://res.cloudinary.com/akrava/raw/upload/')) return;
        if (!this.photoPath || this.photoPath.lastIndexOf('/') < 0) {
            throw new Error("File path was not found");
        }
        const public_idIndex = this.photoPath.lastIndexOf('/') + 1;
        const public_id = this.photoPath.substr(public_idIndex);  
        await new Promise((resolve, reject) => {  /* eslint-disable-line */
            cloudinary.v2.uploader.destroy(public_id, {resource_type: 'raw'},
                async (error, result) => {
                    if (error) console.error(error); // reject(new Error (error));
                    if (result.result !== "ok") console.error(result); // reject(new Error("Couldn't delete image"));
                    resolve();
                });
        });
    }

    static model() { return InvoiceModel; };

    // extended
    static async writeIvoiceToDb(array, user, registry, recipient, numberInvoice) {
        const registryNumStr = array[0].trim();
        const registryNum = Number.parseInt(registryNumStr);
        if (!Number.isInteger(registryNum)) return false;
        const recipientLogin = array[1].trim();       
        if (recipientLogin === user.login || !user.registries.some(x => x.number === registryNum)) {
            return false;
        }
        const description = array[2].trim();
        const location = array[3].trim();
        const weight = Number.parseFloat(array[4].trim());
        const cost = Number.parseFloat(array[5].trim());
        if (!(description && location && weight > 0 && cost > 0)) {
            return false;
        } 
        if (!recipient || !registry) return false;
        let arrival = new Date();
        arrival.setDate(arrival.getDate() + 4);
        arrival = arrival.toISOString();
        if (numberInvoice) {
            const model = await Invoice.getByNumber(numberInvoice);
            return await InvoiceModel.findByIdAndUpdate(model.id, {$set: {
                recipient: recipient.id, description, departure: (new Date()).toISOString(),
                arrival, location, weight, cost, registry: registry.id
            }});
        }
        const invoice = new Invoice(-1, -1, -1, description, 
            (new Date()).toISOString(), arrival, location, weight, cost);
        invoice.recipient = recipient.id;
        invoice.registry = registry.id;
        const id = await Invoice.insert(invoice);
        const invoiceModel = await Invoice.getById(id);
        return invoiceModel;
    }
}

module.exports = Invoice;