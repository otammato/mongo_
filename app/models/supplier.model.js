const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const config = require("../config/config.js");

let db;

MongoClient.connect(config.APP_DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err, client) => {
  if (err) {
    console.error('Failed to connect to the database');
    throw err;
  }
  db = client.db(config.APP_DB_NAME);
  console.log('Successfully connected to the database.');
});

class Supplier {
  constructor(supplier) {
    this.id = supplier.id;
    this.name = supplier.name;
    this.address = supplier.address;
    this.city = supplier.city;
    this.state = supplier.state;
    this.email = supplier.email;
    this.phone = supplier.phone;
  }

  static create(newSupplier, result) {
    db.collection('suppliers').insertOne(newSupplier, (err, res) => {
      if (err) {
        console.error("error: ", err);
        return result(err, null);
      }
      console.log("created supplier: ", { id: res.insertedId, ...newSupplier });
      return result(null, { id: res.insertedId, ...newSupplier });
    });
  }

  static getAll(result) {
    db.collection('suppliers').find({}).toArray((err, res) => {
      if (err) {
        console.error("error: ", err);
        return result(err, null);
      }
      console.log("suppliers: ", res);
      return result(null, res);
    });
  }

  static findById(supplierId, result) {
    db.collection('suppliers').findOne({ _id: ObjectID(supplierId) }, (err, res) => {
      if (err) {
        console.error("error: ", err);
        return result(err, null);
      }
      if (!res) {
        return result({ kind: "not_found" }, null);
      }
      console.log("found supplier: ", res);
      return result(null, res);
    });
  }

  static updateById(id, supplier, result) {
    db.collection('suppliers').updateOne({ _id: ObjectID(id) }, { $set: supplier }, (err, res) => {
      if (err) {
        console.error("error: ", err);
        return result(err, null);
      }
      if (res.matchedCount === 0) {
        return result({ kind: "not_found" }, null);
      }
      console.log("updated supplier: ", { id: id, ...supplier });
      return result(null, { id: id, ...supplier });
    });
  }

  static delete(id, result) {
    db.collection('suppliers').deleteOne({ _id: ObjectID(id) }, (err, res) => {
      if (err) {
        console.error("error: ", err);
        return result(err, null);
      }
      if (res.deletedCount === 0) {
        return result({ kind: "not_found" }, null);
      }
      console.log("deleted supplier with id: ", id);
      return result(null, res);
    });
  }

  static removeAll(result) {
    db.collection('suppliers').deleteMany({}, (err, res) => {
      if (err) {
        console.error("error: ", err);
        return result(err, null);
      }
      console.log(`deleted ${res.deletedCount} suppliers`);
      return result(null, res);
    });
  }
}

module.exports = Supplier;
