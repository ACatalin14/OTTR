const CONSTANTS = {
    ERRORS: {
        OTHER: {
            code: 0,
            message: 'Unknown error'
        },
        WRONG_CREDENTIALS: {
            code: 1000,
            message: 'Wrong authentication credentials'
        },
        EMAIL_ALREADY_EXISTS: {
            code: 1001,
            message: 'Email is already taken'
        },
        USERNAME_LENGTH: {
            code: 1002,
            message: 'Username length must be at least 3 characters'
        },
        PASSWORD_LENGTH: {
            code: 1003,
            message: 'Password length must be at least 6 characters'
        },
        PASSWORD_MISMATCH: {
            code: 1004,
            message: 'Both passwords must be the same'
        }
    }
};

module.exports = CONSTANTS;