const express = require("express");
const app = express();
const cookieSession = require("cookie-session");
const compression = require("compression");
const multer = require("multer");
const path = require("path");

const uidSafe = require("uid-safe");
const cryptoRandomString = require("crypto-random-string");
const s3 = require("./s3.js");

//------------------------------ STATIC FILES -------------------------------

const { sendEmail } = require("./ses.js");
const db = require("./db.js");

const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("./secrets.json").COOKIE_SECRET;

//------------------------------- MIDDLEWARE ----------------------------------

app.use(compression());
app.use(express.json());
//The express.json() function is a built-in middleware function in Express.
// It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(
    cookieSession({
        secret: COOKIE_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 90,
        sameSite: true, // Web security --- to against CSRF
    })
);

app.use((req, res, next) => {
    res.setHeader("x-frame-options", "deny");
    console.log(req.url);
    console.log(req.session);
    next();
});

app.use(require("body-parser").urlencoded({ extended: false }));

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

app.get("/user/id", function (req, res) {
    console.log(req.session);
    res.json({
        userId: req.session.userId,
    });
});

app.post("/register", function (req, res) {
    db.hashPassword(req.body.password)
        .then((hash) => {
            return db
                .addnewUser(req.body.first, req.body.last, req.body.email, hash)
                .then((id) => {
                    req.session.userId = id;
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

// refactor "/register" POST route with async and await:
// app.post("/register", async (req, res) => {
//     const { first_name, last_name, email, password } = req.body;
//     try {
//         const hash = await db.hashPassword(password);
//         const userId = await db.addnewUser(first_name, last_name, email, hash);
//         req.session.userId = userId;
//         res.json({
//             success: true,
//         });
//     } catch (err) {
//         console.log("something went wrong in POST /registration", err);
//         res.json({
//             success: false,
//         });
//     }
// });

app.post("/login", (req, res) => {
    db.showHashPw(req.body.email)
        .then((userPw) => {
            if (!userPw) {
                return res.json({ success: false });
            } else {
                return db.checkPassword(req.body.password, userPw);
            }
        })
        .then((doesMatch) => {
            if (doesMatch) {
                db.getLoginId(req.body.email).then((id) => {
                    return res.json({ success: true });
                });
            } else {
                return res.json({ success: false });
            }
        })
        .catch((err) => {
            console.log("err on POST Login:", err);
            return res.json({ success: false });
        });
});

// *********这里有问题！！写出rest-password的路径:

//1.Confirm that there is a user with the submitted email address
//2.Generate a secret code and store it so it can be retrieved later
//3.Put the secret code into an email message and send it to the user

app.post("/password/reset/start", (req, res) => {
    const code = cryptoRandomString({
        length: 6,
    });
    let { email } = req.body;
    db.confirmUser(email)
        .then((data) => {
            console.log("data", data);
            if (data.rows[0].count > 0) {
                db.storeCode(email, code).then(() => {
                    sendEmail(
                        `Dear user ${email}`,
                        "This is one-time code to reset your password",
                        `Please reset your password with this code:
                    
                    ${code}
                    
                    This code will expire in 10 minutes.`
                    );
                });
            }
            return res.json({ success: true });
        })
        .catch((err) => {
            console.log("err in confirmUser", err);
        });
});

//When the server receives this request, it should do the following before sending a response indicating success:
// 1.Find the stored code for the email address
// 2.Confirm that the code in the request body is the same as the code that was stored
// 3.Hash the password and replace the old one in the database with the new one

app.post("/password/reset/verify", (req, res) => {
    let { code, newPassword, email } = req.body;
    db.verifyResetCode(code, email)
        .then((data) => {
            console.log("data.rows[0].code", data.rows[0].code);
            if (data.rows[0].code === code) {
                db.hashPassword(newPassword)
                    .then((hashedPassword) => {
                        return db.updatePassword({ hashedPassword, email });
                    })
                    .then(() => {
                        res.json({ success: true });
                    })
                    .catch((err) => {
                        console.log("error in updatePassword", err);
                        res.json({ error: true });
                    });
            }
        })
        .catch((err) => {
            console.log("error in verifyResetCode", err);
            res.json({ error: true });
        });
});

//****************************************** */

app.get("/user", function (req, res) {
    db.getUserData(req.session.userId).then(({ rows }) => {
        let { first_name, last_name, email, picture_url: imgUrl, bio, created_at } = rows[0];
        res.json({ first_name, last_name, email, imgUrl, bio, created_at });
    });
});

app.get("/profile", function (req, res) {
    db.getProfile(req.session.userId).then(({ rows }) => {
        let { first_name, last_name, email, picture_url, bio, created_at } =
            rows[0];
        res.json({
            first_name,
            last_name,
            email,
            picture_url,
            bio,
            created_at,
        });
    });
});

app.post("/profile/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("req.file", req.file);
    if (req.file) {
        const userId = req.session.userId;
        const url = `https://s3.amazonaws.com/spicedling/${req.file.filename}`;
        db.addProfilePic({ url, userId })
            .then(({ rows }) => res.json(rows[0]))
            .catch((err) => console.log("error on UPLOAD ProfilePic:", err));
    } else {
        res.sendStatus(500);
    }
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
