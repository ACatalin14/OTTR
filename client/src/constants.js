const USER_ROLES = {
    ADMIN: 1,
    USER: 2,
    GUEST: 3,
};

const CONSTANTS = {
    USER_ROLES,
    USER_GROUPS: {
        AUTHENTICATED: [
            USER_ROLES.ADMIN,
            USER_ROLES.USER
        ],
        ADMIN_ONLY: [
            USER_ROLES.ADMIN
        ],
        UNAUTHENTICATED: [
            USER_ROLES.GUEST
        ]
    },
    ERRORS: {
        LOGIN_FAILED: 'Login failed. Please check your credentials.',
        UNREACHABLE_SERVER: 'Couldn\'t contact the server.'
    },
    SERVER_URL: 'http://localhost:3000/api'
};

export default CONSTANTS;