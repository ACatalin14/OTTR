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
        GUEST_ONLY: [
            USER_ROLES.GUEST
        ]
    },
    ERRORS: {
        1000: 'Login failed. Please check your credentials.',
    }
};

export default CONSTANTS;