const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

console.log(path.join(__dirname, "./patials"));
const partialsPath = path.join(__dirname, "./partials");




app.set("view engine", "hbs");
hbs.registerPartials(partialsPath);

const authenticate = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).redirect("/login"); // Redirect to login page if token is not present
  }

  try {
    const verified = jwt.verify(token, "secret_key"); // Replace "secret_key" with your own secret key
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};


app.get("/", (req, res) => {
  res.render("index");
});



app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/login", (req, res) => {
  res.render("login");
});


app.use(express.static(path.join(__dirname, 'build')));


app.get("/app", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});


const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/student-Registration")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

const scema = new mongoose.Schema({
  firstname: {
    type: String,
    unique: true,
  },
  gender: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("email is invalid");
    },
  },
  mob: {
    type: Number,
    unique: true,
  },

  pass: {
    type: String,
  },
  Cpass: {
    type: String,
  },
});

scema.pre("save", async function (next) {
  if (this.isModified("pass")) {
    console.log(`${this.pass}`);
    this.pass = await bcrypt.hash(this.pass, 10);
    console.log(`${this.pass}`);
  }
  next();
});

const Registration = new mongoose.model("Student_Registration", scema);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/register", async (req, res) => {
  try {
    const pass = req.body.pass;
    const confirmPass = req.body.Cpass;
    if (pass === confirmPass) {
      const first_document = new Registration({
        firstname: req.body.firstname,
        gender: req.body.gender,
        email: req.body.email,
        mob: req.body.mob,
        pass: req.body.pass,
        Cpass: req.body.Cpass,
      });
      const result = await first_document.save(); // To save the data into database
      console.log(result);
      res.status(201).render("index");
    } else {
      res.send("Passwords are not matching");
    }
  } catch (err) {
    res.status(400).send(err);
  }
});
app.post("/login", async (req, res) => {
  try {
    const Useremail = req.body.email;
    const pass = req.body.password;

    const result = await Registration.findOne({ email: Useremail });
    if (!result) {
      return res.status(400).send("Email not found");
    }

    const isMatch = await bcrypt.compare(pass, result.pass);

    if (isMatch) {
      const token = jwt.sign({ email: Useremail }, "mynameisroahnsirshaandiamafullstackdeveloper"); // Replace "secret_key" with your own secret key
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Set the expiration time for the cookie
        httpOnly: true, // Make the cookie accessible only through HTTP(S)
      });
      res.redirect("/app"); // Redirect to the root route ("/") after successful login
    } else {
      res.send("Passwords are not matching");
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});



// const securePass = async (password) => {
//   const passHash = await bycrypt.hash(password, 10);
//   console.log(password);
// };
// securePass("Rohan@123");

const port = process.env.PORT || 8070;
app.listen(port, () => console.log(`Server running at ${port}`));
