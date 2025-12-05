const supabase = require('../helpers/db');
const bcrypt = require('bcrypt');
const AuthenticationError = require('../exceptions/AuthenticationError');

const UsersModel = {
    verifyUser: async({ username, password }) => {
        const { data, error } = await supabase
            .from('users')
            .select('id, password')
            .eq('username', username)
            .limit(1);

        if (error) throw error;

        if (!data || data.length === 0) {
            throw new AuthenticationError('Wrong/Invalid Credentials');
        }

        const { id, password: hashedPassword } = data[0];

        const match = await bcrypt.compare(password, hashedPassword);

        if (!match) {
            throw new AuthenticationError('Wrong/Invalid Credentials');
        }

        return id;
    },
    verifyUsername: async ({ username }) => {
        const { data, error } = await supabase
            .from('users')
            .select('username')
            .eq('username', username)
            .limit(1);

        if (error) throw error;

        return data.length > 0;
    },
    resetPassword: async ({ username, password }) => {
        const { data, error } = await supabase
            .from('users')
            .update({ password })
            .eq('username', username)
            .select('username')
            .limit(1);

        if (error) throw error;

        if (!data || data.length === 0) {
            throw new AuthenticationError(`Reset failed`);
        }

        return true;
    }
};

module.exports = UsersModel;