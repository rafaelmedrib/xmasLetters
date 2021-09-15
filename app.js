const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/lettersDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const letterSchema = {
    uid: String,
    name: String,
    message: String,
    email: String
}

const Letter = new mongoose.model("Letter", letterSchema);

// HOME ROUTING

app.get("/", function(req, res){
    res.render("index")
});


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
            name: req.body.letterNameInput,
            message: req.body.letterMessageInput,
            email: req.body.letterEmailInput
        });

        newLetter.uid = new mongoose.Types.ObjectId();
        newLetter.uid.toString();

        newLetter.save(function (err) {
            if (!err) {
                res.render("sent");
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

app.route("/letters/:letterID")

    .get(function (req, res) {
        Letter.findOne({
            uid: req.params.letterID
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
            uid: req.params.letterID
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
            uid: req.params.letterID
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
            uid: req.params.letterID
        }, function (err) {
            if (!err) {
                res.send("Your letter has been succesfully deleted.");
            }
        });
    });

app.listen(3000, function () {
    console.log("Server is up and running on port 3000.");
});