import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';
import 'dotenv/config'


const app = express();
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT 
  });
db.connect();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", (req, res) =>{
    res.render("home.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.get("/logout", (req, res) => {
    res.render("home.ejs");
});

app.post("/register", async (req, res) => {
    const name = req.body.username;
    const password = req.body.password;
    try {
        await db.query(
            "INSERT INTO userschema (username, password) VALUES ($1, $2)", [name, password]);  
        res.render("secrets.ejs"); 
    } catch (error) {
        console.log(error);
    }
        
});

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const result = await db.query(
            "SELECT * FROM userschema WHERE username = $1", [username]);
        const foundUser = result.rows[0];
        if (foundUser) {
            if (foundUser.password === password) {
                res.render("secrets.ejs");
            } else {
                res.status(401).send("Invalid username or password");
            }
        } else {
            res.status(401).send("Invalid username or password");
        }
    } catch (error) {
       console.log(error); 
       res.status(401).send("Error during login");
    }
});

app.post("/submit", async (req, res) => {

});


app.listen(3000, function() {
    console.log("Server running on port 3000")
});