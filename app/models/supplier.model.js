const mongoose = require('mongoose');
const dbConfig = "mongodb://localhost:27017/";

// Create mongoose connection
mongoose.connect(dbConfig, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const SupplierSchema = new mongoose.Schema({
    name: String,
    address: String,
    city: String,
    state: String,
    email: String,
    phone: String
});

const Supplier = mongoose.model('Supplier', SupplierSchema);

// ... remaining methods will be adapted to use Mongoose queries

Supplier.create = (newSupplier, result) => {
    Supplier.model('Supplier').create(newSupplier, (err, data) => {
        if (err) {
            console.log("error:", err);
            result(err, null);
            return;
        }
        console.log("created supplier:", data);
        result(null, data);
    });
};


Supplier.getAll = result => {
    Supplier.find({}, (err, data) => {
        if (err) {
            console.log("error:", err);
            result(err, null);
            return;
        }
        console.log("suppliers:", data);
        result(null, data);
    });
};

Supplier.findById = (supplierId, result) => {
    Supplier.findById(supplierId, (err, data) => {
        if (err) {
            console.log("error:", err);
            result(err, null);
            return;
        }
        if (!data) {
            result({ kind: "not_found" }, null);
            return;
        }
        console.log("found supplier:", data);
        result(null, data);
    });
};

Supplier.updateById = (id, supplierData, result) => {
    Supplier.findByIdAndUpdate(id, supplierData, { new: true }, (err, data) => {
        if (err) {
            console.log("error:", err);
            result(err, null);
            return;
        }
        if (!data) {
            result({ kind: "not_found" }, null);
            return;
        }
        console.log("updated supplier:", data);
        result(null, data);
    });
};

Supplier.delete = (id, result) => {
    Supplier.findByIdAndDelete(id, (err, data) => {
        if (err) {
            console.log("error:", err);
            result(err, null);
            return;
        }
        if (!data) {
            result({ kind: "not_found" }, null);
            return;
        }
        console.log("deleted supplier with id:", id);
        result(null, data);
    });
};

Supplier.removeAll = result => {
    Supplier.deleteMany({}, (err, data) => {
        if (err) {
            console.log("error:", err);
            result(err, null);
            return;
        }
        console.log(`deleted all suppliers`);
        result(null, data);
    });
};

module.exports = Supplier;
