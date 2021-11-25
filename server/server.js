const express = require("express");
const app = express();
const cookieSession = require("cookie-session");
const compression = require("compression");
const multer = require("multer");
const path = require("path");
const db = require("./db.js");
const { sendEmail } = require("./ses.js");
const uidSafe = require("uid-safe");

app.use(compression());
app.use(express.json());
//The express.json() function is a built-in middleware function in Express.
// It parses incoming requests with JSON payloads and is based on body-parser

app.use(express.static(path.join(__dirname, "..", "client", "public")));

//makes the body elements from the post request readble
app.use(require("body-parser").urlencoded({ extended: false }));

app.use(
    cookieSession({
        secret: "COOKIE_SECRET",
        maxAge: 1000 * 60 * 60 * 24 * 90,
        sameSite: true, // Web security --- to against CSRF
    })
);
// Web security --- to prevent Clickjacking
app.use((req, res, next) => {
    res.setHeader("x-frame-options", "deny");
    next();
});

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});


//--------------------------------  ROUTE  -----------------------------------------

app.use((req, res, next) => {
    console.log(req.url);
    console.log(req.session);
    next();
});

app.get("/user/id.json", function (req, res) {
    console.log(req.session);
    res.json({
        userId: req.session.userId,
    });
});

app.post("/register", function (req, res) {
    db.hashPassword(req.body.password)
        .then((hash) => {
            return db
                .addnewUser(
                    req.body.firstname,
                    req.body.lastname,
                    req.body.email,
                    hash
                )
                .then((results) => {
                    req.session.userId = results[0].id;
                    res.json({ success: true });
                })
                .catch((err) => {
                    console.log(err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post("/login", (req, res) => {
    db.showHashPw(req.body.email)
        .then((userPw) => {
            if (!userPw) {
                res.json({success: false });
            } else {
                return db.checkPassword(req.body.password, userPw);
            }
        })
        .then((doesMatch) => {
            if (doesMatch) {
                db.getLoginId(req.body.email).then((id) => {
                    req.session.userId = id;
                    res.json({ success: true });
                });
            } else {
                res.json({ success: false });
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
