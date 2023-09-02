// const mongoose = require('mongoose');
// const dbConfig = "mongodb://localhost:27017/";

// // Create mongoose connection
// mongoose.connect(dbConfig, { useNewUrlParser: true, useUnifiedTopology: true });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// const SupplierSchema = new mongoose.Schema({
//     name: String,
//     address: String,
//     city: String,
//     state: String,
//     email: String,
//     phone: String
// });

// const Supplier = mongoose.model('Supplier', SupplierSchema);

// // ... remaining methods will be adapted to use Mongoose queries

// Supplier.create = (newSupplier, result) => {
//     Supplier.model('Supplier').create(newSupplier, (err, data) => {
//         if (err) {
//             console.log("error:", err);
//             result(err, null);
//             return;
//         }
//         console.log("created supplier:", data);
//         result(null, data);
//     });
// };


// Supplier.getAll = result => {
//     Supplier.find({}, (err, data) => {
//         if (err) {
//             console.log("error:", err);
//             result(err, null);
//             return;
//         }
//         console.log("suppliers:", data);
//         result(null, data);
//     });
// };

// Supplier.findById = (supplierId, result) => {
//     Supplier.findById(supplierId, (err, data) => {
//         if (err) {
//             console.log("error:", err);
//             result(err, null);
//             return;
//         }
//         if (!data) {
//             result({ kind: "not_found" }, null);
//             return;
//         }
//         console.log("found supplier:", data);
//         result(null, data);
//     });
// };

// Supplier.updateById = (id, supplierData, result) => {
//     Supplier.findByIdAndUpdate(id, supplierData, { new: true }, (err, data) => {
//         if (err) {
//             console.log("error:", err);
//             result(err, null);
//             return;
//         }
//         if (!data) {
//             result({ kind: "not_found" }, null);
//             return;
//         }
//         console.log("updated supplier:", data);
//         result(null, data);
//     });
// };

// Supplier.delete = (id, result) => {
//     Supplier.findByIdAndDelete(id, (err, data) => {
//         if (err) {
//             console.log("error:", err);
//             result(err, null);
//             return;
//         }
//         if (!data) {
//             result({ kind: "not_found" }, null);
//             return;
//         }
//         console.log("deleted supplier with id:", id);
//         result(null, data);
//     });
// };

// Supplier.removeAll = result => {
//     Supplier.deleteMany({}, (err, data) => {
//         if (err) {
//             console.log("error:", err);
//             result(err, null);
//             return;
//         }
//         console.log(`deleted all suppliers`);
//         result(null, data);
//     });
// };

// module.exports = Supplier;

const { MongoClient, ObjectID } = require("mongodb");
const dbConfig = require("../config/config.js");

const uri = "mongodb://localhost:27017/";
const dbName = "COFFEE"; // Assuming you want to use the same DB name

let db;
MongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
  if (err) throw err;
  console.log("Connected successfully to MongoDB server");
  db = client.db(dbName);
});

const Supplier = function (supplier) {
  this._id = supplier.id ? new ObjectID(supplier.id) : new ObjectID(); // MongoDB uses _id with ObjectID type
  this.name = supplier.name;
  this.address = supplier.address;
  this.city = supplier.city;
  this.state = supplier.state;
  this.email = supplier.email;
  this.phone = supplier.phone;
};

Supplier.create = (newSupplier, result) => {
  const collection = db.collection("suppliers");
  collection.insertOne(newSupplier, (err, res) => {
    if (err) return result(err, null);
    result(null, { id: res.insertedId, ...newSupplier });
  });
};

Supplier.getAll = result => {
  const collection = db.collection("suppliers");
  collection.find({}).toArray((err, res) => {
    if (err) return result(err, null);
    result(null, res);
  });
};

Supplier.findById = (supplierId, result) => {
  const collection = db.collection("suppliers");
  collection.findOne({ _id: new ObjectID(supplierId) }, (err, res) => {
    if (err) return result(err, null);
    if (!res) return result({ kind: "not_found" }, null);
    result(null, res);
  });
};

Supplier.updateById = (id, supplier, result) => {
  const collection = db.collection("suppliers");
  collection.updateOne({ _id: new ObjectID(id) }, { $set: supplier }, (err, res) => {
    if (err) return result(err, null);
    if (res.matchedCount === 0) return result({ kind: "not_found" }, null);
    result(null, { id, ...supplier });
  });
};

Supplier.delete = (id, result) => {
  const collection = db.collection("suppliers");
  collection.deleteOne({ _id: new ObjectID(id) }, (err, res) => {
    if (err) return result(err, null);
    if (res.deletedCount === 0) return result({ kind: "not_found" }, null);
    result(null, res);
  });
};

Supplier.removeAll = result => {
  const collection = db.collection("suppliers");
  collection.deleteMany({}, (err, res) => {
    if (err) return result(err, null);
    result(null, res);
  });
};

module.exports = Supplier;

