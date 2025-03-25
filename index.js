import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: "true"}));
app.use(express.static("public"));

const db = new pg.Client({
    user: "postgres",
    database: "permalist",
    host: "localhost",
    password: "krishna23",
    port: 5432
});

db.connect();

let tasks = [];

app.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM tasks");
        tasks = result.rows;
        res.render("index.ejs", {tasks: tasks});
        
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});

app.post("/add", async (req, res) => {   
    try {
        const newTask = req.body.newtask; 
        if(newTask){
            await db.query("INSERT INTO tasks(task) VALUES ($1)",[newTask]);
            console.log("Task added succesfully");
            res.redirect("/");

        }else{
            console.log("do not add an empty task");
            res.redirect("/");
        }
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});

app.post("/delete", async (req, res) => {
    try {
        const id = req.body.deletetask;
        if(id) {
            await db.query("DELETE FROM tasks WHERE id = $1",[id]);
            console.log("Task deleted successfully");
            res.redirect("/");

        }else{
            console.log("something wrong with task id");
            res.redirect("/");
        }
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }

});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});