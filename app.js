const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");
let day = date.getDate();




app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))
app.set("view engine", "ejs");
mongoose.connect("mongodb+srv://Hrishabh:RockOn02@cluster0.nocdqiv.mongodb.net/todoListDB", { useNewUrlParser: true });




const itemSchema = mongoose.Schema({
    name: {
        type: String,
    }
});




const listSchema = mongoose.Schema({
    name: String,
    items: [itemSchema]
});




const Lists = mongoose.model('List', listSchema);
const Items = mongoose.model("Item", itemSchema);
const task1 = new Items({
    name: "This is a todolist"
})




const task2 = new Items({
    name: "Type a task and hit plus sign to add task"
})



const task3 = new Items({
    name: "Check them off to remove them ;)"
})



const defaultItems = [task1, task2, task3];


app.get("/", function(req, res) {




    Items.find({}, function(err, foundItems) {
        if (foundItems.length === 0) {
            Items.insertMany(defaultItems, function(err) {
                if (err) console.log(err);
                else console.log("Successfully added tasks")
            });
            res.redirect("/")
        } else {
            res.render("list", { listTitle: day, newTask: foundItems });
        }
    });




});

app.post("/", function(req, res) {
    let taskName = req.body.task;
    let listName = req.body.list;
    const item = new Items({
        name: taskName
    });
    if (listName === day) {
        item.save();
        res.redirect("/");
    } else {
        Lists.findOne({ name: listName }, function(err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        })
    }
})

app.post("/delete", function(req, res) {
    const checked = req.body.checkbox;
    const listName = req.body.listName;
    if (listName === day) {
        Items.findByIdAndRemove(checked, function(err) {
            if (err) console.log(err);
            else console.log("Successfully removed");
            res.redirect("/")
        })

    } else {
        Lists.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checked } } }, function(err, foundList) {
            if (!err) {
                res.redirect("/" + listName);
            }
        })
    }
})



app.get("/:customList", function(req, res) {

    const listName = _.capitalize(req.params.customList);

    Lists.findOne({ name: listName }, function(err, found) {
        if (err) console.log(err);
        else {
            if (!found) {
                //create the said list
                const list = new Lists({
                    name: listName,
                    items: defaultItems
                })
                list.save()
                res.redirect("/" + listName)
            } else {
                //show the list
                res.render("list", { listTitle: listName, newTask: found.items });
            }
        }
    })

})




app.get("/work", function(req, res) {
    res.render("list", { listTitle: "Work List", newTask: workItems });
})




app.post("/work", function(req, res) {
    let item = req.body.task;
    workItems.push(item);
    res.redirect("/work")
})




app.listen(process.env.PORT || 3000, function() {
    console.log("Server running....");
})