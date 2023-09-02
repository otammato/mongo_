// const Supplier = require("../models/supplier.model.js");


// const {body, validationResult} = require("express-validator");


// exports.create = [

//     // Validate and sanitize the name field.
//     body('name', 'The supplier name is required').trim().isLength({min: 1}).escape(),
//     body('address', 'The supplier address is required').trim().isLength({min: 1}).escape(),
//     body('city', 'The supplier city is required').trim().isLength({min: 1}).escape(),
//     body('state', 'The supplier state is required').trim().isLength({min: 1}).escape(),
//     body('phone', 'Phone number should be 10 digit number plus optional country code').trim().isMobilePhone().escape(),

//     // Process request after validation and sanitization.
//     (req, res, next) => {

//         // Extract the validation errors from a request.
//         const errors = validationResult(req);

//         // Create a genre object with escaped and trimmed data.
//         const supplier = new Supplier(req.body);

//         if (!errors.isEmpty()) {
//             // There are errors. Render the form again with sanitized values/error messages.
//             res.render('supplier-add', {title: 'Create Genre', supplier: supplier, errors: errors.array()});
//         } else {
//             // Data from form is valid., save to db
//             Supplier.create(supplier, (err, data) => {
//                 if (err)
//                     res.render("500", {message: `Error occurred while creating the Supplier.`});
//                 else res.redirect("/suppliers");
//             });
//         }
//     }
// ];

// exports.findAll = (req, res) => {
//     Supplier.getAll((err, data) => {
//         if (err)
//             res.render("500", {message: "The was a problem retrieving the list of suppliers"});
//         else res.render("supplier-list-all", {suppliers: data});
//     });
// };

// exports.findOne = (req, res) => {
//     Supplier.findById(req.params.id, (err, data) => {
//         if (err) {
//             if (err.kind === "not_found") {
//                 res.status(404).send({
//                     message: `Not found Supplier with id ${req.params.id}.`
//                 });
//             } else {
//                 res.render("500", {message: `Error retrieving Supplier with id ${req.params.id}`});
//             }
//         } else res.render("supplier-update", {supplier: data});
//     });
// };


// exports.update = [

//     // Validate and sanitize the name field.
//     body('name', 'The supplier name is required').trim().isLength({min: 1}).escape(),
//     body('address', 'The supplier address is required').trim().isLength({min: 1}).escape(),
//     body('city', 'The supplier city is required').trim().isLength({min: 1}).escape(),
//     body('state', 'The supplier state is required').trim().isLength({min: 1}).escape(),
//     body('phone', 'Phone number should be 10 digit number plus optional country code').trim().isMobilePhone().escape(),

//     // Process request after validation and sanitization.
//     (req, res, next) => {

//         // Extract the validation errors from a request.
//         const errors = validationResult(req);

//         // Create a genre object with escaped and trimmed data.
//         const supplier = new Supplier(req.body);
//         supplier.i

//         if (!errors.isEmpty()) {
//             // There are errors. Render the form again with sanitized values/error messages.
//             res.render('supplier-update', {supplier: supplier, errors: errors.array()});
//         } else {
//             // Data from form is valid., save to db
//             Supplier.updateById(
//                 req.body.id,
//                 supplier,
//                 (err, data) => {
//                     if (err) {
//                         if (err.kind === "not_found") {
//                             res.status(404).send({
//                                 message: `Supplier with id ${req.body.id} Not found.`
//                             });
//                         } else {
//                             res.render("500", {message: `Error updating Supplier with id ${req.body.id}`});
//                         }
//                     } else res.redirect("/suppliers");
//                 }
//             );
//         }
//     }
// ];

// exports.remove = (req, res) => {
//     Supplier.delete(req.params.id, (err, data) => {
//         if (err) {
//             if (err.kind === "not_found") {
//                 res.status(404).send({
//                     message: `Not found Supplier with id ${req.params.id}.`
//                 });
//             } else {
//                 res.render("500", {message: `Could not delete Supplier with id ${req.body.id}`});
//             }
//         } else res.redirect("/suppliers");
//     });
// };

// exports.removeAll = (req, res) => {
//     Supplier.removeAll((err, data) => {
//         if (err)
//             res.render("500", {message: `Some error occurred while removing all suppliers.`});
//         else res.send({message: `All Suppliers were deleted successfully!`});

const Supplier = require("../models/supplier.model.js");

// Create and Save a new Supplier
exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const supplier = new Supplier({
        id: req.body.id, // The constructor in the model will convert this to _id
        name: req.body.name,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        email: req.body.email,
        phone: req.body.phone
    });

    Supplier.create(supplier, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Supplier."
            });
        else res.send(data);
    });
};

// Retrieve all Suppliers from the database.
exports.findAll = (req, res) => {
    Supplier.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving suppliers."
            });
        else res.send(data);
    });
};

// Find a single Supplier with a supplierId
exports.findOne = (req, res) => {
    Supplier.findById(req.params.supplierId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Supplier with id ${req.params.supplierId}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Supplier with id " + req.params.supplierId
                });
            }
        } else res.send(data);
    });
};

// Update a Supplier identified by the supplierId in the request
exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Supplier.updateById(
        req.params.supplierId,
        new Supplier(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Supplier with id ${req.params.supplierId}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Supplier with id " + req.params.supplierId
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Supplier with the specified supplierId in the request
exports.delete = (req, res) => {
    Supplier.delete(req.params.supplierId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Supplier with id ${req.params.supplierId}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Supplier with id " + req.params.supplierId
                });
            }
        } else res.send({ message: `Supplier was deleted successfully!` });
    });
};

// Delete all Suppliers from the database.
exports.deleteAll = (req, res) => {
    Supplier.removeAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while removing all suppliers."
            });
        else res.send({ message: `All Suppliers were deleted successfully!` });
    });
};
