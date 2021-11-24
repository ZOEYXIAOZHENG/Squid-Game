const express = require("express");
const cookieSession = require("cookie-session");
const app = express();
const compression = require("compression");
const path = require("path");

app.use(compression());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(
    cookieSession({
        secret: "COOKIE_SECRET",
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true, // to against CSRF
    })
);

/*****************************  WEBSITE SECURITY  *****************************/

// // to prevent Clickjacking
// app.use((req, res, next) => {
//     res.setHeader("x-frame-options", "deny");
//     next();
// });

//--------------------------------  ROUTE  -----------------------------------------

app.get("/user/id.json", function (req, res) {
    console.log(req.session);
    res.json({
        userId: req.session.userId,
    });
});
// app.post("/registration", (req, res) => {
//     db.hashPassword(req.body.password)
//         .then((hashPw) => {
//             return db
//                 .addnewUser(
//                     req.body.firstName,
//                     req.body.lastName,
//                     req.body.email,
//                     hashPw
//                 )
//                 .then((result) => {
//                     req.session.userId = result;
//                     res.redirect("/sign");
//                 });
//         })
//         .catch((err) => {
//             var errorMessage = "";
//             if (err.message.includes("unique constraint")) {
//                 errorMessage = " this email address was registered.";
//             } else {
//                 errorMessage = " ⛔️ please input data completely!";
//             }
//             res.render("registration", {
//                 layout: "main",
//                 class: "show",
//                 errorMessage,
//             });
//         });
// });

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
