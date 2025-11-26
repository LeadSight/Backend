const pool = require('../helpers/db');
const bcrypt = require('bcrypt');
const AuthenticationError = require('../exceptions/AuthenticationError');

const UsersModel = {
    verifyUser: async({ username, password }) => {
        const query = `
            SELECT id, password 
            FROM users 
            WHERE username = $1
        `;
        const result = await pool.query(query, [username]);

        if (!result.rows.length) {
            throw new AuthenticationError('Wrong/Invalid Credentials');
        }

        const { id, password: hashedPassword } = result.rows[0];

        const match = await bcrypt.compare(password, hashedPassword);

        if (!match) {
        throw new AuthenticationError('Wrong/Invalid Credentials');
        }
        return id;
    },
    verifyUsername: async ({ username }) => {
        const query =`SELECT username FROM users WHERE username = $1`;
        const result = await pool.query(query, [username]);

        return result.rows.length > 0;
    },
    resetPassword: async ({ username, password }) => {
        const query = `UPDATE users SET password = $1 WHERE username = $2 RETURNING username`;
        const result = await pool.query(query, [password, username]);

        if (!result.rows.length) {
            throw new AuthenticationError(`Reset failed`);
        }

        return true;
    },
};

module.exports = UsersModel;