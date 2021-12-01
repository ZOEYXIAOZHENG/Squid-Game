const spicedPg = require("spiced-pg");
const bcrypt = require("bcryptjs");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost/socialnetwork"
);

module.exports.addnewUser = (firstName, lastName, email, password) => {
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

module.exports.hashPassword = (plainTextPassword) => {
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

module.exports.showHashPw = (email) => {
    return db
        .query(`SELECT password FROM users WHERE email = $1`, [email])
        .then(function (result) {
            return result.rows[0] && result.rows[0].password;
        })
        .catch(function (err) {
            console.log(err);
        });
};

module.exports.checkPassword = (
    textEnteredInLoginForm,
    hashedPasswordFromDatabase
) => {
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

module.exports.getLoginId = (email) => {
    console.log(email);
    return db
        .query(`SELECT id FROM users WHERE email = $1`, [email])
        .then(function (result) {
            return result.rows[0].id;
        });
};

module.exports.storeCode = (email, code) => {
    return db.query(
        `INSERT INTO otp (email, code)
               VALUES($1, $2)
               ON CONFLICT (email) DO UPDATE 
               SET code = $2`,
        [email, code]
    );
};

module.exports.verifyResetCode = (code, email) => {
    const q = `SELECT * FROM otp
                WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
                AND code = $1
                AND email = $2
                ORDER BY created_at ASC
                LIMIT 1`;
    const params = [code, email];
    return db.query(q, params);
};

module.exports.addProfilePic = ({ url, userId }) => {
    const q = `UPDATE users 
               SET picture_url = $1
               WHERE id = $2
               RETURNING picture_url`;
    const params = [url, userId];
    return db.query(q, params);
};

module.exports.getProfile = (userId) => {
    const q = `SELECT first_name, last_name, email, picture_url, bio, created_at 
                    FROM users
                    WHERE id = $1`;
    const params = [userId];
    return db.query(q, params);
};

module.exports.addBio = (userId, bio) => {
    const q = `UPDATE users 
               SET bio = $1
               WHERE id = $2
               RETURNING bio`;
    const params = [bio, userId];
    return db.query(q, params);
};

module.exports.updatePassword = (hashedPassword, email) => {
    const q = `UPDATE users 
                SET password = $1
                WHERE email = $2`;
    const params = [hashedPassword, email];
    return db.query(q, params);
};

module.exports.confirmUser = (email) => {
    const q = `SELECT email FROM users
                WHERE email = $1`;
    const params = [email];
    return db.query(q, params);
};

module.exports.getUserData = (userId) => {
    const q = `SELECT first_name, last_name, email, picture_url, bio, created_at 
                    FROM users
                    WHERE id = $1`;
    const params = [userId];
    return db.query(q, params);
};
