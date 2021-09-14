const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/lettersDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const letterSchema = {
    name: String,
    message: String,
    email: String
}

const Letter = new mongoose.model("Letter", letterSchema);

// REQUESTS TARGETING ALL LETTERS

app.route("/letters")

    .get(function (req, res) {
        Letter.find(function (err, foundLetters) {
            if (!err) {
                res.send(foundLetters);
            } else {
                res.send(err);
            }
        });
    })

    .post(function (req, res) {
        const newLetter = new Letter({
            name: req.body.name,
            message: req.body.message,
            email: req.body.email
        });

        newLetter.save(function (err) {
            if (!err) {
                res.send("Your letter has been succesfully delivered");
            } else {
                res.send(err);
            }
        });
    })

    .delete(function (req, res) {
        Letter.deleteMany(function (err) {
            if (!err) {
                res.send("Succesfully deleted all letters.")
            } else {
                res.send(err);
            }
        });
    });

// REQUESTS TARGETING SPECIFIC LETTERS

app.route("/letters/:userName")

    .get(function (req, res) {
        Letter.findOne({
            name: req.params.userName
        }, function (err, foundLetter) {
            if (!err) {
                res.send(foundLetter);
            } else {
                res.send(err);
            }
        });
    })

    .put(function (req, res) {
        Letter.update({
            name: req.params.userName
        }, {
            name: req.body.name,
            message: req.body.message,
            email: req.body.email
        }, {
            overwrite: true
        }, function (err) {
            if (!err) {
                res.send("Your letter has been updated successfully.");
            }
        });
    })

    .patch(function (req, res) {
        Letter.update({
            name: req.params.userName
        }, {
            $set: req.body
        }, function (err) {
            if (!err) {
                res.send("Successfully updated your letter.");
            }
        });
    })

    .delete(function (req, res) {
        Letter.deleteOne({
            name: req.params.userName
        }, function (err) {
            if (!err) {
                res.send("Your letter has been succesfully deleted.");
            }
        });
    });

app.listen(3000, function () {
    console.log("Server is up and running on port 3000.");
});