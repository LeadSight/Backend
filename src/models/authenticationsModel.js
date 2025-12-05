const supabase = require('../helpers/db');
const AuthorizationError = require('../exceptions/AuthorizationError');

const AuthenticationsModel = {
    addRefreshToken: async(token, age) => {
        const expiresAt = new Date(Date.now() + age).toISOString();

        const { error } = await supabase
            .from('authentications')
            .insert([
                {
                    token: token,
                    expires_at: expiresAt
                }
            ]);

        if (error) throw error;
    },
    verifyRefreshToken: async(token) => {
        const { data, error } = await supabase
            .from('authentications')
            .select('token')
            .eq('token', token)
            .limit(1);

        if (error) throw error;

        if (!data || data.length === 0) {
            throw new AuthorizationError('Invalid Refresh Token');
        }
    },
    deleteRefreshToken: async(token) => {
        const { error } = await supabase
            .from('authentications')
            .delete()
            .eq('token', token);

        if (error) throw error;
    },
    deleteExpiredTokens: async() => {
        const nowIso = new Date().toISOString();
        
        const { error } = await supabase
            .from('authentications')
            .delete()
            .lt('expires_at', nowIso);

        if (error) throw error;
    }
};

module.exports = AuthenticationsModel;