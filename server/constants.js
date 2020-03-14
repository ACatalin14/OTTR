const CONSTANTS = {
    USER_ROLES: {
        ADMIN: 1,
        USER: 2,
        GUEST: 3
    },
    ERRORS: {
        OTHER: {
            code: 0,
            message: 'Something went wrong'
        },
        WRONG_CREDENTIALS: {
            code: 1000,
            message: 'Wrong email or password'
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
        },
        UNAUTHORIZED_USER_EDIT: {
            code: 1005,
            message: 'You are not allowed to edit this user\'s details'
        },
        UNAUTHORIZED_USER_DELETE: {
            code: 1006,
            message: 'You are not allowed to delete this user'
        },
        DB_OBJECT_CREATE_FAILED: {
            code: 1007,
            message: 'Couldn\'t create new object in the database'
        },
        DB_OBJECT_UPDATE_FAILED: {
            code: 1008,
            message: 'Couldn\'t update object in the database'
        },
        DB_OBJECT_DELETE_FAILED: {
            code: 1009,
            message: 'Couldn\'t delete object in the database'
        },
        LAYOUT_ELEMENTS_NOT_ARRAY: {
            code: 1010,
            message: 'Car Layout Elements is of unknown type'
        },
        LAYOUT_ELEMENT_UNKNOWN_TYPE: {
            code: 1011,
            message: 'Car Layout Element is of unknown type'
        },
    }
};

module.exports = CONSTANTS;