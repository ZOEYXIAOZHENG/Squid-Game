const express = require("express");
const app = express();
const cookieSession = require("cookie-session");
const compression = require("compression");
const multer = require("multer");
const path = require("path");

const uidSafe = require("uid-safe");
const cryptoRandomString = require("crypto-random-string");
const s3 = require("./s3.js");

const server = require("http").Server(app);
// const socket = io();
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

//------------------------------ STATIC FILES -------------------------------

const { sendEmail } = require("./ses.js");
const db = require("./db.js");

const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("./secrets.json").COOKIE_SECRET;

//------------------------------- MIDDLEWARE ----------------------------------

app.use(compression());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
const cookieSessionMiddleware = cookieSession({
    secret: COOKIE_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 90,
    sameSite: true, // Web security --- to against CSRF
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

io.on("connection", (socket) => {
    console.log("user connected!!");
    // only logged in users can be connected
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    db.getLastTenChatMessages()
        .then(({ rows }) => {
            console.log(rows);
            socket.emit("chatMessages", rows);
        })
        .catch((err) => {
            console.log("err getting last 10 messages: ", err);
        });

    socket.on("newChatMessage", (message) => {
        console.log("message: ", message);
        // add message to DB
        // get users name and image url from DB
        // send back to client
        io.emit("test", "MESSAGE received");
    });
});

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

app.get("/users.json", (req, res) => {
    db.getTopUsers()
        .then((resp) => res.json(resp.rows))
        .catch((err) => {
            console.log(err);
        });
});

app.get("/user-search/:letters.json", (req, res) => {
    db.searchUsers(req.params.letters, req.session.userId).then((resp) =>
        res.json(resp.rows)
    );
});

app.get("/user/:id.json", (req, res) => {
    db.getUserData(req.params.id)
        .then((resp) => {
            console.log(req.params.id, req.session.userId);
            if (req.params.id == req.session.userId) {
                return res.json({ isUser: true });
            }
            return res.json({ isUser: false, data: resp.rows });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.get("/relation/:id.json", (req, res) => {
    db.getRelation(req.session.userId, req.params.id)
        .then((resp) => res.json(resp.rows))
        .catch((err) => {
            console.log(err);
        });
});

app.post("/relation/:otherId.json", (req, res) => {
    const ownId = req.session.userId;
    const otherId = req.params.otherId;
    let { relation } = req.body;
    console.log(req.body);

    if (relation === "Make Friend Request") {
        db.makeFriendRequest(ownId, otherId)
            .then(() => res.json({ relation: "Cancel Friend Request" }))
            .catch((err) => {
                console.log(err);
            });
    } else if (relation === "Cancel Friend Request") {
        db.cancel(ownId, otherId)
            .then(() => res.json({ relation: "Make Friend Request" }))
            .catch((err) => {
                console.log(err);
            });
    } else if (relation === "End Friendship") {
        db.unfriend(ownId, otherId)
            .then(() => res.json({ relation: "Make Friend Request" }))
            .catch((err) => {
                console.log(err);
            });
    } else if (relation === "Accept Friend Request") {
        db.accept(ownId, otherId)
            .then(() => res.json({ relation: "End Friendship" }))
            .catch((err) => {
                console.log(err);
            });
    }
});

app.get("/friends-and-wannabes", (req, res) => {
    db.getFriendsAndWannabes(req.session.userId)
        .then((resp) => {
            return res.json(resp.rows);
        })
        .catch((err) => {
            console.log(err);
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
                    console.log("Here is a ", err);
                    res.json({ success: false, error: err });
                });
        })
        .catch((err) => {
            console.log("err on POST regiester:", err);
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
                    req.session.userId = id;
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

// **********************************  Rest-Password  **************************************:

//1.Confirm with the submitted user email address
//2.Generate a secret code and STORE it, so it can be retrieved later
//3.Put the secret code into an email message and send it to the user

app.post("/password/reset/start", (req, res) => {
    const code = cryptoRandomString({
        length: 6,
    });
    let { email } = req.body;
    db.confirmUser(email)
        .then((data) => {
            if (data.rows.length > 0) {
                db.storeCode(email, code).then(() => {
                    sendEmail(
                        email,
                        "Reset Password",
                        "This is one-time code to reset your password\n" +
                            "Please reset your password with this code\n" +
                            `${code}\nThis code will expire in 10 minutes.`
                    );
                });
                return res.json({ success: true });
            } else {
                return res.json({ success: false });
            }
        })
        .catch((err) => {
            console.log("err in POST confirmUser", err);
        });
});

//When the server receives this request, it should do the following before sending a response indicating success:
// 1.Find the stored code for the email address
// 2.Confirm that the code is same as the code that was stored
// 3.Hash the password and replace the old one in the database with the new one

app.post("/password/reset/verify", (req, res) => {
    let { email, newPass, verCode } = req.body;
    db.verifyResetCode(verCode, email)
        .then((data) => {
            console.log("data.rows[0].code", data.rows[0].code);
            if (data.rows[0].code === verCode) {
                db.hashPassword(newPass)
                    .then((hashedPassword) => {
                        return db.updatePassword(hashedPassword, email);
                    })
                    .then(() => {
                        res.json({ success: true });
                    })
                    .catch((err) => {
                        console.log("err in POST ResetPassword", err);
                        res.json({ error: true });
                    });
            }
        })
        .catch((err) => {
            console.log("err in verifyResetCode", err);
            res.json({ error: true });
        });
});

//******************************************************************************************/

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

app.post("/bioedit.json", (req, res) => {
    const userId = req.session.userId;
    const bio = req.body.draftBio;

    db.addBio(userId, bio)
        .then((resp) => {
            res.json({ bio: resp.rows[0].bio, success: true });
        })
        .catch((err) => {
            console.log(
                "Exception thrown in /upload/bio.json when calling db.addBio: ",
                err
            );
            res.json({
                error: true,
            });
        });
});

app.post("/add-messages", (req, res) => {
    db.addNewMessage(req.session.userId, req.body.msg);
    res.json({ success: true });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
