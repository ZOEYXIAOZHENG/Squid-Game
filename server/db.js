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
    const q = `SELECT first_name, last_name, email, picture_url, bio, created_at, num_of_wannabes
                    FROM users u
                    LEFT JOIN (SELECT u.id, count(*) as num_of_wannabes FROM users u LEFT JOIN friendships ON u.id = recipient_id WHERE u.id = $1 GROUP BY 1)t
                    ON u.id = t.id
                    WHERE u.id = $1`;
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

module.exports.getTopUsers = (userId) => {
    const q = `SELECT first_name, last_name, id, picture_url FROM users
                WHERE id != $1
                ORDER BY id DESC
                LIMIT 3`;
    const params = [userId];
    return db.query(q, params);
};

module.exports.searchUsers = (letters, userId) => {
    const q = `
    SELECT 
        first_name, last_name, picture_url, id
    FROM users 
    WHERE id != $2
        AND (first_name ILIKE $1 
            OR last_name ILIKE $1 
            OR CONCAT (first_name, ' ', last_name) ILIKE $1)`;
    const params = [letters + `%`, userId];
    return db.query(q, params);
};

module.exports.getRelation = (sender, recipient) => {
    const q = `
    SELECT * FROM friendships
    WHERE (recipient_id = $1 AND sender_id = $2)
    OR (recipient_id = $2 AND sender_id = $1);`;
    const params = [sender, recipient];
    return db.query(q, params);
};

module.exports.makeFriendRequest = (sender, recipient) => {
    const q = `
    INSERT INTO friendships (sender_id, recipient_id, accepted)
    VALUES($1, $2, false)`;
    const params = [sender, recipient];
    return db.query(q, params);
};

module.exports.unfriend = (sender, recipient) => {
    const q = `
    DELETE FROM friendships 
    WHERE (sender_id = $1 AND recipient_id = $2) OR (sender_id = $2 AND recipient_id = $1)`;
    const params = [sender, recipient];
    return db.query(q, params);
};

module.exports.cancel = (sender, recipient) => {
    const q = `
    DELETE FROM friendships
    WHERE sender_id = $1 AND recipient_id = $2`;
    const params = [sender, recipient];
    return db.query(q, params);
};

module.exports.accept = (sender, recipient) => {
    const q = `
    UPDATE friendships 
    SET accepted = true
    WHERE sender_id = $2
    AND recipient_id = $1`;
    const params = [sender, recipient];
    return db.query(q, params);
};

module.exports.getFriendsAndWannabes = (id) => {
    const q = `
    SELECT users.id, first_name, last_name, picture_url, accepted
      FROM friendships
      JOIN users
      ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
      OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
      OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)`;
    const params = [id];
    return db.query(q, params);
};

module.exports.getLastTenChatMessages = (userId) => {
    const q = `SELECT c.id, user_id, message, first_name, last_name, picture_url, to_char(c.created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at, user_id = $1 as is_myself FROM chat_messages c
                LEFT JOIN users u ON c.user_id = u.id
             ORDER BY c.created_at DESC LIMIT 10`;
    const params = [userId];
    return db.query(q, params);
};

module.exports.addNewMessage = (userId, msg) => {
    const q = `INSERT INTO chat_messages (user_id, message) VALUES($1, $2)`;
    const params = [userId, msg];
    return db.query(q, params);
};

module.exports.getMessages = (userId) => {
    const q = `SELECT c.id, user_id, message, first_name, last_name, picture_url, to_char(c.created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at, true as is_myself
                FROM users u LEFT JOIN chat_messages c ON c.user_id = u.id
                WHERE user_id = $1
                ORDER BY c.created_at DESC
                LIMIT 1`;
    const params = [userId];
    return db.query(q, params);
};

module.exports.deleteUser = (userId) => {
    const q = `DELETE FROM users WHERE id = $1`;
    const params = [userId];
    return db.query(q, params);
};
