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
    LAYOUT_ELEMENTS: {
        SEAT_LEFT: 1,
        SEAT_RIGHT: 2,
        SEAT_UP: 3,
        SEAT_DOWN: 4,
        LUGGAGE_RACK: 5,
        TABLE: 6,
        WALL: 7
    },
    ERRORS: {
        LOGIN_FAILED: 'Login failed. Please check your credentials.',
        UNREACHABLE_SERVER: 'Couldn\'t contact the server.'
    },
    SERVER_URL: 'http://localhost:3000/api'
};

export default CONSTANTS;