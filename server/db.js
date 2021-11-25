const spicedPg = require("spiced-pg");
const bcrypt = require("bcryptjs");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost/socialnetwork"
);

exports.addnewUser = function (firstName, lastName, email, password) {
    return db
        .query(
            `INSERT INTO users (first_name, last_name, email, password) VALUES($1, $2, $3, $4) RETURNING id`,
            [firstName, lastName, email, password]
        )
        .then((results) => {
            return results.rows[0].id;
        })
        .catch((err) => {
            throw err;
        });
};

exports.hashPassword = function (plainTextPassword) {
    return new Promise(function (resolve, reject) {
        bcrypt.genSalt(function (err, salt) {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(plainTextPassword, salt, function (err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
};

exports.showHashPw = function (email) {
    return db
        .query(`SELECT password FROM users WHERE email = $1`, [email])
        .then(function (result) {
            return result.rows[0] && result.rows[0].password;
        })
        .catch(function (err) {
            console.log(err);
        });
};

exports.checkPassword = function (
    textEnteredInLoginForm,
    hashedPasswordFromDatabase
) {
    return new Promise(function (resolve, reject) {
        bcrypt.compare(
            textEnteredInLoginForm,
            hashedPasswordFromDatabase,
            function (err, doesMatch) {
                if (err) {
                    reject(err);
                } else {
                    resolve(doesMatch);
                }
            }
        );
    });
};

exports.getLoginId = function (email) {
    return db
        .query(`SELECT id FROM users WHERE email = $1`, [email])
        .then(function (result) {
            return result.rows[0].id;
        });
};


