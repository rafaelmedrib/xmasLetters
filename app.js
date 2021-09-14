import express from "express";
import mongoose from "mongoose";
import ejs from "ejs";

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
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

.get(function(req, res){
    Letter.find(function(err, foundLetters){
        if(!err){
            res.send(foundLetters);
        } else {
            res.send(err);
        }
    });
})

.post(function(req, res){
    const newLetter = new Letter({
        name: req.body.name,
        message: req.body.message,
        email: req.body.email
    });

    newLetter.save(function(err){
        if(!err){
            res.send("Your letter has been succesfully delivered");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req, res){
    Letter.deleteMany(function(err){
        if(!err){
            res.send("Succesfully deleted all letters.")
        } else {
            res.send(err);
        }
    });
});

// REQUESTS TARGETING SPECIFIC LETTERS

app.route("/letters/:letterID")

.get()

app.listen(3000, function(){
    console.log("Server is up and running on port 3000");
});